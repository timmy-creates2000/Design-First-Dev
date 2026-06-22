import { Router } from "express";
import { SignupBody, LoginBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  onboardingComplete: boolean;
  createdAt: string;
}

const users = new Map<string, User>();
const tokenToUserId = new Map<string, string>();

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateToken() {
  return "tok_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    onboardingComplete: user.onboardingComplete,
    createdAt: user.createdAt,
  };
}

router.post("/auth/signup", (req, res) => {
  const parsed = SignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
    return;
  }
  const { name, email, password } = parsed.data;
  for (const u of users.values()) {
    if (u.email === email) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }
  }
  const user: User = {
    id: generateId(),
    name,
    email,
    passwordHash: password,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  };
  users.set(user.id, user);
  const token = generateToken();
  tokenToUserId.set(token, user.id);
  logger.info({ userId: user.id }, "User signed up");
  res.status(201).json({ user: toPublicUser(user), token });
});

router.post("/auth/login", (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;
  let found: User | undefined;
  for (const u of users.values()) {
    if (u.email === email && u.passwordHash === password) {
      found = u;
      break;
    }
  }
  if (!found) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = generateToken();
  tokenToUserId.set(token, found.id);
  logger.info({ userId: found.id }, "User logged in");
  res.json({ user: toPublicUser(found), token });
});

router.post("/auth/logout", (req, res) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    tokenToUserId.delete(auth.slice(7));
  }
  res.json({ message: "Logged out" });
});

router.get("/auth/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = tokenToUserId.get(auth.slice(7));
  if (!userId) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  const user = users.get(userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json(toPublicUser(user));
});

export { users, tokenToUserId };
export default router;
