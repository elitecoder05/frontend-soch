import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Zap, Copy, Check, Loader2, RotateCcw,
  Globe, Users, Flame, Mic, MessageSquare, Clock, AlertTriangle
} from "lucide-react";
import { generateScript, type ScriptGenerationParams, type ScriptResult } from "../api/scriptGeneratorApi";

// ─── Constants ───────────────────────────────────────────────────
const DURATIONS = [
  { value: "30s", label: "30 Sec", icon: "⚡" },
  { value: "1min", label: "1 Min", icon: "⏱️" },
  { value: "custom", label: "Custom", icon: "🎯" },
] as const;

const LANGUAGES = [
  { value: "English", label: "English", flag: "🇺🇸" },
  { value: "Hindi", label: "Hindi", flag: "🇮🇳" },
  { value: "Hinglish", label: "Hinglish", flag: "🔀" },
] as const;

const AUDIENCES = [
  { value: "Students", label: "Students", emoji: "🎓" },
  { value: "Entrepreneurs", label: "Entrepreneurs", emoji: "🚀" },
  { value: "Creators", label: "Creators", emoji: "🎬" },
  { value: "custom", label: "Custom", emoji: "✏️" },
] as const;

const TONES = [
  { value: "Inspirational", label: "Inspirational", bg: "#FFF7ED", border: "#FB923C", text: "#C2410C" },
  { value: "Dark", label: "Dark", bg: "#F1F5F9", border: "#64748B", text: "#334155" },
  { value: "Confident", label: "Confident", bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8" },
  { value: "Vulnerable", label: "Vulnerable", bg: "#FFF1F2", border: "#F43F5E", text: "#BE123C" },
  { value: "Raw", label: "Raw", bg: "#FEF2F2", border: "#EF4444", text: "#B91C1C" },
  { value: "Aggressive", label: "Aggressive", bg: "#FFF7ED", border: "#F97316", text: "#C2410C" },
  { value: "Storytelling", label: "Storytelling", bg: "#F5F3FF", border: "#8B5CF6", text: "#6D28D9" },
] as const;

const INTENSITY_LABELS = ["", "Calm", "Motivational", "Strong", "Aggressive", "Custom"];
const INTENSITY_COLORS = ["", "#94A3B8", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

const CTA_OPTIONS = [
  "Follow for more",
  "Subscribe",
  "Comment",
  "Save",
  "custom",
] as const;

// ─── Quality Score Ring ──────────────────────────────────────────
const ScoreRing = ({ score, label, max = 10 }: { score: number; label: string; max?: number }) => {
  const percentage = (score / max) * 100;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = score >= 7 ? "#22C55E" : score >= 5 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[76px] h-[76px]">
        <svg className="w-[76px] h-[76px] -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" stroke="#E2E8F0" strokeWidth="5" fill="none" />
          <circle
            cx="40" cy="40" r="36"
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold" style={{ color }}>{score.toFixed(1)}</span>
        </div>
      </div>
      <span className="text-[11px] text-gray-500 text-center leading-tight max-w-[80px] font-medium">{label}</span>
    </div>
  );
};

// ─── Section Label ───────────────────────────────────────────────
const SectionLabel = ({ icon: Icon, color, children }: { icon: any; color: string; children: React.ReactNode }) => (
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
    <Icon className="w-4 h-4" style={{ color }} />
    {children}
  </label>
);

// ─── Main Component ──────────────────────────────────────────────
const ScriptGenerator = () => {
  // Form state
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<string>("1min");
  const [customDuration, setCustomDuration] = useState<number>(2);
  const [language, setLanguage] = useState("English");
  const [audience, setAudience] = useState("Creators");
  const [customAudience, setCustomAudience] = useState("");
  const [emotionalIntensity, setEmotionalIntensity] = useState(3);
  const [customIntensity, setCustomIntensity] = useState("");
  const [tone, setTone] = useState("Inspirational");
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaType, setCtaType] = useState("Follow for more");
  const [customCta, setCustomCta] = useState("");

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);

    const params: ScriptGenerationParams = {
      topic: topic.trim(),
      duration: duration as "30s" | "1min" | "custom",
      customDuration: duration === "custom" ? customDuration : undefined,
      language: language as "English" | "Hindi" | "Hinglish",
      audience: audience as "Students" | "Entrepreneurs" | "Creators" | "custom",
      customAudience: audience === "custom" ? customAudience : undefined,
      emotionalIntensity,
      customIntensity: emotionalIntensity === 5 ? customIntensity : undefined,
      tone,
      ctaEnabled,
      ctaType: ctaEnabled ? ctaType : undefined,
      customCta: ctaEnabled && ctaType === "custom" ? customCta : undefined,
    };

    try {
      const response = await generateScript(params);
      if (response.success && response.data) {
        setResult(response.data);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      } else {
        setError(response.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Connection failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyFull = () => {
    if (!result) return;
    const full = [result.hook.text, "", result.body.text, result.cta.included ? `\n${result.cta.text}` : ""].join("\n");
    handleCopy(full, "full");
  };

  const handleReset = () => {
    setTopic(""); setResult(null); setError(null);
    setDuration("1min"); setLanguage("English"); setAudience("Creators");
    setEmotionalIntensity(3); setTone("Inspirational"); setCtaEnabled(false);
  };

  // ─── Inline styles for the isolated dark page ─────────────
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)",
    color: "#E2E8F0",
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(15, 15, 30, 0.7)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#F1F5F9",
    fontSize: "15px",
    outline: "none",
    resize: "none" as const,
    transition: "border-color 0.2s",
  };

  const btnBase: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(0, 0, 0, 0.2)",
    color: "#94A3B8",
  };

  const btnActive = (accentColor: string): React.CSSProperties => ({
    ...btnBase,
    background: `${accentColor}15`,
    borderColor: `${accentColor}50`,
    color: accentColor,
  });

  return (
    <div style={pageStyle}>
      {/* Background glow effects */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "20%", width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
        {/* ─── Header ──────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#A78BFA", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            <Sparkles style={{ width: 14, height: 14 }} />
            AI-Powered Script Engine
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px", background: "linear-gradient(135deg, #FFFFFF, #C4B5FD, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Soch AI Script
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Generate psychologically-engineered video scripts with hooks that stop the scroll.
          </p>
        </motion.div>

        {/* ─── Input Card ──────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ ...cardStyle, marginBottom: 24 }}>
          {/* Topic */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Mic style={{ width: 15, height: 15, color: "#A78BFA" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>What's your script about?</span>
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Why most people never escape the 9-to-5 grind…"
              rows={3}
              maxLength={500}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <div style={{ textAlign: "right", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>{topic.length}/500</span>
            </div>
          </div>

          {/* Duration + Language */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Clock style={{ width: 15, height: 15, color: "#60A5FA" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>Duration</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {DURATIONS.map((d) => (
                  <button key={d.value} onClick={() => setDuration(d.value)}
                    style={duration === d.value ? btnActive("#60A5FA") : btnBase}>
                    <span style={{ fontSize: 16 }}>{d.icon}</span>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
              {duration === "custom" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <input type="number" min={0.5} max={10} step={0.5} value={customDuration}
                    onChange={(e) => setCustomDuration(parseFloat(e.target.value) || 1)}
                    style={{ ...inputStyle, width: 80, padding: "8px 12px", fontSize: 13 }} />
                  <span style={{ fontSize: 13, color: "#64748B" }}>minutes</span>
                </div>
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Globe style={{ width: 15, height: 15, color: "#34D399" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>Language</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {LANGUAGES.map((l) => (
                  <button key={l.value} onClick={() => setLanguage(l.value)}
                    style={language === l.value ? btnActive("#34D399") : btnBase}>
                    <span style={{ fontSize: 16 }}>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audience */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Users style={{ width: 15, height: 15, color: "#22D3EE" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>Target Audience</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {AUDIENCES.map((a) => (
                <button key={a.value} onClick={() => setAudience(a.value)}
                  style={audience === a.value ? btnActive("#22D3EE") : btnBase}>
                  <span style={{ fontSize: 18 }}>{a.emoji}</span>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
            {audience === "custom" && (
              <input type="text" value={customAudience} onChange={(e) => setCustomAudience(e.target.value)}
                placeholder="Describe your target audience..."
                style={{ ...inputStyle, marginTop: 10, padding: "10px 14px", fontSize: 13 }} />
            )}
          </div>

          {/* Emotional Intensity */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Flame style={{ width: 15, height: 15, color: "#FB923C" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>Emotional Intensity</span>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                background: `${INTENSITY_COLORS[emotionalIntensity]}20`,
                color: INTENSITY_COLORS[emotionalIntensity],
              }}>
                {emotionalIntensity} – {INTENSITY_LABELS[emotionalIntensity]}
              </span>
            </div>
            <div style={{ padding: "0 2px" }}>
              <input
                type="range" min={1} max={5} value={emotionalIntensity}
                onChange={(e) => setEmotionalIntensity(parseInt(e.target.value))}
                style={{
                  width: "100%", height: 6, borderRadius: 3, appearance: "none" as any, cursor: "pointer",
                  background: `linear-gradient(to right, ${INTENSITY_COLORS[emotionalIntensity]} ${((emotionalIntensity - 1) / 4) * 100}%, rgba(255,255,255,0.08) ${((emotionalIntensity - 1) / 4) * 100}%)`,
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, padding: "0 2px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} style={{ fontSize: 10, color: emotionalIntensity === n ? "#E2E8F0" : "#475569" }}>{n}</span>
                ))}
              </div>
            </div>
            {emotionalIntensity === 5 && (
              <input type="text" value={customIntensity} onChange={(e) => setCustomIntensity(e.target.value)}
                placeholder="Describe your custom intensity..."
                style={{ ...inputStyle, marginTop: 10, padding: "10px 14px", fontSize: 13 }} />
            )}
          </div>

          {/* Tone */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Zap style={{ width: 15, height: 15, color: "#FBBF24" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>Tone</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TONES.map((t) => (
                <button key={t.value} onClick={() => setTone(t.value)} style={{
                  padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s",
                  background: tone === t.value ? `${t.border}20` : "rgba(0,0,0,0.2)",
                  border: `1.5px solid ${tone === t.value ? t.border : "rgba(255,255,255,0.08)"}`,
                  color: tone === t.value ? t.border : "#94A3B8",
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <MessageSquare style={{ width: 15, height: 15, color: "#F472B6" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>Call to Action (CTA)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: ctaEnabled ? 12 : 0 }}>
              <button onClick={() => setCtaEnabled(!ctaEnabled)} style={{
                position: "relative", width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                transition: "background 0.2s",
                background: ctaEnabled ? "#8B5CF6" : "rgba(255,255,255,0.1)",
              }}>
                <div style={{
                  position: "absolute", top: 2, width: 20, height: 20, borderRadius: 10,
                  background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  left: ctaEnabled ? 22 : 2,
                }} />
              </button>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>{ctaEnabled ? "CTA Enabled" : "No CTA"}</span>
            </div>
            {ctaEnabled && (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CTA_OPTIONS.map((c) => (
                    <button key={c} onClick={() => setCtaType(c)} style={{
                      padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s",
                      background: ctaType === c ? "rgba(244,114,182,0.15)" : "rgba(0,0,0,0.2)",
                      border: `1px solid ${ctaType === c ? "rgba(244,114,182,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: ctaType === c ? "#F472B6" : "#94A3B8",
                    }}>
                      {c === "custom" ? "Custom" : c}
                    </button>
                  ))}
                </div>
                {ctaType === "custom" && (
                  <input type="text" value={customCta} onChange={(e) => setCustomCta(e.target.value)}
                    placeholder="Enter your custom CTA..."
                    style={{ ...inputStyle, marginTop: 10, padding: "10px 14px", fontSize: 13 }} />
                )}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              style={{
                flex: 1, padding: "16px 24px", borderRadius: 12, border: "none", cursor: topic.trim() && !isGenerating ? "pointer" : "not-allowed",
                fontSize: 15, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: topic.trim() && !isGenerating ? "linear-gradient(135deg, #7C3AED, #6366F1)" : "#334155",
                boxShadow: topic.trim() && !isGenerating ? "0 4px 20px rgba(124,58,237,0.3)" : "none",
                transition: "all 0.2s",
              }}>
              {isGenerating ? (
                <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Generating your script...</>
              ) : (
                <><Sparkles style={{ width: 18, height: 18 }} /> Generate Script</>
              )}
            </motion.button>
            {result && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                style={{
                  padding: "16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.2)", cursor: "pointer", color: "#94A3B8",
                }}>
                <RotateCcw style={{ width: 18, height: 18 }} />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ─── Error ───────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ ...cardStyle, borderColor: "rgba(239,68,68,0.3)", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <AlertTriangle style={{ width: 18, height: 18, color: "#F87171", flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FCA5A5", marginBottom: 4 }}>Generation Failed</div>
                <div style={{ fontSize: 13, color: "#FDA4AF", lineHeight: 1.5 }}>{error}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Loading Skeleton ────────────── */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ ...cardStyle, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 style={{ width: 20, height: 20, color: "#A78BFA", animation: "spin 1s linear infinite" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>Crafting your script...</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Running Hook → Story → Retention engines</div>
                </div>
              </div>
              {[85, 72, 60, 48, 35].map((w, i) => (
                <div key={i} style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.04)", width: `${w}%`, marginBottom: 12 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Script Result ───────────────── */}
        <AnimatePresence>
          {result && !isGenerating && (
            <motion.div ref={resultRef} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Header + Copy */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                  <Sparkles style={{ width: 18, height: 18, color: "#A78BFA" }} /> Generated Script
                </h2>
                <button onClick={handleCopyFull} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
                  background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
                  color: "#C4B5FD", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  {copiedSection === "full" ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  {copiedSection === "full" ? "Copied!" : "Copy Full Script"}
                </button>
              </div>

              {/* Hook */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                style={{ ...cardStyle, borderColor: "rgba(139,92,246,0.25)", marginBottom: 12, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: "#8B5CF6" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#A78BFA" }}>Hook</span>
                    <span style={{ fontSize: 11, color: "#64748B", background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: 8 }}>{result.hook.type}</span>
                  </div>
                  <button onClick={() => handleCopy(result.hook.text, "hook")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4 }}>
                    {copiedSection === "hook" ? <Check style={{ width: 14, height: 14, color: "#22C55E" }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
                <p style={{ fontSize: 18, fontWeight: 600, color: "#F1F5F9", lineHeight: 1.6, margin: 0 }}>{result.hook.text}</p>
              </motion.div>

              {/* Body */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                style={{ ...cardStyle, marginBottom: 12, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: "#3B82F6" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#60A5FA" }}>Body</span>
                    <span style={{ fontSize: 11, color: "#64748B", background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: 8 }}>{result.body.framework}</span>
                  </div>
                  <button onClick={() => handleCopy(result.body.text, "body")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4 }}>
                    {copiedSection === "body" ? <Check style={{ width: 14, height: 14, color: "#22C55E" }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
                <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.9, whiteSpace: "pre-line" as const }}>{result.body.text}</div>
              </motion.div>

              {/* CTA */}
              {result.cta.included && result.cta.text && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  style={{ ...cardStyle, borderColor: "rgba(244,114,182,0.25)", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: "#F472B6" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#F472B6" }}>Call to Action</span>
                    </div>
                    <button onClick={() => handleCopy(result.cta.text, "cta")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4 }}>
                      {copiedSection === "cta" ? <Check style={{ width: 14, height: 14, color: "#22C55E" }} /> : <Copy style={{ width: 14, height: 14 }} />}
                    </button>
                  </div>
                  <p style={{ fontSize: 14, color: "#FBCFE8", lineHeight: 1.6, margin: 0 }}>{result.cta.text}</p>
                </motion.div>
              )}

              {/* Metadata */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                style={{ ...cardStyle, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: "#34D399" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#34D399" }}>Script Details</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { label: "Words", value: result.metadata.wordCount, icon: "📝" },
                    { label: "Duration", value: result.metadata.estimatedDuration, icon: "⏱️" },
                    { label: "Hook", value: result.metadata.hookType, icon: "🪝" },
                    { label: "Framework", value: result.metadata.frameworkUsed, icon: "📐" },
                  ].map((item, i) => (
                    <div key={i} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>{item.icon}</div>
                      <div style={{ fontSize: 10, color: "#64748B", marginBottom: 2, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#E2E8F0", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quality Scores */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                style={{ ...cardStyle }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: "#FBBF24" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#FBBF24" }}>Quality Score</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-start" }}>
                  <ScoreRing score={result.qualityScores.hookStrength} label="Hook Strength" />
                  <ScoreRing score={result.qualityScores.retentionPotential} label="Retention Potential" />
                  <ScoreRing score={result.qualityScores.emotionalIntensityMatch} label="Intensity Match" />
                  {result.cta.included && <ScoreRing score={result.qualityScores.ctaAlignment} label="CTA Alignment" />}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 40, paddingBottom: 24 }}>
          <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>Powered by Soch AI • Psychological Hook Engine + Structured Storytelling</p>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ScriptGenerator;
