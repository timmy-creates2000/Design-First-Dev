import { useGetRoadmap, useCompleteTask, getGetRoadmapQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, ExternalLink, Clock, Target, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Roadmap() {
  const { data: roadmap, isLoading } = useGetRoadmap();
  const completeTaskMutation = useCompleteTask();
  const queryClient = useQueryClient();

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const isCompleting = currentStatus !== 'completed';
    completeTaskMutation.mutate({ 
      id: taskId, 
      data: { completed: isCompleting } 
    }, {
      onSuccess: () => {
        toast.success(isCompleting ? "Task completed!" : "Task marked incomplete");
        queryClient.invalidateQueries({ queryKey: getGetRoadmapQueryKey() });
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update task");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="space-y-4 pl-6 border-l-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold font-heading mb-2">No roadmap found</h2>
        <p className="text-muted-foreground mb-6">You haven't generated a roadmap yet.</p>
      </div>
    );
  }

  // Group tasks by stage or month
  const stages = roadmap.tasks.reduce((acc, task) => {
    const stageName = task.stage || `Month ${task.monthNumber}` || "General";
    if (!acc[stageName]) acc[stageName] = [];
    acc[stageName].push(task);
    return acc;
  }, {} as Record<string, typeof roadmap.tasks>);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <header className="mb-12">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary/10 text-secondary mb-4">
          Personalized Roadmap
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
          {roadmap.careerTitle}
        </h1>
        <p className="text-muted-foreground text-lg">
          Your step-by-step guide to becoming a {roadmap.careerTitle}. Follow the path and complete tasks to track your progress.
        </p>
      </header>

      <div className="space-y-12 relative">
        {/* Timeline vertical line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border -z-10" />

        {Object.entries(stages).map(([stageName, tasks], stageIndex) => (
          <div key={stageName} className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 md:w-16 flex justify-center bg-background py-2">
                <Badge variant="outline" className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
                  {stageIndex + 1}
                </Badge>
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-heading">{stageName}</h2>
            </div>

            <div className="space-y-6 pl-12 md:pl-16">
              {tasks.map((task, i) => {
                const isCompleted = task.status === 'completed';
                return (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={`relative overflow-visible transition-colors ${isCompleted ? 'border-primary/20 bg-primary/5' : 'hover:border-primary/50'}`}>
                      {/* Task dot connector */}
                      <div className="absolute -left-[30px] md:-left-[38px] top-6 w-4 h-4 rounded-full border-2 border-background bg-border flex items-center justify-center">
                        {isCompleted && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}>
                                {isCompleted ? "Completed" : task.status}
                              </Badge>
                              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                {task.difficulty}
                              </Badge>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" /> {task.estimatedDuration}
                              </div>
                            </div>
                            <CardTitle className={`text-lg ${isCompleted ? 'text-primary/70 line-through' : ''}`}>
                              {task.title}
                            </CardTitle>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className={`rounded-full shrink-0 ${isCompleted ? 'text-green-600 hover:text-green-700 hover:bg-green-100' : 'text-muted-foreground'}`}
                            onClick={() => handleToggleTask(task.id, task.status)}
                            disabled={completeTaskMutation.isPending}
                          >
                            {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className={`text-base ${isCompleted ? 'text-muted-foreground/70' : ''}`}>
                          {task.description}
                        </CardDescription>
                        
                        {task.resourceLink && (
                          <div className="mt-4 flex flex-wrap gap-3">
                            <a href={task.resourceLink} target="_blank" rel="norenoopener noreferrer" className="inline-flex items-center text-sm font-medium text-secondary hover:underline">
                              <ExternalLink className="w-4 h-4 mr-1" /> View Resource
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}