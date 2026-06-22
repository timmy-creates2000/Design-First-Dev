import { useGetProgress } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Target, TrendingUp, Calendar, Zap, CheckCircle2 } from "lucide-react";

export default function Progress() {
  const { data: progress, isLoading } = useGetProgress();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl mt-8" />
      </div>
    );
  }

  if (!progress) {
    return <div className="p-8 text-center text-muted-foreground">No progress data available.</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and milestones.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-primary-foreground/20" />
                <circle 
                  cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" 
                  className="text-secondary"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress.completionPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-bold">{progress.completionPercentage}%</span>
              </div>
            </div>
            <h3 className="font-heading font-bold text-lg mb-1">Total Completion</h3>
            <p className="text-sm text-primary-foreground/80">{progress.completedTasks} of {progress.totalTasks} tasks done</p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-1">{progress.streakDays}</div>
              <p className="text-sm text-muted-foreground">Consecutive days active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-1">{progress.tasksCompletedThisWeek}</div>
              <p className="text-sm text-muted-foreground">Tasks completed this week</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary" />
                Current Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-primary">{progress.currentStage || "Not started"}</div>
              {progress.currentCareerPath && (
                <p className="text-sm text-muted-foreground mt-1">Path: {progress.currentCareerPath}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" /> Upcoming Milestones
          </CardTitle>
          <CardDescription>What you should aim for next</CardDescription>
        </CardHeader>
        <CardContent>
          {progress.upcomingMilestones && progress.upcomingMilestones.length > 0 ? (
            <ul className="space-y-4">
              {progress.upcomingMilestones.map((milestone, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl border bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{milestone}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Keep pushing forward to unlock this milestone.</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No upcoming milestones.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}