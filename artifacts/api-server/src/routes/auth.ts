import { Router } from "express";
import { SignupBody, LoginBody } from "@workspace/api-zod";
import { supabase, getAuthUserId } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateToken() {
  return "tok_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function toPublicUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    onboardingComplete: user.onboarding_complete,
    createdAt: user.created_at,
  };
}

router.post("/auth/signup", async (req, res) => {
  const parsed = SignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }
  const { name, email, password } = parsed.data;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const user = {
    id: generateId(),
    name,
    email,
    password_hash: password,
    onboarding_complete: false,
  };

  const { error: insertError } = await supabase.from("users").insert(user);
  if (insertError) {
    logger.error(insertError, "Failed to insert user");
    res.status(500).json({ error: "Failed to create account" });
    return;
  }

  const token = generateToken();
  await supabase.from("sessions").insert({ token, user_id: user.id });

  logger.info({ userId: user.id }, "User signed up");
  res.status(201).json({
    user: toPublicUser({ ...user, created_at: new Date().toISOString() }),
    token,
  });
});

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password_hash", password)
    .single();

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken();
  await supabase.from("sessions").insert({ token, user_id: user.id });

  logger.info({ userId: user.id }, "User logged in");
  res.json({ user: toPublicUser(user), token });
});

router.post("/auth/logout", async (req, res) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    await supabase.from("sessions").delete().eq("token", auth.slice(7));
  }
  res.json({ message: "Logged out" });
});

router.get("/auth/me", async (req, res) => {
  const userId = await getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(toPublicUser(user));
});

export default router;
