import { Router } from "express";

const router = Router();

const RESOURCES = [
  { id: "r1", title: "SQL for Data Analysis - Complete Beginner Course", type: "video", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", isFree: true, provider: "YouTube / freeCodeCamp", estimatedDuration: "4 hours", relatedSkill: "SQL", category: "Data", difficulty: "Beginner" },
  { id: "r2", title: "Excel Skills for Business Specialization", type: "course", url: "https://www.coursera.org/specializations/excel", isFree: false, provider: "Coursera / Macquarie University", estimatedDuration: "6 weeks", relatedSkill: "Excel", category: "Data", difficulty: "Beginner" },
  { id: "r3", title: "Google Data Analytics Certificate", type: "course", url: "https://www.coursera.org/professional-certificates/google-data-analytics", isFree: false, provider: "Google / Coursera", estimatedDuration: "6 months", relatedSkill: "Data Analysis", category: "Data", difficulty: "Beginner" },
  { id: "r4", title: "Figma UI Design Tutorial for Beginners", type: "video", url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8", isFree: true, provider: "YouTube", estimatedDuration: "3 hours", relatedSkill: "Figma", category: "Design", difficulty: "Beginner" },
  { id: "r5", title: "The Odin Project - Full Stack Curriculum", type: "course", url: "https://www.theodinproject.com", isFree: true, provider: "The Odin Project", estimatedDuration: "12 months", relatedSkill: "Web Development", category: "Tech", difficulty: "Beginner" },
  { id: "r6", title: "freeCodeCamp - Responsive Web Design", type: "course", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", isFree: true, provider: "freeCodeCamp", estimatedDuration: "300 hours", relatedSkill: "HTML/CSS", category: "Tech", difficulty: "Beginner" },
  { id: "r7", title: "JavaScript.info - The Modern JavaScript Tutorial", type: "article", url: "https://javascript.info", isFree: true, provider: "javascript.info", estimatedDuration: "40 hours", relatedSkill: "JavaScript", category: "Tech", difficulty: "Beginner" },
  { id: "r8", title: "React Official Documentation & Tutorial", type: "article", url: "https://react.dev/learn", isFree: true, provider: "React Team", estimatedDuration: "20 hours", relatedSkill: "React", category: "Tech", difficulty: "Intermediate" },
  { id: "r9", title: "Google Digital Marketing & E-commerce Certificate", type: "course", url: "https://grow.google/certificates/digital-marketing-ecommerce/", isFree: false, provider: "Google / Coursera", estimatedDuration: "6 months", relatedSkill: "Digital Marketing", category: "Marketing", difficulty: "Beginner" },
  { id: "r10", title: "3MTT Nigeria Learning Resources", type: "course", url: "https://3mtt.nitda.gov.ng", isFree: true, provider: "3MTT / NITDA Nigeria", estimatedDuration: "Varies", relatedSkill: "Tech Skills", category: "Tech", difficulty: "Beginner" },
  { id: "r11", title: "Power BI for Beginners - Microsoft Learn", type: "course", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", isFree: true, provider: "Microsoft", estimatedDuration: "8 hours", relatedSkill: "Power BI", category: "Data", difficulty: "Beginner" },
  { id: "r12", title: "UI/UX Design Fundamentals - Interaction Design Foundation", type: "article", url: "https://www.interaction-design.org/literature/topics/ui-design", isFree: true, provider: "IDF", estimatedDuration: "10 hours", relatedSkill: "UI/UX Design", category: "Design", difficulty: "Beginner" },
  { id: "r13", title: "HackerRank SQL Practice", type: "course", url: "https://www.hackerrank.com/domains/sql", isFree: true, provider: "HackerRank", estimatedDuration: "20 hours", relatedSkill: "SQL", category: "Data", difficulty: "Intermediate" },
  { id: "r14", title: "Learn Git Branching - Interactive Tutorial", type: "course", url: "https://learngitbranching.js.org", isFree: true, provider: "learngitbranching.js.org", estimatedDuration: "5 hours", relatedSkill: "Git", category: "Tech", difficulty: "Beginner" },
  { id: "r15", title: "Cybersecurity for Everyone - University of Maryland", type: "course", url: "https://www.coursera.org/learn/cybersecurity-for-everyone", isFree: true, provider: "Coursera / UMaryland", estimatedDuration: "9 hours", relatedSkill: "Cybersecurity", category: "Tech", difficulty: "Beginner" },
  { id: "r16", title: "TryHackMe - Cybersecurity Learning Platform", type: "course", url: "https://tryhackme.com", isFree: false, provider: "TryHackMe", estimatedDuration: "Ongoing", relatedSkill: "Ethical Hacking", category: "Tech", difficulty: "Beginner" },
  { id: "r17", title: "Technical Writing with Google", type: "course", url: "https://developers.google.com/tech-writing", isFree: true, provider: "Google", estimatedDuration: "2 days", relatedSkill: "Technical Writing", category: "Writing", difficulty: "Beginner" },
  { id: "r18", title: "Product Management Fundamentals - Coursera", type: "course", url: "https://www.coursera.org/learn/uva-darden-digital-product-management", isFree: false, provider: "Coursera / University of Virginia", estimatedDuration: "11 hours", relatedSkill: "Product Management", category: "Product", difficulty: "Intermediate" },
  { id: "r19", title: "Kaggle - Free Data Science Courses & Datasets", type: "course", url: "https://www.kaggle.com/learn", isFree: true, provider: "Kaggle / Google", estimatedDuration: "Varies", relatedSkill: "Data Science", category: "Data", difficulty: "Beginner" },
  { id: "r20", title: "Andela - Nigerian Tech Talent Platform", type: "article", url: "https://andela.com", isFree: true, provider: "Andela", estimatedDuration: "N/A", relatedSkill: "Career", category: "Jobs", difficulty: "Intermediate" },
];

router.get("/resources", (req, res) => {
  let filtered = [...RESOURCES];
  const { skill, category } = req.query;
  if (skill && typeof skill === "string") {
    filtered = filtered.filter((r) => r.relatedSkill.toLowerCase().includes(skill.toLowerCase()) || r.title.toLowerCase().includes(skill.toLowerCase()));
  }
  if (category && typeof category === "string") {
    filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }
  res.json(filtered);
});

export default router;
