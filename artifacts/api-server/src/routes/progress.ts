import { Router } from "express";
import { supabase, getAuthUserId } from "../lib/supabase";

const router = Router();

router.get("/progress", async (req, res) => {
  const userId = await getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("*, roadmap_tasks(*)")
    .eq("user_id", userId)
    .single();

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

  const tasks: any[] = roadmap.roadmap_tasks ?? [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const tasksCompletedThisWeek = tasks.filter(
    (t) => t.completed_at && new Date(t.completed_at) > weekAgo
  ).length;

  const currentStageTask = tasks.find((t) => t.status === "pending");
  const currentStage = currentStageTask?.stage ?? "Complete";
  const upcoming = tasks.filter((t) => t.status === "pending").slice(0, 3).map((t) => t.title);

  res.json({
    totalTasks,
    completedTasks,
    completionPercentage,
    currentStage,
    currentCareerPath: roadmap.career_title,
    tasksCompletedThisWeek,
    streakDays: tasksCompletedThisWeek > 0 ? Math.min(tasksCompletedThisWeek * 2, 14) : 0,
    upcomingMilestones: upcoming,
  });
});

export default router;
