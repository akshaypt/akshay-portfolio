"use client";

import { useState, useEffect, useRef } from "react";

/* ── Types ── */
type Msg = { from: "user" | "ai"; text: string };
interface CaseData {
  tag: string; brand: string; title: string; lede: string;
  stats: string[]; problem: string; built: string;
  decisions: string[]; outcomes: string[]; takeaway: string;
}

/* ── Case studies data ── */
const CASES: Record<string, CaseData> = {
  wallet: {
    tag: "Fintech / Infrastructure", brand: "Bijak",
    title: "Wallet & Virtual Account Infrastructure",
    lede: "Replacing brittle manual payouts with programmatic settlement at the heart of India's largest B2B agri-trading platform.",
    stats: ["+23% DAU", "+40% Retention", "Near-zero payout failures"],
    problem: "Buyers on Bijak managed dozens of supplier relationships, each with different bank details, triggering manual transfers every time. On the ops side, every payout required an internal team member to verify the payment, buyer, and supplier before funds moved. That process took 4 to 6 hours. The ops team was the bottleneck.",
    built: "A wallet layer on top of partner-bank virtual accounts. Buyers could maintain all their suppliers and banking details inside the app. Payouts were automated: if buyer, supplier, and transaction details passed validation, no human intervention was required. Funds moved in 1 to 10 minutes instead of hours.",
    decisions: [
      "<b>Buyer-side friction first.</b> Centralising supplier bank details in the app eliminated repetitive data entry and reduced upstream payment errors.",
      "<b>Automate the trusted path, surface the exceptions.</b> Only high-confidence payout pairs skipped manual review. Edge cases still went to the ops queue.",
      "<b>Double-entry ledger from day one.</b> Every transaction reconciles. No missing rupees.",
      "<b>Failure modes before happy paths.</b> Bank API down? Queued, retried, surfaced to ops.",
    ],
    outcomes: [
      "+23% DAU within two quarters. Traders return when their money lands on time.",
      "+40% retention on the active trader cohort.",
      "Payout time dropped from 4 to 6 hours to under 10 minutes.",
      "Payout failure rate fell from 4% to under 0.3%.",
    ],
    takeaway: "Payments products are 80% reliability, 20% UI. The boring infrastructure decisions compound into trust.",
  },
  lms: {
    tag: "Fintech / Lending", brand: "Bijak",
    title: "Loan Management System",
    lede: "Turning embedded credit from spreadsheets and email into a structured lending product that scaled the portfolio 3.3×.",
    stats: ["₹30Cr → ₹100Cr+", "NPA below benchmark", "Faster disbursement"],
    problem: "Bijak was running embedded credit through Excel sheets, WhatsApp, and email. Working capital constraints capped trader growth. Risk was opaque to finance leadership, and collections lived in someone's inbox.",
    built: "A full LMS: credit-policy engine, disbursement automation, structured collections, real-time portfolio dashboards. Integrated with NBFC partners as the capital source and wired into the wallet system for auto-collection.",
    decisions: [
      "<b>Underwriting on trading history, not just KYC.</b> Bijak knew its customers better than any bureau did.",
      "<b>Auto-collect from wallet on receivables.</b> Keep ops out of the loop on the happy path.",
      "<b>Real-time portfolio health for finance leadership</b>, not month-end PDFs.",
      "<b>Capital structure designed for partner-NBFC variance</b>: any NBFC could be plugged in or out without a code change.",
    ],
    outcomes: [
      "Portfolio scaled from ₹30Cr to ₹100Cr+ in 18 months.",
      "NPAs stayed below industry benchmark for the segment.",
      "Disbursement cycle went from days to hours.",
    ],
    takeaway: "Lending is a system, not a feature. Underwriting, capital, ops, collections: every leg has to be designed in from the start.",
  },
  xirr: {
    tag: "Analytics / Trading", brand: "Bijak",
    title: "Real-Time Trade Profitability Engine",
    lede: "Giving traders a single, honest number per trade lot, computed live across procurement, logistics, storage, and sale.",
    stats: ["+1.7% avg return", "10K+ trades/month", "Lot-level live P&L"],
    problem: "Traders only knew if a trade was profitable weeks after the fact, when the accountant got around to it. Decisions on procurement, holding, and pricing were made on gut, and the gut was often wrong.",
    built: "An XIRR engine that computed live net return on every trade lot. Costs were modelled at the lot level: purchase, transport, storage, financing, wastage, and sale price. Surfaced in a mobile-first dashboard built for traders standing in a mandi.",
    decisions: [
      "<b>Compute at lot level, not aggregate.</b> Aggregates hide the loss-making trades inside winning weeks.",
      "<b>Net, not gross.</b> Show the real number, even when it's uncomfortable.",
      "<b>Mobile-first.</b> The user is on a phone in the field, not at a desk.",
      "<b>One metric per screen.</b> XIRR is the headline; everything else is supporting cast.",
    ],
    outcomes: [
      "Average return improved by 1.7% across 10K+ monthly trades.",
      "Procurement decisions visibly shifted from gut to data inside one quarter.",
      "Trader engagement on the analytics screen rose 4×.",
    ],
    takeaway: "Give people the right metric, not more metrics. The clarity itself is the product.",
  },
  recon: {
    tag: "Operations / Payments", brand: "Bijak",
    title: "Payment Reconciliation Automation",
    lede: "Killing 30+ hours a week of manual reconciliation by automating the tie-out across four systems.",
    stats: ["70% less cash ops", "~80% time saved", "Audit-ready closes"],
    problem: "Roughly 70% of Bijak's transaction volume was settling in cash, requiring manual reconciliation across the bank statement, wallet ledger, invoice system, and CRM. Ops spent 30+ hours a week tying things out. Books closed late.",
    built: "An automated reconciliation pipeline. Bank, wallet, invoices, and CRM all flowed into a matching engine; clean matches auto-closed; exceptions surfaced as a work queue. Every state change wrote an audit log.",
    decisions: [
      "<b>Match on bank reference, not amount.</b> Amount-matching produces silent false positives that bite at audit.",
      "<b>Surface exceptions as a workbench</b>, not 100 spreadsheets. One queue, one screen, one action per row.",
      "<b>Audit trail mandatory before close.</b> No \"trust me\" closes.",
      "<b>Move cash to digital aggressively</b>, with incentives where economically defensible.",
    ],
    outcomes: [
      "Cash transactions dropped 70% as digital became the default.",
      "Ops reconciliation time fell roughly 80%.",
      "Month-end close moved from 9 days to 3.",
    ],
    takeaway: "Automate the reconciliation, then automate the cash flow it reconciles. The order matters.",
  },
  kyc: {
    tag: "Enterprise / Compliance", brand: "KJBN Labs",
    title: "KYC & Contract Automation",
    lede: "Compressing customer onboarding from a week to under a day with AI-assisted extraction and structured review.",
    stats: ["40–50% less ops work", "<24h onboarding", "Audit-ready"],
    problem: "The compliance team processed customer documents by hand. Onboarding took 5–7 days. Mistakes leaked into legal and audit. Volume was growing faster than the team.",
    built: "A workflow engine for KYC and contract management. AI extracted structured data from documents; humans reviewed and approved; everything was versioned, diffable, and audit-logged.",
    decisions: [
      "<b>AI extracts, humans decide.</b> Never auto-approve a customer.",
      "<b>Versioned templates with diff visibility.</b> Legal can see what changed and why.",
      "<b>Compliance dashboards for management</b>, not just operators. Throughput, exceptions, and bottlenecks visible.",
      "<b>Optimise for trust, not throughput.</b> Slower wins beat faster mistakes.",
    ],
    outcomes: [
      "Compliance workload reduced 40–50%.",
      "Onboarding compressed to under 24 hours.",
      "Zero compliance escalations in the first audit cycle post-launch.",
    ],
    takeaway: "AI as the workflow layer. Humans still own the decisions that matter.",
  },
  offline: {
    tag: "Enterprise / Mobile", brand: "KJBN Labs",
    title: "Offline-First Mobile Application",
    lede: "A mobile app for field teams in low-connectivity regions, designed so that the network failing is not a failure mode.",
    stats: ["100% field uptime", "Zero data loss", "Smart sync"],
    problem: "Field teams operated in rural and low-connectivity regions. Online-first apps lost data when networks dropped. Workdays got lost to syncing problems. Operations stopped trusting the tool.",
    built: "An offline-first mobile app. Local-first writes, queue-based sync, smart conflict resolution. The app works the same whether you're on 5G or no signal at all.",
    decisions: [
      "<b>Local-first architecture from day one.</b> Bolting offline support onto an online app never works.",
      "<b>Last-write-wins with audit log.</b> Conflicts are inevitable; visibility is the answer.",
      "<b>Background sync with exponential backoff.</b> Networks come and go; the user shouldn't have to think about it.",
      "<b>Visible sync state in the UI.</b> Trust comes from knowing where your data is.",
    ],
    outcomes: [
      "100% field uptime, including in zero-signal environments.",
      "Zero reported data loss on sync since launch.",
      "Field-team NPS for the tool moved into the high 60s.",
    ],
    takeaway: "Connectivity is a feature you design FOR, not a baseline you assume. Especially in the markets that matter most.",
  },
};

/* ── Side Projects data ── */
interface ProjectData {
  tag: string; type: string; title: string; lede: string;
  stats: string[]; problem: string; built: string;
  decisions: string[]; outcomes: string[];
  links?: { label: string; href: string }[];
}

const PROJECTS: Record<string, ProjectData> = {
  animestudio: {
    tag: "AI / SaaS Product", type: "Founder Project",
    title: "Anime Studio",
    lede: "A free AI anime story creator that builds a cast, writes chapters, and generates anime/manhwa-style illustrated story slides. Validated it myself by growing an Instagram channel from 0 to 10K followers and 6M+ views in two weeks running on nothing but its own output.",
    stats: ["0 → 10K IG followers in 2 weeks", "6M+ views", "Free to use, AI-generated"],
    problem: "Anyone wanting to post anime or manhwa-style story content needs drawing skills, an artist, or expensive tools, and most AI image generators produce one-off pictures with no continuity of characters or story. There was no easy way to go from an idea to a consistent illustrated chapter you could actually post.",
    built: "Anime Studio: a tool where you create a cast of characters, write your story in chapters, and generate consistent anime/manhwa-style illustrated slides ready for Instagram. Stories, characters, and scripts are free; everyone gets one free image generation a day, with credits only for extra or HD images. Built with a full SEO/GEO foundation (sitemap, structured data, AI-crawler access, a 20-post content library) so the product is discoverable by both search engines and AI answer engines.",
    decisions: [
      "<b>Used my own product to prove it.</b> Launched @animeishq.official and ran it entirely on Anime Studio output, no external tools or artists.",
      "<b>Free-first, always.</b> Story creation and one image a day are free for everyone; credits only kick in for extra or HD images, so the core loop has zero barrier to entry.",
      "<b>Consistency over one-off images.</b> The product is built around a persistent cast and story, not single disconnected AI images, so creators can publish a series.",
      "<b>Built for AI search from day one.</b> Structured data, sitemaps, and an llms.txt mean the product is citable by AI answer engines, not just Google.",
    ],
    outcomes: [
      "@animeishq.official went from 0 to 10K followers and 6M+ views in 2 weeks, using only content made in Anime Studio.",
      "That growth became the product's own case study and the recurring proof point across its content marketing.",
      "Live at animestudio.work with a 20-post SEO/GEO content library built around the same proof.",
    ],
    links: [
      { label: "Visit Anime Studio", href: "https://animestudio.work" },
      { label: "@animeishq on Instagram", href: "https://instagram.com/animeishq.official" },
    ],
  },
  jobmatch: {
    tag: "AI / Chrome Extension", type: "Personal Project",
    title: "JobMatch",
    lede: "An honest job fit scorer that tells you whether to apply, not just what keywords to add.",
    stats: ["7-dimension scoring", "0 to 100 fit score", "Powered by Claude"],
    problem: "Every time I looked at a job listing, I was guessing. Does my profile actually fit this role or am I just wasting my time? No tool gave me a straight answer. They all just told me to add more keywords.",
    built: "A Chrome extension that adds a Check Fit button on job sites like LinkedIn and Indeed. Click it and it reads the job description, compares it to your CV, and gives you an honest score out of 100. It also tells you exactly where you are strong, where you fall short, and whether you should actually apply. Powered by Claude.",
    decisions: [
      "<b>Scored across 7 things</b> like skills, experience, and goals, because one number alone hides too much.",
      "<b>Kept the scoring honest.</b> A 70 means a 70, not a feel good 85.",
      "<b>Showed which gaps are a big deal</b> and which ones you can fix before applying.",
      "<b>Built it as a browser extension</b> because you are already on the job page. You should not have to open another tab.",
    ],
    outcomes: [
      "Stopped applying to everything and hoping.",
      "Only applied where the score and gap profile made it worth it.",
      "More applications actually got responses.",
    ],
  },
  jobpipeline: {
    tag: "Productivity / Chrome Extension", type: "Personal Project",
    title: "Job Pipeline",
    lede: "A job tracking sidebar that lives in your browser so nothing falls through the cracks.",
    stats: ["Browser sidebar", "Cross-device sync", "Next.js + Supabase"],
    problem: "Job hunting is basically a second job. I had roles saved across 20 tabs, no idea which ones I had followed up on, and a spreadsheet that I kept forgetting to update. Things were falling through the cracks.",
    built: "A browser sidebar that lets you save and track job applications without ever leaving the page you are on. You can log where each application stands, set reminders, and see everything in one place. Built with Next.js and Supabase so it works across devices.",
    decisions: [
      "<b>Made it a sidebar</b> so you never have to switch tabs to update your pipeline.",
      "<b>Focused on what needs action next,</b> not just a list of things you applied to.",
      "<b>Used real infrastructure</b> so it actually saves and syncs, not just a local prototype.",
    ],
    outcomes: [
      "Job search stopped feeling chaotic.",
      "Always knew what was in flight, what needed a follow up, and what was dead.",
      "Nothing fell through the gaps.",
    ],
  },
};

const SUGGESTIONS = [
  "Walk me through a 0→1 you've shipped",
  "How did you scale the lending portfolio?",
  "What is your retention framework?",
  "Are you open to advisory work?",
];

/* ── Nav Bar (isolated so scroll events don't re-render the whole page) ── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand"><span className="dot" />Akshay Teli</a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#case-studies">Case Studies</a>
            <a href="#what-i-build">What I Build</a>
            <a href="#journey">Experience</a>
            <a href="#philosophy">Philosophy</a>
            <a href="#ai-agent" className="nav-cta">Ask my AI →</a>
            <button className="hamburger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button className="mob-close" onClick={() => setMenuOpen(false)}>✕</button>
        <a href="#about"        onClick={() => setMenuOpen(false)}>About</a>
        <a href="#case-studies"  onClick={() => setMenuOpen(false)}>Case Studies</a>
        <a href="#what-i-build"  onClick={() => setMenuOpen(false)}>What I Build</a>
        <a href="#journey"       onClick={() => setMenuOpen(false)}>Experience</a>
        <a href="#philosophy"   onClick={() => setMenuOpen(false)}>Philosophy</a>
        <a href="#ai-agent" className="mob-cta" onClick={() => setMenuOpen(false)}>Ask my AI →</a>
      </div>
    </>
  );
}

/* ── Chat Widget (isolated so typing doesn't re-render the whole page) ── */
function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, loading]);

  async function ask(text: string) {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(p => [...p, { from: "user", text: msg }]);
    setLoading(true);
    try {
      const res  = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg }) });
      const data = await res.json();
      const clean = (data.reply ?? "").trim()
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^[-•]\s+/gm, "")
        .replace(/^\d+\.\s+/gm, "");
      setMessages(p => [...p, { from: "ai", text: clean || "Hmm, try a slightly different angle?" }]);
    } catch {
      setMessages(p => [...p, { from: "ai", text: "I'm offline for a moment. Ping me at akshay.teli.001@gmail.com and I'll reply personally." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat reveal">
      <div className="chat-top">
        <div className="chat-id">
          <div className="chat-avatar">A</div>
          <div>
            <div className="who">Akshay Teli</div>
            <div className="by">AI Agent · trained on his work</div>
          </div>
        </div>
        <div className="chat-status"><span className="live-dot" /> Available</div>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <p className="chat-empty-line">What would you like to discuss?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg from-${m.from}`}>
            <div className="who-tag">{m.from === "ai" ? "Akshay" : "You"}</div>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg from-ai">
            <div className="who-tag">Akshay</div>
            <div className="bubble"><span className="typing"><span /><span /><span /></span></div>
          </div>
        )}
      </div>
      {messages.length === 0 && (
        <div className="chat-suggestions">
          <span className="lbl">Suggested topics</span>
          {SUGGESTIONS.map(s => (
            <button key={s} className="suggestion" type="button" onClick={() => ask(s)}>{s}</button>
          ))}
        </div>
      )}
      <div className="chat-input-row">
        <input className="chat-input" type="text" placeholder="Ask me anything…" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && ask(input)}
        />
        <button className="send-btn" type="button" disabled={loading || !input.trim()} onClick={() => ask(input)}>Send →</button>
      </div>
    </div>
  );
}

/* ── CSS (from Claude Design, with fixes) ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --cream: #F1EDE3;
    --cream-2: #E9E4D5;
    --paper: #F7F3E8;
    --ink: #13161A;
    --ink-2: #383C40;
    --ink-3: #74716A;
    --muted: #9C988E;
    --line: #DAD3C2;
    --line-strong: #B8AE9C;
    --terracotta: #2E4636;
    --terracotta-2: #1B2F22;
    --terracotta-3: #9DB6A2;
    --terracotta-wash: #DDE5D2;
    --moss: #5E6F4B;
    --sand: #E8DCC8;
    --serif: "Fraunces", "Iowan Old Style", Georgia, serif;
    --sans: "Inter", -apple-system, system-ui, sans-serif;
    --mono: "JetBrains Mono", ui-monospace, monospace;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: var(--cream);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 16px;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    background-image:
      radial-gradient(rgba(60,80,60,0.022) 1px, transparent 1px),
      radial-gradient(rgba(60,80,60,0.015) 1px, transparent 1px);
    background-size: 3px 3px, 5px 5px;
    background-position: 0 0, 1px 1px;
  }
  ::selection { background: var(--terracotta); color: var(--cream); }

  a { color: inherit; text-decoration: none; }
  button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }

  .wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  @media (max-width: 720px) { .wrap { padding: 0 22px; } }

  h1, h2, h3, h4 {
    font-family: var(--serif);
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin: 0;
    text-wrap: balance;
  }
  .h-display {
    font-size: clamp(48px, 7.2vw, 104px);
    line-height: 0.98;
    letter-spacing: -0.035em;
    font-weight: 350;
    font-variation-settings: "opsz" 144, "SOFT" 30;
  }
  .h-section {
    font-size: clamp(36px, 4.6vw, 60px);
    line-height: 1.02;
    letter-spacing: -0.028em;
    font-weight: 350;
    font-variation-settings: "opsz" 96;
  }
  .h-sub { font-size: clamp(24px, 2.4vw, 30px); line-height: 1.2; font-weight: 400; }
  .italic { font-style: italic; font-variation-settings: "opsz" 144, "SOFT" 100; }
  .eyebrow {
    font-family: var(--sans); font-size: 11px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3);
  }
  .label { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.04em; color: var(--ink-3); text-transform: uppercase; }
  .body { color: var(--ink-2); font-size: 17px; line-height: 1.6; }
  .num { font-feature-settings: "tnum" 1, "lnum" 1; }

  /* Nav */
  .nav {
    position: sticky; top: 0; z-index: 50;
    background: color-mix(in srgb, var(--cream) 88%, transparent);
    backdrop-filter: saturate(140%) blur(10px);
    -webkit-backdrop-filter: saturate(140%) blur(10px);
    border-bottom: 1px solid transparent;
    transition: border-color .3s ease, background .3s ease;
  }
  .nav.scrolled { border-bottom-color: var(--line); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 18px 0; }
  .brand {
    font-family: var(--serif); font-size: 22px;
    letter-spacing: -0.02em; font-weight: 500;
    display: flex; align-items: baseline; gap: 10px;
  }
  .brand .dot { width: 9px; height: 9px; background: var(--terracotta); border-radius: 50%; display: inline-block; transform: translateY(-2px); }
  .nav-links { display: flex; gap: 32px; align-items: center; }
  .nav-links a { font-size: 14px; color: var(--ink-2); transition: color .2s; }
  .nav-links a:hover { color: var(--terracotta); }
  .nav-cta {
    border: 1px solid var(--ink); background: var(--ink);
    color: #FFFFFF !important;
    padding: 10px 18px; border-radius: 999px;
    font-size: 13.5px; font-weight: 600; letter-spacing: 0.01em; transition: all .2s;
  }
  .nav-cta:hover { background: var(--terracotta); border-color: var(--terracotta); }
  @media (max-width: 760px) { .nav-links a:not(.nav-cta):not(.hamburger) { display: none; } }

  /* Hamburger */
  .hamburger { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 36px; height: 36px; background: none; border: none; cursor: pointer; padding: 4px; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--ink); border-radius: 2px; transition: all .25s; }
  @media (max-width: 760px) { .hamburger { display: flex; } .nav-cta { display: none !important; } }

  /* Mobile menu */
  .mobile-menu { display: none; position: fixed; inset: 0; z-index: 999; background: var(--cream); flex-direction: column; padding: 80px 32px 48px; gap: 8px; }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { font-family: var(--serif); font-size: 28px; color: var(--ink); padding: 12px 0; border-bottom: 1px solid var(--line); }
  .mobile-menu .mob-cta { margin-top: 24px; display: inline-flex; align-items: center; justify-content: center; background: var(--ink); color: #fff; border-radius: 999px; padding: 14px 28px; font-family: var(--sans); font-size: 15px; font-weight: 600; border: none; }
  .mobile-menu .mob-close { position: absolute; top: 24px; right: 24px; font-size: 24px; background: none; border: none; cursor: pointer; color: var(--ink); }

  /* Hero */
  .hero { padding: 80px 0 100px; position: relative; overflow: hidden; }
  .hero::before {
    content: ""; position: absolute; top: -120px; right: -160px; width: 540px; height: 540px;
    background: radial-gradient(circle at 30% 30%, var(--terracotta-wash), transparent 60%);
    opacity: .55; pointer-events: none;
  }
  .hero-meta {
    display: flex; gap: 18px; flex-wrap: wrap; align-items: center;
    margin-bottom: 36px; color: var(--ink-3); font-size: 13px; letter-spacing: 0.04em;
  }
  .hero-meta .pip { width: 4px; height: 4px; background: var(--terracotta); border-radius: 50%; }
  .hero h1 { margin-bottom: 36px; max-width: 14ch; }
  .hero h1 .italic { color: var(--terracotta); font-weight: 350; }
  .hero-lede {
    font-family: var(--serif); font-size: clamp(20px, 1.8vw, 23px);
    line-height: 1.5; color: var(--ink-2); max-width: 56ch;
    font-weight: 400; margin-bottom: 38px;
  }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 44px; }
  .tag {
    border: 1px solid var(--line-strong); color: var(--ink-2);
    padding: 7px 14px; border-radius: 999px; font-size: 12.5px;
    letter-spacing: 0.02em; background: var(--paper);
  }
  .tag.accent { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .cta-row { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
  .btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 22px; border-radius: 999px;
    font-size: 14.5px; font-weight: 500; transition: all .2s; border: 1px solid transparent;
  }
  .btn-primary { background: var(--terracotta); color: #FFFFFF; font-weight: 600; }
  .btn-primary:hover { background: var(--terracotta-2); transform: translateY(-1px); color: #fff; }
  .btn-secondary { background: transparent; color: var(--ink); border-color: var(--line-strong); }
  .btn-secondary:hover { border-color: var(--ink); background: var(--paper); }
  .btn-ghost { color: var(--ink-2); padding-left: 4px; padding-right: 4px; }
  .btn-ghost:hover { color: var(--terracotta); }
  .btn .arrow { display: inline-block; transition: transform .25s; }
  .btn:hover .arrow { transform: translate(3px, -3px); }

  .hero-grid {
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 56px; align-items: end;
  }
  @media (max-width: 980px) { .hero-grid { grid-template-columns: 1fr; gap: 32px; } }
  .hero-aside { border-left: 1px solid var(--line); padding-left: 28px; }
  .hero-aside .label { display: block; margin-bottom: 14px; }
  .aside-row { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0; border-bottom: 1px dashed var(--line); }
  .aside-row:last-child { border-bottom: 0; }
  .aside-row .k { color: var(--ink-3); font-size: 13px; }
  .aside-row .v { font-family: var(--serif); font-size: 18px; color: var(--ink); }
  .aside-row .v.italic { color: var(--terracotta); }

  /* Section base */
  section { padding: 100px 0; position: relative; }
  .section-head {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 48px; margin-bottom: 64px; align-items: end;
  }
  @media (max-width: 880px) { .section-head { grid-template-columns: 1fr; gap: 20px; } }
  .section-head .lede { color: var(--ink-2); font-family: var(--serif); font-size: 21px; line-height: 1.5; max-width: 56ch; }
  .section-rule { height: 1px; background: var(--line); margin: 0 auto; max-width: 1200px; }

  /* Metrics */
  .metrics {
    background: var(--cream-2); border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line); padding: 70px 0;
  }
  .metrics-inner { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0; }
  @media (max-width: 980px) { .metrics-inner { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px) { .metrics-inner { grid-template-columns: 1fr; } }
  .metric { padding: 18px 28px; border-right: 1px solid var(--line); }
  .metric:last-child { border-right: 0; }
  @media (max-width: 980px) {
    .metric { border-right: 0; border-bottom: 1px solid var(--line); padding: 22px 0; }
  }
  .metric .num-big {
    font-family: var(--serif); font-size: clamp(46px, 5.4vw, 72px);
    line-height: 1; letter-spacing: -0.035em; color: var(--ink);
    font-weight: 350; font-variation-settings: "opsz" 144;
    margin-bottom: 12px; display: flex; align-items: baseline; gap: 2px;
  }
  .metric .num-big .unit { font-size: 0.45em; color: var(--terracotta); font-style: italic; letter-spacing: 0; margin-left: 2px; }
  .metric .lbl-1 { font-family: var(--sans); font-weight: 600; font-size: 14px; color: var(--ink); margin-bottom: 4px; }
  .metric .lbl-2 { font-size: 12.5px; color: var(--ink-3); }

  /* Timeline */
  .timeline { list-style: none; margin: 0; padding: 0; border-top: 1.5px solid var(--ink); }
  .tl-item {
    display: grid; grid-template-columns: 260px 1fr;
    gap: 64px; padding: 56px 0 64px;
    border-bottom: 1px solid var(--line); position: relative;
  }
  .tl-item:last-child { border-bottom: 1.5px solid var(--ink); }
  @media (max-width: 880px) { .tl-item { grid-template-columns: 1fr; gap: 22px; padding: 44px 0 48px; } }
  .tl-num {
    font-family: var(--serif); font-size: 80px; line-height: 0.85;
    letter-spacing: -0.04em; color: var(--terracotta); font-style: italic;
    font-weight: 350; margin-bottom: 22px; display: block;
  }
  .tl-year {
    font-family: var(--mono); font-size: 11.5px; color: var(--ink-3);
    letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px; display: block;
  }
  .tl-role { font-family: var(--serif); font-size: 22px; font-weight: 400; letter-spacing: -0.018em; color: var(--ink); display: block; margin-bottom: 4px; line-height: 1.2; }
  .tl-co { font-family: var(--serif); font-style: italic; color: var(--terracotta); font-size: 17px; line-height: 1.3; }
  .tl-status {
    display: inline-block; margin-top: 14px; padding: 4px 10px;
    background: var(--ink); color: var(--cream); font-family: var(--sans);
    font-size: 10.5px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; border-radius: 3px;
  }
  .tl-body { max-width: 64ch; }
  .tl-headline { font-family: var(--serif); font-size: clamp(26px, 2.8vw, 36px); line-height: 1.1; letter-spacing: -0.022em; font-weight: 400; margin: 0 0 22px; color: var(--ink); text-wrap: balance; }
  .tl-lede { color: var(--ink-2); font-size: 17px; line-height: 1.62; margin: 0 0 26px; font-family: var(--serif); font-weight: 400; }
  .tl-list { list-style: none; margin: 0 0 30px; padding: 0; display: grid; gap: 14px; }
  .tl-list li { display: grid; grid-template-columns: 18px 1fr; gap: 14px; align-items: baseline; color: var(--ink-2); font-size: 15.5px; line-height: 1.6; }
  .tl-list li::before { content: "→"; color: var(--terracotta); font-family: var(--serif); font-style: italic; font-size: 16px; }
  .tl-list li b { color: var(--ink); font-weight: 600; }
  .tl-outcomes { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 22px; border-top: 1px dashed var(--line-strong); }
  .tl-outcomes .lbl { width: 100%; font-family: var(--sans); font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; margin-bottom: 4px; }
  .tl-outcomes .pill { background: transparent; border: 1px solid var(--line-strong); color: var(--ink); padding: 6px 12px; border-radius: 4px; font-size: 12.5px; font-weight: 500; font-family: var(--sans); }
  .tl-outcomes .pill.primary { background: var(--ink); color: var(--cream); border-color: var(--ink); }

  /* Case studies */
  .cases-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  @media (max-width: 860px) { .cases-grid { grid-template-columns: 1fr; } }
  .case {
    background: var(--paper); border: 1px solid var(--line); border-radius: 18px;
    padding: 32px 30px 28px; transition: transform .25s, border-color .25s, box-shadow .25s;
    position: relative; cursor: pointer; overflow: hidden;
    font: inherit; color: inherit; text-align: left; width: 100%; display: block;
  }
  .case::before {
    content: ""; position: absolute; inset: 0;
    background: radial-gradient(600px 200px at 100% 0%, var(--terracotta-wash), transparent 60%);
    opacity: 0; transition: opacity .3s; pointer-events: none;
  }
  .case:hover { transform: translateY(-2px); border-color: var(--line-strong); box-shadow: 0 18px 40px -28px rgba(45,30,15,0.25); }
  .case:hover::before { opacity: .55; }
  .case-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 28px; }
  .case-tag { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--terracotta); }
  .case-brand { font-family: var(--serif); font-size: 14px; color: var(--ink-3); font-style: italic; }
  .case h3 { font-family: var(--serif); font-size: clamp(22px, 2vw, 28px); line-height: 1.18; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 24px; min-height: 2.6em; }
  .case-stats { display: flex; flex-wrap: wrap; gap: 8px; }
  .stat { background: var(--cream); border: 1px solid var(--line); color: var(--ink-2); padding: 7px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; }
  .stat.primary { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .case-foot { margin-top: 28px; display: flex; justify-content: space-between; align-items: center; color: var(--ink-3); font-size: 13px; }
  .case-foot .arrow { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--line-strong); display: inline-flex; align-items: center; justify-content: center; transition: all .25s; font-size: 14px; }
  .case:hover .case-foot .arrow { background: var(--terracotta); color: #fff; border-color: var(--terracotta); transform: rotate(-45deg); }

  /* Case Modal */
  .cs-overlay {
    position: fixed; inset: 0; background: rgba(15,18,22,0.55);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    z-index: 100; display: none; align-items: flex-start;
    justify-content: center; overflow-y: auto; padding: 60px 24px;
    opacity: 0; transition: opacity .25s ease;
  }
  .cs-overlay.open { display: flex; opacity: 1; }
  .cs-modal {
    background: var(--cream); width: 100%; max-width: 900px; border-radius: 16px;
    box-shadow: 0 40px 80px -30px rgba(0,0,0,0.4), 0 0 0 1px var(--line);
    position: relative; transform: translateY(20px); transition: transform .3s ease;
  }
  .cs-overlay.open .cs-modal { transform: translateY(0); }
  .cs-close {
    position: absolute; top: 18px; right: 18px; width: 40px; height: 40px;
    border-radius: 50%; background: var(--paper); border: 1px solid var(--line);
    color: var(--ink); font-size: 18px; line-height: 1; cursor: pointer;
    transition: all .2s; z-index: 2; display: flex; align-items: center; justify-content: center;
  }
  .cs-close:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }
  .cs-content { padding: 56px 64px 48px; }
  @media (max-width: 720px) { .cs-content { padding: 48px 28px 32px; } .cs-overlay { padding: 24px 16px; } }
  .cs-eyebrow { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 18px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-3); }
  .cs-eyebrow .accent { color: var(--terracotta); }
  .cs-title { font-family: var(--serif); font-size: clamp(30px, 4vw, 44px); line-height: 1.05; letter-spacing: -0.025em; font-weight: 400; color: var(--ink); margin: 0 0 18px; max-width: 22ch; }
  .cs-lede { font-family: var(--serif); color: var(--ink-2); font-size: 19px; line-height: 1.55; margin: 0 0 32px; max-width: 60ch; }
  .cs-stats { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 36px; padding-bottom: 32px; border-bottom: 1px solid var(--line); }
  .cs-section { margin-bottom: 32px; }
  .cs-section h4 { font-family: var(--sans); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; color: var(--ink-3); margin: 0 0 14px; }
  .cs-section p { font-family: var(--serif); color: var(--ink-2); font-size: 17px; line-height: 1.65; margin: 0 0 12px; max-width: 64ch; }
  .cs-section ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  .cs-section ul li { display: grid; grid-template-columns: 18px 1fr; gap: 12px; color: var(--ink-2); font-size: 15.5px; line-height: 1.55; }
  .cs-section ul li::before { content: "→"; color: var(--terracotta); font-family: var(--serif); font-style: italic; font-size: 16px; }
  .cs-section b { color: var(--ink); }
  .cs-links { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
  .cs-takeaway { margin-top: 36px; padding: 24px 28px; background: var(--paper); border-left: 3px solid var(--terracotta); border-radius: 4px; font-family: var(--serif); font-style: italic; color: var(--ink); font-size: 18px; line-height: 1.5; }
  .cs-takeaway .lbl { display: block; font-family: var(--sans); font-style: normal; font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; margin-bottom: 8px; }
  body.cs-locked { overflow: hidden; }

  /* Philosophy */
  .philosophy { background: var(--ink); color: var(--cream); }
  .philosophy h2, .philosophy h3 { color: var(--cream); }
  .philosophy .eyebrow { color: var(--terracotta-3); }
  .philosophy .section-head .lede { color: rgba(247,243,238,0.78); }
  .principles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; border-top: 1px solid rgba(247,243,238,0.12); }
  @media (max-width: 760px) { .principles { grid-template-columns: 1fr; } }
  .principle { padding: 36px 28px 36px 0; border-bottom: 1px solid rgba(247,243,238,0.12); display: grid; grid-template-columns: 64px 1fr; gap: 20px; align-items: baseline; }
  .principle:nth-child(odd) { border-right: 1px solid rgba(247,243,238,0.12); padding-right: 36px; }
  .principle:nth-child(even) { padding-left: 36px; }
  @media (max-width: 760px) { .principle, .principle:nth-child(odd), .principle:nth-child(even) { padding: 28px 0; border-right: 0; } }
  .principle .n { font-family: var(--serif); font-size: 38px; color: var(--terracotta-3); font-style: italic; font-weight: 350; letter-spacing: -0.02em; line-height: 1; }
  .principle .body-p { font-family: var(--serif); font-size: 22px; line-height: 1.35; color: var(--cream); font-weight: 350; letter-spacing: -0.015em; }
  .principle .body-p em { color: var(--terracotta-3); font-style: italic; }
  .philo-callout { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; padding: 0 0 68px; border-bottom: 1px solid rgba(247,243,238,0.12); margin-bottom: 4px; }
  @media (max-width: 760px) { .philo-callout { grid-template-columns: 1fr; gap: 24px; padding-bottom: 48px; } }
  .philo-callout .quote { font-family: var(--serif); font-size: clamp(22px, 2.2vw, 28px); line-height: 1.35; color: var(--cream); font-weight: 350; letter-spacing: -0.012em; }
  .philo-callout .quote .em { color: var(--terracotta-3); font-style: italic; }

  /* Skills */
  .skills-grid { display: grid; grid-template-columns: 1.2fr 2fr; gap: 64px; }
  @media (max-width: 880px) { .skills-grid { grid-template-columns: 1fr; gap: 36px; } }
  .edu-card { background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 28px; }
  .edu-card h4 { font-family: var(--serif); font-size: 22px; font-weight: 400; margin-bottom: 6px; letter-spacing: -0.015em; }
  .edu-card .sub { color: var(--ink-3); font-size: 14px; margin-bottom: 24px; }
  .edu-list { display: grid; gap: 16px; padding-top: 22px; border-top: 1px solid var(--line); }
  .edu-item { display: grid; grid-template-columns: 14px 1fr; gap: 12px; align-items: baseline; font-size: 14.5px; color: var(--ink-2); }
  .edu-item::before { content: "◇"; color: var(--terracotta); }
  .skill-group { margin-bottom: 36px; }
  .skill-group:last-child { margin-bottom: 0; }
  .skill-group .label { display: block; margin-bottom: 14px; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { border: 1px solid var(--line-strong); color: var(--ink); padding: 9px 16px; border-radius: 999px; font-size: 13.5px; background: var(--cream); font-family: var(--serif); font-weight: 400; transition: all .2s; }
  .chip:hover { background: var(--terracotta); color: var(--cream); border-color: var(--terracotta); }

  /* AI Chat */
  .ai { background: linear-gradient(180deg, var(--cream) 0%, var(--cream-2) 100%); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .ai-head { display: flex; align-items: flex-start; gap: 24px; justify-content: space-between; flex-wrap: wrap; margin-bottom: 48px; }
  .ai-head h2 { max-width: 18ch; }
  .chat { background: var(--paper); border: 1px solid var(--line); border-radius: 22px; overflow: hidden; box-shadow: 0 30px 80px -50px rgba(45,30,15,0.25); }
  .chat-top { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; background: var(--cream); border-bottom: 1px solid var(--line); }
  .chat-id { display: flex; align-items: center; gap: 12px; }
  .chat-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--terracotta); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: var(--serif); font-style: italic; font-size: 17px; }
  .chat-id .who { font-family: var(--serif); font-size: 16px; font-weight: 500; }
  .chat-id .by { font-size: 12px; color: var(--ink-3); }
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #6BA168; box-shadow: 0 0 0 4px rgba(107,161,104,0.18); margin-right: 6px; }
  .chat-status { font-size: 12px; color: var(--ink-3); display: flex; align-items: center; }
  .chat-body { padding: 28px; min-height: 280px; display: flex; flex-direction: column; gap: 18px; max-height: 520px; overflow-y: auto; }
  .msg { max-width: 78%; }
  .msg.from-user { align-self: flex-end; }
  .msg.from-ai { align-self: flex-start; }
  .bubble { padding: 14px 18px; border-radius: 16px; font-size: 15px; line-height: 1.55; }
  .msg.from-user .bubble { background: var(--ink); color: var(--cream); border-bottom-right-radius: 4px; }
  .msg.from-ai .bubble { background: var(--cream); color: var(--ink); border: 1px solid var(--line); border-bottom-left-radius: 4px; font-family: var(--serif); font-weight: 400; font-size: 16.5px; line-height: 1.55; }
  .msg .who-tag { font-size: 11px; color: var(--ink-3); margin: 0 6px 4px; letter-spacing: 0.06em; text-transform: uppercase; }
  .msg.from-user .who-tag { text-align: right; }
  .typing { display: inline-flex; gap: 4px; align-items: center; }
  .typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-3); animation: bob 1.2s infinite ease-in-out; }
  .typing span:nth-child(2) { animation-delay: .15s; }
  .typing span:nth-child(3) { animation-delay: .3s; }
  @keyframes bob { 0%, 60%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-4px); opacity: 1; } }
  .chat-empty { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 220px; }
  .chat-empty-line { font-family: var(--serif); font-size: 26px; color: var(--ink-3); font-style: italic; letter-spacing: -0.015em; margin: 0; text-align: center; }
  .chat-suggestions { padding: 8px 24px 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .chat-suggestions .lbl { width: 100%; font-size: 12px; color: var(--ink-3); margin-bottom: 4px; letter-spacing: 0.04em; }
  .suggestion { border: 1px solid var(--line-strong); color: var(--ink-2); background: var(--cream); padding: 8px 14px; border-radius: 999px; font-size: 13px; transition: all .2s; cursor: pointer; }
  .suggestion:hover { background: var(--terracotta); color: #fff; border-color: var(--terracotta); }
  .chat-input-row { display: flex; gap: 10px; padding: 18px 18px 22px; border-top: 1px solid var(--line); margin-top: 18px; }
  .chat-input { flex: 1; border: 1px solid var(--line-strong); background: var(--cream); border-radius: 14px; padding: 14px 16px; font-family: var(--sans); font-size: 15px; color: var(--ink); outline: none; transition: border-color .2s; }
  .chat-input:focus { border-color: var(--terracotta); }
  .send-btn { background: var(--terracotta); color: #fff; padding: 12px 22px; border-radius: 14px; font-size: 14px; font-weight: 500; transition: background .2s; cursor: pointer; }
  .send-btn:hover { background: var(--terracotta-2); }
  .send-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Footer */
  footer { padding: 80px 0 40px; border-top: 1px solid var(--line); }
  .foot-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 48px; margin-bottom: 60px; }
  @media (max-width: 760px) { .foot-grid { grid-template-columns: 1fr; gap: 32px; } }
  .foot-h { font-family: var(--serif); font-size: clamp(36px, 4vw, 56px); line-height: 1.02; letter-spacing: -0.025em; font-weight: 350; margin-bottom: 16px; max-width: 14ch; }
  .foot-h .italic { color: var(--terracotta); }
  .foot-sub { color: var(--ink-3); font-size: 15px; max-width: 40ch; }
  .foot-col h5 { font-family: var(--sans); font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--ink-3); margin-bottom: 16px; }
  .foot-col a { display: block; padding: 6px 0; color: var(--ink); font-size: 15px; transition: color .2s; }
  .foot-col a:hover { color: var(--terracotta); }
  .foot-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding-top: 28px; border-top: 1px solid var(--line); color: var(--ink-3); font-size: 13px; }
  .foot-bottom .signature { font-family: var(--serif); font-style: italic; color: var(--terracotta); }

  /* What I Build section */
  .build-intro { font-family: var(--serif); font-size: clamp(16px, 1.8vw, 19px); color: var(--ink-3); font-style: italic; max-width: 52ch; margin-top: 10px; }
  .projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 48px; }
  @media (max-width: 720px) { .projects-grid { grid-template-columns: 1fr; } }
  .project-card { background: var(--paper); border: 1px solid var(--line); border-radius: 18px; padding: 32px; text-align: left; cursor: pointer; transition: border-color .2s, box-shadow .2s; display: flex; flex-direction: column; gap: 16px; }
  .project-card:hover { border-color: var(--terracotta); box-shadow: 0 12px 40px -16px rgba(45,70,54,0.18); }
  .project-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .project-tag { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; }
  .project-type { font-size: 11px; color: var(--terracotta); font-weight: 600; letter-spacing: 0.04em; background: var(--terracotta-wash); padding: 3px 10px; border-radius: 99px; }
  .project-card h3 { font-family: var(--serif); font-size: clamp(22px, 2.2vw, 28px); font-weight: 400; letter-spacing: -0.02em; color: var(--ink); margin: 0; }
  .project-card .project-lede { font-size: 14.5px; color: var(--ink-3); line-height: 1.55; }
  .project-stats { display: flex; flex-wrap: wrap; gap: 8px; }
  .project-stats .stat { font-size: 12px; padding: 5px 12px; border-radius: 99px; background: var(--cream-2); color: var(--ink-2); font-weight: 500; }
  .project-stats .stat.primary { background: var(--terracotta); color: #fff; }
  .project-foot { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--ink-3); margin-top: auto; padding-top: 8px; border-top: 1px solid var(--line); }
  .project-foot .arrow { color: var(--terracotta); }

  /* Reveal */
  .reveal { opacity: 0; transform: translateY(16px); transition: opacity .8s ease, transform .8s ease; }
  .reveal.in { opacity: 1; transform: none; }
`;

/* ══════════════════════════
   COMPONENT
══════════════════════════ */
export default function Home() {
  const [openCaseId, setOpenCaseId]       = useState<string | null>(null);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  /* Reveal animations */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Modal body lock */
  useEffect(() => {
    document.body.classList.toggle("cs-locked", !!openCaseId);
    return () => document.body.classList.remove("cs-locked");
  }, [openCaseId]);

  /* Escape to close modal */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenCaseId(null); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const cs   = openCaseId    ? CASES[openCaseId]       : null;
  const proj = openProjectId ? PROJECTS[openProjectId] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ══ NAV ══ */}
      <NavBar />

      {/* ══ HERO ══ */}
      <header className="hero" id="top">
        <div className="wrap">
          <div className="hero-meta">
            <span className="label">Senior PM</span><span className="pip" />
            <span className="label">6+ Years</span><span className="pip" />
            <span className="label">Fintech · Marketplaces · Enterprise SaaS</span><span className="pip" />
            <span className="label">Bangalore, India</span>
          </div>
          <div className="hero-grid">
            <div>
              <h1 className="h-display reveal">
                Building <span className="italic">AI&#8209;first</span><br />
                digital products<br />
                that scale.
              </h1>
              <p className="hero-lede reveal">
                Senior Product Manager with 6+ years across fintech, agri-tech, marketplaces,
                and enterprise SaaS. My approach is shaped by real-world execution.
                I've run businesses, not just shipped features.
              </p>
              <div className="tags reveal">
                <span className="tag accent">Ex-Founder ×2</span>
                <span className="tag">Metrics-Driven</span>
                <span className="tag">Hypothesis-Led</span>
                <span className="tag">0→1 Operator</span>
              </div>
              <div className="cta-row reveal">
                <a href="#case-studies" className="btn btn-primary">View Case Studies <span className="arrow">↗</span></a>
                <a href="#ai-agent" className="btn btn-secondary">Ask my AI →</a>
                <a href="/Akshay_Pramod_Teli_Resume.pdf" target="_blank" rel="noreferrer" className="btn btn-ghost">Download Resume →</a>
              </div>
            </div>
            <aside className="hero-aside reveal">
              <span className="label">At a glance</span>
              <div className="aside-row"><span className="k">Currently</span><span className="v italic">Senior PM</span></div>
              <div className="aside-row"><span className="k">Specialism</span><span className="v">Financial infra</span></div>
              <div className="aside-row"><span className="k">Built &amp; led</span><span className="v">27-person team</span></div>
              <div className="aside-row"><span className="k">Scaled lending</span><span className="v">₹30Cr → ₹100Cr+</span></div>
              <div className="aside-row"><span className="k">Founder reps</span><span className="v">2 startups</span></div>
            </aside>
          </div>
        </div>
      </header>

      {/* ══ METRICS ══ */}
      <section className="metrics" id="about" style={{ padding: 0 }}>
        <div className="wrap">
          <div className="metrics-inner">
            {[
              { n: "+23", u: "%",   l: "Daily Active Users",   s: "Wallet automation impact" },
              { n: "+40", u: "%",   l: "Retention Lift",        s: "Post workflow automation" },
              { n: "70",  u: "%",   l: "Less Cash Ops",         s: "Payment reconciliation" },
              { n: "₹100",u: "Cr+", l: "Lending Scaled",        s: "From ₹30Cr portfolio" },
              { n: "4",   u: "×",   l: "Full Launches",         s: "Concept to GTM" },
            ].map((m, i) => (
              <div key={i} className="metric reveal">
                <div className="num-big num">{m.n}<span className="unit">{m.u}</span></div>
                <div className="lbl-1">{m.l}</div>
                <div className="lbl-2">{m.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CASE STUDIES ══ */}
      <section id="case-studies">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Selected Work</span>
              <h2 className="h-section reveal" style={{ marginTop: 14 }}>Case <span className="italic" style={{ color: "var(--terracotta)" }}>studies</span>.</h2>
            </div>
            <p className="lede reveal">Six projects, four years, one through-line: <em>build the system, not just the screen</em>. Click any card to expand the full write-up.</p>
          </div>
          <div className="cases-grid">
            {(["wallet","lms","xirr","recon","kyc","offline"] as const).map((id) => {
              const c = CASES[id];
              return (
                <button key={id} className="case reveal" type="button" onClick={() => setOpenCaseId(id)}>
                  <div className="case-head">
                    <span className="case-tag">{c.tag}</span>
                    <span className="case-brand">{c.brand}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <div className="case-stats">
                    {c.stats.map((s, i) => <span key={i} className={`stat${i === 0 ? " primary" : ""}`}>{s}</span>)}
                  </div>
                  <div className="case-foot"><span>Read case study</span><span className="arrow">→</span></div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CASE MODAL ══ */}
      <div className={`cs-overlay${openCaseId ? " open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!openCaseId} onClick={(e) => { if (e.target === e.currentTarget) setOpenCaseId(null); }}>
        <div className="cs-modal">
          <button className="cs-close" type="button" onClick={() => setOpenCaseId(null)}>✕</button>
          {cs && (
            <div className="cs-content">
              <div className="cs-eyebrow">
                <span className="accent">{cs.tag}</span>
                <span>{cs.brand}</span>
              </div>
              <h3 className="cs-title">{cs.title}</h3>
              <p className="cs-lede">{cs.lede}</p>
              <div className="cs-stats">
                {cs.stats.map((s, i) => <span key={i} className={`stat${i === 0 ? " primary" : ""}`}>{s}</span>)}
              </div>
              <div className="cs-section">
                <h4>The problem</h4>
                <p>{cs.problem}</p>
              </div>
              <div className="cs-section">
                <h4>What I built</h4>
                <p>{cs.built}</p>
              </div>
              <div className="cs-section">
                <h4>Key decisions</h4>
                <ul>{cs.decisions.map((d, i) => <li key={i}><span dangerouslySetInnerHTML={{ __html: d }} /></li>)}</ul>
              </div>
              <div className="cs-section">
                <h4>Outcomes</h4>
                <ul>{cs.outcomes.map((o, i) => <li key={i}><span>{o}</span></li>)}</ul>
              </div>
              <div className="cs-takeaway">
                <span className="lbl">What I took from it</span>
                {cs.takeaway}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section-rule" />

      {/* ══ WHAT I BUILD ══ */}
      <section id="what-i-build">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Side Projects</span>
              <h2 className="h-section reveal" style={{ marginTop: 14 }}>What I <span className="italic" style={{ color: "var(--terracotta)" }}>build</span>.</h2>
            </div>
            <p className="lede reveal">PM by day, builder by night. When I couldn't find tools that worked the way I think, I built them.</p>
          </div>
          <div className="projects-grid">
            {(["animestudio","jobmatch","jobpipeline"] as const).map((id) => {
              const p = PROJECTS[id];
              return (
                <button key={id} className="project-card reveal" type="button" onClick={() => setOpenProjectId(id)}>
                  <div className="project-head">
                    <span className="project-tag">{p.tag}</span>
                    <span className="project-type">{p.type}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="project-lede">{p.lede}</p>
                  <div className="project-stats">
                    {p.stats.map((s, i) => <span key={i} className={`stat${i === 0 ? " primary" : ""}`}>{s}</span>)}
                  </div>
                  <div className="project-foot"><span>Read more</span><span className="arrow">→</span></div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ PROJECT MODAL ══ */}
      <div className={`cs-overlay${openProjectId ? " open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!openProjectId} onClick={(e) => { if (e.target === e.currentTarget) setOpenProjectId(null); }}>
        <div className="cs-modal">
          <button className="cs-close" type="button" onClick={() => setOpenProjectId(null)}>✕</button>
          {proj && (
            <div className="cs-content">
              <div className="cs-eyebrow">
                <span className="accent">{proj.tag}</span>
                <span>{proj.type}</span>
              </div>
              <h3 className="cs-title">{proj.title}</h3>
              <p className="cs-lede">{proj.lede}</p>
              <div className="cs-stats">
                {proj.stats.map((s, i) => <span key={i} className={`stat${i === 0 ? " primary" : ""}`}>{s}</span>)}
              </div>
              <div className="cs-section">
                <h4>The problem</h4>
                <p>{proj.problem}</p>
              </div>
              <div className="cs-section">
                <h4>What I built</h4>
                <p>{proj.built}</p>
              </div>
              <div className="cs-section">
                <h4>Key decisions</h4>
                <ul>{proj.decisions.map((d, i) => <li key={i}><span dangerouslySetInnerHTML={{ __html: d }} /></li>)}</ul>
              </div>
              <div className="cs-section">
                <h4>Outcomes</h4>
                <ul>{proj.outcomes.map((o, i) => <li key={i}><span>{o}</span></li>)}</ul>
              </div>
              {proj.links && (
                <div className="cs-links">
                  {proj.links.map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className={`btn ${i === 0 ? "btn-primary" : "btn-secondary"}`}>
                      {l.label} <span className="arrow">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section-rule" />

      {/* ══ JOURNEY ══ */}
      <section id="journey">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Experience</span>
              <h2 className="h-section reveal" style={{ marginTop: 14 }}>A six-year <span className="italic" style={{ color: "var(--terracotta)" }}>arc</span>.</h2>
            </div>
            <p className="lede reveal">From co-founding two startups to building financial infrastructure at scale. Most recent work first.</p>
          </div>
          <ol className="timeline">
            <li className="tl-item reveal">
              <div className="tl-left">
                <span className="tl-num">01</span>
                <span className="tl-year">Nov 2024 – Apr 2026</span>
                <span className="tl-role">Senior Product Manager</span>
                <span className="tl-co">KJBN Labs · Enterprise SaaS</span>
              </div>
              <div className="tl-body">
                <h3 className="tl-headline">Bringing AI into the workflow layer, not the demo.</h3>
                <p className="tl-lede">Leading enterprise SaaS products with multi-tenant architecture, role-based access, and offline-first mobile workflows. The brief: ship compliance software that field teams actually want to open in the morning.</p>
                <ul className="tl-list">
                  <li><span><b>KYC &amp; contract automation</b> reduced compliance workload by 40–50% across customer ops.</span></li>
                  <li><span><b>Offline-first mobile</b> delivers 100% field uptime and zero data loss on sync, in regions where connectivity is the unreliable layer.</span></li>
                  <li><span>Embedding <b>AI agents into customer journeys</b> as quiet infrastructure, not chat features.</span></li>
                </ul>
                <div className="tl-outcomes">
                  <span className="lbl">Key outcomes</span>
                  <span className="pill primary">40–50% Less Ops Work</span>
                  <span className="pill">100% Field Uptime</span>
                  <span className="pill">Zero Data Loss</span>
                </div>
              </div>
            </li>
            <li className="tl-item reveal">
              <div className="tl-left">
                <span className="tl-num">02</span>
                <span className="tl-year">Feb 2022 – Oct 2024</span>
                <span className="tl-role">Product Manager</span>
                <span className="tl-co">Bijak · B2B agri-trading</span>
              </div>
              <div className="tl-body">
                <h3 className="tl-headline">Where I built financial infrastructure at scale.</h3>
                <p className="tl-lede">Built core fintech rails at India's leading B2B agri-trading platform: wallets, lending, reconciliation, and analytics. Led a 27-person dev team across 100+ production deployments.</p>
                <ul className="tl-list">
                  <li><span><b>Wallet &amp; virtual accounts</b> drove +23% DAU and +40% retention by replacing brittle manual payouts.</span></li>
                  <li><span><b>Loan Management System</b> scaled the lending portfolio from ₹30Cr to ₹100Cr+ with structured credit and lower default risk.</span></li>
                  <li><span><b>Real-time XIRR engine</b> lifted avg trader returns by 1.7% across 10K+ trades/month.</span></li>
                  <li><span><b>Payment reconciliation automation</b> reduced cash transactions by 70% and cut ops overhead.</span></li>
                  <li><span><b>Flash sale engine</b> improved margin by 4% on priority SKUs.</span></li>
                </ul>
                <div className="tl-outcomes">
                  <span className="lbl">Key outcomes</span>
                  <span className="pill primary">₹30Cr → ₹100Cr+</span>
                  <span className="pill">+23% DAU</span>
                  <span className="pill">+40% Retention</span>
                  <span className="pill">70% Less Cash Ops</span>
                </div>
              </div>
            </li>
            <li className="tl-item reveal">
              <div className="tl-left">
                <span className="tl-num">03</span>
                <span className="tl-year">2020 – 2022</span>
                <span className="tl-role">Co-Founder</span>
                <span className="tl-co">VP Mart · Hyperlocal marketplace</span>
              </div>
              <div className="tl-body">
                <h3 className="tl-headline">A two-sided marketplace, built from zero.</h3>
                <p className="tl-lede">Acquired supply, activated demand, and learned the cost of saying yes too often. 41 merchants, 7 categories, MVP shipped in 3 months.</p>
                <ul className="tl-list">
                  <li><span>First disciplined reps in <b>0→1 product strategy</b> and hypothesis-led testing.</span></li>
                  <li><span>Built the operator instinct for <b>supply economics</b> and demand-side activation loops.</span></li>
                  <li><span>Learned to <b>say no</b>, the most underrated PM skill.</span></li>
                </ul>
                <div className="tl-outcomes">
                  <span className="lbl">What it built in me</span>
                  <span className="pill">0→1 instinct</span>
                  <span className="pill">Hypothesis discipline</span>
                  <span className="pill">Founder ownership</span>
                </div>
              </div>
            </li>
            <li className="tl-item reveal">
              <div className="tl-left">
                <span className="tl-num">04</span>
                <span className="tl-year">2019 – 2020</span>
                <span className="tl-role">Co-Founder</span>
                <span className="tl-co">Fangover Food Services</span>
              </div>
              <div className="tl-body">
                <h3 className="tl-headline">Where unit economics became instinct.</h3>
                <p className="tl-lede">Started and ran a profitable food business at twenty-two. Learned the unforgiving arithmetic of margins, COGS, footfall, and churn. Lessons no PM bootcamp can teach.</p>
                <ul className="tl-list">
                  <li><span>Ran a full <b>P&amp;L</b> end-to-end before I ever wrote a PRD.</span></li>
                  <li><span>Built operational muscle across <b>inventory, vendor management, and customer flow</b>.</span></li>
                  <li><span>Where my <b>"operations is product"</b> philosophy was forged.</span></li>
                </ul>
                <div className="tl-outcomes">
                  <span className="lbl">What it built in me</span>
                  <span className="pill">Unit economics</span>
                  <span className="pill">Operational rigour</span>
                  <span className="pill">Customer proximity</span>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ══ PHILOSOPHY ══ */}
      <section className="philosophy" id="philosophy">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Philosophy</span>
              <h2 className="h-section reveal" style={{ marginTop: 14, color: "var(--cream)" }}>How I think about <span className="italic" style={{ color: "var(--terracotta-3)" }}>product</span>.</h2>
            </div>
            <p className="lede reveal">I approach product through structured hypothesis testing, user-behaviour analysis, and measurable experimentation. My focus is building scalable systems, not just shipping features.</p>
          </div>
          <div className="philo-callout">
            <p className="quote reveal">I've run a <span className="em">profitable food business</span>, built a marketplace from scratch, shipped financial infrastructure at scale, and led enterprise platforms from 0→1.</p>
            <p className="quote reveal">That experience shapes <span className="em">every product decision</span> I make: from prioritisation to pricing to the team rituals I run.</p>
          </div>
          <div className="principles">
            {[
              ["01", "Unit economics", "decide survival, margins before growth."],
              ["02", "Hypotheses", "before roadmaps, validate before you build."],
              ["03", "Retention", "over acquisition, the compounding advantage."],
              ["04", "Operations", "define product success, execution is strategy."],
              ["05", "Simplicity", "scales better than complexity."],
              ["06", "AI", "as a workflow layer, not a feature."],
            ].map(([n, em, rest]) => (
              <div key={n} className="principle reveal">
                <span className="n">{n}</span>
                <p className="body-p"><em>{em}</em> {rest}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Toolkit</span>
              <h2 className="h-section reveal" style={{ marginTop: 14 }}>What I <span className="italic" style={{ color: "var(--terracotta)" }}>build with</span>.</h2>
            </div>
            <p className="lede reveal">A working layer of product, technical, and leadership skills, shaped by what an operator-PM actually reaches for on a Tuesday morning.</p>
          </div>
          <div className="skills-grid">
            <div className="edu-card reveal">
              <span className="eyebrow">Education &amp; Certs</span>
              <h4 style={{ marginTop: 10 }}>B.Tech, Electronics &amp; Communication</h4>
              <p className="sub">PES University, Bangalore</p>
              <div className="edu-list">
                <div className="edu-item">Certified Scrum Product Owner (CSPO)</div>
                <div className="edu-item">Google Data Analytics Specialization</div>
                <div className="edu-item">Hypothesis-driven Experimentation</div>
                <div className="edu-item">Financial Modelling for Fintech</div>
              </div>
            </div>
            <div>
              {[
                { cat: "Product",    items: ["0→1 Development","Fintech & Lending","Marketplace Dynamics","Enterprise SaaS","Growth & Retention","Product Strategy","Pricing & Monetisation"] },
                { cat: "Technical",  items: ["SQL","Firebase","API Design","Analytics","AI Automation","Mixpanel · Amplitude","Looker · Metabase"] },
                { cat: "Leadership", items: ["Cross-functional Teams","Agile Execution","Stakeholder Alignment","Founder Ownership","Hiring & Coaching"] },
              ].map(({ cat, items }) => (
                <div key={cat} className="skill-group reveal">
                  <span className="label">{cat}</span>
                  <div className="chips">
                    {items.map(sk => <span key={sk} className="chip">{sk}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ AI AGENT ══ */}
      <section className="ai" id="ai-agent">
        <div className="wrap">
          <div className="ai-head">
            <div>
              <span className="eyebrow">Ask my AI</span>
              <h2 className="h-section reveal" style={{ marginTop: 14 }}>Ask <span className="italic" style={{ color: "var(--terracotta)" }}>my AI</span>.</h2>
            </div>
            <p className="lede reveal" style={{ maxWidth: "44ch", alignSelf: "flex-end" }}>
              A conversational agent grounded in my work, useful for evaluating fit, scoping an advisory engagement, or sounding out a product question before we meet.
            </p>
          </div>
          <ChatWidget />
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer id="contact">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <h3 className="foot-h">Let's build <span className="italic">something</span> good.</h3>
              <p className="foot-sub">Open to senior PM roles, fractional product leadership, and selective advisory work, especially in fintech, AI-first SaaS, and marketplaces.</p>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <a href="mailto:akshay.teli.001@gmail.com">akshay.teli.001@gmail.com</a>
              <a href="https://www.linkedin.com/in/akshaypramodteli" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="/Akshay_Pramod_Teli_Resume.pdf" target="_blank" rel="noreferrer">Download Resume →</a>
            </div>
            <div className="foot-col">
              <h5>Sections</h5>
              <a href="#journey">Experience</a>
              <a href="#case-studies">Case Studies</a>
              <a href="#philosophy">Philosophy</a>
              <a href="#ai-agent">Ask my AI</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} Akshay Teli · Bangalore, India</span>
            <span className="signature">Designed with intent.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
