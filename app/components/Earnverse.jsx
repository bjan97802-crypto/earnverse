"use client"

import { useState, useEffect, useRef } from "react"

// ─── XSS SANITIZER ───────────────────────────────────────────
function sanitize(str) {
  if (!str) return ""
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/[^\w\s\u0600-\u06FF\u0750-\u077F.,!?'-]/g, "")
    .slice(0, 40)
}


// ─── GEMINI via Next.js API Route (/api/chat) ────────────────
async function callAI(userMessage, systemPrompt) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, system: systemPrompt }),
    })
    const data = await res.json()
    return data.reply || "Kuch masla hua, dobara try karo."
  } catch {
    return "Server se connection nahi hua. Please try again."
  }
}

// ─── REAL OPPORTUNITIES DATABASE (with exact links) ──────────
const DB = {
  Coding: [
    { name: "Devpost Hackathons", url: "https://devpost.com/hackathons", cat: "Hackathon", prize: "$500–$50,000", time: "Rolling", icon: "🏆", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Lablab.ai AI Hackathons", url: "https://lablab.ai/event", cat: "AI Hackathon", prize: "$1,000–$25,000", time: "Rolling", icon: "🤖", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "HackerEarth Challenges", url: "https://hackerearth.com/challenges", cat: "Coding", prize: "$200–$10,000", time: "Rolling", icon: "💻", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Kaggle Competitions", url: "https://kaggle.com/competitions", cat: "AI/ML", prize: "$1,000–$100,000", time: "Rolling", icon: "📊", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Google Summer of Code", url: "https://summerofcode.withgoogle.com/programs", cat: "Open Source", prize: "$1,500–$3,300", time: "Mar–Apr", icon: "☀️", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "HackerOne Bug Bounties", url: "https://hackerone.com/opportunities/all/search", cat: "Bug Bounty", prize: "$100–$250,000", time: "Rolling", icon: "🐛", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Immunefi Web3 Bounties", url: "https://immunefi.com/explore", cat: "Web3 Security", prize: "$1,000–$10,000,000", time: "Rolling", icon: "🔒", scam: 2, exp: ["Expert"] },
    { name: "ETHGlobal Hackathons", url: "https://ethglobal.com/events", cat: "Ethereum", prize: "$2,000–$30,000", time: "Rolling", icon: "Ξ", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "NASA Space Apps Challenge", url: "https://www.spaceappschallenge.org/2024", cat: "Science/Tech", prize: "$5,000–$50,000", time: "Oct", icon: "🚀", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "DoraHacks Bounties", url: "https://dorahacks.io/hackathon", cat: "Web3 Dev", prize: "$500–$50,000", time: "Rolling", icon: "⛓️", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "Replit Bounties", url: "https://replit.com/bounties", cat: "Dev Gigs", prize: "$100–$5,000", time: "Rolling", icon: "⚡", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Gitcoin Grants", url: "https://grants.gitcoin.co", cat: "Open Source Funding", prize: "$100–$50,000", time: "Quarterly", icon: "💰", scam: 2, exp: ["Intermediate","Expert"] },
  ],
  "Web3/Crypto": [
    { name: "Layer3 Web3 Quests", url: "https://layer3.xyz/quests", cat: "Web3 Quests", prize: "$10–$500/quest", time: "Rolling", icon: "🌐", scam: 3, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Galxe Campaigns", url: "https://app.galxe.com/quest", cat: "Web3 Campaigns", prize: "$5–$200/task", time: "Rolling", icon: "🌌", scam: 3, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Coinbase Learn & Earn", url: "https://coinbase.com/earn", cat: "Learn to Earn", prize: "$3–$50/lesson", time: "Rolling", icon: "🎓", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Zealy Community Tasks", url: "https://zealy.io/explore", cat: "Community", prize: "$20–$1,000", time: "Rolling", icon: "⚡", scam: 3, exp: ["Beginner","Intermediate"] },
    { name: "Binance Learn & Earn", url: "https://academy.binance.com/en/learn-and-earn", cat: "Learn to Earn", prize: "$5–$100", time: "Rolling", icon: "₿", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Code4rena Audit Contests", url: "https://code4rena.com/contests", cat: "Smart Contract Audit", prize: "$5,000–$500,000", time: "Rolling", icon: "🔍", scam: 1, exp: ["Expert"] },
  ],
  Trading: [
    { name: "FTMO Prop Challenge", url: "https://ftmo.com/en/trader-evaluation", cat: "Prop Trading", prize: "$10K–$200K account", time: "Rolling", icon: "📈", scam: 4, exp: ["Intermediate","Expert"] },
    { name: "Funded Next Challenge", url: "https://fundednext.com/challenge", cat: "Prop Trading", prize: "$5K–$300K account", time: "Rolling", icon: "💹", scam: 4, exp: ["Intermediate","Expert"] },
    { name: "The5ers Funding Program", url: "https://the5ers.com/funded-trader-program", cat: "Prop Trading", prize: "$6K–$4M account", time: "Rolling", icon: "🎯", scam: 4, exp: ["Intermediate","Expert"] },
    { name: "Binance Trading Competition", url: "https://binance.com/en/trade-competition", cat: "Crypto Trading", prize: "$100–$50,000", time: "Monthly", icon: "🏆", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "Bybit Trading League", url: "https://bybit.com/en/trading-competition", cat: "Crypto Trading", prize: "$500–$100,000", time: "Monthly", icon: "📊", scam: 2, exp: ["Intermediate","Expert"] },
  ],
  Writing: [
    { name: "Medium Partner Program", url: "https://medium.com/creator-program", cat: "Writing", prize: "$50–$5,000/month", time: "Rolling", icon: "✍️", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Substack Newsletter", url: "https://substack.com/home", cat: "Newsletter", prize: "$100–$10,000/month", time: "Rolling", icon: "📰", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "WriterAccess Platform", url: "https://writeraccess.com/writers", cat: "Content Writing", prize: "$15–$200/article", time: "Rolling", icon: "🖊️", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Contena Writing Jobs", url: "https://contena.co/freelance-writing-jobs", cat: "Freelance Writing", prize: "$50–$500/article", time: "Rolling", icon: "📝", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "Reedsy Writing Contests", url: "https://reedsy.com/discovery/contests", cat: "Fiction Writing", prize: "$50–$5,000", time: "Weekly", icon: "📚", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Smashing Magazine Write", url: "https://www.smashingmagazine.com/write-for-us", cat: "Tech Writing", prize: "$200–$350/article", time: "Rolling", icon: "💎", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "ProBlogger Job Board", url: "https://problogger.com/jobs", cat: "Blogging", prize: "$50–$1,000/post", time: "Rolling", icon: "🌟", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
  ],
  Design: [
    { name: "99designs Contests", url: "https://99designs.com/contests", cat: "Design Contest", prize: "$100–$1,500/contest", time: "Rolling", icon: "🎨", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Canva Creator Program", url: "https://www.canva.com/creators/apply", cat: "Design Assets", prize: "$5–$50/template", time: "Rolling", icon: "🖼️", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Envato Market", url: "https://market.envato.com/sell", cat: "Digital Assets", prize: "$10–$100/sale", time: "Rolling", icon: "💎", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "Shutterstock Contributor", url: "https://submit.shutterstock.com", cat: "Stock Images", prize: "$0.25–$120/image", time: "Rolling", icon: "📸", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Adobe Stock Contributor", url: "https://stock.adobe.com/contributor", cat: "Stock Assets", prize: "$0.33–$99/asset", time: "Rolling", icon: "🔷", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Hatchwise Logo Contests", url: "https://hatchwise.com/active-contests", cat: "Logo Design", prize: "$100–$500/contest", time: "Rolling", icon: "🏅", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
  ],
  "Social Media": [
    { name: "YouTube Partner Program", url: "https://youtube.com/account_monetization", cat: "Video Content", prize: "$1–$10/1000 views", time: "Rolling", icon: "▶️", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "TikTok Creator Fund", url: "https://www.tiktok.com/creators/creator-portal", cat: "Short Video", prize: "$0.02–$0.04/1000 views", time: "Rolling", icon: "🎵", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Twitch Affiliate Program", url: "https://www.twitch.tv/creatorcamp/en/paths/affiliate", cat: "Live Streaming", prize: "$100–$5,000/month", time: "Rolling", icon: "🎮", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Instagram Creator Marketplace", url: "https://business.instagram.com/creators", cat: "Brand Deals", prize: "$50–$5,000/post", time: "Rolling", icon: "📱", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "Substack Creator", url: "https://substack.com/home", cat: "Newsletter", prize: "$100–$10,000/month", time: "Rolling", icon: "📧", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
  ],
  Cybersecurity: [
    { name: "HackerOne Bug Bounties", url: "https://hackerone.com/opportunities/all/search", cat: "Bug Bounty", prize: "$100–$250,000", time: "Rolling", icon: "🐛", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Bugcrowd Programs", url: "https://bugcrowd.com/programs", cat: "Bug Bounty", prize: "$100–$100,000", time: "Rolling", icon: "🔐", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Immunefi Web3 Bounties", url: "https://immunefi.com/explore", cat: "Web3 Security", prize: "$1,000–$10,000,000", time: "Rolling", icon: "🛡️", scam: 1, exp: ["Expert"] },
    { name: "Intigriti Platform", url: "https://intigriti.com/programs", cat: "Bug Bounty", prize: "$50–$50,000", time: "Rolling", icon: "🔒", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Google Bug Hunters", url: "https://bughunters.google.com/about/rules/6625378258173952", cat: "Bug Bounty", prize: "$100–$150,000", time: "Rolling", icon: "🔎", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "TryHackMe CTF Events", url: "https://tryhackme.com/competitions", cat: "CTF Competitions", prize: "$100–$5,000", time: "Rolling", icon: "⚔️", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
  ],
  "Data Analysis": [
    { name: "Kaggle Competitions", url: "https://kaggle.com/competitions", cat: "Data Science", prize: "$1,000–$100,000", time: "Rolling", icon: "📊", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "DrivenData Competitions", url: "https://drivendata.org/competitions", cat: "Social Good Data", prize: "$500–$50,000", time: "Rolling", icon: "🌍", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Scale AI RLHF Tasks", url: "https://scale.com/jobs", cat: "AI Data Work", prize: "$10–$40/hour", time: "Rolling", icon: "🧬", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Appen Data Tasks", url: "https://jobs.appen.com/open-positions", cat: "Data Annotation", prize: "$8–$20/hour", time: "Rolling", icon: "🏷️", scam: 2, exp: ["Beginner","Intermediate"] },
    { name: "Outlier AI Expert Tasks", url: "https://outlier.ai/for-contributors", cat: "AI Expert Work", prize: "$15–$50/hour", time: "Rolling", icon: "💡", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "Numerai Tournament", url: "https://numer.ai/tournament", cat: "Data Science", prize: "$500–$10,000/month", time: "Weekly", icon: "🎯", scam: 2, exp: ["Expert"] },
  ],
  Gaming: [
    { name: "ESL Gaming Tournaments", url: "https://esl.com/en/tournaments", cat: "Esports", prize: "$100–$500,000", time: "Rolling", icon: "🏆", scam: 2, exp: ["Intermediate","Expert"] },
    { name: "FACEIT Competitions", url: "https://faceit.com/en/csgo/tournaments", cat: "Esports", prize: "$50–$10,000", time: "Rolling", icon: "🎮", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Battlefy Tournaments", url: "https://battlefy.com/tournaments", cat: "Esports", prize: "$50–$10,000", time: "Rolling", icon: "⚔️", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Sorare Fantasy Sports", url: "https://sorare.com/en/cards", cat: "Fantasy/NFT", prize: "$50–$5,000/season", time: "Weekly", icon: "⚽", scam: 3, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Mistplay Rewards", url: "https://www.mistplay.com", cat: "Play to Earn", prize: "$5–$50/month", time: "Rolling", icon: "📱", scam: 2, exp: ["Beginner"] },
  ],
  Teaching: [
    { name: "Udemy Course Creation", url: "https://teach.udemy.com", cat: "Online Teaching", prize: "$100–$10,000/month", time: "Rolling", icon: "📚", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Preply Online Tutoring", url: "https://preply.com/en/become-a-tutor", cat: "Tutoring", prize: "$15–$80/hour", time: "Rolling", icon: "👨‍🏫", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "iTalki Language Teaching", url: "https://teach.italki.com", cat: "Language Tutoring", prize: "$10–$50/hour", time: "Rolling", icon: "🗣️", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "MentorCruise Mentoring", url: "https://mentorcruise.com/become-mentor", cat: "Mentorship", prize: "$50–$300/month", time: "Rolling", icon: "🧠", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Cambly English Teaching", url: "https://www.cambly.com/en/tutors", cat: "English Tutoring", prize: "$10.20–$12/hour", time: "Rolling", icon: "🌐", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Skillshare Teaching", url: "https://www.skillshare.com/teach", cat: "Creative Teaching", prize: "$100–$3,000/month", time: "Rolling", icon: "🎓", scam: 1, exp: ["Intermediate","Expert"] },
  ],
  Marketing: [
    { name: "Amazon Associates", url: "https://affiliate-program.amazon.com", cat: "Affiliate Marketing", prize: "1–10% commission", time: "Rolling", icon: "🛒", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Impact.com Affiliates", url: "https://impact.com/affiliate-network", cat: "Affiliate Marketing", prize: "$5–$500/sale", time: "Rolling", icon: "📈", scam: 2, exp: ["Beginner","Intermediate","Expert"] },
    { name: "HubSpot Affiliate Program", url: "https://www.hubspot.com/partners/affiliates", cat: "SaaS Affiliate", prize: "$250–$1,000/signup", time: "Rolling", icon: "🔗", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "Fiverr Affiliate Program", url: "https://affiliates.fiverr.com", cat: "Marketplace Affiliate", prize: "$15–$150/referral", time: "Rolling", icon: "⭐", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "ClickBank Marketplace", url: "https://accounts.clickbank.com/marketplace.htm", cat: "Digital Products", prize: "30–75% commission", time: "Rolling", icon: "💰", scam: 3, exp: ["Intermediate","Expert"] },
  ],
  "No Skill Yet": [
    { name: "Appen Data Annotation", url: "https://jobs.appen.com/open-positions", cat: "Data Annotation", prize: "$8–$15/hour", time: "Rolling", icon: "🏷️", scam: 2, exp: ["Beginner"] },
    { name: "Remotasks AI Training", url: "https://remotasks.com/en/tasks", cat: "AI Tasks", prize: "$5–$20/hour", time: "Rolling", icon: "🤖", scam: 2, exp: ["Beginner"] },
    { name: "Swagbucks Surveys", url: "https://www.swagbucks.com/g/earn", cat: "Surveys", prize: "$1–$50/month", time: "Rolling", icon: "📋", scam: 2, exp: ["Beginner"] },
    { name: "Prolific Academic Research", url: "https://www.prolific.com/participants", cat: "Research Surveys", prize: "$6–$20/hour", time: "Rolling", icon: "🎓", scam: 1, exp: ["Beginner"] },
    { name: "UserTesting Reviews", url: "https://www.usertesting.com/be-a-user-tester", cat: "App Testing", prize: "$10/test (20 min)", time: "Rolling", icon: "🔍", scam: 1, exp: ["Beginner"] },
    { name: "Fiverr Starter Gigs", url: "https://www.fiverr.com/start_selling", cat: "Micro Services", prize: "$5–$100/gig", time: "Rolling", icon: "⭐", scam: 2, exp: ["Beginner"] },
    { name: "HEC Pakistan Scholarships", url: "https://hec.gov.pk/english/scholarships/Pages/default.aspx", cat: "Scholarship (PK)", prize: "Full funding", time: "Rolling", icon: "🏫", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Bold.org Scholarships", url: "https://bold.org/scholarships", cat: "Scholarships", prize: "$500–$25,000", time: "Rolling", icon: "📖", scam: 2, exp: ["Beginner","Intermediate"] },
  ],
  Photography: [
    { name: "Shutterstock Contributor", url: "https://submit.shutterstock.com", cat: "Stock Photos", prize: "$0.25–$120/image", time: "Rolling", icon: "📸", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Adobe Stock Photos", url: "https://stock.adobe.com/contributor", cat: "Stock Photos", prize: "$0.33–$99/image", time: "Rolling", icon: "🔷", scam: 1, exp: ["Beginner","Intermediate","Expert"] },
    { name: "Getty Images Contributor", url: "https://contributors.gettyimages.com", cat: "Premium Stock", prize: "$1–$500/image", time: "Rolling", icon: "🌟", scam: 1, exp: ["Intermediate","Expert"] },
    { name: "500px Licensing", url: "https://500px.com/licensing", cat: "Photo Licensing", prize: "$0.99–$500/photo", time: "Rolling", icon: "🏅", scam: 2, exp: ["Intermediate","Expert"] },
  ],
}

// ─── AGE BASED FILTER ─────────────────────────────────────────
function getAgeCategories(age) {
  if (age <= 18) return ["No Skill Yet", "Coding", "Gaming", "Writing", "Design"]
  if (age <= 25) return ["Coding", "Web3/Crypto", "Gaming", "Writing", "Design", "Social Media", "Data Analysis", "Cybersecurity", "Teaching", "Marketing", "No Skill Yet"]
  if (age <= 40) return ["Coding", "Web3/Crypto", "Trading", "Writing", "Design", "Social Media", "Cybersecurity", "Data Analysis", "Teaching", "Marketing"]
  return ["Teaching", "Trading", "Writing", "Design", "Marketing", "Data Analysis"]
}

// ─── MATCH OPPORTUNITIES ──────────────────────────────────────
function matchOpportunities(profile) {
  const { age, skills, experience } = profile
  const ageCats = getAgeCategories(age)
  const selectedSkills = skills.length > 0 ? skills : ["No Skill Yet"]

  const relevantCats = [...new Set([...selectedSkills, ...ageCats.filter(c => selectedSkills.includes(c))])]
  const finalCats = selectedSkills.length > 0 ? selectedSkills : ageCats

  const results = []
  for (const cat of finalCats) {
    const opps = DB[cat] || []
    for (const opp of opps) {
      if (!results.find(r => r.name === opp.name)) {
        const expMatch = opp.exp.includes(experience || "Beginner") ? 20 : 0
        const score = 60 + expMatch + Math.floor(Math.random() * 18)
        results.push({ ...opp, matchScore: score })
      }
    }
  }
  return results.sort((a, b) => b.matchScore - a.matchScore)
}

// ─── EARNING CALC from actual matched opps ───────────────────
function calcEarningRange(opportunities) {
  if (!opportunities || opportunities.length === 0) return "$0"
  let minTotal = 0, maxTotal = 0
  const top5 = opportunities.slice(0, 5)
  for (const opp of top5) {
    const p = opp.prize || ""
    const nums = p.match(/\$?([\d,]+)/g)
    if (nums && nums.length >= 2) {
      const lo = parseInt(nums[0].replace(/[$,]/g, "")) || 0
      const hi = parseInt(nums[1].replace(/[$,]/g, "")) || lo
      minTotal += lo
      maxTotal += Math.min(hi, lo * 3)
    } else if (nums && nums.length === 1) {
      const n = parseInt(nums[0].replace(/[$,]/g, "")) || 0
      minTotal += n
      maxTotal += n * 2
    }
  }
  if (minTotal === 0) return "$50–$500/mo"
  return `$${minTotal.toLocaleString()}–$${maxTotal.toLocaleString()}/mo`
}

// ─── SCAM DETECTION ───────────────────────────────────────────
function detectScam(opportunities) {
  return opportunities.filter(o => o.scam >= 4).length
}

// ─── RISK COLORS ─────────────────────────────────────────────
const RISK = {
  1: { bg: "rgba(16,185,129,0.12)", color: "#10b981", label: "Very Safe" },
  2: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6", label: "Safe" },
  3: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Use Caution" },
  4: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "High Risk" },
  5: { bg: "rgba(220,38,38,0.15)", color: "#dc2626", label: "Scam Risk" },
}

const SKILLS_LIST = [
  { icon: "💻", name: "Coding" }, { icon: "📈", name: "Trading" }, { icon: "✍️", name: "Writing" },
  { icon: "🎨", name: "Design" }, { icon: "📱", name: "Social Media" }, { icon: "🔒", name: "Cybersecurity" },
  { icon: "📊", name: "Data Analysis" }, { icon: "🎮", name: "Gaming" }, { icon: "🌐", name: "Web3/Crypto" },
  { icon: "📢", name: "Marketing" }, { icon: "🗣️", name: "Teaching" }, { icon: "📸", name: "Photography" },
  { icon: "🎵", name: "Music" }, { icon: "🎬", name: "Video Editing" }, { icon: "🔧", name: "No Skill Yet" },
]

const GOALS = [
  { id: "fee", icon: "🎓", label: "Cover Education Fees", desc: "Tuition & study costs" },
  { id: "parttime", icon: "⏰", label: "Part-Time Income", desc: "Earn consistently on the side" },
  { id: "extra", icon: "💰", label: "Extra Money", desc: "Additional income stream" },
  { id: "fulltime", icon: "🚀", label: "Full-Time Online", desc: "Go completely remote" },
  { id: "business", icon: "🏢", label: "Fund My Business", desc: "Startup funding & grants" },
  { id: "retirement", icon: "🏡", label: "Retirement Income", desc: "Passive income plan" },
]

// ─── CSS ──────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  .ev { font-family:'Space Grotesk',sans-serif; background:#02020a; color:#e8e6f0; min-height:100vh; overflow-x:hidden; }
  .logo-font { font-family:'Orbitron',monospace; font-weight:900; }
  .logo-span { background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .grid-bg { position:fixed; inset:0; pointer-events:none; background-image:linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px); background-size:50px 50px; z-index:0; }
  .orb1 { position:fixed; top:-200px; left:-200px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%); pointer-events:none; z-index:0; animation:orbPulse 8s ease-in-out infinite; }
  .orb2 { position:fixed; bottom:-300px; right:-200px; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle,rgba(6,182,212,.08) 0%,transparent 70%); pointer-events:none; z-index:0; animation:orbPulse 12s ease-in-out infinite reverse; }
  @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.1);opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes shimmer { 0%{background-position:-500px 0} 100%{background-position:500px 0} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
  .slide-up { animation:slideUp .5s ease forwards; }
  .fade-in { animation:fadeIn .4s ease forwards; }
  .spin-a { animation:spin 1s linear infinite; }
  .shimmer-text { background:linear-gradient(90deg,#fff 0%,#6366f1 30%,#8b5cf6 50%,#06b6d4 70%,#fff 100%); background-size:500px auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 4s linear infinite; }
  .glass { background:rgba(255,255,255,.02); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.06); }
  .card-h { transition:all .3s cubic-bezier(.4,0,.2,1); }
  .card-h:hover { transform:translateY(-3px); border-color:rgba(99,102,241,.35) !important; background:rgba(99,102,241,.04) !important; }
  .btn-glow { background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none; color:white; cursor:pointer; position:relative; overflow:hidden; transition:all .3s; }
  .btn-glow::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#8b5cf6,#06b6d4); opacity:0; transition:opacity .3s; }
  .btn-glow:hover::before { opacity:1; }
  .btn-glow:hover { transform:translateY(-2px); box-shadow:0 0 30px rgba(99,102,241,.5); }
  .btn-glow span { position:relative; z-index:1; }
  .opt-sel { border-color:#6366f1 !important; background:rgba(99,102,241,.1) !important; }
  .sk-sel { border-color:#6366f1 !important; background:rgba(99,102,241,.12) !important; color:#818cf8 !important; }
  .tab-a { background:rgba(99,102,241,.15) !important; color:#818cf8 !important; border-color:rgba(99,102,241,.4) !important; }
  .scan-line { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent); animation:scanLine 3s linear infinite; pointer-events:none; }
  ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:rgba(99,102,241,.3); border-radius:2px; }
  input[type=range] { accent-color:#6366f1; width:100%; }
  .ev-input { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:white; border-radius:12px; padding:10px 16px; width:100%; outline:none; font-family:'Space Grotesk',sans-serif; font-size:14px; transition:border-color .2s; }
  .ev-input:focus { border-color:#6366f1; }

  /* ── RESPONSIVE ── */
  @media (max-width:768px) {
    .hero-title { font-size:2rem !important; }
    .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
    .cats-grid { grid-template-columns:repeat(3,1fr) !important; }
    .how-grid { grid-template-columns:repeat(2,1fr) !important; }
    .kpi-grid { grid-template-columns:repeat(2,1fr) !important; }
    .quick-grid { grid-template-columns:1fr !important; }
    .roadmap-grid { grid-template-columns:1fr !important; }
    .tabs-row { overflow-x:auto; gap:4px !important; }
    .tabs-row button { font-size:11px !important; padding:6px 10px !important; white-space:nowrap; }
    .topbar { padding:10px 14px !important; }
    .dash-pad { padding:16px !important; }
    .opp-row { flex-direction:column !important; gap:10px !important; }
    .opp-right { text-align:left !important; }
    .chat-box { height:70vh !important; }
    .quick-prompts { display:none !important; }
    .nav-pad { padding:14px 16px !important; }
    .hero-pad { padding:40px 16px 40px !important; }
    .section-pad { padding:0 16px !important; max-width:100% !important; }
    .form-box { padding:20px !important; }
    .grid-3c { grid-template-columns:1fr 1fr !important; }
  }
  @media (max-width:480px) {
    .cats-grid { grid-template-columns:repeat(2,1fr) !important; }
    .how-grid { grid-template-columns:1fr !important; }
    .kpi-grid { grid-template-columns:repeat(2,1fr) !important; }
    .hero-title { font-size:1.7rem !important; }
    .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
    .grid-3c { grid-template-columns:1fr !important; }
  }
`

export default function EarnVerse() {
  const [step, setStep] = useState("landing")
  const [fStep, setFStep] = useState(1)
  const [profile, setProfile] = useState({ age: 22, goal: "", skills: [], experience: "", time: "", name: "" })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [opportunities, setOpportunities] = useState([])
  const [searching, setSearching] = useState(false)
  const [earningRange, setEarningRange] = useState("$0")
  const [scamsBlocked, setScamsBlocked] = useState(0)
  const [messages, setMessages] = useState([
    { role: "ai", text: "Assalam o Alaikum! Main aapka EarnVerse Intelligence hun — aapki profile analyze karke best real opportunities dhundta hun. Kya jaanna chahte ho?" }
  ])
  const [input, setInput] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isReturning, setIsReturning] = useState(false)
  const chatRef = useRef(null)

  // ── LOCALSTORAGE: remember user ──────────────────────────────
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("ev_profile")
      const savedOpps = localStorage.getItem("ev_opps")
      if (saved) {
        const p = JSON.parse(saved)
        setProfile(p)
        setIsReturning(true)
        if (savedOpps) {
          const opps = JSON.parse(savedOpps)
          setOpportunities(opps)
          setEarningRange(calcEarningRange(opps))
          setScamsBlocked(detectScam(opps))
        }
        setStep("dashboard")
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const saveProfile = (p) => {
    try { localStorage.setItem("ev_profile", JSON.stringify(p)) } catch {}
  }

  const toggleSkill = (s) => setProfile(p => ({
    ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s]
  }))

  const handleLaunch = async () => {
    const cleanProfile = { ...profile, name: sanitize(profile.name) }
    saveProfile(cleanProfile)
    setProfile(cleanProfile)
    setStep("dashboard")
    setSearching(true)
    await new Promise(r => setTimeout(r, 900))
    const opps = matchOpportunities(cleanProfile)
    setOpportunities(opps)
    setEarningRange(calcEarningRange(opps))
    setScamsBlocked(detectScam(opps))
    try { localStorage.setItem("ev_opps", JSON.stringify(opps)) } catch {}
    setSearching(false)
  }

  const handleRefresh = async () => {
    setSearching(true)
    await new Promise(r => setTimeout(r, 700))
    const opps = matchOpportunities(profile)
    setOpportunities(opps)
    setEarningRange(calcEarningRange(opps))
    setScamsBlocked(detectScam(opps))
    try { localStorage.setItem("ev_opps", JSON.stringify(opps)) } catch {}
    setSearching(false)
  }

  const handleLogout = () => {
    try { localStorage.removeItem("ev_profile"); localStorage.removeItem("ev_opps") } catch {}
    setProfile({ age: 22, goal: "", skills: [], experience: "", time: "", name: "" })
    setOpportunities([])
    setStep("landing")
    setFStep(1)
    setIsReturning(false)
  }

  const sendMessage = async (text) => {
    const msg = text || input
    if (!msg.trim()) return
    setInput("")
    const newMsgs = [...messages, { role: "user", text: sanitize(msg) }]
    setMessages(newMsgs)
    setAiLoading(true)
    const system = `You are EarnVerse Intelligence — a smart, friendly earning advisor for Pakistan and global users. 

User Profile:
Name: ${profile.name || "User"}, Age: ${profile.age}, Skills: ${profile.skills.join(", ") || "No skills selected yet"}, Experience Level: ${profile.experience || "Beginner"}, Daily Time Available: ${profile.time || "Unknown"}, Goal: ${profile.goal || "Earn money online"}

YOUR MAIN JOB:
- Help user earn money online — realistically, fast, step by step
- If user has NO opportunities or NO skills, be extra helpful. Suggest beginner-friendly paths they can start TODAY
- Give a clear 30-day action plan when asked — week by week, day by day if needed
- Be the user's personal income coach

RULES:
- Reply in SAME language as user (Roman Urdu ya English — jo bhi user likhay)
- Be warm, direct, encouraging — like a helpful older sibling
- For SCAM checks: analyze the URL/platform name, give clear ✅ Safe / ⚠️ Risky / 🚨 Scam verdict with reasons
- For opportunities: always give realistic earning range + time to first payment
- For roadmaps: give specific week-by-week plan matching user's skills and time
- If user has no skills: suggest top 3 beginner paths (data annotation, surveys, Fiverr micro-gigs, content creation)
- Always end with ONE clear next action step
- Never make up fake sites — only recommend real, verified platforms
- Pakistan-friendly: mention platforms that pay via JazzCash, EasyPaisa, Payoneer, or bank transfer when relevant`
    const reply = await callAI(msg, system)
    setMessages([...newMsgs, { role: "ai", text: reply }])
    setAiLoading(false)
  }

  if (!mounted) return null

  // ──────────────── LANDING ───────────────────────────────────
  if (step === "landing") return (
    <div className="ev">
      <style>{CSS}</style>
      <div className="grid-bg" /><div className="orb1" /><div className="orb2" />

      <nav style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between" }} className="nav-pad" style={{ padding:"18px 40px", borderBottom:"1px solid rgba(255,255,255,.04)", position:"relative", zIndex:10 }}>
        <div className="logo-font" style={{ fontSize:20 }}>EARN<span className="logo-span">VERSE</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:20, background:"rgba(16,185,129,.08)", border:"1px solid rgba(16,185,129,.2)", fontSize:12, color:"#10b981" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#10b981", animation:"blink 2s infinite" }} /> Live · Real Opportunities
          </div>
          <button className="btn-glow" onClick={() => setStep("onboarding")} style={{ padding:"10px 22px", borderRadius:12, fontWeight:600, fontSize:14 }}>
            <span>Start Free →</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero-pad" style={{ position:"relative", zIndex:5, textAlign:"center", padding:"70px 20px 50px" }} >
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:20, background:"rgba(99,102,241,.08)", border:"1px solid rgba(99,102,241,.2)", fontSize:12, color:"#818cf8", marginBottom:28 }}>
          ⚡ AI-Powered · Skill-Matched · Scam-Protected
        </div>
        <h1 className="shimmer-text hero-title logo-font" style={{ fontSize:"clamp(1.8rem,6vw,5rem)", lineHeight:1.1, marginBottom:12 }}>
          Your Skills.<br/>Real Money.
        </h1>
        <p style={{ fontSize:"clamp(14px,2vw,18px)", color:"rgba(255,255,255,.45)", maxWidth:540, margin:"0 auto 16px", lineHeight:1.7 }}>
          From coding to content — EarnVerse AI finds <strong style={{color:"#818cf8"}}>verified, skill-matched</strong> opportunities for ages 15–60. No guesswork, no scams.
        </p>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.25)", marginBottom:36 }}>
          Join 50,000+ earners already using EarnVerse
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-glow" onClick={() => setStep("onboarding")} style={{ padding:"13px 30px", borderRadius:14, fontWeight:700, fontSize:15 }}>
            <span>Find My Opportunities →</span>
          </button>
          {isReturning && (
            <button onClick={() => setStep("dashboard")} style={{ padding:"13px 22px", borderRadius:14, background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.3)", color:"#818cf8", cursor:"pointer", fontSize:14, fontWeight:600 }}>
              Welcome back, {profile.name} →
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="section-pad" style={{ maxWidth:860, margin:"0 auto 50px", padding:"0 20px" }}>
        <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {[["2M+","Real Opportunities"],["50k+","Active Users"],["$2.4B+","Total Prize Pool"],["98%","Scam Detection"]].map(([v,l],i) => (
            <div key={i} className="glass card-h" style={{ borderRadius:16, padding:"20px 14px", textAlign:"center" }}>
              <div className="logo-font" style={{ fontSize:24, background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:4 }}>{v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="section-pad" style={{ maxWidth:1000, margin:"0 auto 50px", padding:"0 20px" }}>
        <h2 className="logo-font" style={{ textAlign:"center", fontSize:"clamp(1.2rem,3vw,2rem)", marginBottom:8 }}>18+ Opportunity Categories</h2>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,.3)", marginBottom:28, fontSize:13 }}>Hackathons · Bug Bounties · Crypto · Scholarships · Remote Jobs · Trading & more</p>
        <div className="cats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
          {[["🏆","Hackathons","#6366f1"],["💰","Crypto/Web3","#8b5cf6"],["📈","Trading","#f59e0b"],["🎓","Scholarships","#10b981"],["💼","Remote Jobs","#6366f1"],["🐛","Bug Bounties","#ef4444"],["🚀","Startups","#8b5cf6"],["🌐","Ambassador","#10b981"],["📝","Content","#f59e0b"],["🎮","Esports","#ef4444"],["🤖","AI Tasks","#6366f1"],["📚","Teaching","#10b981"],["🎨","Design","#8b5cf6"],["🔬","Research","#6366f1"],["🏛️","Govt Grants","#f59e0b"],["🤝","Referral","#10b981"],["📸","Photography","#ef4444"],["🧠","Mentoring","#8b5cf6"]].map(([ic,nm,cl],i) => (
            <div key={i} className="glass card-h" style={{ borderRadius:12, padding:"12px 8px", textAlign:"center", cursor:"pointer" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{ic}</div>
              <div style={{ fontSize:10, fontWeight:600, color:"white", marginBottom:2 }}>{nm}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth:640, margin:"0 auto 60px", padding:"0 20px", textAlign:"center" }}>
        <div className="glass" style={{ borderRadius:24, padding:"40px 30px", background:"linear-gradient(135deg,rgba(99,102,241,.08),rgba(6,182,212,.05))" }}>
          <h2 className="logo-font" style={{ fontSize:"clamp(1.2rem,3vw,1.8rem)", marginBottom:10 }}>Ready to Start Earning?</h2>
          <p style={{ color:"rgba(255,255,255,.4)", marginBottom:24, fontSize:14 }}>Takes 2 minutes · 100% free · No credit card</p>
          <button className="btn-glow" onClick={() => setStep("onboarding")} style={{ padding:"13px 32px", borderRadius:14, fontWeight:700, fontSize:15 }}>
            <span>Get Started Free →</span>
          </button>
        </div>
      </div>
    </div>
  )

  // ──────────────── ONBOARDING ─────────────────────────────────
  if (step === "onboarding") return (
    <div className="ev" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:16 }}>
      <style>{CSS}</style>
      <div className="orb1" /><div className="orb2" /><div className="grid-bg" />

      <div style={{ width:"100%", maxWidth:480, position:"relative", zIndex:5 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div className="logo-font" style={{ fontSize:18, marginBottom:4 }}>EARN<span className="logo-span">VERSE</span></div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.3)" }}>Setup takes 2 minutes</div>
        </div>

        {/* Progress */}
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex:1, height:3, borderRadius:2, background:"rgba(255,255,255,.06)", overflow:"hidden" }}>
              <div style={{ height:"100%", width:s<=fStep?"100%":"0%", background:"linear-gradient(90deg,#6366f1,#8b5cf6)", transition:"width .5s ease", borderRadius:2 }} />
            </div>
          ))}
        </div>

        <div className="slide-up glass form-box" style={{ borderRadius:22, padding:28 }}>
          {/* STEP 1 */}
          {fStep === 1 && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"#818cf8", letterSpacing:3, marginBottom:6 }}>STEP 1 OF 3</div>
              <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Let's get started!</h2>
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginBottom:20 }}>Tell us your name and age</p>
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:8, display:"block" }}>Your Name</label>
                <input className="ev-input" type="text" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value.replace(/[<>{}[\]\\\/]/g, "").slice(0,30)}))} placeholder="Enter your name..." maxLength={30} />
                {profile.name && !/^[a-zA-Z\s\u0600-\u06FF]{2,}$/.test(profile.name) && (
                  <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>⚠️ Please enter a valid name</div>
                )}
              </div>
              <div style={{ marginBottom:22 }}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:12, display:"block" }}>Your Age</label>
                <div style={{ textAlign:"center", marginBottom:12 }}>
                  <div className="logo-font" style={{ fontSize:56, background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{profile.age}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginTop:2 }}>
                    {profile.age<=18?"🎓 High School/College":profile.age<=25?"💼 Young Professional":profile.age<=40?"🏢 Mid Career":"🏡 Senior"}
                  </div>
                </div>
                <input type="range" min={15} max={60} value={profile.age} onChange={e => setProfile(p => ({...p, age:parseInt(e.target.value)}))} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,.25)", marginTop:4 }}><span>15</span><span>60</span></div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:8, display:"block" }}>Your Goal</label>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {GOALS.map(g => (
                    <div key={g.id} onClick={() => setProfile(p => ({...p, goal:g.id}))} className={profile.goal===g.id?"opt-sel glass":"glass"} style={{ padding:"10px 14px", borderRadius:10, display:"flex", alignItems:"center", gap:12, cursor:"pointer", transition:"all .2s" }}>
                      <span style={{ fontSize:18 }}>{g.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{g.label}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{g.desc}</div>
                      </div>
                      {profile.goal===g.id && <span style={{ width:18, height:18, borderRadius:"50%", background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => {
                const validName = /^[a-zA-Z\s\u0600-\u06FF]{2,30}$/.test(profile.name)
                if (validName && profile.goal) setFStep(2)
              }} className="btn-glow" style={{ width:"100%", padding:"12px", borderRadius:12, fontWeight:600, fontSize:14, opacity:(profile.name && profile.goal)?1:.4 }}>
                <span>Continue →</span>
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {fStep === 2 && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"#818cf8", letterSpacing:3, marginBottom:6 }}>STEP 2 OF 3</div>
              <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Your Skills?</h2>
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginBottom:18 }}>Select all that apply — more = better matches</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:20 }}>
                {SKILLS_LIST.map(s => (
                  <button key={s.name} onClick={() => toggleSkill(s.name)} className={profile.skills.includes(s.name)?"sk-sel":""}
                    style={{ padding:"7px 13px", borderRadius:10, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.02)", color:profile.skills.includes(s.name)?"#818cf8":"rgba(255,255,255,.5)", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:5, transition:"all .15s" }}>
                    {s.icon} {s.name}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setFStep(1)} className="glass" style={{ flex:1, padding:"11px", borderRadius:11, border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.5)", cursor:"pointer", background:"none", fontSize:13 }}>← Back</button>
                <button onClick={() => setFStep(3)} className="btn-glow" style={{ flex:2, padding:"11px", borderRadius:11, fontWeight:600, fontSize:14 }}><span>Continue →</span></button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {fStep === 3 && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"#818cf8", letterSpacing:3, marginBottom:6 }}>STEP 3 OF 3</div>
              <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Final Details</h2>
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginBottom:18 }}>Almost there!</p>

              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:8, display:"block" }}>Experience Level</label>
                <div className="grid-3c" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {[["🌱","Beginner","Just starting"],["🔥","Intermediate","Some experience"],["⚡","Expert","Highly skilled"]].map(([ic,id,desc]) => (
                    <button key={id} onClick={() => setProfile(p => ({...p, experience:id}))} className={profile.experience===id?"opt-sel":""} style={{ padding:"12px 8px", borderRadius:10, border:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.02)", color:"white", cursor:"pointer", textAlign:"center", transition:"all .2s" }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                      <div style={{ fontSize:11, fontWeight:600 }}>{id}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,.35)" }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:22 }}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:8, display:"block" }}>Daily Time Available</label>
                <div className="grid-3c" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {[["⏰","1-2 hrs","Side hustle"],["💪","4-5 hrs","Part time"],["🚀","Full time","8+ hours"]].map(([ic,id,desc]) => (
                    <button key={id} onClick={() => setProfile(p => ({...p, time:id}))} className={profile.time===id?"opt-sel":""} style={{ padding:"12px 8px", borderRadius:10, border:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.02)", color:"white", cursor:"pointer", textAlign:"center", transition:"all .2s" }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                      <div style={{ fontSize:11, fontWeight:600 }}>{id}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,.35)" }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setFStep(2)} className="glass" style={{ flex:1, padding:"11px", borderRadius:11, border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.5)", cursor:"pointer", background:"none", fontSize:13 }}>← Back</button>
                <button onClick={handleLaunch} disabled={!profile.experience || !profile.time} className="btn-glow" style={{ flex:2, padding:"13px", borderRadius:11, fontWeight:700, fontSize:14, opacity:(profile.experience && profile.time)?1:.4 }}>
                  <span>🚀 Launch EarnVerse</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // ──────────────── DASHBOARD ──────────────────────────────────
  return (
    <div className="ev">
      <style>{CSS}</style>
      <div className="grid-bg" /><div className="orb1" /><div className="orb2" />

      {/* TOPBAR */}
      <div className="topbar" style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 24px", background:"rgba(2,2,10,.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div className="logo-font" style={{ fontSize:16 }}>EARN<span className="logo-span">VERSE</span></div>
          <div className="tabs-row" style={{ display:"flex", gap:3 }}>
            {[["dashboard","🏠","Home"],["opportunities","🔍","Opps"],["roadmap","🗺️","Roadmap"],["copilot","🧠","Intelligence"]].map(([id,ic,lb]) => (
              <button key={id} onClick={() => setActiveTab(id)} className={activeTab===id?"tab-a":""} style={{ padding:"7px 12px", borderRadius:9, border:`1px solid ${activeTab===id?"rgba(99,102,241,.3)":"transparent"}`, background:activeTab===id?"rgba(99,102,241,.1)":"none", color:activeTab===id?"#818cf8":"rgba(255,255,255,.35)", cursor:"pointer", fontSize:12, fontWeight:500, transition:"all .2s", whiteSpace:"nowrap" }}>
                {ic} {lb}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:16, background:"rgba(16,185,129,.08)", border:"1px solid rgba(16,185,129,.2)", fontSize:11, color:"#10b981" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#10b981", animation:"blink 1.5s infinite" }} />AI On
          </div>
          <div className="glass" style={{ padding:"4px 10px", borderRadius:9, fontSize:11, color:"rgba(255,255,255,.35)" }}>{profile.name} · {profile.age}y</div>
          <button onClick={handleLogout} style={{ padding:"4px 10px", borderRadius:9, background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", color:"#ef4444", cursor:"pointer", fontSize:11 }}>Logout</button>
        </div>
      </div>

      <div className="dash-pad" style={{ maxWidth:1200, margin:"0 auto", padding:"28px 24px", position:"relative", zIndex:5 }}>

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div className="fade-in">
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:"clamp(1.2rem,3vw,1.7rem)", fontWeight:700, marginBottom:4 }}>
                {isReturning ? `Welcome back, ${profile.name}! 👋` : `Welcome, ${profile.name}! 🚀`}
              </h1>
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:13 }}>
                {profile.skills.slice(0,3).join(" · ") || "No skills set"} · {profile.experience} · {profile.time}
              </p>
            </div>

            <div className="kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
              {[
                { l:"Matched Opportunities", v:searching?"...":String(opportunities.length||0), icon:"🎯", c:"#6366f1" },
                { l:"Earning Potential", v:searching?"...":earningRange, icon:"💸", c:"#10b981" },
                { l:"Scam Risk Items", v:String(scamsBlocked), icon:"🛡️", c:"#f59e0b" },
                { l:"Top Match Score", v:opportunities.length>0?`${opportunities[0]?.matchScore}%`:"—", icon:"🏆", c:"#8b5cf6" },
              ].map((k,i) => (
                <div key={i} className="glass card-h" style={{ borderRadius:16, padding:"16px", position:"relative", overflow:"hidden" }}>
                  <div className="scan-line" />
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ fontSize:20 }}>{k.icon}</span>
                    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:6, background:`${k.c}18`, color:k.c }}>Live</span>
                  </div>
                  <div className="logo-font" style={{ fontSize:"clamp(13px,2vw,18px)", color:k.c, marginBottom:4 }}>{k.v}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{k.l}</div>
                </div>
              ))}
            </div>

            {/* Earning bar */}
            <div className="glass" style={{ borderRadius:16, padding:20, marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>Your Earning Potential</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>Based on {opportunities.length} matched opportunities</div>
                </div>
                <div className="logo-font" style={{ fontSize:16, color:"#10b981" }}>{earningRange}</div>
              </div>
              <div style={{ height:5, background:"rgba(255,255,255,.06)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:profile.experience==="Expert"?"82%":profile.experience==="Intermediate"?"52%":"22%", background:"linear-gradient(90deg,#6366f1,#10b981)", borderRadius:3, transition:"width 1s ease" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,.22)", marginTop:5 }}>
                <span>Beginner</span><span>Intermediate</span><span>Expert</span>
              </div>
            </div>

            <div className="quick-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {[["🔍","Find Opportunities","AI-matched for your exact skills","opportunities","#6366f1"],["🗺️","30-Day Roadmap","First income in 30 days","roadmap","#8b5cf6"],["🧠","EarnVerse Intelligence","Scam check · Strategy · Advice","copilot","#10b981"]].map(([ic,t,d,tab,c],i) => (
                <button key={i} onClick={() => setActiveTab(tab)} className="glass card-h" style={{ borderRadius:16, padding:20, textAlign:"left", cursor:"pointer", border:`1px solid ${c}18`, width:"100%", background:"rgba(255,255,255,.01)" }}>
                  <div style={{ fontSize:26, marginBottom:12 }}>{ic}</div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{t}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:14 }}>{d}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:c }}>Open →</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── OPPORTUNITIES ── */}
        {activeTab === "opportunities" && (
          <div className="fade-in">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h1 style={{ fontSize:"clamp(1.1rem,2.5vw,1.5rem)", fontWeight:700, marginBottom:4 }}>Your Opportunities</h1>
                <p style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>Matched to: {profile.skills.join(", ") || "General"} · {profile.experience} · Age {profile.age}</p>
              </div>
              <button onClick={handleRefresh} className="btn-glow" style={{ padding:"9px 18px", borderRadius:11, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:7 }}>
                <span className={searching?"spin-a":""}>🔄</span><span>Refresh</span>
              </button>
            </div>

            {searching ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:36, marginBottom:14, display:"inline-block", animation:"spin 2s linear infinite" }}>🔍</div>
                <div style={{ color:"rgba(255,255,255,.45)" }}>Matching opportunities to your profile...</div>
              </div>
            ) : opportunities.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>🎯</div>
                <div style={{ color:"rgba(255,255,255,.4)", marginBottom:16 }}>Click Refresh to find your opportunities</div>
                <button onClick={handleRefresh} className="btn-glow" style={{ padding:"11px 24px", borderRadius:11, fontWeight:600 }}><span>Find Opportunities</span></button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {opportunities.map((opp, i) => {
                  const risk = RISK[opp.scam] || RISK[2]
                  return (
                    <div key={i} className="glass card-h" style={{ borderRadius:14, padding:"16px 18px", animation:`slideUp .3s ease ${i*.04}s both` }}>
                      <div className="opp-row" style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:"rgba(99,102,241,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{opp.icon}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>{opp.name}</div>
                              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:4 }}>
                                <span style={{ fontSize:10, padding:"3px 8px", borderRadius:6, background:"rgba(99,102,241,.1)", color:"#818cf8" }}>{opp.cat}</span>
                                <span style={{ fontSize:10, padding:"3px 8px", borderRadius:6, background:risk.bg, color:risk.color }}>🛡️ {risk.label}</span>
                                <span style={{ fontSize:10, padding:"3px 8px", borderRadius:6, background:"rgba(255,255,255,.04)", color:"rgba(255,255,255,.4)" }}>📅 {opp.time}</span>
                                <span style={{ fontSize:10, padding:"3px 8px", borderRadius:6, background:"rgba(16,185,129,.08)", color:"#10b981" }}>Match {opp.matchScore}%</span>
                              </div>
                            </div>
                            <div className="opp-right" style={{ textAlign:"right", flexShrink:0 }}>
                              <div className="logo-font" style={{ fontSize:14, color:"#10b981", marginBottom:6 }}>{opp.prize}</div>
                              <a href={opp.url} target="_blank" rel="noopener noreferrer" className="btn-glow" style={{ display:"inline-block", padding:"6px 14px", borderRadius:9, color:"white", textDecoration:"none", fontSize:12, fontWeight:600 }}>
                                <span>Apply →</span>
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

        {/* ── ROADMAP ── */}
        {activeTab === "roadmap" && (
          <div className="fade-in">
            <div style={{ marginBottom:20 }}>
              <h1 style={{ fontSize:"clamp(1.1rem,2.5vw,1.5rem)", fontWeight:700, marginBottom:4 }}>30-Day First Income Roadmap</h1>
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>Goal: First money earned in 30 days · Skills: {profile.skills.join(", ") || "General"}</p>
            </div>
            <div className="roadmap-grid" style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:16 }}>
              <div className="glass" style={{ borderRadius:16, padding:22 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:20 }}>📅 Week-by-Week Plan</div>
                {[
                  { w:"Week 1", c:"#10b981", t:"Setup & Apply",
                    items:[
                      `Create profile on: ${opportunities.slice(0,2).map(o=>o.name).join(", ") || "Upwork, Fiverr"}`,
                      `Apply to top 3 matched opportunities`,
                      `Complete any required tests or assessments`,
                    ]
                  },
                  { w:"Week 2", c:"#6366f1", t:"Execute & Submit",
                    items:[
                      `Submit first work samples or applications`,
                      `Improve your profile with portfolio`,
                      `Apply to 3 more opportunities`,
                    ]
                  },
                  { w:"Week 3", c:"#8b5cf6", t:"Follow Up & Expand",
                    items:[
                      `Follow up on Week 1 applications`,
                      `Join relevant communities for networking`,
                      `Start next batch of opportunities`,
                    ]
                  },
                  { w:"Week 4", c:"#f59e0b", t:"Collect First Income",
                    items:[
                      `Collect first earnings (even $10 is a win!)`,
                      `Review what worked best`,
                      `Scale up the best opportunity`,
                    ]
                  },
                ].map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:14, marginBottom:i<3?18:0 }}>
                    <div style={{ width:52, fontSize:10, color:"rgba(255,255,255,.3)", paddingTop:2, fontWeight:600, letterSpacing:1, flexShrink:0 }}>{s.w}</div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:10 }}>
                      <div style={{ width:9, height:9, borderRadius:"50%", background:s.c, flexShrink:0 }} />
                      {i<3 && <div style={{ width:1, flex:1, background:"rgba(255,255,255,.05)", marginTop:4, minHeight:36 }} />}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:s.c, marginBottom:5 }}>{s.t}</div>
                      {s.items.map((item,j) => (
                        <div key={j} style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginBottom:3, display:"flex", alignItems:"flex-start", gap:5 }}>
                          <span style={{ width:3, height:3, borderRadius:"50%", background:"rgba(255,255,255,.2)", flexShrink:0, marginTop:5 }} />{item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div className="glass" style={{ borderRadius:14, padding:18 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>👤 Your Profile</div>
                  {[["Name",profile.name],["Age",`${profile.age} yrs`],["Skills",profile.skills.slice(0,2).join(", ")||"—"],["Level",profile.experience],["Time",profile.time]].map(([k,v],i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", fontSize:12, borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <span style={{ color:"rgba(255,255,255,.35)" }}>{k}</span>
                      <span style={{ fontWeight:500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActiveTab("copilot"); sendMessage(`Create detailed 30-day earning roadmap. My profile: Age ${profile.age}, Skills: ${profile.skills.join(", ")}, Level: ${profile.experience}, Time: ${profile.time}. Goal is first real income in 30 days. Be specific with daily/weekly actions.`) }} className="btn-glow" style={{ padding:"13px", borderRadius:12, fontWeight:600, fontSize:13 }}>
                  <span>🧠 Get AI Custom Roadmap</span>
                </button>
                <div className="glass" style={{ borderRadius:14, padding:18 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>🎯 Target Earnings</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginBottom:8 }}>Based on your {opportunities.length} matched opportunities:</div>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:50, marginBottom:6 }}>
                    {[15,25,40,60,75,90,80,100].map((h,i) => (
                      <div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0", height:`${h}%`, background:i===7?"linear-gradient(180deg,#6366f1,#8b5cf6)":"rgba(99,102,241,.18)" }} />
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"rgba(255,255,255,.2)" }}><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:8 }}>Realistic target: <span className="logo-font" style={{ color:"#10b981", fontSize:13 }}>{earningRange}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AI COPILOT ── */}
        {activeTab === "copilot" && (
          <div className="fade-in">
            <div style={{ marginBottom:16 }}>
              <h1 style={{ fontSize:"clamp(1.1rem,2.5vw,1.5rem)", fontWeight:700, marginBottom:4 }}>EarnVerse Intelligence</h1>
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:12 }}>Scam check · Opportunity advice · Roadmap · Roman Urdu & English</p>
            </div>
            <div className="glass chat-box" style={{ borderRadius:18, padding:18, height:560, display:"flex", flexDirection:"column" }}>
              <div ref={chatRef} style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, marginBottom:14, paddingRight:4 }}>
                {messages.map((m,i) => (
                  <div key={i} style={{ maxWidth:"80%", alignSelf:m.role==="ai"?"flex-start":"flex-end" }}>
                    {m.role==="ai" && <div style={{ fontSize:10, fontWeight:700, color:"#818cf8", marginBottom:4, marginLeft:2 }}>EarnVerse Intelligence</div>}
                    <div style={{ padding:"11px 15px", fontSize:13, lineHeight:1.7, borderRadius:m.role==="ai"?"0 16px 16px 16px":"16px 0 16px 16px", background:m.role==="ai"?"rgba(255,255,255,.04)":"rgba(99,102,241,.15)", border:m.role==="ai"?"1px solid rgba(255,255,255,.06)":"1px solid rgba(99,102,241,.25)", color:m.role==="ai"?"#e8e6f0":"#c7d2fe", whiteSpace:"pre-wrap" }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ maxWidth:"80%", alignSelf:"flex-start" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"#818cf8", marginBottom:4, marginLeft:2 }}>EarnVerse Intelligence</div>
                    <div style={{ padding:"11px 15px", borderRadius:"0 16px 16px 16px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", display:"flex", gap:5 }}>
                      {[0,150,300].map(d => <span key={d} style={{ width:7, height:7, borderRadius:"50%", background:"#818cf8", display:"inline-block", animation:`blink 1.2s ${d}ms infinite` }} />)}
                    </div>
                  </div>
                )}
              </div>

              <div className="quick-prompts" style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                {["Meri best opportunities kya hain?","Scam check karo: ftmo.com","$500 first mahine mein kaise?","Mera roadmap banao","Pakistan se best earning kya hai?"].map((q,i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{ fontSize:11, padding:"5px 11px", borderRadius:8, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.02)", color:"rgba(255,255,255,.4)", cursor:"pointer", transition:"all .2s" }}>
                    {q} ↗
                  </button>
                ))}
              </div>

              <div style={{ display:"flex", gap:9, borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:12 }}>
                <input className="ev-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendMessage()} placeholder="Kuch bhi poocho — scam check, opportunities, roadmap..." style={{ flex:1 }} />
                <button onClick={() => sendMessage()} className="btn-glow" style={{ padding:"10px 18px", borderRadius:11, fontWeight:600, fontSize:13, flexShrink:0 }}>
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