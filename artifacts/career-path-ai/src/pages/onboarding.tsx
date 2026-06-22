import { useState } from "react";
import { useLocation } from "wouter";
import { useSaveProfile } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = 5;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useLocation();
  const { updateUser, user } = useAuth();
  const saveProfileMutation = useSaveProfile();

  const [formData, setFormData] = useState({
    educationLevel: "",
    course: "",
    state: "",
    interests: [] as string[],
    monthlyBudget: "",
    deviceAccess: "",
    internetQuality: "",
    careerGoals: "",
    learningPace: "",
    timeline: "",
  });

  const handleNext = () => {
    if (step < STEPS) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    saveProfileMutation.mutate({ data: formData }, {
      onSuccess: (res) => {
        if (user) {
          updateUser({ ...user, onboardingComplete: true });
        }
        toast.success("Profile saved!");
        setLocation("/careers/recommendations");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to save profile");
      }
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.educationLevel && formData.course && formData.state;
    if (step === 2) return formData.interests.length > 0;
    if (step === 3) return formData.monthlyBudget && formData.deviceAccess && formData.internetQuality;
    if (step === 4) return formData.careerGoals && formData.timeline;
    if (step === 5) return formData.learningPace;
    return true;
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="py-6 px-4 bg-background border-b">
        <div className="container mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">C</div>
            <span className="font-heading font-bold text-xl text-primary">Career Path AI</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Step {step} of {STEPS}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-3xl p-4 flex flex-col justify-center">
        <div className="w-full bg-secondary/10 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out" 
            style={{ width: `${(step / STEPS) * 100}%` }}
          />
        </div>

        <div className="bg-card p-8 md:p-12 rounded-3xl border shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-primary">Let's get to know you</h2>
                    <p className="text-muted-foreground mt-2">Tell us a bit about your current situation.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Highest Education Level</Label>
                      <Select value={formData.educationLevel} onValueChange={(val) => updateField("educationLevel", val)}>
                        <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high_school">Secondary School (SSCE)</SelectItem>
                          <SelectItem value="undergrad">Undergraduate</SelectItem>
                          <SelectItem value="graduate">Graduate (BSc/HND)</SelectItem>
                          <SelectItem value="postgrad">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>What did you study? (Or what are you studying?)</Label>
                      <Input value={formData.course} onChange={(e) => updateField("course", e.target.value)} placeholder="e.g. Accounting, Computer Science..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Which state are you in?</Label>
                      <Input value={formData.state} onChange={(e) => updateField("state", e.target.value)} placeholder="e.g. Lagos, Abuja, Enugu..." />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-primary">What interests you?</h2>
                    <p className="text-muted-foreground mt-2">Select a few areas you'd like to explore.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {["Design", "Coding", "Data", "Marketing", "Writing", "Business", "Finance", "Product"].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => {
                          const current = formData.interests;
                          if (current.includes(interest)) {
                            updateField("interests", current.filter(i => i !== interest));
                          } else {
                            updateField("interests", [...current, interest]);
                          }
                        }}
                        className={`px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${
                          formData.interests.includes(interest) 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-primary">Learning Setup</h2>
                    <p className="text-muted-foreground mt-2">We need to know your constraints so we can recommend practical paths.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Monthly budget for learning (Data/Courses)</Label>
                      <Select value={formData.monthlyBudget} onValueChange={(val) => updateField("monthlyBudget", val)}>
                        <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Under ₦5,000</SelectItem>
                          <SelectItem value="medium">₦5,000 - ₦20,000</SelectItem>
                          <SelectItem value="high">Over ₦20,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Primary device access</Label>
                      <Select value={formData.deviceAccess} onValueChange={(val) => updateField("deviceAccess", val)}>
                        <SelectTrigger><SelectValue placeholder="Select device" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile_only">Mobile phone only</SelectItem>
                          <SelectItem value="shared_pc">Shared computer / Cybercafe</SelectItem>
                          <SelectItem value="personal_pc">Personal laptop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Internet Quality</Label>
                      <Select value={formData.internetQuality} onValueChange={(val) => updateField("internetQuality", val)}>
                        <SelectTrigger><SelectValue placeholder="Select quality" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spotty">Spotty/Expensive data</SelectItem>
                          <SelectItem value="good">Good 4G/Average Wi-Fi</SelectItem>
                          <SelectItem value="excellent">Excellent/Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-primary">Your Goals</h2>
                    <p className="text-muted-foreground mt-2">What are you hoping to achieve?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Primary Goal</Label>
                      <Select value={formData.careerGoals} onValueChange={(val) => updateField("careerGoals", val)}>
                        <SelectTrigger><SelectValue placeholder="Select goal" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first_job">Land my first tech job</SelectItem>
                          <SelectItem value="freelance">Start freelancing/earning quickly</SelectItem>
                          <SelectItem value="switch">Switch from a different career</SelectItem>
                          <SelectItem value="upskill">Upskill in my current role</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timeline</Label>
                      <Select value={formData.timeline} onValueChange={(val) => updateField("timeline", val)}>
                        <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">ASAP (0-3 months)</SelectItem>
                          <SelectItem value="medium">Medium term (3-6 months)</SelectItem>
                          <SelectItem value="relaxed">No rush (6+ months)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-primary">Pace Yourself</h2>
                    <p className="text-muted-foreground mt-2">How much time can you commit weekly?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Learning Pace</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                        {[
                          { id: "casual", label: "Casual", desc: "2-5 hours/week" },
                          { id: "steady", label: "Steady", desc: "10-15 hours/week" },
                          { id: "intensive", label: "Intensive", desc: "20+ hours/week" }
                        ].map((pace) => (
                          <div 
                            key={pace.id}
                            onClick={() => updateField("learningPace", pace.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                              formData.learningPace === pace.id 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="font-bold mb-1">{pace.label}</div>
                            <div className={`text-xs ${formData.learningPace === pace.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                              {pace.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between pt-6 border-t">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack}>Back</Button>
            ) : <div />}
            
            <Button 
              onClick={handleNext} 
              disabled={!isStepValid() || saveProfileMutation.isPending}
              className="min-w-[120px]"
            >
              {saveProfileMutation.isPending ? "Saving..." : step === STEPS ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}