import { Router } from "express";
import { SendChatMessageBody } from "@workspace/api-zod";
import { tokenToUserId } from "./auth";
import { userProfiles } from "./profile";
import { userRoadmaps } from "./roadmap";

const router = Router();

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

const userChats = new Map<string, ChatMessage[]>();

function getAuthUserId(req: any): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return tokenToUserId.get(auth.slice(7)) ?? null;
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateAIResponse(message: string, userId: string): string {
  const profile = userProfiles.get(userId);
  const roadmap = userRoadmaps.get(userId);
  const msg = message.toLowerCase();

  if (msg.includes("salary") || msg.includes("pay") || msg.includes("earn")) {
    const career = roadmap?.careerTitle ?? "tech roles";
    return `Great question! For ${career} in Nigeria, entry-level salaries typically range from ₦150,000 to ₦350,000/month. Mid-level professionals earn ₦350,000–₦700,000, and senior roles can go above ₦1,000,000. Remote work for foreign companies can multiply these figures significantly. Focus on building a strong portfolio and the compensation will follow.`;
  }
  if (msg.includes("nysc") || msg.includes("service year")) {
    return `NYSC is actually a great time to build your skills! You have structured time, the allowance covers basic expenses, and you can use evenings and weekends to learn. Many corps members have landed their first tech job before POP. Focus on one skill area, complete a portfolio project during your service year, and you'll graduate NYSC as a junior professional.`;
  }
  if (msg.includes("budget") || msg.includes("money") || msg.includes("afford") || msg.includes("free")) {
    const budget = profile?.monthlyBudget ?? "limited";
    return `With a ${budget} budget, the good news is that most in-demand skills have world-class free resources. YouTube, FreeCodeCamp, The Odin Project, Coursera audit mode, and Google's free certifications are all excellent. Invest in data access more than course fees. Many people have entered tech with zero budget — determination is the only non-negotiable investment.`;
  }
  if (msg.includes("switch") || msg.includes("change") || msg.includes("background") || msg.includes("microbiology") || msg.includes("accounting") || msg.includes("law")) {
    const course = profile?.course ?? "your background";
    return `Transitioning from ${course} to tech is absolutely possible — I've seen it happen countless times. Your existing analytical skills, domain knowledge, and professional experience are assets, not liabilities. Many of the best data analysts came from science backgrounds. The key is to commit to 3-6 months of focused learning and build 2-3 portfolio projects that demonstrate your ability, not just your degree.`;
  }
  if (msg.includes("remote") || msg.includes("work from home") || msg.includes("abroad")) {
    return `Remote work is very achievable in Nigeria, especially in tech. Roles like Product Design, Frontend Development, Technical Writing, and Data Analysis have very high remote potential. Platforms like Toptal, Andela, Upwork, and LinkedIn remote jobs regularly hire Nigerian talent. Build a strong portfolio, practice English communication skills, and target companies explicitly open to African candidates.`;
  }
  if (msg.includes("how long") || msg.includes("time") || msg.includes("months") || msg.includes("weeks")) {
    const career = roadmap?.careerTitle ?? "your target role";
    return `For ${career}, most people go from beginner to hireable in 4-8 months with consistent daily practice (2-3 hours minimum). The key is to stop tutorial-hopping and build real projects early. Every month you spend watching tutorials without building is a month delayed. Start building your first project in month 2, no matter how imperfect it feels.`;
  }
  if (msg.includes("roadmap") || msg.includes("next") || msg.includes("what should i")) {
    if (roadmap) {
      const pending = roadmap.tasks.filter((t) => t.status === "pending")[0];
      if (pending) {
        return `Your next step on your ${roadmap.careerTitle} roadmap is: **${pending.title}**. ${pending.description} Estimated time: ${pending.estimatedDuration}. Focus on this before moving to the next task — consistency beats rushing every time.`;
      }
      return `You've completed all tasks on your roadmap — congratulations! It's time to start applying for jobs, contribute to open source projects, or take on freelance projects to build your portfolio. You're ready!`;
    }
    return `You haven't generated a roadmap yet. Go to the Career Recommendations page, pick a path that excites you, and generate your personalized roadmap. That will give you a clear, week-by-week plan to follow.`;
  }
  if (msg.includes("linkedin") || msg.includes("cv") || msg.includes("resume") || msg.includes("portfolio")) {
    return `For the Nigerian job market, your LinkedIn profile is critical. Use a professional photo, write a clear headline like "Aspiring Data Analyst | SQL | Power BI | Open to Opportunities", and list all your projects with links. Your portfolio should have 2-3 projects with problem statements, your approach, and results. Recruiters at Nigerian companies spend less than 30 seconds on a CV — lead with impact.`;
  }
  if (msg.includes("start") || msg.includes("begin") || msg.includes("first")) {
    const career = roadmap?.careerTitle ?? "your chosen career";
    return `The best way to start ${career} is to avoid analysis paralysis. Pick one beginner resource and commit to it for 30 days. Set a daily learning target (even 45 minutes daily beats 5-hour weekend sessions). Join a Nigerian tech community on Twitter or Discord for accountability. And start your first mini-project by the end of week 2 — even if it's messy.`;
  }

  const name = profile?.course ? `a ${profile.course} background` : "your background";
  return `That's a great question. Based on ${name} and the Nigerian job market context, I'd recommend focusing on building practical skills over theoretical knowledge. The employers who matter most — startups, fintechs, and remote-first companies — care about what you can do, not just your credentials. Is there a specific aspect of your career journey you'd like me to help you think through?`;
}

router.get("/chat/messages", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const messages = userChats.get(userId) ?? [];
  if (messages.length === 0) {
    const profile = userProfiles.get(userId);
    const welcomeMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: `Hello${profile ? `, I see you're studying ${profile.course}` : ""}! I'm CareerBot, your AI career coach. I know the Nigerian job market inside out — from entry-level salaries to remote work opportunities. Ask me anything about your career path, skill gaps, learning strategies, or the roadmap. I'm here to give you direct, practical advice — no generic answers.`,
      createdAt: new Date().toISOString(),
    };
    userChats.set(userId, [welcomeMsg]);
    res.json([welcomeMsg]);
    return;
  }
  res.json(messages);
});

router.post("/chat/messages", (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const messages = userChats.get(userId) ?? [];
  const userMsg: ChatMessage = {
    id: generateId(),
    role: "user",
    content: parsed.data.content,
    createdAt: new Date().toISOString(),
  };
  messages.push(userMsg);
  const aiResponse = generateAIResponse(parsed.data.content, userId);
  const aiMsg: ChatMessage = {
    id: generateId(),
    role: "assistant",
    content: aiResponse,
    createdAt: new Date(Date.now() + 500).toISOString(),
  };
  messages.push(aiMsg);
  userChats.set(userId, messages);
  res.json(aiMsg);
});

export default router;
