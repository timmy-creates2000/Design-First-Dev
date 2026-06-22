import { Router } from "express";
import { tokenToUserId } from "./auth";
import { userRoadmaps } from "./roadmap";

const router = Router();

function getAuthUserId(req: any): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return tokenToUserId.get(auth.slice(7)) ?? null;
}

router.get("/progress", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const roadmap = userRoadmaps.get(userId);
  if (!roadmap) {
    res.json({
      totalTasks: 0,
      completedTasks: 0,
      completionPercentage: 0,
      currentStage: "Not started",
      currentCareerPath: null,
      tasksCompletedThisWeek: 0,
      streakDays: 0,
      upcomingMilestones: [],
    });
    return;
  }
  const totalTasks = roadmap.tasks.length;
  const completedTasks = roadmap.tasks.filter((t) => t.status === "completed").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const tasksCompletedThisWeek = roadmap.tasks.filter((t) => t.completedAt && new Date(t.completedAt) > weekAgo).length;
  const stages = ["Foundation", "Core Skills", "Portfolio", "Job Readiness"];
  const currentStageTask = roadmap.tasks.find((t) => t.status === "pending");
  const currentStage = currentStageTask?.stage ?? "Complete";
  const upcoming = roadmap.tasks.filter((t) => t.status === "pending").slice(0, 3).map((t) => t.title);
  res.json({
    totalTasks,
    completedTasks,
    completionPercentage,
    currentStage,
    currentCareerPath: roadmap.careerTitle,
    tasksCompletedThisWeek,
    streakDays: tasksCompletedThisWeek > 0 ? Math.min(tasksCompletedThisWeek * 2, 14) : 0,
    upcomingMilestones: upcoming,
  });
});

export default router;
