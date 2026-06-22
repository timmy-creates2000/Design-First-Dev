import { Router } from "express";
import { SendChatMessageBody } from "@workspace/api-zod";
import { supabase, getAuthUserId } from "../lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../lib/logger";

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function generateAIResponse(message: string, userId: string): Promise<string> {
  try {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    const { data: roadmap } = await supabase
      .from("roadmaps")
      .select("*, roadmap_tasks(*)")
      .eq("user_id", userId)
      .single();

    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(20);

    const systemPrompt = `You are CareerBot, an expert AI career coach for Nigerian students and graduates.
You know the Nigerian job market deeply — salaries in Naira, remote work opportunities, 3MTT, 
Nigerian fintech ecosystem (Flutterwave, Paystack, Moniepoint), NYSC, and practical learning 
resources available in Nigeria (YouTube, Coursera, Udemy, Andela, etc.).

User profile: ${profile ? JSON.stringify({
  course: profile.course,
  educationLevel: profile.education_level,
  state: profile.state,
  interests: profile.interests,
  existingSkills: profile.existing_skills,
  monthlyBudget: profile.monthly_budget,
  timeline: profile.timeline,
  learningPace: profile.learning_pace,
}) : "Not provided yet"}

Current career path: ${roadmap ? roadmap.career_title : "Not selected yet"}
Progress: ${roadmap?.roadmap_tasks ? `${roadmap.roadmap_tasks.filter((t: any) => t.status === "completed").length}/${roadmap.roadmap_tasks.length} tasks completed` : "No roadmap yet"}

Guidelines:
- Always be direct, practical, and encouraging
- Reference Nigerian context when relevant (salaries in Naira, local resources, Nigerian companies)
- Never give generic advice — make every answer specific to this user's situation
- Keep responses concise and actionable (3-5 paragraphs max)
- Use bullet points for lists of resources or steps`;

    const chatHistory = (history ?? []).slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood! I'm CareerBot, ready to give personalized career guidance for the Nigerian job market. How can I help?" }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (err) {
    logger.error(err, "Gemini AI error");
    return "I'm having a moment — please try again in a few seconds. Your question is important and I want to give you the best answer!";
  }
}

router.get("/chat/messages", async (req, res) => {
  const userId = await getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!messages || messages.length === 0) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("course")
      .eq("user_id", userId)
      .single();

    const welcomeMsg = {
      id: generateId(),
      user_id: userId,
      role: "assistant",
      content: `Hello${profile ? `, I see you're studying ${profile.course}` : ""}! I'm CareerBot, your AI career coach powered by Google Gemini. I know the Nigerian job market inside out — from entry-level salaries to remote work opportunities. Ask me anything about your career path, skill gaps, learning strategies, or your roadmap. I'm here to give you direct, practical advice!`,
      created_at: new Date().toISOString(),
    };

    await supabase.from("chat_messages").insert(welcomeMsg);
    res.json([toPublicMessage(welcomeMsg)]);
    return;
  }

  res.json(messages.map(toPublicMessage));
});

router.post("/chat/messages", async (req, res) => {
  const userId = await getAuthUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const userMsg = {
    id: generateId(),
    user_id: userId,
    role: "user",
    content: parsed.data.content,
    created_at: new Date().toISOString(),
  };
  await supabase.from("chat_messages").insert(userMsg);

  const aiText = await generateAIResponse(parsed.data.content, userId);

  const aiMsg = {
    id: generateId(),
    user_id: userId,
    role: "assistant",
    content: aiText,
    created_at: new Date(Date.now() + 100).toISOString(),
  };
  await supabase.from("chat_messages").insert(aiMsg);

  res.json(toPublicMessage(aiMsg));
});

function toPublicMessage(m: any) {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.created_at,
  };
}

export default router;
