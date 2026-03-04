import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Copy, Check, Loader2, Send, Settings2, X, ChevronDown
} from "lucide-react";
import { generateScript, type ScriptGenerationParams, type ScriptResult } from "../api/scriptGeneratorApi";

// ─── Suggestion Chips ────────────────────────────────────────────
const SUGGESTIONS = [
  "Why most people never escape the 9-to-5 grind",
  "3 habits that changed my life forever",
  "The truth nobody tells you about success",
  "How to build discipline in 30 days",
];

const DURATIONS = [
  { value: "30s", label: "30 sec" },
  { value: "1min", label: "1 min" },
  { value: "custom", label: "Custom" },
] as const;

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Hinglish", label: "Hinglish" },
] as const;

const TONES = [
  "Inspirational", "Dark", "Confident", "Vulnerable", "Raw", "Aggressive", "Storytelling"
] as const;

const AUDIENCES = [
  { value: "Students", label: "Students" },
  { value: "Entrepreneurs", label: "Entrepreneurs" },
  { value: "Creators", label: "Creators" },
  { value: "custom", label: "Custom" },
] as const;

const INTENSITY_LABELS = ["", "Calm", "Motivational", "Strong", "Aggressive", "Custom"];
const INTENSITY_COLORS = ["", "#94A3B8", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

const CTA_OPTIONS = [
  "Follow for more", "Subscribe", "Comment", "Save", "custom"
] as const;

// ─── Main Component ──────────────────────────────────────────────
const ScriptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<string>("1min");
  const [customDuration, setCustomDuration] = useState<number>(2);
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Inspirational");
  const [audience, setAudience] = useState("Creators");
  const [customAudience, setCustomAudience] = useState("");
  const [emotionalIntensity, setEmotionalIntensity] = useState(3);
  const [customIntensity, setCustomIntensity] = useState("");
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaType, setCtaType] = useState("Follow for more");
  const [customCta, setCustomCta] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastTopic, setLastTopic] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSettings]);

  const handleGenerate = async (customTopic?: string) => {
    const finalTopic = (customTopic || topic).trim();
    if (!finalTopic) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setLastTopic(finalTopic);
    if (customTopic) setTopic(customTopic);
    setShowSettings(false);

    const params: ScriptGenerationParams = {
      topic: finalTopic,
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

  const handleCopy = async () => {
    if (!result) return;
    const full = [
      result.hook.text,
      "",
      result.body.text,
      result.cta.included ? `\n${result.cta.text}` : "",
    ].join("\n").trim();
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // ─── Styles ─────────────────────────────────────────────────
  const page: React.CSSProperties = {
    height: "100dvh",
    overflowY: "auto",
    background: "#171717",
    color: "#E5E5E5",
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
  };

  const container: React.CSSProperties = {
    flex: 1,
    maxWidth: 680,
    width: "100%",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={page} className="custom-scrollbar">
      <div style={container}>
        {/* ─── Main content area ─────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: result || isGenerating || error ? "flex-start" : "center", paddingTop: result || isGenerating || error ? 48 : 0, paddingBottom: 140 }}>

          {/* ─── Empty State ─────────────────────────── */}
          {!result && !isGenerating && !error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: "rgba(139,92,246,0.12)", marginBottom: 24 }}>
                <Sparkles style={{ width: 26, height: 26, color: "#A78BFA" }} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 10px", color: "#F5F5F5", letterSpacing: "-0.01em" }}>
                What script do you need?
              </h1>
              <p style={{ fontSize: 15, color: "#737373", margin: "0 0 36px", lineHeight: 1.5 }}>
                Describe your topic and get a ready-to-use video script instantly.
              </p>

              {/* Suggestion Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleGenerate(s)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 20,
                      border: "1px solid #303030",
                      background: "transparent",
                      color: "#A3A3A3",
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      lineHeight: 1.3,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#525252"; e.currentTarget.style.color = "#E5E5E5"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#303030"; e.currentTarget.style.color = "#A3A3A3"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Loading ─────────────────────────────── */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 24 }}>
                {/* User message */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                  <div style={{ padding: "12px 18px", borderRadius: "18px 18px 4px 18px", background: "#2A2A2A", color: "#E5E5E5", fontSize: 14, maxWidth: "80%", lineHeight: 1.5 }}>
                    {lastTopic}
                  </div>
                </div>
                {/* AI typing */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles style={{ width: 16, height: 16, color: "#A78BFA" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#737373", fontSize: 14 }}>
                    <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                    Writing your script...
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Error ───────────────────────────────── */}
          <AnimatePresence>
            {error && !isGenerating && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: "#FCA5A5", lineHeight: 1.5 }}>{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Script Result ───────────────────────── */}
          <AnimatePresence>
            {result && !isGenerating && (
              <motion.div ref={resultRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* User message bubble */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                  <div style={{ padding: "12px 18px", borderRadius: "18px 18px 4px 18px", background: "#2A2A2A", color: "#E5E5E5", fontSize: 14, maxWidth: "80%", lineHeight: 1.5 }}>
                    {lastTopic}
                  </div>
                </div>

                {/* AI response */}
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Sparkles style={{ width: 16, height: 16, color: "#A78BFA" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Script content */}
                    <div style={{ fontSize: 14, color: "#D4D4D4", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                      <div style={{ fontWeight: 600, color: "#F5F5F5", fontSize: 16, marginBottom: 12 }}>
                        {result.hook.text}
                      </div>
                      <div style={{ marginBottom: result.cta.included ? 16 : 0 }}>
                        {result.body.text}
                      </div>
                      {result.cta.included && result.cta.text && (
                        <div style={{ fontStyle: "italic", color: "#A78BFA", paddingTop: 4 }}>
                          {result.cta.text}
                        </div>
                      )}
                    </div>

                    {/* Action bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, paddingTop: 12, borderTop: "1px solid #262626" }}>
                      <button
                        onClick={handleCopy}
                        style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                          borderRadius: 8, border: "1px solid #303030", background: "transparent",
                          color: copied ? "#22C55E" : "#737373", fontSize: 12, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#E5E5E5"; }}
                        onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#737373"; }}
                      >
                        {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <span style={{ fontSize: 11, color: "#525252", marginLeft: 8 }}>
                        {result.metadata.wordCount} words · {result.metadata.estimatedDuration}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Input Bar (fixed at bottom) ───────────── */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, #171717 70%, transparent)",
          padding: "20px 20px 24px",
          zIndex: 10,
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
            {/* Settings Popover */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  ref={settingsRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute", bottom: "100%", left: 0, right: 0,
                    marginBottom: 8, padding: 20, borderRadius: 16,
                    background: "#1E1E1E", border: "1px solid #303030",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                    maxHeight: "60vh", overflowY: "auto" as const,
                  }}
                  className="custom-scrollbar"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#E5E5E5" }}>Settings</span>
                    <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#737373", padding: 4 }}>
                      <X style={{ width: 16, height: 16 }} />
                    </button>
                  </div>

                  {/* Duration */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#737373", marginBottom: 8, fontWeight: 500 }}>Duration</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {DURATIONS.map((d) => (
                        <button key={d.value} onClick={() => setDuration(d.value)} style={{
                          padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                          transition: "all 0.15s", fontWeight: 500,
                          border: duration === d.value ? "1px solid #7C3AED" : "1px solid #303030",
                          background: duration === d.value ? "rgba(124,58,237,0.12)" : "transparent",
                          color: duration === d.value ? "#C4B5FD" : "#A3A3A3",
                        }}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                    {duration === "custom" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        <input type="number" min={0.5} max={10} step={0.5} value={customDuration}
                          onChange={(e) => setCustomDuration(parseFloat(e.target.value) || 1)}
                          style={{
                            width: 70, padding: "6px 10px", borderRadius: 8, fontSize: 13,
                            background: "#262626", border: "1px solid #303030", color: "#E5E5E5", outline: "none",
                          }} />
                        <span style={{ fontSize: 12, color: "#737373" }}>minutes</span>
                      </div>
                    )}
                  </div>

                  {/* Language */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#737373", marginBottom: 8, fontWeight: 500 }}>Language</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {LANGUAGES.map((l) => (
                        <button key={l.value} onClick={() => setLanguage(l.value)} style={{
                          padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                          transition: "all 0.15s", fontWeight: 500,
                          border: language === l.value ? "1px solid #7C3AED" : "1px solid #303030",
                          background: language === l.value ? "rgba(124,58,237,0.12)" : "transparent",
                          color: language === l.value ? "#C4B5FD" : "#A3A3A3",
                        }}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#737373", marginBottom: 8, fontWeight: 500 }}>Tone</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {TONES.map((t) => (
                        <button key={t} onClick={() => setTone(t)} style={{
                          padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                          transition: "all 0.15s", fontWeight: 500,
                          border: tone === t ? "1px solid #7C3AED" : "1px solid #303030",
                          background: tone === t ? "rgba(124,58,237,0.12)" : "transparent",
                          color: tone === t ? "#C4B5FD" : "#A3A3A3",
                        }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audience */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#737373", marginBottom: 8, fontWeight: 500 }}>Target Audience</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {AUDIENCES.map((a) => (
                        <button key={a.value} onClick={() => setAudience(a.value)} style={{
                          padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                          transition: "all 0.15s", fontWeight: 500,
                          border: audience === a.value ? "1px solid #7C3AED" : "1px solid #303030",
                          background: audience === a.value ? "rgba(124,58,237,0.12)" : "transparent",
                          color: audience === a.value ? "#C4B5FD" : "#A3A3A3",
                        }}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                    {audience === "custom" && (
                      <input type="text" value={customAudience} onChange={(e) => setCustomAudience(e.target.value)}
                        placeholder="Describe your audience..."
                        style={{
                          width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13,
                          background: "#262626", border: "1px solid #303030", color: "#E5E5E5", outline: "none",
                          boxSizing: "border-box" as const,
                        }} />
                    )}
                  </div>

                  {/* Emotional Intensity */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#737373", fontWeight: 500 }}>Emotional Intensity</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10,
                        background: `${INTENSITY_COLORS[emotionalIntensity]}20`,
                        color: INTENSITY_COLORS[emotionalIntensity],
                      }}>
                        {emotionalIntensity} – {INTENSITY_LABELS[emotionalIntensity]}
                      </span>
                    </div>
                    <input
                      type="range" min={1} max={5} value={emotionalIntensity}
                      onChange={(e) => setEmotionalIntensity(parseInt(e.target.value))}
                      style={{
                        width: "100%", height: 5, borderRadius: 3, appearance: "none" as any, cursor: "pointer",
                        background: `linear-gradient(to right, ${INTENSITY_COLORS[emotionalIntensity]} ${((emotionalIntensity - 1) / 4) * 100}%, #303030 ${((emotionalIntensity - 1) / 4) * 100}%)`,
                        outline: "none",
                      }}
                    />
                    {emotionalIntensity === 5 && (
                      <input type="text" value={customIntensity} onChange={(e) => setCustomIntensity(e.target.value)}
                        placeholder="Describe your custom intensity..."
                        style={{
                          width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13,
                          background: "#262626", border: "1px solid #303030", color: "#E5E5E5", outline: "none",
                          boxSizing: "border-box" as const,
                        }} />
                    )}
                  </div>

                  {/* CTA */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ctaEnabled ? 10 : 0 }}>
                      <span style={{ fontSize: 12, color: "#737373", fontWeight: 500 }}>Call to Action</span>
                      <button onClick={() => setCtaEnabled(!ctaEnabled)} style={{
                        position: "relative" as const, width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                        transition: "background 0.2s",
                        background: ctaEnabled ? "#7C3AED" : "#303030",
                      }}>
                        <div style={{
                          position: "absolute" as const, top: 2, width: 16, height: 16, borderRadius: 8,
                          background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                          left: ctaEnabled ? 18 : 2,
                        }} />
                      </button>
                      <span style={{ fontSize: 11, color: "#525252" }}>{ctaEnabled ? "On" : "Off"}</span>
                    </div>
                    {ctaEnabled && (
                      <div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {CTA_OPTIONS.map((c) => (
                            <button key={c} onClick={() => setCtaType(c)} style={{
                              padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                              transition: "all 0.15s", fontWeight: 500,
                              border: ctaType === c ? "1px solid #7C3AED" : "1px solid #303030",
                              background: ctaType === c ? "rgba(124,58,237,0.12)" : "transparent",
                              color: ctaType === c ? "#C4B5FD" : "#A3A3A3",
                            }}>
                              {c === "custom" ? "Custom" : c}
                            </button>
                          ))}
                        </div>
                        {ctaType === "custom" && (
                          <input type="text" value={customCta} onChange={(e) => setCustomCta(e.target.value)}
                            placeholder="Enter your custom CTA..."
                            style={{
                              width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13,
                              background: "#262626", border: "1px solid #303030", color: "#E5E5E5", outline: "none",
                              boxSizing: "border-box" as const,
                            }} />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              padding: "10px 10px 10px 16px", borderRadius: 16,
              background: "#1E1E1E", border: "1px solid #303030",
              transition: "border-color 0.15s",
            }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: "none", background: showSettings ? "rgba(124,58,237,0.15)" : "transparent",
                  color: showSettings ? "#C4B5FD" : "#525252",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s", flexShrink: 0,
                }}
                title="Settings"
              >
                <Settings2 style={{ width: 18, height: 18 }} />
              </button>

              <textarea
                ref={inputRef}
                className="custom-scrollbar"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your script topic..."
                rows={1}
                style={{
                  flex: 1, border: "none", background: "transparent", color: "#E5E5E5",
                  fontSize: 14, outline: "none", resize: "none", lineHeight: 1.5,
                  padding: "8px 0", maxHeight: 120, fontFamily: "inherit",
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleGenerate()}
                disabled={!topic.trim() || isGenerating}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: "none", cursor: topic.trim() && !isGenerating ? "pointer" : "default",
                  background: topic.trim() && !isGenerating ? "#7C3AED" : "#303030",
                  color: topic.trim() && !isGenerating ? "#fff" : "#525252",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s", flexShrink: 0,
                }}
              >
                {isGenerating ? (
                  <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                ) : (
                  <Send style={{ width: 16, height: 16 }} />
                )}
              </motion.button>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span style={{ fontSize: 11, color: "#404040" }}>Powered by Soch AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }
      `}</style>
    </div>
  );
};

export default ScriptGenerator;
