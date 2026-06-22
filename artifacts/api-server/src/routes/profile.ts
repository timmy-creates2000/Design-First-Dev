import { Router } from "express";
import { SaveProfileBody } from "@workspace/api-zod";
import { tokenToUserId, users } from "./auth";
import { logger } from "../lib/logger";

const router = Router();

export const userProfiles = new Map<string, any>();

function getAuthUserId(req: any): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return tokenToUserId.get(auth.slice(7)) ?? null;
}

router.get("/profile", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const profile = userProfiles.get(userId);
  if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
  res.json(profile);
});

router.post("/profile", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = SaveProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }
  const profile = {
    id: userId + "_profile",
    userId,
    ...parsed.data,
    existingSkills: parsed.data.existingSkills ?? [],
  };
  userProfiles.set(userId, profile);
  const user = users.get(userId);
  if (user) {
    user.onboardingComplete = true;
    users.set(userId, user);
  }
  logger.info({ userId }, "Profile saved");
  res.json(profile);
});

export default router;
