import { useGetRecommendations, useGenerateRoadmap } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, CheckCircle2, ChevronRight, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Recommendations() {
  const { data: recommendations, isLoading } = useGetRecommendations();
  const generateRoadmapMutation = useGenerateRoadmap();
  const [, setLocation] = useLocation();

  const handleChoosePath = (careerId: string, careerTitle: string) => {
    generateRoadmapMutation.mutate({ data: { careerId } }, {
      onSuccess: () => {
        toast.success(`Started path: ${careerTitle}`);
        setLocation("/roadmap");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to generate roadmap");
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="mb-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-primary mb-3">Your Top Matches</h1>
        <p className="text-muted-foreground text-lg">
          Based on your profile, interests, and Nigerian market data, we've identified the best paths for you.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-24 h-24 rounded-full shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations?.map((rec, i) => (
            <motion.div 
              key={rec.career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`overflow-hidden border-2 ${i === 0 ? "border-secondary/50 shadow-md relative" : "border-border"}`}>
                {i === 0 && (
                  <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> BEST MATCH
                  </div>
                )}
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-muted/30 p-6 md:p-8 flex flex-col items-center justify-center md:w-64 border-b md:border-b-0 md:border-r shrink-0 relative overflow-hidden">
                      {/* Fit Score Ring */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted" />
                          <circle 
                            cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" 
                            className={`${rec.fitScore >= 90 ? "text-secondary" : rec.fitScore >= 80 ? "text-primary" : "text-accent"}`}
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - rec.fitScore / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-heading font-bold">{rec.fitScore}%</span>
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Fit</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="font-heading text-2xl font-bold text-primary">{rec.career.title}</h2>
                        <Badge variant="outline" className="bg-background">{rec.career.difficultyLevel}</Badge>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 my-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary">
                          <CheckCircle2 className="w-4 h-4" /> Why it fits you
                        </h4>
                        <p className="text-sm text-primary/80">{rec.whyItFits}</p>
                      </div>

                      <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={() => handleChoosePath(rec.career.id, rec.career.title)}
                          disabled={generateRoadmapMutation.isPending}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          {generateRoadmapMutation.isPending ? "Generating..." : "Generate Roadmap"}
                        </Button>
                        <Link href={`/careers/${rec.career.id}`}>
                          <Button variant="outline" className="flex-1">
                            View Full Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <div className="text-center pt-8">
            <p className="text-muted-foreground mb-4">Don't see anything you like?</p>
            <Link href="/careers">
              <Button variant="outline" className="gap-2">
                Browse all careers <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}