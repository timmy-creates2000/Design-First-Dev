import { useGetCareer, useGetSkillGap, useGenerateRoadmap } from "@workspace/api-client-react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Briefcase, MapPin, Clock, Zap, Target, Wrench, ListChecks, ArrowRight, CheckCircle2, XCircle
} from "lucide-react";
import { toast } from "sonner";

export default function CareerDetail() {
  const params = useParams();
  const id = params.id as string;
  const [, setLocation] = useLocation();
  
  const { data: career, isLoading: loadingCareer } = useGetCareer(id, {
    query: { enabled: !!id, queryKey: ['career', id] }
  });
  
  const { data: skillGap, isLoading: loadingGap } = useGetSkillGap(id, {
    query: { enabled: !!id, queryKey: ['skillgap', id] }
  });

  const generateRoadmapMutation = useGenerateRoadmap();

  const handleStartPath = () => {
    generateRoadmapMutation.mutate({ data: { careerId: id } }, {
      onSuccess: () => {
        toast.success(`Started path: ${career?.title}`);
        setLocation("/roadmap");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to start path");
      }
    });
  };

  if (loadingCareer) {
    return <div className="p-8 max-w-5xl mx-auto space-y-6"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (!career) {
    return <div className="p-8 text-center">Career not found</div>;
  }

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="bg-primary text-primary-foreground pt-12 pb-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/careers" className="inline-flex items-center text-sm font-medium text-primary-foreground/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-none">
              {career.category || "Tech"}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white">
              {career.difficultyLevel}
            </Badge>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{career.title}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl leading-relaxed">
            {career.description}
          </p>
          
          <div className="flex flex-wrap gap-6 mt-8 p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 max-w-3xl">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-xs text-primary-foreground/60 uppercase tracking-wider font-semibold">Demand</div>
                <div className="font-medium">{career.demandLevel}</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-xs text-primary-foreground/60 uppercase tracking-wider font-semibold">Remote</div>
                <div className="font-medium">{career.remotePotential}</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-xs text-primary-foreground/60 uppercase tracking-wider font-semibold">Time to Job</div>
                <div className="font-medium">{career.timeToJobReady}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <div className="bg-card rounded-2xl border shadow-sm p-2">
          <Tabs defaultValue="overview" className="w-full">
            <div className="px-4 pt-2 overflow-x-auto">
              <TabsList className="bg-transparent h-auto p-0 gap-6 w-max border-b border-border/0 pb-px">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-semibold text-base">Overview</TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-semibold text-base">Skills & Gap Analysis</TabsTrigger>
                <TabsTrigger value="strategy" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-semibold text-base">Entry Strategy</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4 md:p-6 mt-4">
              <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                        <ListChecks className="w-5 h-5 text-primary" /> Core Responsibilities
                      </h3>
                      <ul className="space-y-3">
                        {career.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                        <Wrench className="w-5 h-5 text-primary" /> Tools of the Trade
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {career.tools.map((tool, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-muted/30 rounded-xl p-6 border">
                      <h3 className="font-heading font-bold text-lg mb-2">Salary Expectation</h3>
                      <p className="text-sm text-muted-foreground mb-4">Typical entry to mid-level range in Nigeria</p>
                      <div className="text-2xl font-bold text-primary">
                        ₦{career.salaryMin.toLocaleString()} - ₦{career.salaryMax.toLocaleString()}
                        <span className="text-sm text-muted-foreground font-normal"> /mo</span>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                      <h3 className="font-heading font-bold text-lg mb-4 text-primary">Ready to commit?</h3>
                      <p className="text-sm text-primary/80 mb-6">Generate a step-by-step learning roadmap tailored to your profile.</p>
                      <Button 
                        className="w-full h-12 text-base shadow-lg hover:shadow-xl transition-all"
                        onClick={handleStartPath}
                        disabled={generateRoadmapMutation.isPending}
                      >
                        {generateRoadmapMutation.isPending ? "Generating..." : "Start This Path"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="m-0 focus-visible:outline-none">
                {loadingGap ? (
                  <Skeleton className="h-64 w-full rounded-xl" />
                ) : skillGap ? (
                  <div className="space-y-8">
                    <div className="bg-card border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                      <div className="w-40 h-40 shrink-0 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-muted" />
                          <circle 
                            cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" 
                            className="text-secondary"
                            strokeDasharray={`${2 * Math.PI * 70}`}
                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - skillGap.readinessScore / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-heading font-bold text-foreground">{skillGap.readinessScore}%</span>
                          <span className="text-sm text-muted-foreground font-medium uppercase">Ready</span>
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold font-heading mb-2">Your Skill Gap Analysis</h3>
                        <p className="text-muted-foreground mb-4">
                          Based on the skills you listed, here is what you need to learn. Estimated time to close gap: <strong>{skillGap.estimatedTimeToClose}</strong>.
                        </p>
                        <Button variant="outline" onClick={handleStartPath} disabled={generateRoadmapMutation.isPending}>
                          Generate Roadmap to Close Gap
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4 text-green-600">
                          <CheckCircle2 className="w-5 h-5" /> Skills You Have
                        </h4>
                        {skillGap.skillsHave.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {skillGap.skillsHave.map(s => (
                              <Badge key={s} variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No matching skills found in your profile.</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4 text-destructive">
                          <Target className="w-5 h-5" /> Skills to Learn
                        </h4>
                        <div className="space-y-3">
                          {skillGap.skillsMissing.map((s, i) => {
                            const isHighPriority = skillGap.priorityOrder.slice(0, 3).includes(s);
                            return (
                              <div key={s} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                                <span className="font-medium text-sm">{s}</span>
                                {isHighPriority && <Badge className="bg-accent text-accent-foreground border-none text-[10px] uppercase">High Priority</Badge>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Skill gap analysis not available.</p>
                )}
              </TabsContent>
              
              <TabsContent value="strategy" className="m-0 focus-visible:outline-none">
                <div className="max-w-3xl">
                  <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                    <p className="text-lg leading-relaxed">{career.entryStrategy}</p>
                  </div>
                  
                  <div className="mt-12 p-8 bg-primary text-primary-foreground rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold font-heading mb-2">Turn strategy into action</h3>
                      <p className="text-primary-foreground/80">Get a step-by-step roadmap with free learning resources.</p>
                    </div>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="shrink-0 text-primary font-bold shadow-xl"
                      onClick={handleStartPath}
                      disabled={generateRoadmapMutation.isPending}
                    >
                      {generateRoadmapMutation.isPending ? "Generating..." : "Start Now"} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}