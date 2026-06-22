import { Router } from "express";
import { SaveProfileBody } from "@workspace/api-zod";
import { supabase, getAuthUserId } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

router.get("/profile", async (req, res) => {
  const userId = await getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }

  res.json(toPublicProfile(profile));
});

router.post("/profile", async (req, res) => {
  const userId = await getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = SaveProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }

  const profileData = {
    id: userId + "_profile",
    user_id: userId,
    education_level: parsed.data.educationLevel,
    course: parsed.data.course,
    school: parsed.data.school ?? null,
    state: parsed.data.state,
    academic_level: parsed.data.academicLevel ?? null,
    interests: parsed.data.interests ?? [],
    existing_skills: parsed.data.existingSkills ?? [],
    monthly_budget: parsed.data.monthlyBudget,
    device_access: parsed.data.deviceAccess ?? null,
    internet_quality: parsed.data.internetQuality ?? null,
    career_goals: parsed.data.careerGoals ?? null,
    learning_pace: parsed.data.learningPace,
    work_style: parsed.data.workStyle ?? null,
    timeline: parsed.data.timeline,
  };

  const { error } = await supabase
    .from("user_profiles")
    .upsert(profileData, { onConflict: "user_id" });

  if (error) {
    logger.error(error, "Failed to save profile");
    res.status(500).json({ error: "Failed to save profile" });
    return;
  }

  await supabase
    .from("users")
    .update({ onboarding_complete: true })
    .eq("id", userId);

  logger.info({ userId }, "Profile saved");
  res.json(toPublicProfile(profileData));
});

function toPublicProfile(p: any) {
  return {
    id: p.id,
    userId: p.user_id,
    educationLevel: p.education_level,
    course: p.course,
    school: p.school,
    state: p.state,
    academicLevel: p.academic_level,
    interests: p.interests ?? [],
    existingSkills: p.existing_skills ?? [],
    monthlyBudget: p.monthly_budget,
    deviceAccess: p.device_access,
    internetQuality: p.internet_quality,
    careerGoals: p.career_goals,
    learningPace: p.learning_pace,
    workStyle: p.work_style,
    timeline: p.timeline,
  };
}

export default router;
