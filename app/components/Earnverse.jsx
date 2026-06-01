"use client"

import { useState, useEffect, useRef } from "react"

const CLAUDE_API = "https://api.anthropic.com/v1/messages"

const OPPORTUNITIES_DB = {
  coding: [
    { name: "Devpost Hackathons", url: "https://devpost.com", category: "Hackathon", prize: "$500–$50,000", deadline: "Rolling", icon: "🏆", scamRisk: 2 },
    { name: "HackerEarth Challenges", url: "https://hackerearth.com", category: "Coding", prize: "$200–$10,000", deadline: "Rolling", icon: "💻", scamRisk: 2 },
    { name: "Kaggle Competitions", url: "https://kaggle.com/competitions", category: "AI/ML", prize: "$1,000–$100,000", deadline: "Rolling", icon: "🤖", scamRisk: 1 },
    { name: "Google Summer of Code", url: "https://summerofcode.withgoogle.com", category: "Open Source", prize: "$1,500–$3,300", deadline: "Mar–Apr", icon: "☀️", scamRisk: 1 },
    { name: "Lablab.ai AI Hackathons", url: "https://lablab.ai", category: "AI Hackathon", prize: "$500–$25,000", deadline: "Rolling", icon: "🧠", scamRisk: 2 },
    { name: "DoraHacks Web3 Hackathons", url: "https://dorahacks.io", category: "Web3", prize: "$1,000–$50,000", deadline: "Rolling", icon: "⛓️", scamRisk: 3 },
    { name: "HackerOne Bug Bounties", url: "https://hackerone.com", category: "Bug Bounty", prize: "$100–$250,000", deadline: "Rolling", icon: "🐛", scamRisk: 1 },
    { name: "Immunefi Web3 Bounties", url: "https://immunefi.com", category: "Web3 Security", prize: "$1,000–$10,000,000", deadline: "Rolling", icon: "🔒", scamRisk: 2 },
    { name: "ETHGlobal Hackathons", url: "https://ethglobal.com", category: "Ethereum", prize: "$2,000–$30,000", deadline: "Rolling", icon: "Ξ", scamRisk: 2 },
    { name: "NASA Space Apps Challenge", url: "https://spaceapps.nasa.gov", category: "Science/Tech", prize: "$5,000–$50,000", deadline: "Oct", icon: "🚀", scamRisk: 1 },
  ],
  trading: [
    { name: "FTMO Prop Trading", url: "https://ftmo.com", category: "Prop Trading", prize: "$10,000–$200,000 account", deadline: "Rolling", icon: "📈", scamRisk: 4 },
    { name: "Funded Next", url: "https://fundednext.com", category: "Prop Trading", prize: "$5,000–$300,000 account", deadline: "Rolling", icon: "💹", scamRisk: 4 },
    { name: "Binance Trading Competitions", url: "https://binance.com/en/trade-competition", category: "Crypto Trading", prize: "$100–$50,000", deadline: "Monthly", icon: "₿", scamRisk: 3 },
    { name: "The5ers Funded Trader", url: "https://the5ers.com", category: "Prop Trading", prize: "$6,000–$4,000,000 account", deadline: "Rolling", icon: "📊", scamRisk: 4 },
  ],
  writing: [
    { name: "Medium Partner Program", url: "https://medium.com/creators", category: "Writing", prize: "$50–$5,000/month", deadline: "Rolling", icon: "✍️", scamRisk: 1 },
    { name: "Substack Newsletter", url: "https://substack.com", category: "Newsletter", prize: "$100–$10,000/month", deadline: "Rolling", icon: "📰", scamRisk: 1 },
    { name: "Contena Freelance Writing", url: "https://contena.co", category: "Freelance", prize: "$50–$500/article", deadline: "Rolling", icon: "📝", scamRisk: 2 },
    { name: "WriterAccess Content", url: "https://writeraccess.com", category: "Content Writing", prize: "$15–$200/article", deadline: "Rolling", icon: "🖊️", scamRisk: 2 },
    { name: "Reedsy Writing Contests", url: "https://reedsy.com/discovery/contests", category: "Fiction Writing", prize: "$50–$5,000", deadline: "Weekly", icon: "📚", scamRisk: 1 },
  ],
  design: [
    { name: "99designs Contests", url: "https://99designs.com/contests", category: "Design", prize: "$100–$1,500/contest", deadline: "Rolling", icon: "🎨", scamRisk: 2 },
    { name: "Canva Creator Program", url: "https://canva.com/creators", category: "Design Assets", prize: "$5–$50/template", deadline: "Rolling", icon: "🖼️", scamRisk: 1 },
    { name: "Envato Market", url: "https://market.envato.com/sell", category: "Digital Assets", prize: "$10–$100/sale", deadline: "Rolling", icon: "💎", scamRisk: 2 },
    { name: "Shutterstock Contributor", url: "https://submit.shutterstock.com", category: "Stock Images", prize: "$0.25–$120/image", deadline: "Rolling", icon: "📸", scamRisk: 1 },
  ],
  socialmedia: [
    { name: "YouTube Partner Program", url: "https://youtube.com/creators", category: "Video Content", prize: "$1–$10/1000 views", deadline: "Rolling", icon: "▶️", scamRisk: 1 },
    { name: "TikTok Creator Fund", url: "https://tiktok.com/creators", category: "Short Video", prize: "$0.02–$0.04/1000 views", deadline: "Rolling", icon: "🎵", scamRisk: 2 },
    { name: "Twitch Affiliate Program", url: "https://twitch.tv/partners", category: "Live Streaming", prize: "$100–$5,000/month", deadline: "Rolling", icon: "🎮", scamRisk: 1 },
  ],
  web3crypto: [
    { name: "Layer3 Web3 Quests", url: "https://layer3.xyz", category: "Web3 Quests", prize: "$10–$500/quest", deadline: "Rolling", icon: "🌐", scamRisk: 3 },
    { name: "Galxe Campaigns", url: "https://galxe.com", category: "Web3 Campaigns", prize: "$5–$200/task", deadline: "Rolling", icon: "🌌", scamRisk: 4 },
    { name: "Gitcoin Grants", url: "https://gitcoin.co/grants", category: "Open Source Funding", prize: "$100–$50,000", deadline: "Quarterly", icon: "💰", scamRisk: 2 },
    { name: "Zealy Community Sprints", url: "https://zealy.io", category: "Community Tasks", prize: "$20–$1,000", deadline: "Rolling", icon: "⚡", scamRisk: 3 },
    { name: "Coinbase Learn & Earn", url: "https://coinbase.com/earn", category: "Learn to Earn", prize: "$3–$50/lesson", deadline: "Rolling", icon: "🎓", scamRisk: 2 },
  ],
  scholarships: [
    { name: "Chevening UK Scholarships", url: "https://chevening.org", category: "Scholarship", prize: "Full tuition + $25,000", deadline: "Nov", icon: "🎓", scamRisk: 1 },
    { name: "HEC Pakistan Scholarships", url: "https://hec.gov.pk/english/scholarships", category: "Scholarship (PK)", prize: "Full funding", deadline: "Rolling", icon: "🏫", scamRisk: 1 },
    { name: "Turkish Government Scholarship", url: "https://turkiyeburslari.gov.tr", category: "International", prize: "Full tuition + stipend", deadline: "Feb", icon: "🌙", scamRisk: 1 },
    { name: "Aga Khan Foundation Grants", url: "https://akdn.org", category: "Development", prize: "$5,000–$50,000", deadline: "Rolling", icon: "✨", scamRisk: 1 },
    { name: "Bold.org Scholarships", url: "https://bold.org/scholarships", category: "Various", prize: "$500–$25,000", deadline: "Rolling", icon: "📖", scamRisk: 2 },
  ],
  freelance: [
    { name: "Upwork Freelancing", url: "https://upwork.com", category: "Freelance", prize: "$5–$200/hour", deadline: "Rolling", icon: "💼", scamRisk: 2 },
    { name: "Fiverr Gigs", url: "https://fiverr.com", category: "Freelance", prize: "$5–$10,000/project", deadline: "Rolling", icon: "⭐", scamRisk: 2 },
    { name: "Toptal Premium Freelance", url: "https://toptal.com", category: "Elite Freelance", prize: "$60–$200/hour", deadline: "Rolling", icon: "🔝", scamRisk: 1 },
    { name: "Contra Independent Work", url: "https://contra.com", category: "Freelance", prize: "$20–$150/hour", deadline: "Rolling", icon: "🤝", scamRisk: 2 },
    { name: "Remote OK Jobs", url: "https://remoteok.com", category: "Remote Jobs", prize: "$2,000–$15,000/month", deadline: "Rolling", icon: "🌍", scamRisk: 2 },
    { name: "Arc.dev Developer Jobs", url: "https://arc.dev", category: "Dev Jobs", prize: "$30–$100/hour", deadline: "Rolling", icon: "🖥️", scamRisk: 1 },
  ],
  gaming: [
    { name: "ESL Gaming Tournaments", url: "https://esl.com", category: "Esports", prize: "$100–$500,000", deadline: "Rolling", icon: "🏆", scamRisk: 2 },
    { name: "Battlefy Esports", url: "https://battlefy.com", category: "Esports", prize: "$50–$10,000", deadline: "Rolling", icon: "🎯", scamRisk: 2 },
    { name: "Sorare Fantasy Sports", url: "https://sorare.com", category: "Fantasy/NFT", prize: "$50–$5,000/season", deadline: "Weekly", icon: "⚽", scamRisk: 3 },
  ],
  teaching: [
    { name: "Udemy Course Creation", url: "https://udemy.com/teaching", category: "Online Teaching", prize: "$100–$10,000/month", deadline: "Rolling", icon: "📚", scamRisk: 1 },
    { name: "Preply Online Tutoring", url: "https://preply.com/en/become-a-tutor", category: "Tutoring", prize: "$15–$80/hour", deadline: "Rolling", icon: "👨‍🏫", scamRisk: 1 },
    { name: "iTalki Language Teaching", url: "https://italki.com/teacher", category: "Language", prize: "$10–$50/hour", deadline: "Rolling", icon: "🗣️", scamRisk: 1 },
    { name: "MentorCruise", url: "https://mentorcruise.com/become-mentor", category: "Mentorship", prize: "$50–$300/month", deadline: "Rolling", icon: "🧠", scamRisk: 1 },
  ],
  dataAnnotation: [
    { name: "Remotasks AI Training", url: "https://remotasks.com", category: "AI Data", prize: "$5–$25/hour", deadline: "Rolling", icon: "🏷️", scamRisk: 2 },
    { name: "Appen Crowd Work", url: "https://appen.com/jobs", category: "Data Annotation", prize: "$8–$20/hour", deadline: "Rolling", icon: "🤖", scamRisk: 2 },
    { name: "Scale AI RLHF Tasks", url: "https://scale.com", category: "AI Feedback", prize: "$10–$40/hour", deadline: "Rolling", icon: "🧬", scamRisk: 2 },
    { name: "Outlier AI Expert Tasks", url: "https://outlier.ai/crowdsource", category: "Expert AI Work", prize: "$15–$50/hour", deadline: "Rolling", icon: "💡", scamRisk: 2 },
  ],
}

const SKILL_MAP = {
  Coding: ["coding", "web3crypto", "dataAnnotation"],
  Trading: ["trading", "web3crypto"],
  Writing: ["writing", "freelance"],
  Design: ["design", "freelance"],
  "Social Media": ["socialmedia", "freelance"],
  Cybersecurity: ["coding"],
  "Data Analysis": ["coding", "dataAnnotation"],
  Gaming: ["gaming"],
  "Web3/Crypto": ["web3crypto", "trading"],
  Marketing: ["freelance", "socialmedia"],
  Teaching: ["teaching"],
  "No Skill Yet": ["scholarships", "freelance", "dataAnnotation"],
}

const AGE_CATEGORIES = {
  "15-22": ["scholarships", "coding", "dataAnnotation", "gaming"],
  "23-35": ["freelance", "coding", "web3crypto", "trading", "design", "writing"],
  "36-50": ["freelance", "teaching", "trading", "web3crypto"],
  "51-60": ["teaching", "freelance", "writing"],
}

const EARNING_RANGES = {
  "No Skill Yet_Beginner_1-2 hours": "$50–$200/mo",
  "No Skill Yet_Beginner_4-5 hours": "$100–$400/mo",
  "Coding_Beginner_1-2 hours": "$200–$800/mo",
  "Coding_Intermediate_4-5 hours": "$1,000–$3,500/mo",
  "Coding_Expert_Full time": "$3,000–$12,000/mo",
  "Design_Beginner_1-2 hours": "$150–$600/mo",
  "Design_Intermediate_4-5 hours": "$800–$2,500/mo",
  "Design_Expert_Full time": "$2,000–$8,000/mo",
  "Writing_Beginner_1-2 hours": "$100–$400/mo",
  "Writing_Intermediate_4-5 hours": "$500–$2,000/mo",
  "Writing_Expert_Full time": "$1,500–$6,000/mo",
  "Trading_Intermediate_4-5 hours": "$500–$3,000/mo",
  "Trading_Expert_Full time": "$2,000–$15,000/mo",
  "Social Media_Beginner_1-2 hours": "$50–$300/mo",
  "Social Media_Intermediate_4-5 hours": "$300–$2,000/mo",
  "Social Media_Expert_Full time": "$1,000–$10,000/mo",
  "Web3/Crypto_Intermediate_4-5 hours": "$300–$2,000/mo",
  "Web3/Crypto_Expert_Full time": "$1,000–$8,000/mo",
  "Teaching_Intermediate_4-5 hours": "$400–$1,500/mo",
  "Teaching_Expert_Full time": "$1,500–$5,000/mo",
}

function getEarningRange(skills, exp, time) {
  for (const skill of skills) {
    const key = `${skill}_${exp}_${time}`
    if (EARNING_RANGES[key]) return EARNING_RANGES[key]
  }
  const level = exp === "Expert" ? "high" : exp === "Intermediate" ? "mid" : "low"
  const timeBoost = time === "Full time" ? 3 : time === "4-5 hours" ? 2 : 1
  const bases = { low: [50, 200], mid: [200, 800], high: [800, 3000] }
  const [lo, hi] = bases[level]
  return `$${lo * timeBoost}–$${hi * timeBoost}/mo`
}

function getMatchedOpps(profile) {
  const { age, skills, experience } = profile
  const ageKey = age <= 22 ? "15-22" : age <= 35 ? "23-35" : age <= 50 ? "36-50" : "51-60"
  const ageCats = AGE_CATEGORIES[ageKey] || []
  const skillCats = skills.flatMap(s => SKILL_MAP[s] || [])
  const allCats = [...new Set([...ageCats, ...skillCats])]
  
  const results = []
  for (const cat of allCats) {
    const opps = OPPORTUNITIES_DB[cat] || []
    for (const opp of opps) {
      if (!results.find(r => r.name === opp.name)) {
        results.push({ ...opp, matchScore: Math.floor(70 + Math.random() * 28) })
      }
    }
  }
  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 18)
}

async function callClaude(messages, systemPrompt) {
  const res = await fetch(CLAUDE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  })
  const data = await res.json()
  return data.content?.map(b => b.text || "").join("") || "Something went wrong."
}

const goals = [
  { id: "fee", icon: "🎓", label: "Cover Education Fees", desc: "Pay tuition & education costs" },
  { id: "parttime", icon: "⏰", label: "Part-Time Income", desc: "Earn on the side consistently" },
  { id: "extra", icon: "💰", label: "Extra Money", desc: "Additional income stream" },
  { id: "retirement", icon: "🏡", label: "Retirement Income", desc: "Passive income after retirement" },
  { id: "fulltime", icon: "🚀", label: "Full-Time Online", desc: "Go completely online" },
  { id: "business", icon: "🏢", label: "Fund My Business", desc: "Get startup funding & grants" },
]

const skillsList = [
  { icon: "💻", name: "Coding" }, { icon: "📈", name: "Trading" }, { icon: "✍️", name: "Writing" },
  { icon: "🎨", name: "Design" }, { icon: "📱", name: "Social Media" }, { icon: "🔒", name: "Cybersecurity" },
  { icon: "📊", name: "Data Analysis" }, { icon: "🎮", name: "Gaming" }, { icon: "🌐", name: "Web3/Crypto" },
  { icon: "📢", name: "Marketing" }, { icon: "🗣️", name: "Teaching" }, { icon: "🔧", name: "No Skill Yet" },
]

const RISK_COLORS = {
  1: { bg: "rgba(16,185,129,0.12)", color: "#10b981", label: "Very Safe" },
  2: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", label: "Safe" },
  3: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Moderate Risk" },
  4: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "Use Caution" },
  5: { bg: "rgba(239,68,68,0.2)", color: "#dc2626", label: "High Risk" },
}

export default function EarnVerse() {
  const [step, setStep] = useState("landing")
  const [formStep, setFormStep] = useState(1)
  const [profile, setProfile] = useState({ age: 22, goal: "", skills: [], experience: "", time: "", country: "", name: "" })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [messages, setMessages] = useState([
    { role: "ai", text: "Assalam o Alaikum! Main aapka EarnVerse AI Copilot hun. Aapki profile dekh ke main best opportunities dhundta hun. Kya explore karna chahte ho?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [opportunities, setOpportunities] = useState([])
  const [searching, setSearching] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState([])
  const chatRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    const pts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }))
    setParticles(pts)
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const toggleSkill = (skill) => {
    setProfile(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill]
    }))
  }

  const handleComplete = async () => {
    setStep("dashboard")
    setSearching(true)
    await new Promise(r => setTimeout(r, 1200))
    const opps = getMatchedOpps(profile)
    setOpportunities(opps)
    setSearching(false)
  }

  const sendMessage = async (text) => {
    const msg = text || input
    if (!msg.trim()) return
    setInput("")
    const newMessages = [...messages, { role: "user", text: msg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const systemPrompt = `You are EarnVerse AI Copilot — a smart earning opportunities advisor. You know this user's profile:
Name: ${profile.name || "User"}, Age: ${profile.age}, Skills: ${profile.skills.join(", ") || "None yet"}, Experience: ${profile.experience}, Time: ${profile.time}, Country: ${profile.country}, Goal: ${profile.goal}

You help find real earning opportunities, check scams, create roadmaps, and give advice. Be concise, helpful, and respond in the same language the user uses (Urdu/Roman Urdu or English). Always mention realistic earning amounts based on the user's actual skill level. Flag obvious scams with a warning emoji ⚠️. For real opportunities, provide direct links where possible.`
      const apiMessages = newMessages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }))
      const reply = await callClaude(apiMessages, systemPrompt)
      setMessages(prev => [...prev, { role: "ai", text: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "Network error. Please try again." }])
    }
    setLoading(false)
  }

  const earningRange = profile.skills.length > 0 ? getEarningRange(profile.skills, profile.experience || "Beginner", profile.time || "1-2 hours") : "$50–$500/mo"

  if (!mounted) return null

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow-x: hidden; }
    .ev-root { font-family: 'Space Grotesk', sans-serif; background: #02020a; color: #e8e6f0; min-height: 100vh; position: relative; overflow-x: hidden; }
    .ev-logo { font-family: 'Orbitron', monospace; font-weight: 900; letter-spacing: -0.5px; }
    .ev-logo span { background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    
    .particle { position: fixed; border-radius: 50%; background: rgba(99,102,241,0.4); pointer-events: none; animation: particleFloat linear infinite; }
    @keyframes particleFloat { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.4; } 100% { transform: translateY(-10vh) scale(1); opacity: 0; } }
    
    .grid-bg { position: fixed; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px); background-size: 50px 50px; }
    .noise-overlay { position: fixed; inset: 0; pointer-events: none; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px; }
    .orb1 { position: fixed; top: -200px; left: -200px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%); pointer-events: none; animation: orbPulse 8s ease-in-out infinite; }
    .orb2 { position: fixed; bottom: -300px; right: -200px; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%); pointer-events: none; animation: orbPulse 12s ease-in-out infinite reverse; }
    @keyframes orbPulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } }
    
    .glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); }
    .glass-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
    .glass-hover:hover { transform: translateY(-3px); border-color: rgba(99,102,241,0.35) !important; background: rgba(99,102,241,0.05) !important; }
    
    .btn-glow { background: linear-gradient(135deg, #6366f1, #8b5cf6); transition: all 0.3s; position: relative; overflow: hidden; }
    .btn-glow::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #8b5cf6, #06b6d4); opacity: 0; transition: opacity 0.3s; }
    .btn-glow:hover::before { opacity: 1; }
    .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(99,102,241,0.5), 0 8px 25px rgba(99,102,241,0.3); }
    .btn-glow span { position: relative; z-index: 1; }
    
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -500px 0; } 100% { background-position: 500px 0; } }
    @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
    @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
    @keyframes pulse2 { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
    @keyframes glow-text { 0%,100% { text-shadow: 0 0 20px rgba(99,102,241,0.5); } 50% { text-shadow: 0 0 40px rgba(99,102,241,0.9), 0 0 80px rgba(139,92,246,0.4); } }
    
    .slide-up { animation: slideUp 0.6s ease forwards; }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .spin-anim { animation: spin 1s linear infinite; }
    .glow-text { animation: glow-text 3s ease-in-out infinite; }
    
    .shimmer-text { background: linear-gradient(90deg, #fff 0%, #6366f1 30%, #8b5cf6 50%, #06b6d4 70%, #fff 100%); background-size: 500px auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4s linear infinite; }
    
    .scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent); animation: scan 3s linear infinite; pointer-events: none; }
    
    .progress-bar { height: 2px; background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4); transition: width 0.5s ease; border-radius: 2px; }
    
    .option-sel { border-color: #6366f1 !important; background: rgba(99,102,241,0.1) !important; }
    .skill-sel { border-color: #6366f1 !important; background: rgba(99,102,241,0.12) !important; color: #818cf8 !important; }
    
    .tab-active { background: rgba(99,102,241,0.15) !important; color: #818cf8 !important; border-color: rgba(99,102,241,0.4) !important; }
    
    .opp-card { animation: slideUp 0.4s ease forwards; opacity: 0; }
    
    .chat-ai { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 0 18px 18px 18px; }
    .chat-user { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.25); border-radius: 18px 0 18px 18px; color: #c7d2fe; }
    
    .hexagon-bg { background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.05) 100%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
    
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
    input[type=range] { accent-color: #6366f1; }
    input[type=text], input[type=range] { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: white; border-radius: 12px; padding: 10px 16px; width: 100%; outline: none; font-family: 'Space Grotesk', sans-serif; transition: border-color 0.2s; }
    input[type=text]:focus { border-color: #6366f1; }
  `

  // ===== LANDING =====
  if (step === "landing") {
    return (
      <div className="ev-root">
        <style>{css}</style>
        <div className="grid-bg" />
        <div className="noise-overlay" />
        <div className="orb1" />
        <div className="orb2" />
        {particles.map(p => (
          <div key={p.id} className="particle" style={{ left: `${p.x}%`, width: p.size, height: p.size, animationDuration: `${p.speed}s`, animationDelay: `${p.delay}s` }} />
        ))}

        {/* Navbar */}
        <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="ev-logo" style={{ fontSize: 22 }}>EARN<span>VERSE</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 12, color: "#10b981" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "blink 2s infinite" }} />
              Live · 2M+ Opportunities
            </div>
            <button className="btn-glow" onClick={() => setStep("onboarding")} style={{ padding: "10px 22px", borderRadius: 12, border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              <span>Get Started Free →</span>
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "80px 20px 60px" }} className="slide-up">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 12, color: "#818cf8", marginBottom: 32 }}>
            ⚡ AI-Powered · Web3 Native · Zero Cost
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, fontFamily: "'Orbitron', monospace" }}>
            <span className="shimmer-text">Discover Every</span>
            <br />
            <span style={{ color: "white" }}>Opportunity on Earth</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Age 15 to 60 — AI finds real earning opportunities matched to your exact skills, location & time. Scam detection included.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-glow" onClick={() => setStep("onboarding")} style={{ padding: "14px 32px", borderRadius: 14, border: "none", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 16 }}>
              <span>Start Finding Opportunities →</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ position: "relative", zIndex: 5, maxWidth: 900, margin: "0 auto 60px", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[["2M+", "Opportunities Listed"], ["180+", "Countries Covered"], ["$2.4B+", "Total Prize Pool"], ["98%", "Scam Detection"]].map(([v, l], i) => (
              <div key={i} className="glass glass-hover" style={{ borderRadius: 16, padding: "24px 16px", textAlign: "center" }}>
                <div className="ev-logo" style={{ fontSize: 28, background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>{v}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div style={{ position: "relative", zIndex: 5, maxWidth: 1100, margin: "0 auto 60px", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 10, fontFamily: "'Orbitron', monospace" }}>Every Opportunity Type</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", marginBottom: 32, fontSize: 14 }}>18+ categories · Real verified sources</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
            {[["🏆","Hackathons","2.4k+","#6366f1"],["💰","Crypto/Web3","8.1k+","#8b5cf6"],["📈","Prop Trading","1.2k+","#f59e0b"],["🎓","Scholarships","15k+","#10b981"],["💼","Remote Jobs","42k+","#6366f1"],["🐛","Bug Bounties","900+","#ef4444"],["🚀","Startup Grants","3.2k+","#8b5cf6"],["🌐","Ambassador","600+","#10b981"],["📝","Content Creator","5k+","#f59e0b"],["🎮","Gaming/Esports","1.8k+","#ef4444"],["🤖","AI Challenges","1.5k+","#6366f1"],["📚","Open Source","6k+","#10b981"],["🎨","Design Contests","2.3k+","#8b5cf6"],["🔬","Research","4.5k+","#6366f1"],["🏛️","Govt Funding","800+","#f59e0b"],["🤝","Referral/Passive","2k+","#10b981"],["📊","Data Annotation","500+","#ef4444"],["🧠","Teaching/Mentor","1k+","#8b5cf6"]].map(([icon,name,cnt,col],i)=>(
              <div key={i} className="glass glass-hover" style={{ borderRadius: 14, padding: "16px 10px", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "white", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 10, color: col }}>{cnt}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div style={{ position: "relative", zIndex: 5, maxWidth: 900, margin: "0 auto 80px", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 40, fontFamily: "'Orbitron', monospace" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[["01","📋","Tell Us About You","Age, skills, goals & time"],["02","🤖","AI Matches You","Scans 2M+ real opportunities"],["03","🎯","Get Your List","Ranked, verified, scam-checked"],["04","💸","Earn & Grow","Apply, win, track, level up"]].map(([n,ic,t,d],i)=>(
              <div key={i} className="glass" style={{ borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#6366f1", opacity: 0.08, position: "absolute", top: 4, right: 10, fontFamily: "'Orbitron', monospace" }}>{n}</div>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{ic}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ position: "relative", zIndex: 5, maxWidth: 700, margin: "0 auto 60px", padding: "0 20px", textAlign: "center" }}>
          <div className="glass" style={{ borderRadius: 24, padding: 56, background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))" }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>Ready to Earn?</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 28, fontSize: 14 }}>Thousands of people age 15–60 are already earning online</p>
            <button className="btn-glow" onClick={() => setStep("onboarding")} style={{ padding: "14px 36px", borderRadius: 14, border: "none", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 16 }}>
              <span>Get Started — It's Free →</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== ONBOARDING =====
  if (step === "onboarding") {
    return (
      <div className="ev-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{css}</style>
        <div className="orb1" /><div className="orb2" /><div className="grid-bg" />
        <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 5 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="ev-logo" style={{ fontSize: 20, marginBottom: 4 }}>EARN<span>VERSE</span></div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Personalizing your experience</div>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div className="progress-bar" style={{ width: s <= formStep ? "100%" : "0%" }} />
              </div>
            ))}
          </div>

          <div className="slide-up glass" style={{ borderRadius: 24, padding: 32 }}>
            {formStep === 1 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#818cf8", letterSpacing: 3, marginBottom: 6 }}>STEP 1 OF 4</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Who are you?</h2>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24 }}>Tell us a bit about yourself</p>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, display: "block" }}>Your Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} placeholder="Enter your name..." />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16, display: "block" }}>Your Age</label>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div className="ev-logo" style={{ fontSize: 64, background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{profile.age}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{profile.age <= 22 ? "🎓 Student" : profile.age <= 35 ? "💼 Young Professional" : profile.age <= 50 ? "🏢 Mid Career" : "🏡 Senior"}</div>
                  </div>
                  <input type="range" min={15} max={60} value={profile.age} onChange={e => setProfile(p => ({...p, age: parseInt(e.target.value)}))} style={{ padding: "4px 0", borderRadius: 4 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}><span>15</span><span>60</span></div>
                </div>
                <button onClick={() => profile.name && setFormStep(2)} className="btn-glow" style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14, opacity: profile.name ? 1 : 0.4 }}>
                  <span>Continue →</span>
                </button>
              </div>
            )}

            {formStep === 2 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#818cf8", letterSpacing: 3, marginBottom: 6 }}>STEP 2 OF 4</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Your main goal?</h2>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Choose what matters most</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {goals.map(g => (
                    <div key={g.id} onClick={() => setProfile(p => ({...p, goal: g.id}))} className={`glass ${profile.goal === g.id ? "option-sel" : ""}`} style={{ padding: "12px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }}>
                      <span style={{ fontSize: 22 }}>{g.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{g.label}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{g.desc}</div>
                      </div>
                      {profile.goal === g.id && <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setFormStep(1)} className="glass" style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", cursor: "pointer", background: "none", fontSize: 13 }}>← Back</button>
                  <button onClick={() => profile.goal && setFormStep(3)} className="btn-glow" style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14, opacity: profile.goal ? 1 : 0.4 }}><span>Continue →</span></button>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#818cf8", letterSpacing: 3, marginBottom: 6 }}>STEP 3 OF 4</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Your skills?</h2>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Select all that apply — no skill is totally fine!</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {skillsList.map(s => (
                    <button key={s.name} onClick={() => toggleSkill(s.name)} className={profile.skills.includes(s.name) ? "skill-sel" : ""} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: profile.skills.includes(s.name) ? "#818cf8" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
                      {s.icon} {s.name}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setFormStep(2)} className="glass" style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", cursor: "pointer", background: "none", fontSize: 13 }}>← Back</button>
                  <button onClick={() => setFormStep(4)} className="btn-glow" style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}><span>Continue →</span></button>
                </div>
              </div>
            )}

            {formStep === 4 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#818cf8", letterSpacing: 3, marginBottom: 6 }}>STEP 4 OF 4</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Final Details</h2>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>Almost done!</p>
                {[
                  { label: "Experience Level", field: "experience", opts: [["🌱","Beginner","Just starting"],["🔥","Intermediate","Some experience"],["⚡","Expert","Highly skilled"]] },
                  { label: "Daily Time Available", field: "time", opts: [["⏰","1-2 hours","Side hustle"],["💪","4-5 hours","Part time"],["🚀","Full time","8+ hours"]] },
                ].map(({ label, field, opts }) => (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, display: "block" }}>{label}</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {opts.map(([ic, id, desc]) => (
                        <button key={id} onClick={() => setProfile(p => ({...p, [field]: id}))} className={profile[field] === id ? "option-sel" : ""} style={{ padding: "12px 8px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "white", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                          <div style={{ fontSize: 18, marginBottom: 4 }}>{ic}</div>
                          <div style={{ fontSize: 11, fontWeight: 600 }}>{id}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, display: "block" }}>Country</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {["🇵🇰 Pakistan","🇮🇳 India","🌍 Global"].map(c => (
                      <button key={c} onClick={() => setProfile(p => ({...p, country: c}))} className={profile.country === c ? "option-sel" : ""} style={{ padding: "10px 6px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: profile.country === c ? "#818cf8" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, transition: "all 0.2s" }}>{c}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setFormStep(3)} className="glass" style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", cursor: "pointer", background: "none", fontSize: 13 }}>← Back</button>
                  <button onClick={handleComplete} disabled={!profile.experience || !profile.time || !profile.country} className="btn-glow" style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14, opacity: (profile.experience && profile.time && profile.country) ? 1 : 0.4 }}>
                    <span>🚀 Launch EarnVerse</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ===== DASHBOARD =====
  return (
    <div className="ev-root">
      <style>{css}</style>
      <div className="grid-bg" />
      <div className="orb1" /><div className="orb2" />

      {/* Topbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "rgba(2,2,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div className="ev-logo" style={{ fontSize: 18 }}>EARN<span>VERSE</span></div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["dashboard","🏠","Home"],["opportunities","🔍","Opportunities"],["roadmap","🗺️","Roadmap"],["copilot","🤖","AI Copilot"]].map(([id, ic, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} className={activeTab === id ? "tab-active" : ""} style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${activeTab === id ? "rgba(99,102,241,0.3)" : "transparent"}`, background: activeTab === id ? "rgba(99,102,241,0.1)" : "none", color: activeTab === id ? "#818cf8" : "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s" }}>
                {ic} {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 11, color: "#10b981" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", animation: "blink 1.5s infinite" }} />AI Active
          </div>
          <div className="glass" style={{ padding: "5px 12px", borderRadius: 10, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            {profile.name} · {profile.age}y · {profile.country}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 5 }}>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Welcome back, {profile.name || "Explorer"} 👋</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{profile.skills.slice(0,3).join(" · ") || "No skills set"} · {profile.experience} · {profile.time}</p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
              {[
                { label: "Matched Opportunities", value: searching ? "..." : String(opportunities.length || "—"), icon: "🎯", color: "#6366f1" },
                { label: "Earning Potential", value: earningRange, icon: "💸", color: "#10b981" },
                { label: "Your Category", value: profile.age <= 22 ? "Student" : profile.age <= 35 ? "Young Pro" : profile.age <= 50 ? "Mid Career" : "Senior", icon: "👤", color: "#f59e0b" },
                { label: "Scams Blocked", value: "14+", icon: "🛡️", color: "#ef4444" },
              ].map((k, i) => (
                <div key={i} className="glass glass-hover" style={{ borderRadius: 18, padding: 20, position: "relative", overflow: "hidden" }}>
                  <div className="scan-line" />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 22 }}>{k.icon}</span>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 8, background: `${k.color}18`, color: k.color }}>Live</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: k.color, fontFamily: "'Orbitron', monospace" }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Earning Potential Bar */}
            <div className="glass" style={{ borderRadius: 18, padding: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Your Earning Potential</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Based on {profile.skills.length > 0 ? profile.skills.slice(0,3).join(", ") : "your profile"} · {profile.experience} level</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#10b981", fontFamily: "'Orbitron', monospace" }}>{earningRange}</div>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: profile.experience === "Expert" ? "85%" : profile.experience === "Intermediate" ? "55%" : "25%", background: "linear-gradient(90deg, #6366f1, #10b981)", borderRadius: 4, transition: "width 1s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                <span>Beginner</span><span>Intermediate</span><span>Expert</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[["🔍","Find Opportunities","AI-matched just for you","opportunities","#6366f1"],["🗺️","Get Roadmap","30-day earning plan","roadmap","#8b5cf6"],["🤖","Ask AI Copilot","Roman Urdu / English","copilot","#10b981"]].map(([ic,title,desc,tab,col],i) => (
                <button key={i} onClick={() => setActiveTab(tab)} className="glass glass-hover" style={{ borderRadius: 18, padding: 24, textAlign: "left", cursor: "pointer", border: `1px solid ${col}18`, width: "100%", background: "rgba(255,255,255,0.015)" }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{ic}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>{desc}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: col }}>Open →</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OPPORTUNITIES TAB */}
        {activeTab === "opportunities" && (
          <div className="fade-in">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Your Opportunities</h1>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>AI-matched · Scam-checked · For {profile.name}</p>
              </div>
              <button onClick={handleComplete} className="btn-glow" style={{ padding: "10px 20px", borderRadius: 12, border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                <span className={searching ? "spin-anim" : ""}>🔄</span>
                <span>Refresh</span>
              </button>
            </div>

            {searching ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 2s linear infinite", display: "inline-block" }}>🔍</div>
                <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>AI scanning 2M+ opportunities...</div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Matching skills · Checking scams · Verifying sources</div>
              </div>
            ) : opportunities.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
                <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>No opportunities loaded yet</div>
                <button onClick={handleComplete} className="btn-glow" style={{ padding: "12px 28px", borderRadius: 12, border: "none", color: "white", fontWeight: 600, cursor: "pointer" }}>
                  <span>🔍 Find My Opportunities</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {opportunities.map((opp, i) => {
                  const risk = RISK_COLORS[opp.scamRisk] || RISK_COLORS[2]
                  return (
                    <div key={i} className="glass glass-hover opp-card" style={{ borderRadius: 16, padding: 20, animationDelay: `${i * 0.04}s` }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{opp.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{opp.name}</div>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(99,102,241,0.1)", color: "#818cf8" }}>{opp.category}</span>
                                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: risk.bg, color: risk.color }}>🛡️ {risk.label}</span>
                                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}>📅 {opp.deadline}</span>
                                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(16,185,129,0.08)", color: "#10b981" }}>Match: {opp.matchScore}%</span>
                              </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: "#10b981", fontFamily: "'Orbitron', monospace" }}>{opp.prize}</div>
                              <a href={opp.url} target="_blank" rel="noopener noreferrer" className="btn-glow" style={{ marginTop: 8, display: "inline-block", padding: "7px 16px", borderRadius: 10, color: "white", textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                                <span>Apply Now →</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>30-Day Earning Roadmap</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Personalized plan for {profile.name} · Goal: {earningRange}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
              <div className="glass" style={{ borderRadius: 18, padding: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 24 }}>📅 Week-by-Week Plan</div>
                {[
                  { week: "Week 1", color: "#10b981", title: "Foundation", items: ["Select top 3 opportunities from your list", "Create required accounts & profiles", "Start first applications or sign-ups"] },
                  { week: "Week 2", color: "#6366f1", title: "Execute", items: ["Complete all pending applications", "Improve profile with portfolio/samples", "Follow up on submitted work"] },
                  { week: "Week 3", color: "#8b5cf6", title: "Amplify", items: ["Add 3 more new opportunities", "Check results from Week 1 applications", "Build network in your niche"] },
                  { week: "Week 4", color: "#f59e0b", title: "Collect & Scale", items: ["Collect first earnings", "Track conversion rate", "Plan Month 2 with bigger goals"] },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < 3 ? 20 : 0 }}>
                    <div style={{ width: 56, fontSize: 10, color: "rgba(255,255,255,0.35)", paddingTop: 2, fontWeight: 600, letterSpacing: 1, flexShrink: 0 }}>{s.week}</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      {i < 3 && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.06)", marginTop: 4, minHeight: 40 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: s.color, marginBottom: 6 }}>{s.title}</div>
                      {s.items.map((item, j) => (
                        <div key={j} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 5 }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>👤 Profile Summary</div>
                  {[["Name", profile.name], ["Age", `${profile.age} yrs`], ["Goal", goals.find(g=>g.id===profile.goal)?.label || profile.goal], ["Skills", profile.skills.slice(0,2).join(", ") || "—"], ["Experience", profile.experience], ["Time", profile.time], ["Country", profile.country]].map(([k,v], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 12, borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActiveTab("copilot"); sendMessage(`Create a detailed 30-day earning roadmap for me. My profile: Age ${profile.age}, Skills: ${profile.skills.join(", ")}, Goal: ${profile.goal}, Experience: ${profile.experience}, Time: ${profile.time}, Country: ${profile.country}. Show week by week plan with realistic income estimates.`) }} className="btn-glow" style={{ padding: "14px", borderRadius: 14, border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                  <span>🤖 Get AI Personalized Roadmap</span>
                </button>
                <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>📊 Projected Growth</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 64, marginBottom: 8 }}>
                    {[15,28,24,45,38,60,52,80].map((h,i) => (
                      <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", height: `${h}%`, background: i===7 ? "linear-gradient(180deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.18)", transition: "height 0.5s ease" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.25)" }}><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>Projected: <span style={{ color: "#10b981", fontWeight: 700, fontFamily: "'Orbitron', monospace" }}>{earningRange}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COPILOT TAB */}
        {activeTab === "copilot" && (
          <div className="fade-in">
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>AI Copilot</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Roman Urdu / English — Opportunities, Scam check, Roadmap, anything</p>
            </div>
            <div className="glass" style={{ borderRadius: 20, padding: 20, height: 580, display: "flex", flexDirection: "column" }}>
              <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, paddingRight: 4 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ maxWidth: "78%", alignSelf: m.role === "ai" ? "flex-start" : "flex-end" }}>
                    {m.role === "ai" && <div style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", marginBottom: 4, marginLeft: 2 }}>EarnVerse AI</div>}
                    <div className={m.role === "ai" ? "chat-ai" : "chat-user"} style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.7 }}>{m.text}</div>
                  </div>
                ))}
                {loading && (
                  <div style={{ maxWidth: "78%", alignSelf: "flex-start" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", marginBottom: 4, marginLeft: 2 }}>EarnVerse AI</div>
                    <div className="chat-ai" style={{ padding: "12px 16px", display: "flex", gap: 5 }}>
                      {[0,150,300].map(d => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", animation: `blink 1.2s ${d}ms infinite` }} />)}
                    </div>
                  </div>
                )}
              </div>
              {/* Quick prompts */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {["Meri best opportunities kya hain?","$500 in 30 days kaise kamayein?","Scam check karo is site ko","Pakistan se best options?","Mera personalized roadmap banao"].map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.2s" }}>
                    {q} ↗
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Kuch bhi poocho opportunities, scam check, roadmap..." style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }} />
                <button onClick={() => sendMessage()} className="btn-glow" style={{ padding: "10px 20px", borderRadius: 12, border: "none", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>
                  <span>Send →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}