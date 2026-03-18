import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Copy, Check, Loader2, Send, Settings2, X,
  Menu, Trash2, Clock
} from "lucide-react";
import {
  generateScript, saveScriptHistory, getScriptHistory, getScriptHistoryItem, getScriptHistorySession, deleteScriptHistorySession, regenerateSection,
  type ScriptGenerationParams, type ScriptResult, type ScriptHistoryItem
} from "../api/scriptGeneratorApi";
import Cookies from "js-cookie";

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

const GUEST_FREE_LIMIT = 5;
const GUEST_USAGE_KEY = "soch_script_generator_guest_usage_count";

// ─── Date grouping helper ────────────────────────────────────────
const groupByDate = (items: ScriptHistoryItem[]) => {
  const groups: { label: string; items: ScriptHistoryItem[] }[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);

  const todayItems: ScriptHistoryItem[] = [];
  const yesterdayItems: ScriptHistoryItem[] = [];
  const weekItems: ScriptHistoryItem[] = [];
  const olderItems: ScriptHistoryItem[] = [];

  items.forEach((item) => {
    const d = new Date(item.createdAt);
    if (d >= today) todayItems.push(item);
    else if (d >= yesterday) yesterdayItems.push(item);
    else if (d >= weekAgo) weekItems.push(item);
    else olderItems.push(item);
  });

  if (todayItems.length) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (weekItems.length) groups.push({ label: "Previous 7 days", items: weekItems });
  if (olderItems.length) groups.push({ label: "Older", items: olderItems });
  return groups;
};


// ─── Main Component ──────────────────────────────────────────────
const ScriptGenerator = () => {
  const navigate = useNavigate();
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
  const [referenceUrl, setReferenceUrl] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [sessionScript, setSessionScript] = useState<ScriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastTopic, setLastTopic] = useState("");
  const [sessionRootTopic, setSessionRootTopic] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionTurns, setSessionTurns] = useState<ScriptHistoryItem[]>([]);
  const [lastParams, setLastParams] = useState<Partial<ScriptGenerationParams>>({});
  const [guestUsageCount, setGuestUsageCount] = useState<number>(0);
  const [showLimitPrompt, setShowLimitPrompt] = useState(false);

  // Edit popup state
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editDuration, setEditDuration] = useState("1min");
  const [editCustomDuration, setEditCustomDuration] = useState(2);
  const [editLanguage, setEditLanguage] = useState("English");
  const [editTone, setEditTone] = useState("Inspirational");
  const [editAudience, setEditAudience] = useState("Creators");
  const [editCustomAudience, setEditCustomAudience] = useState("");
  const [editIntensity, setEditIntensity] = useState(3);
  const [editCustomIntensity, setEditCustomIntensity] = useState("");
  const [editCtaEnabled, setEditCtaEnabled] = useState(false);
  const [editCtaType, setEditCtaType] = useState("Follow for more");
  const [editCustomCta, setEditCustomCta] = useState("");
  const [editReferenceUrl, setEditReferenceUrl] = useState("");

  // History state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<ScriptHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const editPopupRef = useRef<HTMLDivElement>(null);
  const inputDockRef = useRef<HTMLDivElement>(null);

  const [keyboardInset, setKeyboardInset] = useState(0);
  const [inputDockHeight, setInputDockHeight] = useState(140);

  // Individual section regeneration state
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [sectionAbortController, setSectionAbortController] = useState<AbortController | null>(null);

  const isLoggedIn = !!Cookies.get("authToken");

  const createSessionId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  };

  const getStoredGuestUsage = () => {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage.getItem(GUEST_USAGE_KEY);
    const parsed = parseInt(raw || "0", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  const setStoredGuestUsage = (count: number) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(GUEST_USAGE_KEY, String(Math.max(0, count)));
  };

  // Load history when sidebar opens
  const loadHistory = useCallback(async () => {
    if (!isLoggedIn) return;
    setHistoryLoading(true);
    const res = await getScriptHistory();
    if (res.success && res.data) setHistory(res.data);
    setHistoryLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (sidebarOpen && isLoggedIn) loadHistory();
  }, [sidebarOpen, isLoggedIn, loadHistory]);

  useEffect(() => {
    if (isLoggedIn) {
      setGuestUsageCount(0);
      setShowLimitPrompt(false);
      return;
    }

    const count = getStoredGuestUsage();
    setGuestUsageCount(count);
    setShowLimitPrompt(count >= GUEST_FREE_LIMIT);
  }, [isLoggedIn]);

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

  // Cycle through generation steps while generating
  useEffect(() => {
    if (!isGenerating) {
      setGenerationStep(0);
      return;
    }
    const timings = [1800, 3000, 2500]; // ms to wait before moving to next step
    let step = 0;
    setGenerationStep(0);
    const advance = () => {
      step++;
      if (step <= 3) {
        setGenerationStep(step);
      }
    };
    const timers = timings.map((ms, i) =>
      setTimeout(advance, timings.slice(0, i + 1).reduce((a, b) => a + b, 0))
    );
    return () => timers.forEach(clearTimeout);
  }, [isGenerating]);

  // Close edit popup on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (editPopupRef.current && !editPopupRef.current.contains(e.target as Node)) {
        setShowEditPopup(false);
      }
    };
    if (showEditPopup) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEditPopup]);

  // Keep the input dock above mobile keyboards using the visual viewport API.
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const viewport = window.visualViewport;
    const updateKeyboardInset = () => {
      const inset = Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
      setKeyboardInset(inset);
    };

    updateKeyboardInset();
    viewport.addEventListener("resize", updateKeyboardInset);
    viewport.addEventListener("scroll", updateKeyboardInset);
    window.addEventListener("orientationchange", updateKeyboardInset);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardInset);
      viewport.removeEventListener("scroll", updateKeyboardInset);
      window.removeEventListener("orientationchange", updateKeyboardInset);
    };
  }, []);

  // Track dock height so result/action content always remains scrollable above it.
  useEffect(() => {
    const node = inputDockRef.current;
    if (!node) return;

    const updateDockHeight = () => {
      const rect = node.getBoundingClientRect();
      setInputDockHeight(Math.max(120, Math.round(rect.height)));
    };

    updateDockHeight();

    if (typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver(updateDockHeight);
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, []);

  const handleGenerate = async (customTopic?: string) => {
    const finalTopic = (customTopic || topic).trim();
    if (!finalTopic) return;
    if (!isLoggedIn && guestUsageCount >= GUEST_FREE_LIMIT) {
      setShowLimitPrompt(true);
      setError("Free limit reached. Please log in or upgrade to continue.");
      return;
    }

    const hasExistingSession = !!sessionScript && !!sessionRootTopic;
    const rootTopic = sessionRootTopic || finalTopic;
    const currentResult = sessionScript;
    const resolvedSessionId = activeSessionId || createSessionId();

    // Create abort controller for cancellation
    const controller = new AbortController();
    setAbortController(controller);

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setLastTopic(finalTopic);
    if (!sessionRootTopic) setSessionRootTopic(finalTopic);
    if (!activeSessionId) setActiveSessionId(resolvedSessionId);
    setActiveHistoryId(null);
    if (customTopic) setTopic(customTopic);
    setShowSettings(false);

    const params: ScriptGenerationParams = {
      topic: rootTopic,
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
      referenceUrl: referenceUrl.trim() || undefined,
      isFollowUp: hasExistingSession,
      followUpInstruction: hasExistingSession ? finalTopic : undefined,
      previousTopic: hasExistingSession ? sessionRootTopic : undefined,
      currentScript: hasExistingSession ? currentResult || undefined : undefined,
    };
    setLastParams(params);

    try {
      const response = await generateScript(params, controller.signal);
      if (response.success && response.data) {
        setResult(response.data);
        setSessionScript(response.data);
        setSessionTurns((prev) => {
          const turn: ScriptHistoryItem = {
            _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            topic: rootTopic,
            sessionId: resolvedSessionId,
            turnNumber: (prev.length || 0) + 1,
            userPrompt: finalTopic,
            isFollowUp: hasExistingSession,
            result: response.data,
            createdAt: new Date().toISOString(),
          };

          if (!hasExistingSession) return [turn];
          return [...prev, turn];
        });

        if (!isLoggedIn) {
          const nextGuestCount = guestUsageCount + 1;
          setGuestUsageCount(nextGuestCount);
          setStoredGuestUsage(nextGuestCount);
          if (nextGuestCount >= GUEST_FREE_LIMIT) setShowLimitPrompt(true);
        }
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);

        // Auto-save if logged in
        if (isLoggedIn) {
          saveScriptHistory(rootTopic, params, response.data, {
            sessionId: resolvedSessionId,
            userPrompt: finalTopic,
            isFollowUp: hasExistingSession,
          }).then((saveRes) => {
            if (saveRes.success && saveRes.data?.sessionId) {
              setActiveSessionId(saveRes.data.sessionId);
              setSessionTurns((prev) => {
                if (prev.length === 0) return prev;
                const cloned = [...prev];
                const latest = cloned[cloned.length - 1];
                cloned[cloned.length - 1] = {
                  ...latest,
                  _id: saveRes.data?.id || latest._id,
                  sessionId: saveRes.data?.sessionId || latest.sessionId,
                  turnNumber: saveRes.data?.turnNumber || latest.turnNumber,
                };
                return cloned;
              });
              loadHistory();
            }
          });
        }
      } else {
        setError(response.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        setError("Generation cancelled by user.");
      } else {
        setError(err.message || "Connection failed.");
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  // Cancel generation
  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsGenerating(false);
      setGenerationStep(0);
      setError("Generation cancelled by user.");
    }
  };

  const handleLoadHistory = async (item: ScriptHistoryItem) => {
    setActiveHistoryId(item._id);
    setLastTopic(item.topic);
    setSessionRootTopic(item.topic);
    const sessionId = item.sessionId || item._id;
    setActiveSessionId(sessionId);
    setTopic("");
    setError(null);

    const sessionRes = await getScriptHistorySession(sessionId);
    if (sessionRes.success && sessionRes.data && sessionRes.data.length > 0) {
      setSessionTurns(sessionRes.data);
      const latestTurn = sessionRes.data[sessionRes.data.length - 1];
      if (latestTurn?.result) {
        setResult(latestTurn.result);
        setSessionScript(latestTurn.result);
        setLastTopic(latestTurn.userPrompt || latestTurn.topic);
      }
      setSidebarOpen(false);
      return;
    }

    // Fallback for legacy entries with no session metadata
    const res = await getScriptHistoryItem(item._id);
    if (res.success && res.data?.result) {
      setSessionTurns([res.data]);
      setResult(res.data.result);
      setSessionScript(res.data.result);
    }
    setSidebarOpen(false);
  };

  const handleDeleteHistory = async (e: React.MouseEvent, id: string, sessionId?: string) => {
    e.stopPropagation();
    const targetSessionId = sessionId || id;
    const res = await deleteScriptHistorySession(targetSessionId);
    if (res.success) {
      setHistory((prev) => prev.filter((h) => (h.sessionId || h._id) !== targetSessionId));
      if ((activeSessionId || activeHistoryId || '') === targetSessionId) {
        setResult(null);
        setSessionScript(null);
        setLastTopic("");
        setSessionRootTopic("");
        setSessionTurns([]);
        setActiveSessionId(null);
        setActiveHistoryId(null);
      }
    }
  };

  // Edit: open dedicated edit popup with current settings prefilled
  const handleEdit = () => {
    setEditDuration(duration);
    setEditCustomDuration(customDuration);
    setEditLanguage(language);
    setEditTone(tone);
    setEditAudience(audience);
    setEditCustomAudience(customAudience);
    setEditIntensity(emotionalIntensity);
    setEditCustomIntensity(customIntensity);
    setEditCtaEnabled(ctaEnabled);
    setEditCtaType(ctaType);
    setEditCustomCta(customCta);
    setEditReferenceUrl(referenceUrl);
    setShowEditPopup(true);
    
    // Auto-scroll to edit popup
    setTimeout(() => {
      editPopupRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }, 100);
  };

  // Save & Regenerate: apply edited settings, then regenerate with same topic
  const handleSaveAndRegenerate = () => {
    // Apply edits to main state
    setDuration(editDuration);
    setCustomDuration(editCustomDuration);
    setLanguage(editLanguage);
    setTone(editTone);
    setAudience(editAudience);
    setCustomAudience(editCustomAudience);
    setEmotionalIntensity(editIntensity);
    setCustomIntensity(editCustomIntensity);
    setCtaEnabled(editCtaEnabled);
    setCtaType(editCtaType);
    setCustomCta(editCustomCta);
    setReferenceUrl(editReferenceUrl);
    setShowEditPopup(false);

    const resolvedSessionId = activeSessionId || createSessionId();

    // Build params with edited values and regenerate
    const params: ScriptGenerationParams = {
      topic: sessionRootTopic || lastTopic,
      duration: editDuration as "30s" | "1min" | "custom",
      customDuration: editDuration === "custom" ? editCustomDuration : undefined,
      language: editLanguage as "English" | "Hindi" | "Hinglish",
      audience: editAudience as "Students" | "Entrepreneurs" | "Creators" | "custom",
      customAudience: editAudience === "custom" ? editCustomAudience : undefined,
      emotionalIntensity: editIntensity,
      customIntensity: editIntensity === 5 ? editCustomIntensity : undefined,
      tone: editTone,
      ctaEnabled: editCtaEnabled,
      ctaType: editCtaEnabled ? editCtaType : undefined,
      customCta: editCtaEnabled && editCtaType === "custom" ? editCustomCta : undefined,
      referenceUrl: editReferenceUrl.trim() || undefined,
      isFollowUp: true,
      followUpInstruction: `Regenerate with updated settings. Latest user ask: ${lastTopic}`,
      previousTopic: sessionRootTopic || lastTopic,
      currentScript: sessionScript || undefined,
    };

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setLastParams(params);

    generateScript(params).then((response) => {
      if (response.success && response.data) {
        setResult(response.data);
        setSessionScript(response.data);
        if (!activeSessionId) setActiveSessionId(resolvedSessionId);
        setSessionTurns((prev) => ([
          ...prev,
          {
            _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            topic: sessionRootTopic || lastTopic,
            sessionId: resolvedSessionId,
            turnNumber: (prev.length || 0) + 1,
            userPrompt: `Regenerate: ${lastTopic}`,
            isFollowUp: true,
            result: response.data,
            createdAt: new Date().toISOString(),
          }
        ]));
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
        if (isLoggedIn) {
          saveScriptHistory(sessionRootTopic || lastTopic, params, response.data, {
            sessionId: resolvedSessionId,
            userPrompt: `Regenerate: ${lastTopic}`,
            isFollowUp: true,
          }).then((saveRes) => {
            if (saveRes.success) loadHistory();
          });
        }
      } else {
        setError(response.error || "Something went wrong.");
      }
      setIsGenerating(false);
    }).catch((err: any) => {
      setError(err.message || "Connection failed.");
      setIsGenerating(false);
    });
  };

  // Handle individual section regeneration
  const handleRegenerateSection = async (section: 'hook' | 'body' | 'cta') => {
    if (!result || !lastParams) return;

    const controller = new AbortController();
    setSectionAbortController(controller);
    setRegeneratingSection(section);
    setError(null);

    try {
      const response = await regenerateSection(section, lastParams, result, undefined, controller.signal);
      
      if (response.success && response.data) {
        // Update the specific section in the result
        setResult(prevResult => {
          if (!prevResult) return prevResult;
          return {
            ...prevResult,
            [section]: response.data[section]
          };
        });
        setSessionScript(prevScript => {
          if (!prevScript) return prevScript;
          return {
            ...prevScript,
            [section]: response.data[section]
          };
        });

        const updatedResult = {
          ...result,
          [section]: response.data[section]
        } as ScriptResult;
        const resolvedSessionId = activeSessionId || createSessionId();
        if (!activeSessionId) setActiveSessionId(resolvedSessionId);
        setSessionTurns((prev) => ([
          ...prev,
          {
            _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            topic: sessionRootTopic || lastTopic,
            sessionId: resolvedSessionId,
            turnNumber: (prev.length || 0) + 1,
            userPrompt: `Regenerate ${section}`,
            isFollowUp: true,
            result: updatedResult,
            createdAt: new Date().toISOString(),
          }
        ]));

        // Auto-save if logged in
        if (isLoggedIn) {
          saveScriptHistory(sessionRootTopic || lastTopic, lastParams, updatedResult, {
            sessionId: resolvedSessionId,
            userPrompt: `Regenerate ${section}`,
            isFollowUp: true,
          }).then((saveRes) => {
            if (saveRes.success) loadHistory();
          });
        }
      } else {
        setError(response.error || `Failed to regenerate ${section}. Please try again.`);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        setError(`${section} regeneration cancelled by user.`);
      } else {
        setError(err.message || `Connection failed while regenerating ${section}.`);
      }
    } finally {
      setRegeneratingSection(null);
      setSectionAbortController(null);
    }
  };

  // Cancel section regeneration
  const handleCancelSectionRegeneration = () => {
    if (sectionAbortController) {
      sectionAbortController.abort();
      setSectionAbortController(null);
      setRegeneratingSection(null);
      setError("Section regeneration cancelled by user.");
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

  const sessionSummaries = useMemo(() => {
    const map = new Map<string, ScriptHistoryItem>();
    history.forEach((item) => {
      const sid = item.sessionId || item._id;
      if (!map.has(sid)) map.set(sid, item);
    });
    return Array.from(map.values());
  }, [history]);

  const historyGroups = groupByDate(sessionSummaries);
  const settingsMaxHeight = Math.max(
    220,
    (typeof window !== "undefined" ? window.innerHeight : 800) - keyboardInset - 160
  );
  const isGuestLimitReached = !isLoggedIn && guestUsageCount >= GUEST_FREE_LIMIT;

  // ─── Styles ─────────────────────────────────────────────────
  const page: React.CSSProperties = {
    height: "100dvh",
    overflowY: "auto",
    background: "#FFFFFF",
    color: "#1A1A1A",
    fontFamily: "'Gothic A1', -apple-system, system-ui, sans-serif",
    display: "flex",
  };

  const sidebarStyle: React.CSSProperties = {
    width: 280,
    height: "100dvh",
    background: "#F8F8F8",
    borderRight: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflowY: "auto",
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    overflowY: "auto",
    position: "relative",
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
      {/* ─── Sidebar ─────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)",
                zIndex: 20, display: "none",
              }}
              className="sidebar-overlay"
            />
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ ...sidebarStyle, zIndex: 21, position: "fixed", left: 0, top: 0 }}
              className="custom-scrollbar"
            >
              {/* Sidebar header */}
              <div style={{
                padding: "16px 16px 12px", display: "flex", alignItems: "center",
                justifyContent: "space-between", borderBottom: "1px solid #E5E7EB",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock style={{ width: 15, height: 15, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>History</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} style={{
                  background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4,
                }}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              {/* New script button */}
              <div style={{ padding: "12px 12px 4px" }}>
                <button onClick={() => {
                  setResult(null); setSessionScript(null); setSessionTurns([]); setLastTopic(""); setSessionRootTopic(""); setActiveSessionId(null); setActiveHistoryId(null);
                  setTopic(""); setError(null); setSidebarOpen(false);
                }} style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1px solid #E5E7EB", background: "transparent",
                  color: "#6B7280", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.15s",
                }}>
                  <Sparkles style={{ width: 14, height: 14 }} />
                  New Script
                </button>
              </div>

              {/* History list */}
              <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }} className="custom-scrollbar">
                {!isLoggedIn && (
                  <div style={{ padding: "20px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                      Log in to save and access your script history.
                    </p>
                  </div>
                )}

                {isLoggedIn && historyLoading && (
                  <div style={{ padding: "20px 16px", textAlign: "center" }}>
                    <Loader2 style={{ width: 16, height: 16, color: "#9CA3AF", animation: "spin 1s linear infinite", margin: "0 auto" }} />
                  </div>
                )}

                {isLoggedIn && !historyLoading && history.length === 0 && (
                  <div style={{ padding: "20px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                      No scripts yet. Generate your first one!
                    </p>
                  </div>
                )}

                {isLoggedIn && !historyLoading && historyGroups.map((group) => (
                  <div key={group.label}>
                    <div style={{ padding: "10px 16px 6px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {group.label}
                    </div>
                    {group.items.map((item) => (
                      (() => {
                        const itemSessionId = item.sessionId || item._id;
                        const isActiveSession = (activeSessionId || activeHistoryId || '') === itemSessionId;
                        return (
                      <div
                        key={item._id}
                        onClick={() => handleLoadHistory(item)}
                        style={{
                          padding: "10px 16px", cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "space-between", gap: 8,
                          transition: "background 0.1s",
                          background: isActiveSession ? "rgba(124,58,237,0.08)" : "transparent",
                          borderLeft: isActiveSession ? "2px solid #7C3AED" : "2px solid transparent",
                        }}
                        onMouseEnter={(e) => { if (!isActiveSession) e.currentTarget.style.background = "#F3F4F6"; }}
                        onMouseLeave={(e) => { if (!isActiveSession) e.currentTarget.style.background = "transparent"; }}
                      >
                        <span style={{
                          fontSize: 13, color: isActiveSession ? "#7C3AED" : "#4B5563",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          flex: 1,
                        }}>
                          {item.topic}
                        </span>
                        <button
                          onClick={(e) => handleDeleteHistory(e, item._id, itemSessionId)}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "#D1D5DB", padding: 4, flexShrink: 0, borderRadius: 6,
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#EF4444"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#D1D5DB"}
                        >
                          <Trash2 style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                        );
                      })()
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ────────────────────────── */}
      <div style={mainStyle} className="custom-scrollbar">
        {/* Top bar with menu button */}
        <div style={{
          position: "sticky", top: 0, zIndex: 5, padding: "12px 16px",
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{
            width: 36, height: 36, borderRadius: 10, border: "none",
            background: "transparent", color: "#9CA3AF", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1A1A1A"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#9CA3AF"}
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Soch AI Script</span>
        </div>

        <div style={container}>
          {/* ─── Main content area ─────────────────────── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: result || isGenerating || error ? "flex-start" : "center", paddingTop: result || isGenerating || error ? 16 : 0, paddingBottom: Math.max(140, inputDockHeight + keyboardInset + 24) }}>

            {/* ─── Empty State ─────────────────────────── */}
            {!result && !isGenerating && !error && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: "rgba(139,92,246,0.12)", marginBottom: 24 }}>
                  <Sparkles style={{ width: 26, height: 26, color: "#A78BFA" }} />
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 10px", color: "#111827", letterSpacing: "-0.01em" }}>
                  What script do you need?
                </h1>
                <p style={{ fontSize: 15, color: "#6B7280", margin: "0 0 36px", lineHeight: 1.5 }}>
                  Describe your topic and get a ready-to-use video script instantly.
                </p>

                {/* Suggestion Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleGenerate(s)}
                      style={{
                        padding: "10px 18px", borderRadius: 20,
                        border: "1px solid #D1D5DB", background: "transparent",
                        color: "#374151", fontSize: 13, cursor: "pointer",
                        transition: "all 0.15s", lineHeight: 1.3,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.color = "#111827"; e.currentTarget.style.background = "rgba(124,58,237,0.04)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.background = "transparent"; }}
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
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                    <div style={{ padding: "12px 18px", borderRadius: "18px 18px 4px 18px", background: "#F3F4F6", color: "#1A1A1A", fontSize: 14, maxWidth: "80%", lineHeight: 1.5 }}>
                      {lastTopic}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles style={{ width: 16, height: 16, color: "#A78BFA" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      {/* Step-by-step progress */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                        {[
                          { label: "Generating Hook", color: "#7C3AED" },
                          { label: "Writing Body", color: "#3B82F6" },
                          { label: "Adding CTA", color: "#A78BFA" },
                          { label: "Finishing up", color: "#22C55E" },
                        ].map((s, i) => {
                          const isDone = generationStep > i;
                          const isActive = generationStep === i;
                          const isPending = generationStep < i;
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1, duration: 0.2 }}
                              style={{
                                display: "flex", alignItems: "center", gap: 10,
                                opacity: isPending ? 0.35 : 1,
                                transition: "opacity 0.3s",
                              }}
                            >
                              {isDone ? (
                                <div style={{ width: 20, height: 20, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Check style={{ width: 12, height: 12, color: "#fff" }} />
                                </div>
                              ) : isActive ? (
                                <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Loader2 style={{ width: 16, height: 16, color: s.color, animation: "spin 1s linear infinite" }} />
                                </div>
                              ) : (
                                <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid #D4D4D8`, background: "transparent" }} />
                              )}
                              <span style={{
                                fontSize: 13, fontWeight: isActive ? 600 : 500,
                                color: isDone ? "#22C55E" : isActive ? s.color : "#9CA3AF",
                                transition: "color 0.3s",
                              }}>
                                {isDone ? `${s.label} ✓` : s.label}{isActive ? "..." : ""}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                      {/* Theme tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {[
                          { label: tone, color: "#7C3AED" },
                          { label: language, color: "#6366F1" },
                          { label: duration === "custom" ? `${customDuration}min` : duration === "30s" ? "30 sec" : "1 min", color: "#8B5CF6" },
                          { label: audience === "custom" ? (customAudience || "Custom") : audience, color: "#A78BFA" },
                          ...(referenceUrl ? [{ label: "🔗 Reference", color: "#EC4899" }] : []),
                        ].map((tag, i) => (
                          <span key={i} style={{
                            fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
                            background: `${tag.color}15`, color: tag.color, border: `1px solid ${tag.color}30`,
                          }}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Error ───────────────────────────────── */}
            <AnimatePresence>
              {error && !isGenerating && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: "#DC2626", lineHeight: 1.5 }}>{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Previous Turns Timeline ───────────────── */}
            {sessionTurns.length > 1 && !isGenerating && (
              <div style={{ marginBottom: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Conversation History
                </div>
                {sessionTurns.slice(0, -1).map((turn, index) => (
                  <details key={`${turn._id}-${index}`} style={{ border: "1px solid #E5E7EB", borderRadius: 10, background: "#FAFAFA" }}>
                    <summary style={{ cursor: "pointer", listStyle: "none", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>v{index + 1} · {turn.userPrompt || turn.topic}</span>
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{new Date(turn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </summary>
                    <div style={{ borderTop: "1px solid #E5E7EB", padding: "10px 12px", display: "grid", gap: 8 }}>
                      {turn.result?.hook?.text && (
                        <div style={{ fontSize: 13, color: "#1F2937", whiteSpace: "pre-line" }}><strong>Hook:</strong> {turn.result.hook.text}</div>
                      )}
                      {turn.result?.body?.text && (
                        <div style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-line" }}><strong>Body:</strong> {turn.result.body.text}</div>
                      )}
                      {turn.result?.cta?.included && turn.result?.cta?.text && (
                        <div style={{ fontSize: 13, color: "#6D28D9", whiteSpace: "pre-line" }}><strong>CTA:</strong> {turn.result.cta.text}</div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            )}

            {/* ─── Script Result ───────────────────────── */}
            <AnimatePresence>
              {result && !isGenerating && (
                <motion.div ref={resultRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
                    <div style={{ padding: "12px 18px", borderRadius: "18px 18px 4px 18px", background: "#F3F4F6", color: "#1A1A1A", fontSize: 14, maxWidth: "80%", lineHeight: 1.5 }}>
                      {lastTopic}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Sparkles style={{ width: 16, height: 16, color: "#A78BFA" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Hook Section */}
                      <div style={{ marginBottom: 16, padding: "14px 16px", borderRadius: 12, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#7C3AED" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.8, color: "#7C3AED" }}>Hook</span>
                          </div>
                          {regeneratingSection === 'hook' ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Loader2 style={{ width: 12, height: 12, color: "#7C3AED", animation: "spin 1s linear infinite" }} />
                              <span style={{ fontSize: 10, color: "#7C3AED", fontWeight: 500 }}>Regenerating...</span>
                              <button
                                onClick={handleCancelSectionRegeneration}
                                style={{
                                  background: "none", border: "1px solid #E5E7EB", borderRadius: 4,
                                  padding: "2px 6px", fontSize: 9, color: "#6B7280", cursor: "pointer"
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRegenerateSection('hook')}
                              disabled={isGenerating || regeneratingSection !== null}
                              style={{
                                display: "flex", alignItems: "center", gap: 4, padding: "4px 8px",
                                borderRadius: 6, border: "1px solid #E5E7EB", background: "transparent",
                                color: "#6B7280", fontSize: 10, cursor: regeneratingSection !== null ? "default" : "pointer",
                                transition: "all 0.15s", opacity: regeneratingSection !== null ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) => { if (regeneratingSection === null && !isGenerating) e.currentTarget.style.color = "#7C3AED"; }}
                              onMouseLeave={(e) => { if (regeneratingSection === null && !isGenerating) e.currentTarget.style.color = "#6B7280"; }}
                            >
                              <Sparkles style={{ width: 11, height: 11 }} />
                              Regenerate
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                          {result.hook.text}
                        </div>
                      </div>

                      {/* Body Section */}
                      <div style={{ marginBottom: result.cta.included ? 16 : 0, padding: "14px 16px", borderRadius: 12, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#3B82F6" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.8, color: "#3B82F6" }}>Body</span>
                          </div>
                          {regeneratingSection === 'body' ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Loader2 style={{ width: 12, height: 12, color: "#3B82F6", animation: "spin 1s linear infinite" }} />
                              <span style={{ fontSize: 10, color: "#3B82F6", fontWeight: 500 }}>Regenerating...</span>
                              <button
                                onClick={handleCancelSectionRegeneration}
                                style={{
                                  background: "none", border: "1px solid #E5E7EB", borderRadius: 4,
                                  padding: "2px 6px", fontSize: 9, color: "#6B7280", cursor: "pointer"
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRegenerateSection('body')}
                              disabled={isGenerating || regeneratingSection !== null}
                              style={{
                                display: "flex", alignItems: "center", gap: 4, padding: "4px 8px",
                                borderRadius: 6, border: "1px solid #E5E7EB", background: "transparent",
                                color: "#6B7280", fontSize: 10, cursor: regeneratingSection !== null ? "default" : "pointer",
                                transition: "all 0.15s", opacity: regeneratingSection !== null ? 0.5 : 1,
                              }}
                              onMouseEnter={(e) => { if (regeneratingSection === null && !isGenerating) e.currentTarget.style.color = "#3B82F6"; }}
                              onMouseLeave={(e) => { if (regeneratingSection === null && !isGenerating) e.currentTarget.style.color = "#6B7280"; }}
                            >
                              <Sparkles style={{ width: 11, height: 11 }} />
                              Regenerate
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                          {result.body.text}
                        </div>
                      </div>

                      {/* CTA Section */}
                      {result.cta.included && result.cta.text && (
                        <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#A78BFA" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.8, color: "#A78BFA" }}>Call to Action</span>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: "#7C3AED", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                            {result.cta.text}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 12, borderTop: "1px solid #E5E7EB", flexWrap: "wrap" }}>
                        <button
                          onClick={handleEdit}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                            borderRadius: 8, border: "1px solid #E5E7EB", background: "transparent",
                            color: "#6B7280", fontSize: 12, cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#1A1A1A"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#6B7280"}
                        >
                          <Settings2 style={{ width: 13, height: 13 }} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleGenerate(lastTopic)}
                          disabled={isGenerating}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                            borderRadius: 8, border: "1px solid #E5E7EB", background: "transparent",
                            color: "#6B7280", fontSize: 12, cursor: isGenerating ? "default" : "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { if (!isGenerating) e.currentTarget.style.color = "#1A1A1A"; }}
                          onMouseLeave={(e) => { if (!isGenerating) e.currentTarget.style.color = "#6B7280"; }}
                        >
                          <Sparkles style={{ width: 13, height: 13 }} />
                          Regenerate
                        </button>
                        <button
                          onClick={handleCopy}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                            borderRadius: 8, border: "1px solid #E5E7EB", background: "transparent",
                            color: copied ? "#22C55E" : "#6B7280", fontSize: 12, cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#1A1A1A"; }}
                          onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#6B7280"; }}
                        >
                          {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                        <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>
                          {result.metadata.wordCount} words · {result.metadata.estimatedDuration}
                        </span>
                      </div>

                      {!isLoggedIn && (
                        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB", background: "rgba(124,58,237,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "#4B5563" }}>Log in now to save this script and full chat history.</span>
                          <button
                            onClick={() => navigate('/login', { state: { from: { pathname: '/script-generator' } } })}
                            style={{ border: "none", background: "#7C3AED", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >
                            Login Now
                          </button>
                        </div>
                      )}

                      {/* Edit Popup */}
                      <AnimatePresence>
                        {showEditPopup && (
                          <motion.div
                            ref={editPopupRef}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              marginTop: 16, padding: 20, borderRadius: 16,
                              background: "#FFFFFF", border: "1px solid #E5E7EB",
                              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                              maxHeight: 400, overflowY: "auto" as const,
                            }}
                            className="custom-scrollbar"
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Edit Settings</span>
                              <button onClick={() => setShowEditPopup(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }}>
                                <X style={{ width: 16, height: 16 }} />
                              </button>
                            </div>

                            {/* Duration */}
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Duration</div>
                              <div style={{ display: "flex", gap: 6 }}>
                                {DURATIONS.map((d) => (
                                  <button key={d.value} onClick={() => setEditDuration(d.value)} style={{
                                    padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                    transition: "all 0.15s", fontWeight: 500,
                                    border: editDuration === d.value ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                                    background: editDuration === d.value ? "rgba(124,58,237,0.08)" : "transparent",
                                    color: editDuration === d.value ? "#7C3AED" : "#6B7280",
                                  }}>{d.label}</button>
                                ))}
                              </div>
                              {editDuration === "custom" && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                  <input type="number" min={0.5} max={10} step={0.5} value={editCustomDuration}
                                    onChange={(e) => setEditCustomDuration(parseFloat(e.target.value) || 1)}
                                    style={{ width: 70, padding: "6px 10px", borderRadius: 8, fontSize: 13, background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none" }} />
                                  <span style={{ fontSize: 12, color: "#6B7280" }}>minutes</span>
                                </div>
                              )}
                            </div>

                            {/* Language */}
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Language</div>
                              <div style={{ display: "flex", gap: 6 }}>
                                {LANGUAGES.map((l) => (
                                  <button key={l.value} onClick={() => setEditLanguage(l.value)} style={{
                                    padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                    transition: "all 0.15s", fontWeight: 500,
                                    border: editLanguage === l.value ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                                    background: editLanguage === l.value ? "rgba(124,58,237,0.08)" : "transparent",
                                    color: editLanguage === l.value ? "#7C3AED" : "#6B7280",
                                  }}>{l.label}</button>
                                ))}
                              </div>
                            </div>

                            {/* Tone */}
                            {/* <div style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Tone</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {TONES.map((t) => (
                                  <button key={t} onClick={() => setEditTone(t)} style={{
                                    padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                    transition: "all 0.15s", fontWeight: 500,
                                    border: editTone === t ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                                    background: editTone === t ? "rgba(124,58,237,0.08)" : "transparent",
                                    color: editTone === t ? "#7C3AED" : "#6B7280",
                                  }}>{t}</button>
                                ))}
                              </div>
                            </div> */}

                            {/* Audience */}
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Target Audience</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {AUDIENCES.map((a) => (
                                  <button key={a.value} onClick={() => setEditAudience(a.value)} style={{
                                    padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                    transition: "all 0.15s", fontWeight: 500,
                                    border: editAudience === a.value ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                                    background: editAudience === a.value ? "rgba(124,58,237,0.08)" : "transparent",
                                    color: editAudience === a.value ? "#7C3AED" : "#6B7280",
                                  }}>{a.label}</button>
                                ))}
                              </div>
                              {editAudience === "custom" && (
                                <input type="text" value={editCustomAudience} onChange={(e) => setEditCustomAudience(e.target.value)}
                                  placeholder="Describe your audience..."
                                  style={{ width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13, background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none", boxSizing: "border-box" as const }} />
                              )}
                            </div>

                            {/* Emotional Intensity */}
                            {/* <div style={{ marginBottom: 16 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Emotional Intensity</span>
                                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: `${INTENSITY_COLORS[editIntensity]}20`, color: INTENSITY_COLORS[editIntensity] }}>
                                  {editIntensity} – {INTENSITY_LABELS[editIntensity]}
                                </span>
                              </div>
                              <input type="range" min={1} max={5} value={editIntensity} onChange={(e) => setEditIntensity(parseInt(e.target.value))}
                                style={{ width: "100%", height: 5, borderRadius: 3, appearance: "none" as any, cursor: "pointer", background: `linear-gradient(to right, ${INTENSITY_COLORS[editIntensity]} ${((editIntensity - 1) / 4) * 100}%, #D4D4D8 ${((editIntensity - 1) / 4) * 100}%)`, outline: "none" }} />
                              {editIntensity === 5 && (
                                <input type="text" value={editCustomIntensity} onChange={(e) => setEditCustomIntensity(e.target.value)}
                                  placeholder="Describe your custom intensity..."
                                  style={{ width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13, background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none", boxSizing: "border-box" as const }} />
                              )}
                            </div> */}

                            {/* CTA */}
                            <div style={{ marginBottom: 20 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: editCtaEnabled ? 10 : 0 }}>
                                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Call to Action</span>
                                <button onClick={() => setEditCtaEnabled(!editCtaEnabled)} style={{ position: "relative" as const, width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer", transition: "background 0.2s", background: editCtaEnabled ? "#7C3AED" : "#D4D4D8" }}>
                                  <div style={{ position: "absolute" as const, top: 2, width: 16, height: 16, borderRadius: 8, background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.15)", left: editCtaEnabled ? 18 : 2 }} />
                                </button>
                                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{editCtaEnabled ? "On" : "Off"}</span>
                              </div>
                              {editCtaEnabled && (
                                <div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {CTA_OPTIONS.map((c) => (
                                      <button key={c} onClick={() => setEditCtaType(c)} style={{
                                        padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                        transition: "all 0.15s", fontWeight: 500,
                                        border: editCtaType === c ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                                        background: editCtaType === c ? "rgba(124,58,237,0.08)" : "transparent",
                                        color: editCtaType === c ? "#7C3AED" : "#6B7280",
                                      }}>{c === "custom" ? "Custom" : c}</button>
                                    ))}
                                  </div>
                                  {editCtaType === "custom" && (
                                    <input type="text" value={editCustomCta} onChange={(e) => setEditCustomCta(e.target.value)}
                                      placeholder="Enter your custom CTA..."
                                      style={{ width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13, background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none", boxSizing: "border-box" as const }} />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Save & Regenerate button */}

                            {/* Reference URL in edit popup */}
                            <div style={{ marginBottom: 20 }}>
                              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Reference Link <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></div>
                              <input
                                type="url"
                                value={editReferenceUrl}
                                onChange={(e) => setEditReferenceUrl(e.target.value)}
                                placeholder="Paste a reel or video link for inspiration..."
                                style={{
                                  width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13,
                                  background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A",
                                  outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                                }}
                              />
                              {editReferenceUrl && (
                                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>
                                  AI will draw tonal and structural inspiration from this link
                                </div>
                              )}
                            </div>

                            {/* Save & Regenerate button */}
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              onClick={handleSaveAndRegenerate}
                              style={{
                                width: "100%", padding: "11px 0", borderRadius: 10,
                                border: "none", background: "#7C3AED",
                                color: "#fff", fontSize: 13, fontWeight: 600,
                                cursor: "pointer", display: "flex",
                                alignItems: "center", justifyContent: "center", gap: 8,
                                transition: "opacity 0.15s",
                              }}
                            >
                              <Sparkles style={{ width: 14, height: 14 }} />
                              Save & Regenerate
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
            )}
            </AnimatePresence>
          </div>

          {/* ─── Input Bar (fixed at bottom) ───────────── */}
          <div
            ref={inputDockRef}
            style={{
            position: "fixed", left: 0, right: 0,
            bottom: keyboardInset,
            background: "linear-gradient(to top, #FFFFFF 70%, transparent)",
            padding: "20px 20px calc(16px + env(safe-area-inset-bottom, 0px))",
            zIndex: 10,
            transition: "bottom 0.2s ease",
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
                      background: "#FFFFFF", border: "1px solid #E5E7EB",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                      maxHeight: settingsMaxHeight, overflowY: "auto" as const,
                    }}
                    className="custom-scrollbar"
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Settings</span>
                      <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }}>
                        <X style={{ width: 16, height: 16 }} />
                      </button>
                    </div>

                    {/* Duration */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Duration</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {DURATIONS.map((d) => (
                          <button key={d.value} onClick={() => setDuration(d.value)} style={{
                            padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                            transition: "all 0.15s", fontWeight: 500,
                            border: duration === d.value ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                            background: duration === d.value ? "rgba(124,58,237,0.08)" : "transparent",
                            color: duration === d.value ? "#7C3AED" : "#6B7280",
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
                              background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none",
                            }} />
                          <span style={{ fontSize: 12, color: "#6B7280" }}>minutes</span>
                        </div>
                      )}
                    </div>

                    {/* Language */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Language</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {LANGUAGES.map((l) => (
                          <button key={l.value} onClick={() => setLanguage(l.value)} style={{
                            padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                            transition: "all 0.15s", fontWeight: 500,
                            border: language === l.value ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                            background: language === l.value ? "rgba(124,58,237,0.08)" : "transparent",
                            color: language === l.value ? "#7C3AED" : "#6B7280",
                          }}>
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tone */}
                    {/* <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Tone</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {TONES.map((t) => (
                          <button key={t} onClick={() => setTone(t)} style={{
                            padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                            transition: "all 0.15s", fontWeight: 500,
                            border: tone === t ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                            background: tone === t ? "rgba(124,58,237,0.08)" : "transparent",
                            color: tone === t ? "#7C3AED" : "#6B7280",
                          }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div> */}

                    {/* Audience */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Target Audience</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {AUDIENCES.map((a) => (
                          <button key={a.value} onClick={() => setAudience(a.value)} style={{
                            padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                            transition: "all 0.15s", fontWeight: 500,
                            border: audience === a.value ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                            background: audience === a.value ? "rgba(124,58,237,0.08)" : "transparent",
                            color: audience === a.value ? "#7C3AED" : "#6B7280",
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
                            background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none",
                            boxSizing: "border-box" as const,
                          }} />
                      )}
                    </div>

                    {/* Emotional Intensity */}
                    {/* <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Emotional Intensity</span>
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
                          background: `linear-gradient(to right, ${INTENSITY_COLORS[emotionalIntensity]} ${((emotionalIntensity - 1) / 4) * 100}%, #D4D4D8 ${((emotionalIntensity - 1) / 4) * 100}%)`,
                          outline: "none",
                        }}
                      />
                      {emotionalIntensity === 5 && (
                        <input type="text" value={customIntensity} onChange={(e) => setCustomIntensity(e.target.value)}
                          placeholder="Describe your custom intensity..."
                          style={{
                            width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, fontSize: 13,
                            background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none",
                            boxSizing: "border-box" as const,
                          }} />
                      )}
                    </div> */}

                    {/* CTA */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ctaEnabled ? 10 : 0 }}>
                        <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Call to Action</span>
                        <button onClick={() => setCtaEnabled(!ctaEnabled)} style={{
                          position: "relative" as const, width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                          transition: "background 0.2s",
                          background: ctaEnabled ? "#7C3AED" : "#D4D4D8",
                        }}>
                          <div style={{
                            position: "absolute" as const, top: 2, width: 16, height: 16, borderRadius: 8,
                            background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                            left: ctaEnabled ? 18 : 2,
                          }} />
                        </button>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{ctaEnabled ? "On" : "Off"}</span>
                      </div>
                      {ctaEnabled && (
                        <div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {CTA_OPTIONS.map((c) => (
                              <button key={c} onClick={() => setCtaType(c)} style={{
                                padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                transition: "all 0.15s", fontWeight: 500,
                                border: ctaType === c ? "1px solid #7C3AED" : "1px solid #D4D4D8",
                                background: ctaType === c ? "rgba(124,58,237,0.08)" : "transparent",
                                color: ctaType === c ? "#7C3AED" : "#6B7280",
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
                                background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A", outline: "none",
                                boxSizing: "border-box" as const,
                              }} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reference URL in bottom settings */}
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: 500 }}>Reference Link <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 400 }}>(optional)</span></div>
                      <input
                        type="url"
                        value={referenceUrl}
                        onChange={(e) => setReferenceUrl(e.target.value)}
                        placeholder="Paste a reel or video link for inspiration..."
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13,
                          background: "#F5F5F5", border: "1px solid #D4D4D8", color: "#1A1A1A",
                          outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
                        }}
                      />
                      {referenceUrl && (
                        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>
                          AI will draw tonal and structural inspiration from this link
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {showLimitPrompt && isGuestLimitReached && (
                <div style={{ marginBottom: 8, padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#4B5563" }}>
                    Free limit reached ({GUEST_FREE_LIMIT} scripts). Log in or upgrade to continue generating.
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => navigate('/login', { state: { from: { pathname: '/script-generator' } } })}
                      style={{ border: "1px solid #D1D5DB", background: "#fff", color: "#374151", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/pricing')}
                      style={{ border: "none", background: "#7C3AED", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      View Plans
                    </button>
                  </div>
                </div>
              )}

              {/* Input area */}
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                padding: "10px 10px 10px 16px", borderRadius: 16,
                background: "#F5F5F5", border: "1px solid #E5E7EB",
                transition: "border-color 0.15s",
              }}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    border: "none", background: showSettings ? "rgba(124,58,237,0.1)" : "transparent",
                    color: showSettings ? "#7C3AED" : "#9CA3AF",
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
                  placeholder="Describe your script topic..."
                  rows={1}
                  style={{
                    flex: 1, border: "none", background: "transparent", color: "#1A1A1A",
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
                  onClick={isGenerating ? handleCancel : () => handleGenerate()}
                  disabled={(!topic.trim() && !isGenerating) || (isGuestLimitReached && !isGenerating)}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    border: "none", cursor: (topic.trim() || isGenerating) && !isGuestLimitReached ? "pointer" : "default",
                    background: isGenerating ? "#EF4444" : (isGuestLimitReached ? "#E5E7EB" : (topic.trim() ? "#7C3AED" : "#E5E7EB")),
                    color: isGenerating ? "#fff" : (topic.trim() && !isGuestLimitReached ? "#fff" : "#9CA3AF"),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s", flexShrink: 0,
                  }}
                >
                  {isGenerating ? (
                    <X style={{ width: 16, height: 16 }} />
                  ) : (
                    <Send style={{ width: 16, height: 16 }} />
                  )}
                </motion.button>
              </div>

              {/* Footer */}
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <a href="/" style={{ fontSize: 11, fontWeight: "bold", color: "#111827", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#7C3AED"} onMouseLeave={(e) => e.currentTarget.style.color = "#111827"}>Powered by Soch AI Store</a>
              </div>
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
          background: #D1D5DB;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
        @media (max-width: 768px) {
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default ScriptGenerator;
