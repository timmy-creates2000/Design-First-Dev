import { useState, useEffect } from "react";
import { useGetProfile, useSaveProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Mail, GraduationCap, MapPin, Briefcase } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useGetProfile();
  const saveProfileMutation = useSaveProfile();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        educationLevel: profile.educationLevel || "",
        course: profile.course || "",
        state: profile.state || "",
        monthlyBudget: profile.monthlyBudget || "",
        learningPace: profile.learningPace || "",
        timeline: profile.timeline || "",
        interests: profile.interests || [],
        careerGoals: profile.careerGoals || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveProfileMutation.mutate({ data: formData }, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update profile");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-20">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and learning preferences.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-4">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <h2 className="font-heading font-bold text-xl">{user?.name}</h2>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-2">
                <Mail className="w-4 h-4" /> {user?.email}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Joined: {new Date(user?.createdAt || "").toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Education & Background</CardTitle>
              <CardDescription>Update your academic background.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={formData.educationLevel} onValueChange={(v) => handleChange("educationLevel", v)}>
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
                  <Label>Course of Study</Label>
                  <Input value={formData.course || ""} onChange={(e) => handleChange("course", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={formData.state || ""} onChange={(e) => handleChange("state", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Setup & Goals</CardTitle>
              <CardDescription>How you want to approach your career path.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Budget</Label>
                  <Select value={formData.monthlyBudget} onValueChange={(v) => handleChange("monthlyBudget", v)}>
                    <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Under ₦5,000</SelectItem>
                      <SelectItem value="medium">₦5,000 - ₦20,000</SelectItem>
                      <SelectItem value="high">Over ₦20,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Learning Pace</Label>
                  <Select value={formData.learningPace} onValueChange={(v) => handleChange("learningPace", v)}>
                    <SelectTrigger><SelectValue placeholder="Select pace" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual (2-5 hrs/wk)</SelectItem>
                      <SelectItem value="steady">Steady (10-15 hrs/wk)</SelectItem>
                      <SelectItem value="intensive">Intensive (20+ hrs/wk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Goal</Label>
                  <Select value={formData.careerGoals} onValueChange={(v) => handleChange("careerGoals", v)}>
                    <SelectTrigger><SelectValue placeholder="Select goal" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first_job">Land first tech job</SelectItem>
                      <SelectItem value="freelance">Start freelancing</SelectItem>
                      <SelectItem value="switch">Switch careers</SelectItem>
                      <SelectItem value="upskill">Upskill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(v) => handleChange("timeline", v)}>
                    <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">ASAP (0-3 mos)</SelectItem>
                      <SelectItem value="medium">Medium (3-6 mos)</SelectItem>
                      <SelectItem value="relaxed">No rush (6+ mos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t flex justify-end">
                <Button 
                  onClick={handleSave}
                  disabled={saveProfileMutation.isPending}
                >
                  {saveProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}