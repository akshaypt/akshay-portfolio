"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── InView hook ─── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

/* ─── Counter ─── */
function Counter({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [n, setN] = useState(0); const { ref, vis } = useInView(0.3);
  useEffect(() => {
    if (!vis) return;
    let s = 0; const step = to / 70;
    const t = setInterval(() => { s += step; if (s >= to) { setN(to); clearInterval(t); } else setN(parseFloat(s.toFixed(decimals))); }, 16);
    return () => clearInterval(t);
  }, [vis, to, decimals]);
  return <span ref={ref}>{prefix}{n.toFixed(decimals)}{suffix}</span>;
}

/* ─── Typewriter ─── */
function Typewriter({ words }: { words: string[] }) {
  const [wordIdx, setWordIdx] = useState(0); const [charIdx, setCharIdx] = useState(0); const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx]; const delay = deleting ? 50 : charIdx === word.length ? 2000 : 80;
    const t = setTimeout(() => {
      if (!deleting && charIdx === word.length) { setDeleting(true); return; }
      if (deleting && charIdx === 0) { setDeleting(false); setWordIdx((wordIdx + 1) % words.length); return; }
      setCharIdx(c => deleting ? c - 1 : c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words]);
  return <span>{words[wordIdx].slice(0, charIdx)}<span style={{ borderRight: "2px solid #c8a96e", marginLeft: 1, animation: "blink-cursor .7s step-end infinite" }} /></span>;
}

type Msg = { role: "user" | "bot"; text: string };

/* ════ DATA ════ */
const METRICS = [
  { to: 23, prefix: "+", suffix: "%", label: "Daily Active Users", sub: "Wallet automation impact", color: "#c8a96e" },
  { to: 40, prefix: "+", suffix: "%", label: "Retention Lift", sub: "Post workflow automation", color: "#7c9e87" },
  { to: 70, prefix: "", suffix: "%", label: "Less Cash Ops", sub: "Payment reconciliation", color: "#8fa8c4" },
  { to: 100, prefix: "₹", suffix: "Cr+", label: "Lending Scaled", sub: "From ₹30Cr portfolio", color: "#c49090" },
  { to: 3, prefix: "0→", suffix: "", label: "Full Launches", sub: "Concept to GTM", color: "#a894c8" },
];

const JOURNEY = [
  { period: "2019–2020", role: "Co-founder", company: "Cloud Kitchen", tag: "Founder", color: "#c8a96e", icon: "🍽",
    summary: "Built a food startup from scratch post-college. Broke even in 3–6 months, achieved profitability, then navigated COVID disruption.",
    bullets: ["Launched delivery-first on Zomato & Swiggy with minimal capex", "Profitable within 3–6 months of launch", "Expanded operations — disrupted by COVID platform saturation", "Learned: unit economics, CAC, platform dependency, operational discipline"] },
  { period: "2020–2022", role: "Co-founder", company: "VP Mart", tag: "Founder", color: "#c8a96e", icon: "🛒",
    summary: "Hyperlocal marketplace digitizing neighborhood merchants. Launched in 3 months with 41 merchants across 7 categories.",
    bullets: ["Full ownership: strategy, PRDs, wireframes, tech coordination", "41 merchants · 7 categories · launched in 3 months", "Built customer app, merchant app, inventory & admin systems", "Learned: marketplace liquidity, supply-side complexity, why simplicity scales"] },
  { period: "Feb 2022–Oct 2024", role: "Product Manager", company: "Bijak", tag: "PM", color: "#7c9e87", icon: "🌾",
    summary: "Built core financial infrastructure at India's leading B2B agri-trading platform. Led 27-member dev team across 100+ deployments.",
    bullets: ["Wallet + virtual accounts → +23% DAU, +40% retention", "Loan Management System → ₹30Cr to ₹100Cr+ lending", "Real-time XIRR engine → 1.7% avg return improvement across 10K+ trades/month", "Payment automation → 70% reduction in cash transactions", "Flash sale engine → 4% margin improvement"] },
  { period: "Nov 2024–Present", role: "Senior Product Manager", company: "KJBN Labs", tag: "Current", color: "#8fa8c4", icon: "🏢",
    summary: "Leading 0→1 of a global enterprise SaaS platform. Own product strategy, roadmap, architecture, and cross-team execution.",
    bullets: ["Enterprise accounting & ledger with ERP compatibility", "Satellite-based crop yield estimation for procurement forecasting", "RBAC workflow engine for multi-persona enterprise ops", "KYC & contract automation → 40–50% reduction in manual effort", "Offline-first mobile app → 100% field continuity"] },
];

const CASES = [
  { company: "Bijak", title: "Wallet & Virtual Account Infrastructure", tag: "Fintech · Infrastructure", color: "#c8a96e",
    problem: "Manual payout processes were slow, error-prone, and eroding trader trust across the platform.",
    solution: "Designed wallet infrastructure linked to virtual accounts, fully automating the payout lifecycle.",
    impact: ["+23% DAU", "+40% Retention", "Reliable Payouts"] },
  { company: "Bijak", title: "Loan Management System", tag: "Fintech · Lending", color: "#7c9e87",
    problem: "Lending operations lacked structured internal tooling, capping credit scale and increasing risk.",
    solution: "Designed and launched a full LMS enabling structured credit operations at scale.",
    impact: ["₹30Cr → ₹100Cr+", "Structured Credit", "Reduced Risk"] },
  { company: "Bijak", title: "Real-Time Trade Profitability Engine", tag: "Analytics · Trading", color: "#8fa8c4",
    problem: "Zero visibility into projected vs actual returns across thousands of monthly trades.",
    solution: "Built real-time XIRR system covering 10,000+ trades/month for live P&L tracking.",
    impact: ["1.7% Return Lift", "10K+ Trades/mo", "Live P&L"] },
  { company: "Bijak", title: "Payment Reconciliation Automation", tag: "Operations · Payments", color: "#a894c8",
    problem: "Cash-heavy operations caused errors, delays, and heavy manual reconciliation overhead.",
    solution: "Introduced online payment at delivery with gamification to drive behavioural adoption.",
    impact: ["70% Cash Reduction", "Fewer Errors", "Lower Overhead"] },
  { company: "KJBN Labs", title: "KYC & Contract Automation", tag: "Enterprise · Compliance", color: "#c49090",
    problem: "Manual verification cycles were slow and error-prone across a growing enterprise client base.",
    solution: "Automated KYC and contract workflows with compliance-grade audit trails.",
    impact: ["40–50% Less Work", "Faster Compliance", "Audit-ready"] },
  { company: "KJBN Labs", title: "Offline-First Mobile Application", tag: "Enterprise · Mobile", color: "#7c9e87",
    problem: "Field operations broke down entirely in areas with poor connectivity.",
    solution: "Intelligent sync architecture enabling full app functionality without internet.",
    impact: ["100% Field Uptime", "Zero Data Loss", "Smart Sync"] },
];

const STARTERS = ["Walk me through your 0→1 experience", "How did you scale the lending portfolio?", "What's your retention framework?", "Open to advisory or consulting?"];

/* ═══════════════════════════════════════════
   AI VIDEO INTRO — animated canvas
═══════════════════════════════════════════ */
function AIVideoIntro({ onSkip }: { onSkip: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [phase, setPhase] = useState<"intro" | "main" | "ending">("intro");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    /* Nodes */
    const NODE_COUNT = 60;
    type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number; pulseSpeed: number };
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 3, pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    /* Central attractor */
    let attractorStrength = 0;
    const cx = () => W / 2, cy = () => H / 2;

    /* Text fade */
    let textAlpha = 0, lineAlpha = 0;
    const texts = [
      { text: "Meet AI Akshay", size: 52, y: -60, delay: 1.5 },
      { text: "Your intelligent guide to Akshay Teli's work", size: 20, y: 10, delay: 2.4 },
      { text: "Trained on 6 years of product experience", size: 16, y: 50, delay: 3.2 },
      { text: "Ask anything. Get real insights.", size: 16, y: 82, delay: 4.0 },
    ];

    let frame = 0;
    function draw() {
      const t = (Date.now() - startRef.current) / 1000;
      setElapsed(t);
      frame++;

      ctx.fillStyle = "rgba(250,248,245,0.18)";
      ctx.fillRect(0, 0, W, H);

      /* background gradient */
      const bg = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), Math.max(W, H) * 0.7);
      bg.addColorStop(0, "rgba(200,169,110,0.06)");
      bg.addColorStop(0.5, "rgba(143,168,196,0.04)");
      bg.addColorStop(1, "rgba(250,248,245,0)");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      /* Attractor ramp */
      if (t > 0.5 && t < 3) attractorStrength = Math.min(1, (t - 0.5) / 2.5) * 0.012;
      else if (t >= 3) attractorStrength = Math.max(0, attractorStrength - 0.0002);

      /* Update & draw nodes */
      nodes.forEach((nd, i) => {
        nd.pulse += nd.pulseSpeed;
        const dx = cx() - nd.x, dy = cy() - nd.y;
        nd.vx += dx * attractorStrength; nd.vy += dy * attractorStrength;
        nd.vx *= 0.98; nd.vy *= 0.98;
        nd.x += nd.vx; nd.y += nd.vy;
        if (nd.x < 0 || nd.x > W) nd.vx *= -1;
        if (nd.y < 0 || nd.y > H) nd.vy *= -1;

        /* draw edges */
        for (let j = i + 1; j < nodes.length; j++) {
          const nb = nodes[j];
          const dist = Math.hypot(nd.x - nb.x, nd.y - nb.y);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.18;
            ctx.strokeStyle = `rgba(200,169,110,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(nd.x, nd.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
          }
        }

        const glow = 0.5 + 0.5 * Math.sin(nd.pulse);
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r * (0.8 + 0.3 * glow), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${0.4 + 0.4 * glow})`; ctx.fill();
      });

      /* Central orb */
      if (t > 1) {
        const orbAlpha = Math.min(1, (t - 1) / 1.5);
        const orbR = 8 + 4 * Math.sin(t * 2);
        const orbGlow = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 80);
        orbGlow.addColorStop(0, `rgba(200,169,110,${0.6 * orbAlpha})`);
        orbGlow.addColorStop(0.3, `rgba(200,169,110,${0.15 * orbAlpha})`);
        orbGlow.addColorStop(1, "rgba(200,169,110,0)");
        ctx.fillStyle = orbGlow; ctx.beginPath(); ctx.arc(cx(), cy(), 80, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx(), cy(), orbR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${orbAlpha})`; ctx.fill();

        /* Rings */
        for (let ring = 1; ring <= 3; ring++) {
          const ringR = ring * 55 + 10 * Math.sin(t * 1.5 + ring);
          ctx.beginPath(); ctx.arc(cx(), cy(), ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200,169,110,${0.08 * orbAlpha})`; ctx.lineWidth = 1; ctx.stroke();
        }
      }

      /* Floating text */
      texts.forEach(({ text, size, y: yOff, delay }) => {
        if (t < delay) return;
        const a = Math.min(1, (t - delay) / 0.8);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = size > 40 ? "#1a1612" : "#6b5e4e";
        ctx.font = size > 40 ? `400 ${size}px 'Cormorant Garamond', serif` : `400 ${size}px 'Figtree', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(text, cx(), cy() + yOff + 140);
        ctx.restore();
      });

      /* Wave at bottom */
      if (t > 2) {
        const wAlpha = Math.min(0.5, (t - 2) / 1.5);
        ctx.save(); ctx.globalAlpha = wAlpha;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y2 = H - 60 + 12 * Math.sin(x * 0.02 + t * 2) + 6 * Math.sin(x * 0.04 - t * 3);
          x === 0 ? ctx.moveTo(x, y2) : ctx.lineTo(x, y2);
        }
        ctx.strokeStyle = "rgba(200,169,110,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    /* clear bg first */
    ctx.fillStyle = "#faf8f5"; ctx.fillRect(0, 0, W, H);
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const totalDuration = 9;
  const progress = Math.min(1, elapsed / totalDuration);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#faf8f5", display: "flex", flexDirection: "column" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(200,169,110,0.15)" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#c8a96e,#a894c8)", width: `${progress * 100}%`, transition: "width 0.1s linear", borderRadius: 2 }} />
      </div>

      {/* Skip */}
      <button
        onClick={onSkip}
        style={{ position: "absolute", top: 28, right: 32, zIndex: 10, background: "rgba(250,248,245,0.8)", border: "1px solid rgba(200,169,110,0.3)", borderRadius: 999, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#6b5e4e", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all .2s", fontFamily: "'Figtree', sans-serif" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#c8a96e"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(250,248,245,0.8)"; (e.currentTarget as HTMLButtonElement).style.color = "#6b5e4e"; }}
      >
        Skip intro →
      </button>

      {/* Bottom CTA after 6s */}
      {elapsed > 6 && (
        <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", textAlign: "center", animation: "fadeUp .6s ease forwards", zIndex: 10 }}>
          <button onClick={onSkip}
            style={{ background: "#c8a96e", color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Figtree', sans-serif", boxShadow: "0 8px 32px rgba(200,169,110,0.35)", transition: "all .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(200,169,110,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(200,169,110,0.35)"; }}
          >
            Enter Portfolio
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [introGone, setIntroGone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeJourney, setActiveJourney] = useState(2);
  const [expandedCase, setExpandedCase] = useState<number | null>(null);
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const heroRef = useInView(0.05); const metricsRef = useInView(0.1);
  const journeyRef = useInView(0.05); const capRef = useInView(0.1);
  const caseRef = useInView(0.05); const philRef = useInView(0.1);
  const aiRef = useInView(0.05); const eduRef = useInView(0.1);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSkipIntro = useCallback(() => {
    setShowIntro(false);
    setTimeout(() => setIntroGone(true), 600);
  }, []);

  /* Custom cursor */
  useEffect(() => {
    const m = (e: MouseEvent) => { setCursorPos({ x: e.clientX, y: e.clientY }); };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim(); if (!msg || loading) return;
    setInput(""); setMessages(p => [...p, { role: "user", text: msg }]); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg }) });
      const data = await res.json();
      setMessages(p => [...p, { role: "bot", text: data.reply }]);
    } catch { setMessages(p => [...p, { role: "bot", text: "Something went wrong. Please try again." }]); }
    finally { setLoading(false); }
  }

  const fadeUp = (vis: boolean, delay = 0): React.CSSProperties => ({
    opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Figtree:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#faf8f5;color:#1a1612;font-family:'Figtree',sans-serif;cursor:none}
        ::selection{background:rgba(200,169,110,.25)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#f0ebe3}
        ::-webkit-scrollbar-thumb{background:#d4c5b0;border-radius:4px}

        .serif{font-family:'Cormorant Garamond',serif}

        @keyframes blink-cursor{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}

        .intro-exit{animation:fadeIn .5s ease reverse forwards}

        .nav-link{color:#8a7a6b;text-decoration:none;font-size:13px;font-weight:500;transition:color .2s;letter-spacing:.01em}
        .nav-link:hover{color:#1a1612}

        .btn-primary{display:inline-flex;align-items:center;gap:8px;background:#1a1612;color:#faf8f5;font-size:13px;font-weight:600;padding:11px 22px;border-radius:10px;border:none;cursor:none;text-decoration:none;transition:all .2s;font-family:'Figtree',sans-serif;letter-spacing:.01em}
        .btn-primary:hover{background:#3d3228;transform:translateY(-1px);box-shadow:0 8px 24px rgba(26,22,18,.2)}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;background:#c8a96e;color:#fff;font-size:13px;font-weight:600;padding:11px 22px;border-radius:10px;border:none;cursor:none;text-decoration:none;transition:all .2s;font-family:'Figtree',sans-serif}
        .btn-gold:hover{background:#b8975a;transform:translateY(-1px);box-shadow:0 8px 24px rgba(200,169,110,.4)}
        .btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#4a3f35;font-size:13px;font-weight:600;padding:10px 20px;border-radius:10px;border:1px solid rgba(200,169,110,.4);cursor:none;text-decoration:none;transition:all .2s;font-family:'Figtree',sans-serif}
        .btn-outline:hover{border-color:#c8a96e;background:rgba(200,169,110,.06)}

        .metric-card{border:1px solid #e8e0d4;border-radius:16px;padding:28px 22px;background:#fff;transition:all .3s;cursor:default}
        .metric-card:hover{border-color:#c8a96e;box-shadow:0 12px 40px rgba(200,169,110,.12);transform:translateY(-3px)}

        .glow-card{border:1px solid #e8e0d4;border-radius:16px;background:#fff;transition:all .3s}
        .glow-card:hover{border-color:rgba(200,169,110,.5);box-shadow:0 16px 48px rgba(200,169,110,.1)}

        .j-tab{background:transparent;border:none;cursor:none;text-align:left;padding:16px 20px;border-radius:12px;transition:all .2s;width:100%;border-left:2px solid transparent;font-family:'Figtree',sans-serif}
        .j-tab:hover{background:rgba(200,169,110,.06)}
        .j-tab.active{background:rgba(200,169,110,.08);border-left-color:#c8a96e}

        .case-card{border:1px solid #e8e0d4;border-radius:14px;padding:24px;background:#fff;cursor:none;transition:all .3s}
        .case-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.06);transform:translateY(-3px)}

        .principle-row{display:flex;gap:14px;align-items:flex-start;padding:14px 18px;border:1px solid #ede6dc;border-radius:12px;background:#fdfbf8;transition:all .25s;cursor:default}
        .principle-row:hover{border-color:rgba(200,169,110,.4);background:rgba(200,169,110,.04);transform:translateX(4px)}

        .skill-chip{font-size:12px;color:#6b5e4e;border:1px solid #e0d6c8;border-radius:8px;padding:5px 12px;background:#fdfbf8;transition:all .2s;cursor:default}
        .skill-chip:hover{border-color:#c8a96e;background:rgba(200,169,110,.08);color:#1a1612}

        .chat-bubble-user{background:#1a1612;color:#faf8f5;border-radius:14px 14px 4px 14px;padding:10px 15px;font-size:13px;font-weight:500;max-width:78%;align-self:flex-end;animation:slideInRight .3s ease}
        .chat-bubble-bot{background:#f5f0e8;border:1px solid #e8e0d4;color:#3d3228;border-radius:14px 14px 14px 4px;padding:10px 15px;font-size:13px;line-height:1.6;max-width:80%;align-self:flex-start;animation:fadeUp .3s ease}

        @keyframes typing-dot{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
        .td{width:5px;height:5px;border-radius:50%;background:#8a7a6b;display:inline-block;animation:typing-dot 1.2s infinite}
        .td:nth-child(2){animation-delay:.2s}.td:nth-child(3){animation-delay:.4s}

        .ai-section-bg{background:linear-gradient(135deg,#f5f0e8 0%,#faf8f5 50%,#f0ebe3 100%)}

        hr.sep{border:none;border-top:1px solid #ede6dc}

        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .show-mobile{display:flex!important}
          .mobile-grid-1{grid-template-columns:1fr!important}
        }
        @media(min-width:769px){.show-mobile{display:none!important}}

        /* intro transition */
        .portfolio-enter{animation:fadeIn .8s ease .1s both}
      `}</style>

      {/* ── Custom cursor ── */}
      <div style={{ position: "fixed", zIndex: 9999, pointerEvents: "none", left: cursorPos.x - 6, top: cursorPos.y - 6, width: 12, height: 12, borderRadius: "50%", background: "#c8a96e", transition: "transform .1s", transform: cursorActive ? "scale(2.5)" : "scale(1)", mixBlendMode: "multiply" }} />
      <div style={{ position: "fixed", zIndex: 9998, pointerEvents: "none", left: cursorPos.x - 20, top: cursorPos.y - 20, width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(200,169,110,.4)", transition: "left .12s, top .12s" }} />

      {/* ── Intro ── */}
      {!introGone && (
        <div style={{ opacity: showIntro ? 1 : 0, transition: "opacity .5s ease", pointerEvents: showIntro ? "all" : "none" }}>
          <AIVideoIntro onSkip={handleSkipIntro} />
        </div>
      )}

      {/* ── Main portfolio ── */}
      <div className={introGone ? "portfolio-enter" : ""} style={{ opacity: introGone ? 1 : 0 }}
        onMouseEnter={() => setCursorActive(true)} onMouseLeave={() => setCursorActive(false)}>

        {/* ══════ NAVBAR ══════ */}
        <header style={{
          position: "fixed", inset: "0 0 auto 0", zIndex: 50,
          background: scrolled ? "rgba(250,248,245,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid #ede6dc" : "1px solid transparent",
          transition: "all .3s",
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 500, color: "#1a1612", textDecoration: "none", letterSpacing: "-0.01em" }}>
              Akshay Teli
            </a>
            <nav className="hide-mobile" style={{ display: "flex", gap: 28 }}>
              {[["About", "#about"], ["Experience", "#journey"], ["Case Studies", "#case-studies"], ["AI Akshay", "#ai-assistant"]].map(([l, h]) => (
                <a key={l} href={h} className="nav-link">{l}</a>
              ))}
            </nav>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="#ai-assistant" className="btn-gold hide-mobile" style={{ fontSize: 12, padding: "8px 16px" }}>Talk to AI Akshay</a>
              <button className="show-mobile" onClick={() => setMobileMenuOpen(p => !p)} style={{ background: "transparent", border: "1px solid #e0d6c8", borderRadius: 8, padding: "7px 10px", cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b5e4e" strokeWidth="2">
                  {mobileMenuOpen ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
                </svg>
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #ede6dc", background: "rgba(250,248,245,.97)", display: "flex", flexDirection: "column", gap: 2 }}>
              {[["About", "#about"], ["Experience", "#journey"], ["Case Studies", "#case-studies"], ["AI Akshay", "#ai-assistant"]].map(([l, h]) => (
                <a key={l} href={h} onClick={() => setMobileMenuOpen(false)} style={{ padding: "10px 12px", borderRadius: 8, color: "#4a3f35", textDecoration: "none", fontSize: 14, transition: "background .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,169,110,.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>{l}</a>
              ))}
            </div>
          )}
        </header>

        {/* ══════ HERO ══════ */}
        <section style={{ paddingTop: 148, paddingBottom: 96, paddingLeft: 32, paddingRight: 32, position: "relative", overflow: "hidden" }}>
          {/* Decorative bg blobs */}
          <div style={{ position: "absolute", top: "5%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,169,110,.08) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,148,200,.06) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div ref={heroRef.ref} style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ maxWidth: 820 }}>
              {/* Status pill */}
              <div style={{ ...fadeUp(heroRef.vis, 0), display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid #e0d6c8", borderRadius: 999, padding: "7px 18px", marginBottom: 36, background: "rgba(200,169,110,.06)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c9e87", flexShrink: 0, boxShadow: "0 0 0 0 rgba(124,158,135,.5)", animation: "pulse-green 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#8a7a6b" }}>Senior PM · 6+ Years · Fintech · Marketplaces · Enterprise SaaS · Bangalore</span>
              </div>

              <h1 style={{ ...fadeUp(heroRef.vis, 80), fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.8rem,7vw,5rem)", lineHeight: 1.04, letterSpacing: "-0.025em", color: "#1a1612", marginBottom: 20, fontWeight: 400 }}>
                Building{" "}
                <em style={{ fontStyle: "italic", color: "#c8a96e" }}>AI-First</em>{" "}
                Digital Products That Scale
              </h1>

              <div style={{ ...fadeUp(heroRef.vis, 160), fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.3rem,2.5vw,1.7rem)", color: "#8a7a6b", marginBottom: 10, fontWeight: 300, lineHeight: 1.4 }}>
                Specialising in{" "}
                <span style={{ color: "#c8a96e", fontStyle: "italic" }}>
                  <Typewriter words={["0→1 product launches", "retention systems", "AI workflow design", "fintech infrastructure", "marketplace products"]} />
                </span>
              </div>

              <p style={{ ...fadeUp(heroRef.vis, 220), fontSize: 15, color: "#8a7a6b", lineHeight: 1.75, maxWidth: 580, marginBottom: 12 }}>
                Senior Product Manager with 6+ years across fintech, agri-tech, marketplaces, and enterprise SaaS. My approach is shaped by real-world execution — I've run businesses, not just shipped features.
              </p>
              <p style={{ ...fadeUp(heroRef.vis, 260), fontSize: 12, color: "#b8a898", fontWeight: 500, letterSpacing: "0.08em", marginBottom: 44 }}>
                EX-FOUNDER&emsp;·&emsp;METRICS-DRIVEN&emsp;·&emsp;HYPOTHESIS-LED
              </p>

              <div style={{ ...fadeUp(heroRef.vis, 320), display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
                <a href="#case-studies" className="btn-primary">
                  View Case Studies
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
                <a href="#journey" className="btn-outline">My Journey</a>
                <a href="#ai-assistant" className="btn-gold">
                  ✦ Talk to AI Akshay
                </a>
              </div>
              <div style={fadeUp(heroRef.vis, 380)}>
              <a
  href="/Akshay_Pramod_Teli_Resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
 style={{ fontSize: 13, color: "#b8a898", textDecoration: "none", transition: "color .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#c8a96e")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#b8a898")}>Download Resume →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ METRICS ══════ */}
        <section style={{ padding: "0 32px 96px" }}>
          <div ref={metricsRef.ref} style={{ maxWidth: 1152, margin: "0 auto" }}>
            <hr className="sep" style={{ marginBottom: 60 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
              {METRICS.map((m, i) => (
                <div key={m.label} className="metric-card" style={{ ...fadeUp(metricsRef.vis, i * 80) }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,4vw,2.6rem)", fontWeight: 500, color: m.color, margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    <Counter to={m.to} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1612", margin: "0 0 3px" }}>{m.label}</p>
                  <p style={{ fontSize: 11, color: "#b8a898", margin: 0 }}>{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ JOURNEY ══════ */}
        <section id="journey" style={{ padding: "80px 32px", background: "#f5f0e8" }}>
          <div ref={journeyRef.ref} style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ ...fadeUp(journeyRef.vis, 0), marginBottom: 52 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 10 }}>Experience</p>
              <h2 className="serif" style={{ fontSize: "clamp(2rem,4.5vw,3rem)", fontWeight: 400, color: "#1a1612", letterSpacing: "-0.02em", margin: "0 0 12px" }}>My Journey</h2>
              <p style={{ fontSize: 14, color: "#8a7a6b", maxWidth: 500, lineHeight: 1.7 }}>From co-founding startups to building financial infrastructure at scale — each chapter shaped how I think about product.</p>
            </div>

            <div style={{ ...fadeUp(journeyRef.vis, 100), display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }} className="mobile-grid-1">
              {/* Tabs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {JOURNEY.map((j, i) => (
                  <button key={i} className={`j-tab${activeJourney === i ? " active" : ""}`} onClick={() => setActiveJourney(i)}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{j.icon}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: activeJourney === i ? j.color : "#b8a898" }}>{j.tag}</span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: activeJourney === i ? "#1a1612" : "#8a7a6b", margin: "0 0 2px", transition: "color .2s" }}>{j.role}</p>
                    <p style={{ fontSize: 11, color: "#b8a898", margin: 0 }}>{j.period}</p>
                  </button>
                ))}
              </div>
              {/* Panel */}
              <div className="glow-card" style={{ padding: "36px 40px", borderLeft: `3px solid ${JOURNEY[activeJourney].color}`, background: "#fff", animation: "slideInRight .35s ease" }} key={activeJourney}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                  <div>
                    <h3 className="serif" style={{ fontSize: "clamp(1.3rem,2.5vw,1.65rem)", fontWeight: 400, color: "#1a1612", margin: "0 0 4px", letterSpacing: "-0.015em" }}>{JOURNEY[activeJourney].role}</h3>
                    <p style={{ fontSize: 13, color: JOURNEY[activeJourney].color, fontWeight: 600, margin: 0 }}>{JOURNEY[activeJourney].company}</p>
                  </div>
                  <span style={{ fontSize: 12, color: "#8a7a6b", background: "#f5f0e8", border: "1px solid #e8e0d4", borderRadius: 8, padding: "5px 12px", height: "fit-content" }}>{JOURNEY[activeJourney].period}</span>
                </div>
                <p style={{ fontSize: 14, color: "#6b5e4e", lineHeight: 1.75, marginBottom: 24 }}>{JOURNEY[activeJourney].summary}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {JOURNEY[activeJourney].bullets.map((b, bi) => (
                    <li key={bi} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: JOURNEY[activeJourney].color, flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: 13, color: "#6b5e4e", lineHeight: 1.65 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ WHAT I BUILD ══════ */}
        <section id="about" style={{ padding: "80px 32px" }}>
          <div ref={capRef.ref} style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ ...fadeUp(capRef.vis, 0), marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 10 }}>Expertise</p>
              <h2 className="serif" style={{ fontSize: "clamp(2rem,4.5vw,3rem)", fontWeight: 400, color: "#1a1612", letterSpacing: "-0.02em", margin: 0 }}>What I Build</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
              {[
                { tag: "0→1", title: "Zero-to-One Product Strategy", desc: "Validation, MVP scoping, GTM execution. Done twice as a founder, multiple times as a PM.", color: "#c8a96e", icon: "◈" },
                { tag: "Fintech", title: "Financial Infrastructure", desc: "Wallets, lending systems, reconciliation engines, and payment automation built for scale.", color: "#7c9e87", icon: "◎" },
                { tag: "Growth", title: "Retention & Growth Systems", desc: "Experiment-driven activation loops and data-informed iteration to move retention metrics.", color: "#8fa8c4", icon: "◐" },
                { tag: "Enterprise", title: "Enterprise SaaS Platforms", desc: "Multi-tenant architecture, RBAC, compliance workflows, and offline-first systems.", color: "#a894c8", icon: "◆" },
              ].map((c, i) => (
                <div key={c.title} className="glow-card" style={{
                  ...fadeUp(capRef.vis, i * 80), padding: "28px", cursor: "default",
                  borderColor: hoverCard === i ? `${c.color}60` : "#e8e0d4",
                  background: hoverCard === i ? `${c.color}05` : "#fff",
                }}
                  onMouseEnter={() => setHoverCard(i)} onMouseLeave={() => setHoverCard(null)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: c.color, border: `1px solid ${c.color}50`, borderRadius: 999, padding: "3px 10px", background: `${c.color}10` }}>{c.tag}</span>
                    <span style={{ fontSize: 22, color: `${c.color}60` }}>{c.icon}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1a1612", margin: "0 0 10px", lineHeight: 1.35 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: "#8a7a6b", lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ CASE STUDIES ══════ */}
        <section id="case-studies" style={{ padding: "80px 32px", background: "#f5f0e8" }}>
          <div ref={caseRef.ref} style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ ...fadeUp(caseRef.vis, 0), display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 10 }}>Work</p>
                <h2 className="serif" style={{ fontSize: "clamp(2rem,4.5vw,3rem)", fontWeight: 400, color: "#1a1612", letterSpacing: "-0.02em", margin: 0 }}>Case Studies</h2>
              </div>
              <p
  style={{
    fontSize: 16,
    color: "#b8a898",
    fontStyle: "italic",
    fontFamily: "'Cormorant Garamond',serif"
  }}
>
  Click any card to expand
</p>

            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
              {CASES.map((cs, i) => (
                <div key={i} className="case-card" style={{
                  ...fadeUp(caseRef.vis, i * 60),
                  borderColor: expandedCase === i ? `${cs.color}50` : "#e8e0d4",
                  background: expandedCase === i ? `${cs.color}04` : "#fff",
                }} onClick={() => setExpandedCase(expandedCase === i ? null : i)}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: cs.color, border: `1px solid ${cs.color}40`, borderRadius: 999, padding: "3px 9px", background: `${cs.color}10` }}>{cs.tag}</span>
                    <svg style={{ color: "#c8b8a4", transition: "transform .25s", transform: expandedCase === i ? "rotate(180deg)" : "rotate(0)" }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 11, color: "#b8a898", fontWeight: 600, marginBottom: 5, letterSpacing: ".04em" }}>{cs.company}</p>
                  <h3 className="serif" style={{ fontSize: 18, fontWeight: 400, color: "#1a1612", margin: "0 0 14px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{cs.title}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cs.impact.map(imp => (
                      <span key={imp} style={{ fontSize: 11, fontWeight: 700, color: cs.color, background: `${cs.color}12`, border: `1px solid ${cs.color}30`, borderRadius: 6, padding: "3px 9px" }}>{imp}</span>
                    ))}
                  </div>
                  {expandedCase === i && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #ede6dc", animation: "fadeUp .3s ease" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#b8a898", marginBottom: 6 }}>Problem</p>
                      <p style={{ fontSize: 13, color: "#6b5e4e", lineHeight: 1.65, marginBottom: 16 }}>{cs.problem}</p>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#b8a898", marginBottom: 6 }}>Solution</p>
                      <p style={{ fontSize: 13, color: "#6b5e4e", lineHeight: 1.65 }}>{cs.solution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ PHILOSOPHY ══════ */}
        <section style={{ padding: "80px 32px" }}>
          <div ref={philRef.ref} style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 64 }}>
              <div style={fadeUp(philRef.vis, 0)}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 10 }}>Philosophy</p>
                <h2 className="serif" style={{ fontSize: "clamp(2rem,4.5vw,3rem)", fontWeight: 400, color: "#1a1612", letterSpacing: "-0.02em", margin: "0 0 20px" }}>How I Think About Product</h2>
                <p style={{ fontSize: 14, color: "#8a7a6b", lineHeight: 1.8, marginBottom: 20 }}>
                  I approach product building through structured hypothesis testing, user behavior analysis, and measurable experimentation. My focus is building scalable systems — not just shipping features.
                </p>
                <p style={{ fontSize: 14, color: "#8a7a6b", lineHeight: 1.8 }}>
                  I've run a profitable food business, built a marketplace from scratch, shipped financial infrastructure at scale, and led enterprise platforms from 0→1. That experience shapes every product decision I make.
                </p>
              </div>
              <div style={{ ...fadeUp(philRef.vis, 160), display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { n: "01", text: "Unit economics decide survival — margins before growth", color: "#c8a96e" },
                  { n: "02", text: "Hypotheses before roadmaps — validate before you build", color: "#7c9e87" },
                  { n: "03", text: "Retention over acquisition — the compounding advantage", color: "#8fa8c4" },
                  { n: "04", text: "Operations define product success — execution is strategy", color: "#a894c8" },
                  { n: "05", text: "Simplicity scales better than complexity", color: "#c49090" },
                  { n: "06", text: "AI as a workflow layer, not a feature", color: "#c8a96e" },
                ].map(p => (
                  <div key={p.n} className="principle-row">
                    <span style={{ fontSize: 10, fontWeight: 800, color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}35`, borderRadius: 6, padding: "3px 7px", flexShrink: 0, letterSpacing: ".04em", fontFamily: "'Figtree',sans-serif" }}>{p.n}</span>
                    <span style={{ fontSize: 13, color: "#4a3f35", fontWeight: 500, lineHeight: 1.6 }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════ EDUCATION & SKILLS ══════ */}
        <section style={{ padding: "80px 32px", background: "#f5f0e8" }}>
          <div ref={eduRef.ref} style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48 }}>
              <div style={fadeUp(eduRef.vis, 0)}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 20 }}>Education</p>
                <div style={{ border: "1px solid #e8e0d4", borderRadius: 14, padding: "22px 24px", background: "#fff", marginBottom: 14 }}>
                  <p className="serif" style={{ fontSize: 17, fontWeight: 400, color: "#1a1612", marginBottom: 4 }}>B.Tech — Electronics & Communication</p>
                  <p style={{ fontSize: 13, color: "#8a7a6b" }}>PES University, Bangalore</p>
                </div>
                {["Certified Scrum Product Owner (CSPO)", "Google Data Analytics Specialization"].map(c => (
                  <div key={c} style={{ display: "flex", gap: 12, alignItems: "center", border: "1px solid #e8e0d4", borderRadius: 10, padding: "12px 16px", background: "#fff", marginBottom: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#6b5e4e" }}>{c}</span>
                  </div>
                ))}
              </div>
              <div style={fadeUp(eduRef.vis, 160)}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 20 }}>Skills</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { cat: "Product", items: ["0→1 Development", "Fintech & Lending", "Marketplace Dynamics", "Enterprise SaaS", "Growth & Retention", "Product Strategy"], color: "#c8a96e" },
                    { cat: "Technical", items: ["SQL", "Firebase", "API Design", "Analytics", "AI Automation"], color: "#7c9e87" },
                    { cat: "Leadership", items: ["Cross-functional Teams", "Agile Execution", "Stakeholder Alignment", "Founder Ownership"], color: "#8fa8c4" },
                  ].map(({ cat, items, color }) => (
                    <div key={cat}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color, marginBottom: 10 }}>{cat}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {items.map(sk => <span key={sk} className="skill-chip">{sk}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ AI CHAT ══════ */}
        <section id="ai-assistant" className="ai-section-bg" style={{ padding: "96px 32px" }}>
          <div ref={aiRef.ref} style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ ...fadeUp(aiRef.vis, 0), textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,169,110,.12)", border: "1px solid rgba(200,169,110,.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 20 }}>
                <span style={{ fontSize: 14 }}>✦</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#c8a96e", letterSpacing: ".06em", textTransform: "uppercase" }}>AI Assistant</span>
              </div>
              <h2 className="serif" style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 400, color: "#1a1612", letterSpacing: "-0.025em", margin: "0 0 14px", lineHeight: 1.15 }}>
                Curious How I'd Think About Your Product?
              </h2>
              <p style={{ fontSize: 15, color: "#8a7a6b", lineHeight: 1.7 }}>
                Ask AI Akshay about growth strategy, hiring fit, founder experience, or startup advisory.
              </p>
            </div>

            <div style={{ ...fadeUp(aiRef.vis, 160), border: "1px solid #e0d6c8", borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 20px 60px rgba(200,169,110,.1)" }}>
              {/* Header */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #ede6dc", display: "flex", alignItems: "center", gap: 10, background: "rgba(200,169,110,.04)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c9e87", boxShadow: "0 0 0 0 rgba(124,158,135,.5)", animation: "pulse-green 2s infinite" }} />
                <span className="serif" style={{ fontSize: 17, fontWeight: 400, color: "#1a1612" }}>AI Akshay</span>
                <span style={{ fontSize: 11, color: "#b8a898" }}>— powered by Claude</span>
              </div>

              {/* Messages */}
              <div style={{ height: 340, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
                {messages.length === 0 && (
                  <div style={{ marginTop: "auto" }}>
                    <p style={{ fontSize: 12, color: "#b8a898", marginBottom: 12, fontWeight: 500 }}>Quick questions to start:</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {STARTERS.map(s => (
                        <button key={s} onClick={() => sendMessage(s)}
                          style={{ background: "#faf8f5", border: "1px solid #e8e0d4", borderRadius: 10, padding: "11px 14px", fontSize: 12, color: "#6b5e4e", textAlign: "left", cursor: "none", lineHeight: 1.45, transition: "all .2s", fontFamily: "'Figtree',sans-serif" }}
                          onMouseEnter={e => { const d = e.currentTarget as HTMLButtonElement; d.style.borderColor = "#c8a96e"; d.style.background = "rgba(200,169,110,.06)"; d.style.color = "#1a1612"; }}
                          onMouseLeave={e => { const d = e.currentTarget as HTMLButtonElement; d.style.borderColor = "#e8e0d4"; d.style.background = "#faf8f5"; d.style.color = "#6b5e4e"; }}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}>{m.text}</div>
                ))}
                {loading && (
                  <div className="chat-bubble-bot" style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
                    <span className="td" /><span className="td" /><span className="td" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "14px 18px", borderTop: "1px solid #ede6dc", display: "flex", gap: 10 }}>
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Ask about my experience, projects, or how I'd approach your product..."
                  disabled={loading}
                  style={{ flex: 1, background: "#faf8f5", border: "1px solid #e0d6c8", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#1a1612", outline: "none", transition: "border-color .2s", fontFamily: "'Figtree',sans-serif" }}
                  onFocus={e => (e.target.style.borderColor = "#c8a96e")}
                  onBlur={e => (e.target.style.borderColor = "#e0d6c8")}
                />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="btn-gold"
                  style={{ padding: "10px 20px", opacity: loading || !input.trim() ? 0.4 : 1, cursor: loading || !input.trim() ? "not-allowed" : "none" }}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ FOOTER ══════ */}
        <footer id="contact" style={{ borderTop: "1px solid #e8e0d4", padding: "44px 32px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <p className="serif" style={{ fontSize: 20, fontWeight: 400, color: "#1a1612", margin: "0 0 3px" }}>Akshay Teli</p>
              <p style={{ fontSize: 12, color: "#b8a898", margin: 0 }}>Senior PM · Bangalore, India</p>
            </div>
            <div style={{ display: "flex", gap: 28 }}>
            {[
  ["akshay.teli.001@gmail.com", "mailto:akshay.teli.001@gmail.com"],
  ["LinkedIn", "https://www.linkedin.com/in/akshaypramodteli"],
  ["Download Resume", "/Akshay_Pramod_Teli_Resume.pdf"]
].map(([l, h]) => (

                <a key={l} href={h} style={{ fontSize: 13, color: "#b8a898", textDecoration: "none", transition: "color .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#c8a96e")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#b8a898")}>{l}</a>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#d4c5b0", margin: 0 }}>© {new Date().getFullYear()} Akshay Teli</p>
          </div>
        </footer>

      </div>

      <style>{`
        @keyframes pulse-green {
          0%{box-shadow:0 0 0 0 rgba(124,158,135,.5)}
          70%{box-shadow:0 0 0 6px rgba(124,158,135,0)}
          100%{box-shadow:0 0 0 0 rgba(124,158,135,0)}
        }
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .show-mobile{display:flex!important}
          .mobile-grid-1{grid-template-columns:1fr!important}
        }
        @media(min-width:769px){ .show-mobile{display:none!important} }
      `}</style>
    </>
  );
}