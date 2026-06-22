import { useGetProgress, useGetRoadmap } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MessageSquare, TrendingUp, Compass, Award, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: progress, isLoading: loadingProgress } = useGetProgress();
  const { data: roadmap, isLoading: loadingRoadmap } = useGetRoadmap();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">
          Welcome back, {user?.name?.split(' ')[0] || "there"}!
        </h1>
        <p className="text-muted-foreground">Here's your career building progress so far.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Status Card */}
        <Card className="md:col-span-2 bg-primary text-primary-foreground border-none overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="text-lg font-medium text-primary-foreground/80">Current Path</CardTitle>
            {loadingProgress ? (
              <Skeleton className="h-8 w-48 bg-white/20" />
            ) : (
              <div className="text-2xl font-bold font-heading">
                {progress?.currentCareerPath || "No path selected yet"}
              </div>
            )}
          </CardHeader>
          <CardContent className="relative z-10">
            {loadingProgress ? (
              <div className="space-y-4 mt-4">
                <Skeleton className="h-2 w-full bg-white/20" />
                <Skeleton className="h-4 w-32 bg-white/20" />
              </div>
            ) : progress?.currentCareerPath ? (
              <div className="space-y-4 mt-4">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-primary-foreground/90">
                    <span>{progress.completionPercentage}% Completed</span>
                    <span>Stage: {progress.currentStage}</span>
                  </div>
                  <Progress value={progress.completionPercentage} className="bg-white/20" indicatorClassName="bg-white" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Link href="/roadmap">
                    <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                      Continue Roadmap
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-primary-foreground/80 mb-6 text-sm">
                  Take our assessment to find the best career fit for your skills and goals.
                </p>
                <Link href="/careers/recommendations">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    Get Recommendations
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Coach Quick Access */}
        <Card className="bg-secondary/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-secondary" />
              CareerBot
            </CardTitle>
            <CardDescription>Your 24/7 AI Career Coach</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Stuck on a concept? Need interview prep or resume review? I'm here to help.
            </p>
            <Link href="/chat">
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Chat Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProgress ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{progress?.completedTasks || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {progress?.tasksCompletedThisWeek || 0} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProgress ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{progress?.streakDays || 0} <span className="text-lg font-normal text-muted-foreground">days</span></div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProgress ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-sm font-medium leading-tight">
                {progress?.upcomingMilestones?.[0] || "No upcoming milestones"}
              </div>
            )}
            <div className="mt-4">
              <Link href="/progress" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                View all progress <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Next Tasks */}
      {roadmap && roadmap.tasks && roadmap.tasks.filter(t => t.status !== 'completed').length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold">Up Next</h2>
            <Link href="/roadmap" className="text-sm font-medium text-primary hover:underline">
              View full roadmap
            </Link>
          </div>
          <div className="grid gap-3">
            {roadmap.tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task, i) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{task.description}</p>
                </div>
                <Link href={`/roadmap`}>
                  <Button size="sm" variant="ghost">View</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}