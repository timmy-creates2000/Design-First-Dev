import { Router } from "express";
import { GenerateRoadmapBody, CompleteTaskBody } from "@workspace/api-zod";
import { tokenToUserId } from "./auth";
import { CAREERS } from "./careers";

const router = Router();

interface RoadmapTask {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  stage: string;
  monthNumber: number | null;
  resourceLink: string | null;
  estimatedDuration: string;
  difficulty: string;
  status: string;
  completedAt: string | null;
}

interface Roadmap {
  id: string;
  userId: string;
  careerId: string;
  careerTitle: string;
  generatedAt: string;
  tasks: RoadmapTask[];
}

const userRoadmaps = new Map<string, Roadmap>();

function getAuthUserId(req: any): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return tokenToUserId.get(auth.slice(7)) ?? null;
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function buildRoadmapTasks(career: any, roadmapId: string): RoadmapTask[] {
  const templates: Record<string, { stage: string; month: number; title: string; description: string; duration: string; difficulty: string; resource: string }[]> = {
    "data-analyst": [
      { stage: "Foundation", month: 1, title: "Excel & Google Sheets Mastery", description: "Learn formulas, pivot tables, VLOOKUP, and data formatting.", duration: "2 weeks", difficulty: "Beginner", resource: "https://www.youtube.com/watch?v=Vl0H-qTclOg" },
      { stage: "Foundation", month: 1, title: "Data Concepts & Statistics Basics", description: "Understand mean, median, mode, distributions, and basic statistical thinking.", duration: "1 week", difficulty: "Beginner", resource: "https://www.khanacademy.org/math/statistics-probability" },
      { stage: "Core Skills", month: 2, title: "SQL Fundamentals", description: "Learn SELECT, WHERE, GROUP BY, JOIN, and subqueries using MySQL or PostgreSQL.", duration: "3 weeks", difficulty: "Beginner", resource: "https://www.w3schools.com/sql/" },
      { stage: "Core Skills", month: 2, title: "SQL Practice Projects", description: "Complete 5 real-world SQL exercises on business datasets.", duration: "1 week", difficulty: "Intermediate", resource: "https://www.hackerrank.com/domains/sql" },
      { stage: "Core Skills", month: 3, title: "Power BI Fundamentals", description: "Learn to import data, create visuals, and build interactive dashboards.", duration: "2 weeks", difficulty: "Beginner", resource: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi" },
      { stage: "Core Skills", month: 3, title: "First Dashboard Project", description: "Build a sales/revenue dashboard using a public dataset from Kaggle.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://www.kaggle.com/datasets" },
      { stage: "Portfolio", month: 4, title: "Capstone Portfolio Project", description: "Analyze a Nigerian dataset (e.g., CBN or NBS data) and tell a compelling story with your findings.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://www.nbs.gov.ng" },
      { stage: "Job Readiness", month: 4, title: "LinkedIn & CV Optimization", description: "Update your LinkedIn with skills, projects, and a summary. Tailor your CV for data roles.", duration: "3 days", difficulty: "Beginner", resource: "https://www.linkedin.com" },
      { stage: "Job Readiness", month: 4, title: "Interview Preparation", description: "Practice SQL interview questions, behavioral questions, and case studies.", duration: "1 week", difficulty: "Intermediate", resource: "https://leetcode.com/study-plan/sql-50/" },
    ],
    "product-designer": [
      { stage: "Foundation", month: 1, title: "Design Thinking Principles", description: "Understand empathize, define, ideate, prototype, test. The mindset behind great design.", duration: "1 week", difficulty: "Beginner", resource: "https://www.interaction-design.org/literature/topics/design-thinking" },
      { stage: "Foundation", month: 1, title: "Figma Fundamentals", description: "Learn frames, components, auto-layout, and basic prototyping in Figma.", duration: "3 weeks", difficulty: "Beginner", resource: "https://www.figma.com/community/file/1175823984" },
      { stage: "Core Skills", month: 2, title: "UI Design Principles", description: "Study typography, color theory, spacing, and visual hierarchy.", duration: "2 weeks", difficulty: "Beginner", resource: "https://uxplanet.org/ui-design-the-ultimate-guide-74e5aca62c8" },
      { stage: "Core Skills", month: 2, title: "First Redesign Project", description: "Pick any popular Nigerian app and redesign 3 key screens to improve UX.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://www.behance.net" },
      { stage: "Core Skills", month: 3, title: "User Research & Wireframing", description: "Conduct 3 user interviews, build wireframes, and create a user journey map.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://uxdesign.cc/how-to-conduct-user-interviews-fe4b8c34b0b7" },
      { stage: "Portfolio", month: 4, title: "Full Product Design Case Study", description: "Design a mobile app from scratch: research, wireframes, high-fidelity, prototype.", duration: "3 weeks", difficulty: "Intermediate", resource: "https://www.uxfolio.com" },
      { stage: "Job Readiness", month: 5, title: "Portfolio Website", description: "Launch a portfolio on Behance, Dribbble, or a personal website showcasing your case studies.", duration: "1 week", difficulty: "Beginner", resource: "https://www.behance.net" },
    ],
    "frontend-developer": [
      { stage: "Foundation", month: 1, title: "HTML & CSS Fundamentals", description: "Build static web pages with semantic HTML and modern CSS including Flexbox and Grid.", duration: "2 weeks", difficulty: "Beginner", resource: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
      { stage: "Foundation", month: 1, title: "JavaScript Basics", description: "Variables, functions, arrays, objects, DOM manipulation, and event handling.", duration: "2 weeks", difficulty: "Beginner", resource: "https://javascript.info" },
      { stage: "Core Skills", month: 2, title: "JavaScript Advanced Concepts", description: "Promises, async/await, fetch API, ES6+ features, and error handling.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://javascript.info/async" },
      { stage: "Core Skills", month: 2, title: "Git & GitHub", description: "Version control basics: commit, branch, merge, pull requests, collaboration.", duration: "1 week", difficulty: "Beginner", resource: "https://learngitbranching.js.org" },
      { stage: "Core Skills", month: 3, title: "React Fundamentals", description: "Components, props, state, hooks (useState, useEffect), and React Router.", duration: "3 weeks", difficulty: "Intermediate", resource: "https://react.dev/learn" },
      { stage: "Portfolio", month: 4, title: "Portfolio Project 1: Clone", description: "Clone a well-designed website (Paystack, Flutterwave) focusing on responsive design.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://github.com" },
      { stage: "Portfolio", month: 5, title: "Portfolio Project 2: Full App", description: "Build a full CRUD app with React and a public API (weather app, movie finder, etc.).", duration: "3 weeks", difficulty: "Intermediate", resource: "https://rapidapi.com/collection/list-of-free-apis" },
      { stage: "Job Readiness", month: 6, title: "Open Source Contribution", description: "Make 3 pull requests to open source projects to demonstrate collaboration skills.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://goodfirstissue.dev" },
    ],
  };

  const defaultTasks = [
    { stage: "Foundation", month: 1, title: `Learn ${career.requiredSkills[0]}`, description: `Master the fundamentals of ${career.requiredSkills[0]} through structured practice.`, duration: "2 weeks", difficulty: "Beginner", resource: "https://www.youtube.com" },
    { stage: "Foundation", month: 1, title: `${career.requiredSkills[1] ?? "Core Concepts"} Basics`, description: "Build foundational knowledge through online resources and exercises.", duration: "2 weeks", difficulty: "Beginner", resource: "https://www.coursera.org" },
    { stage: "Core Skills", month: 2, title: "Hands-on Practice", description: "Apply your skills to mini projects and exercises.", duration: "3 weeks", difficulty: "Intermediate", resource: "https://www.freecodecamp.org" },
    { stage: "Core Skills", month: 3, title: "Build Your First Project", description: "Complete a project that demonstrates your core skills.", duration: "2 weeks", difficulty: "Intermediate", resource: "https://github.com" },
    { stage: "Portfolio", month: 4, title: "Portfolio Project", description: "Build a complete project for your portfolio that showcases all skills.", duration: "3 weeks", difficulty: "Intermediate", resource: "https://www.behance.net" },
    { stage: "Job Readiness", month: 4, title: "CV & LinkedIn Update", description: "Update your CV and LinkedIn profile to highlight your new skills.", duration: "3 days", difficulty: "Beginner", resource: "https://www.linkedin.com" },
    { stage: "Job Readiness", month: 5, title: "Interview Preparation", description: "Practice common interview questions for this role.", duration: "1 week", difficulty: "Intermediate", resource: "https://www.glassdoor.com" },
  ];

  const taskDefs = templates[career.id] ?? defaultTasks;
  return taskDefs.map((t, i) => ({
    id: `${roadmapId}_task_${i}`,
    roadmapId,
    title: t.title,
    description: t.description,
    stage: t.stage,
    monthNumber: t.month,
    resourceLink: t.resource,
    estimatedDuration: t.duration,
    difficulty: t.difficulty,
    status: "pending",
    completedAt: null,
  }));
}

router.get("/roadmap", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const roadmap = userRoadmaps.get(userId);
  if (!roadmap) { res.status(404).json({ error: "No roadmap found" }); return; }
  res.json(roadmap);
});

router.post("/roadmap", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = GenerateRoadmapBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const career = CAREERS.find((c) => c.id === parsed.data.careerId);
  if (!career) { res.status(404).json({ error: "Career not found" }); return; }
  const roadmapId = generateId();
  const roadmap: Roadmap = {
    id: roadmapId,
    userId,
    careerId: career.id,
    careerTitle: career.title,
    generatedAt: new Date().toISOString(),
    tasks: buildRoadmapTasks(career, roadmapId),
  };
  userRoadmaps.set(userId, roadmap);
  res.status(201).json(roadmap);
});

router.patch("/roadmap/tasks/:taskId/complete", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = CompleteTaskBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const roadmap = userRoadmaps.get(userId);
  if (!roadmap) { res.status(404).json({ error: "No roadmap found" }); return; }
  const task = roadmap.tasks.find((t) => t.id === req.params.taskId);
  if (!task) { res.status(404).json({ error: "Task not found" }); return; }
  task.status = parsed.data.completed ? "completed" : "pending";
  task.completedAt = parsed.data.completed ? new Date().toISOString() : null;
  res.json(task);
});

export { userRoadmaps };
export default router;
