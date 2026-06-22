import { Router } from "express";
import { supabase, getAuthUserId } from "../lib/supabase";

const router = Router();

export interface Career {
  id: string;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  demandLevel: string;
  remotePotential: string;
  difficultyLevel: string;
  timeToJobReady: string;
  requiredSkills: string[];
  category: string;
}

export interface CareerDetail extends Career {
  tools: string[];
  responsibilities: string[];
  entryStrategy: string;
}

export const CAREERS: CareerDetail[] = [
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Transform raw data into business insights using Excel, SQL, and visualization tools. High demand across banking, fintech, and e-commerce in Nigeria.",
    salaryMin: 150000,
    salaryMax: 450000,
    demandLevel: "Very High",
    remotePotential: "High",
    difficultyLevel: "Beginner-Friendly",
    timeToJobReady: "3-5 months",
    requiredSkills: ["Excel", "SQL", "Power BI", "Data Cleaning", "Data Storytelling"],
    category: "Data",
    tools: ["Microsoft Excel", "SQL (MySQL/PostgreSQL)", "Power BI", "Tableau", "Google Sheets"],
    responsibilities: [
      "Collect and clean datasets from various sources",
      "Build dashboards and reports for stakeholders",
      "Identify trends and patterns in business data",
      "Present findings to non-technical teams",
    ],
    entryStrategy: "Start with Excel and Google Sheets mastery, then learn SQL. Build 2-3 dashboard projects using public datasets. Apply for junior roles at fintech or e-commerce companies.",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    description: "Design user interfaces and experiences for digital products. Nigeria's tech boom has created massive demand for UI/UX designers who understand local users.",
    salaryMin: 200000,
    salaryMax: 600000,
    demandLevel: "High",
    remotePotential: "Very High",
    difficultyLevel: "Moderate",
    timeToJobReady: "4-6 months",
    requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    category: "Design",
    tools: ["Figma", "Adobe XD", "Miro", "Notion", "Maze"],
    responsibilities: [
      "Design wireframes, mockups, and interactive prototypes",
      "Conduct user research and usability testing",
      "Create and maintain design systems",
      "Collaborate with developers to implement designs",
    ],
    entryStrategy: "Learn Figma fundamentals, redesign 3 popular Nigerian apps, get feedback on Behance and Twitter. Apply for internships at Lagos startups.",
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    description: "Build the visual and interactive parts of web applications. One of the most in-demand roles at Nigerian startups and global companies hiring remotely.",
    salaryMin: 200000,
    salaryMax: 700000,
    demandLevel: "Very High",
    remotePotential: "Very High",
    difficultyLevel: "Moderate",
    timeToJobReady: "5-8 months",
    requiredSkills: ["HTML/CSS", "JavaScript", "React", "Git", "Responsive Design"],
    category: "Tech",
    tools: ["VS Code", "React", "Tailwind CSS", "Git/GitHub", "Figma (for reading designs)"],
    responsibilities: [
      "Build responsive web interfaces from design files",
      "Write clean, maintainable JavaScript/TypeScript",
      "Optimize performance and accessibility",
      "Collaborate with backend developers on API integration",
    ],
    entryStrategy: "Complete The Odin Project or FreeCodeCamp curriculum. Build a personal portfolio site and 2-3 clone projects. Contribute to open source. Apply on remote job boards.",
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    description: "Build the server-side logic and APIs that power applications. Growing demand in Nigeria's fintech sector, especially for Node.js and Python developers.",
    salaryMin: 250000,
    salaryMax: 800000,
    demandLevel: "High",
    remotePotential: "High",
    difficultyLevel: "Moderate-Hard",
    timeToJobReady: "6-10 months",
    requiredSkills: ["Node.js or Python", "Databases (SQL/NoSQL)", "REST APIs", "Authentication", "Git"],
    category: "Tech",
    tools: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Docker", "Postman"],
    responsibilities: [
      "Design and build RESTful APIs",
      "Manage databases and data models",
      "Implement authentication and security",
      "Deploy and maintain server infrastructure",
    ],
    entryStrategy: "Learn Node.js with Express or Python with FastAPI. Build a full CRUD API project. Learn about databases, auth, and deployment to AWS/Render.",
  },
  {
    id: "digital-marketer",
    title: "Digital Marketer",
    description: "Drive growth for businesses through social media, SEO, email, and paid advertising. High demand from SMEs and e-commerce brands across Nigeria.",
    salaryMin: 100000,
    salaryMax: 400000,
    demandLevel: "Very High",
    remotePotential: "High",
    difficultyLevel: "Beginner-Friendly",
    timeToJobReady: "2-4 months",
    requiredSkills: ["Social Media Strategy", "SEO", "Content Creation", "Email Marketing", "Analytics"],
    category: "Marketing",
    tools: ["Meta Business Suite", "Google Analytics", "Mailchimp", "Canva", "SEMrush"],
    responsibilities: [
      "Manage social media accounts and content calendars",
      "Run and optimize paid ad campaigns",
      "Analyze campaign performance and report ROI",
      "Create content strategies aligned with business goals",
    ],
    entryStrategy: "Get Google Digital Marketing certificate (free). Build a portfolio by managing social media for a small local business for free. Then pitch paid clients.",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Lead the strategy and execution of digital products. Senior role that commands top salaries at Nigerian startups and multinationals.",
    salaryMin: 400000,
    salaryMax: 1200000,
    demandLevel: "High",
    remotePotential: "High",
    difficultyLevel: "Hard",
    timeToJobReady: "8-12 months",
    requiredSkills: ["Product Strategy", "User Research", "Data Analysis", "Stakeholder Management", "Agile"],
    category: "Product",
    tools: ["Jira", "Notion", "Figma", "Mixpanel", "Miro", "Slack"],
    responsibilities: [
      "Define product vision and roadmap",
      "Gather and prioritize user requirements",
      "Work with engineering and design teams",
      "Analyze product metrics and drive growth",
    ],
    entryStrategy: "Start in a related role (developer, designer, or analyst). Take PM courses on Coursera. Get an APM role at a startup. Build a product case study.",
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    description: "Protect organizations from cyber threats. Nigeria's banking and fintech sector has critical need for security professionals.",
    salaryMin: 300000,
    salaryMax: 900000,
    demandLevel: "High",
    remotePotential: "Medium",
    difficultyLevel: "Hard",
    timeToJobReady: "8-12 months",
    requiredSkills: ["Networking", "Linux", "Ethical Hacking", "SIEM Tools", "Risk Assessment"],
    category: "Tech",
    tools: ["Wireshark", "Kali Linux", "Nmap", "Metasploit", "Splunk"],
    responsibilities: [
      "Monitor networks for security incidents",
      "Conduct vulnerability assessments",
      "Respond to and investigate breaches",
      "Develop and enforce security policies",
    ],
    entryStrategy: "Study for CompTIA Security+ certification. Practice on TryHackMe and HackTheBox. Apply for entry-level SOC analyst positions at banks or telcos.",
  },
  {
    id: "technical-writer",
    title: "Technical Writer",
    description: "Create documentation, guides, and content for technical products. Underrated but well-paying remote role that suits analytical minds.",
    salaryMin: 150000,
    salaryMax: 500000,
    demandLevel: "Medium",
    remotePotential: "Very High",
    difficultyLevel: "Beginner-Friendly",
    timeToJobReady: "2-3 months",
    requiredSkills: ["Writing", "API Documentation", "Markdown", "Research", "Attention to Detail"],
    category: "Writing",
    tools: ["Notion", "Confluence", "Postman", "GitHub", "ReadMe.io"],
    responsibilities: [
      "Write API documentation and developer guides",
      "Create user manuals and help articles",
      "Maintain and update documentation as products evolve",
      "Interview engineers to understand technical concepts",
    ],
    entryStrategy: "Write documentation for an open-source project. Build a portfolio on GitHub. Apply to companies hiring remote technical writers globally.",
  },
];

async function computeRecommendations(userId: string) {
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return CAREERS.map((career) => {
    let score = 50;
    if (profile) {
      const interests = profile.interests ?? [];
      const skills = (profile.existing_skills ?? []).map((s: string) => s.toLowerCase());
      const budget = profile.monthly_budget ?? "";
      const timeline = profile.timeline ?? "";

      if (interests.some((i: string) => career.category.toLowerCase().includes(i.toLowerCase()) || career.title.toLowerCase().includes(i.toLowerCase()))) score += 20;
      const overlap = career.requiredSkills.filter((s) => skills.some((us) => s.toLowerCase().includes(us))).length;
      score += overlap * 5;
      if (budget === "under-5k" && career.difficultyLevel === "Beginner-Friendly") score += 10;
      if (budget === "10k-25k" && career.demandLevel.includes("High")) score += 5;
      if (timeline === "urgent" && career.timeToJobReady.startsWith("2")) score += 10;
      if (timeline === "6months" && !career.timeToJobReady.startsWith("8")) score += 5;
    }
    score = Math.min(99, Math.max(40, score));
    return {
      career: {
        id: career.id, title: career.title, description: career.description,
        salaryMin: career.salaryMin, salaryMax: career.salaryMax,
        demandLevel: career.demandLevel, remotePotential: career.remotePotential,
        difficultyLevel: career.difficultyLevel, timeToJobReady: career.timeToJobReady,
        requiredSkills: career.requiredSkills, category: career.category,
      },
      fitScore: score,
      whyItFits: `Based on your background in ${profile?.course ?? "your field"} and interests in ${((profile?.interests as string[]) ?? ["this area"]).join(", ")}, this path offers strong alignment with your goals and the Nigerian job market.`,
      recommendedNextAction: `Start with ${career.requiredSkills[0]} and complete your first project in ${career.timeToJobReady.split("-")[0]} months.`,
    };
  }).sort((a, b) => b.fitScore - a.fitScore).slice(0, 5);
}

router.get("/careers", (_req, res) => {
  res.json(CAREERS.map(({ tools, responsibilities, entryStrategy, ...c }) => c));
});

router.get("/careers/recommendations", async (req, res) => {
  const userId = await getAuthUserId(req);
  if (!userId) {
    const recs = CAREERS.slice(0, 5).map((career) => ({
      career: { id: career.id, title: career.title, description: career.description, salaryMin: career.salaryMin, salaryMax: career.salaryMax, demandLevel: career.demandLevel, remotePotential: career.remotePotential, difficultyLevel: career.difficultyLevel, timeToJobReady: career.timeToJobReady, requiredSkills: career.requiredSkills, category: career.category },
      fitScore: 75,
      whyItFits: "High demand in Nigeria with strong remote potential.",
      recommendedNextAction: `Start with ${career.requiredSkills[0]} today.`,
    }));
    res.json(recs);
    return;
  }
  res.json(await computeRecommendations(userId));
});

router.get("/careers/:id/skill-gap", async (req, res) => {
  const career = CAREERS.find((c) => c.id === req.params.id);
  if (!career) { res.status(404).json({ error: "Career not found" }); return; }
  const userId = await getAuthUserId(req);
  let userSkills: string[] = [];
  if (userId) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("existing_skills")
      .eq("user_id", userId)
      .single();
    userSkills = ((profile?.existing_skills as string[]) ?? []).map((s) => s.toLowerCase());
  }
  const skillsHave = career.requiredSkills.filter((s) => userSkills.some((us) => s.toLowerCase().includes(us)));
  const skillsMissing = career.requiredSkills.filter((s) => !skillsHave.includes(s));
  const readinessScore = Math.round((skillsHave.length / career.requiredSkills.length) * 100);
  res.json({
    careerId: career.id,
    careerTitle: career.title,
    readinessScore,
    skillsHave,
    skillsMissing,
    priorityOrder: skillsMissing,
    estimatedTimeToClose: career.timeToJobReady,
  });
});

router.get("/careers/:id", (req, res) => {
  const career = CAREERS.find((c) => c.id === req.params.id);
  if (!career) { res.status(404).json({ error: "Not found" }); return; }
  res.json(career);
});

export default router;
