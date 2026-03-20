import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

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

const CTA_OPTIONS = [
  "Follow for more", "Subscribe", "Comment", "Save", "custom"
] as const;

interface CustomizeScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

export const CustomizeScriptModal = ({ isOpen, onClose, topic }: CustomizeScriptModalProps) => {
  const navigate = useNavigate();
  
  // Form state
  const [detailedInstructions, setDetailedInstructions] = useState('');
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

  const handleGenerate = () => {
    if (!topic.trim()) return;

    // Build URL parameters with all settings
    const params = new URLSearchParams({
      topic: topic,
      autoGenerate: 'true', // Flag to auto-start generation
    });
    
    if (detailedInstructions) params.append('instructions', detailedInstructions);
    if (duration !== "1min") params.append('duration', duration);
    if (customDuration !== 2 && duration === "custom") params.append('customDuration', customDuration.toString());
    if (language !== "English") params.append('language', language);
    if (tone !== "Inspirational") params.append('tone', tone);
    if (audience !== "Creators") params.append('audience', audience);
    if (customAudience && audience === "custom") params.append('customAudience', customAudience);
    if (emotionalIntensity !== 3) params.append('intensity', emotionalIntensity.toString());
    if (customIntensity && emotionalIntensity === 5) params.append('customIntensity', customIntensity);
    if (ctaEnabled) {
      params.append('ctaEnabled', 'true');
      params.append('ctaType', ctaType);
      if (customCta && ctaType === "custom") params.append('customCta', customCta);
    }
    if (referenceUrl) params.append('referenceUrl', referenceUrl);

    navigate(`/script-generator?${params.toString()}`);
  };

  const handleReset = () => {
    setDetailedInstructions('');
    setDuration('1min');
    setCustomDuration(2);
    setLanguage('English');
    setTone('Inspirational');
    setAudience('Creators');
    setCustomAudience('');
    setEmotionalIntensity(3);
    setCustomIntensity('');
    setCtaEnabled(false);
    setCtaType('Follow for more');
    setCustomCta('');
    setReferenceUrl('');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(calc(100vw-2rem),42rem)] -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border/30 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-lg">Customize Your Script</h3>
                <p className="text-xs text-muted-foreground mt-1">Set all options before generating</p>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-6">
              
              {/* Detailed Instructions */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Detailed Instructions
                  <span className="text-xs text-muted-foreground font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  value={detailedInstructions}
                  onChange={(e) => setDetailedInstructions(e.target.value)}
                  placeholder="Add any specific instructions for your script..."
                  className="w-full p-3 text-sm rounded-lg border border-border/50 bg-card/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                  rows={3}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Duration</label>
                <div className="flex gap-2 flex-wrap">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDuration(d.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        duration === d.value
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                          : 'bg-card/50 text-foreground border border-border/50 hover:bg-card hover:border-border'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                {duration === "custom" && (
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="number"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={customDuration}
                      onChange={(e) => setCustomDuration(parseFloat(e.target.value) || 1)}
                      className="w-24 px-3 py-2 text-sm rounded-lg border border-border/50 bg-card/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                )}
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Language</label>
                <div className="flex gap-2 flex-wrap">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setLanguage(l.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        language === l.value
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                          : 'bg-card/50 text-foreground border border-border/50 hover:bg-card hover:border-border'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Tone</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        tone === t
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                          : 'bg-card/50 text-foreground border border-border/50 hover:bg-card hover:border-border'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Target Audience</label>
                <div className="grid grid-cols-2 gap-2">
                  {AUDIENCES.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => setAudience(a.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        audience === a.value
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                          : 'bg-card/50 text-foreground border border-border/50 hover:bg-card hover:border-border'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                {audience === "custom" && (
                  <input
                    type="text"
                    value={customAudience}
                    onChange={(e) => setCustomAudience(e.target.value)}
                    placeholder="Describe your target audience..."
                    className="w-full mt-3 px-3 py-2 text-sm rounded-lg border border-border/50 bg-card/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                )}
              </div>

              {/* Emotional Intensity */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Emotional Intensity: <span className="text-primary">{emotionalIntensity}/5</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={emotionalIntensity}
                  onChange={(e) => setEmotionalIntensity(parseInt(e.target.value))}
                  className="w-full"
                />
                {emotionalIntensity === 5 && (
                  <input
                    type="text"
                    value={customIntensity}
                    onChange={(e) => setCustomIntensity(e.target.value)}
                    placeholder="Describe your custom intensity..."
                    className="w-full mt-3 px-3 py-2 text-sm rounded-lg border border-border/50 bg-card/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                )}
              </div>

              {/* CTA (Call To Action) */}
              <div>
                <label className="flex items-center gap-3 text-sm font-semibold text-foreground mb-3">
                  <input
                    type="checkbox"
                    checked={ctaEnabled}
                    onChange={(e) => setCtaEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-border/50"
                  />
                  Include Call To Action
                </label>
                {ctaEnabled && (
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      {CTA_OPTIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCtaType(c)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            ctaType === c
                              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                              : 'bg-card/50 text-foreground border border-border/50 hover:bg-card hover:border-border'
                          }`}
                        >
                          {c === "custom" ? "Custom" : c}
                        </button>
                      ))}
                    </div>
                    {ctaType === "custom" && (
                      <input
                        type="text"
                        value={customCta}
                        onChange={(e) => setCustomCta(e.target.value)}
                        placeholder="Enter your custom CTA..."
                        className="w-full px-3 py-2 text-sm rounded-lg border border-border/50 bg-card/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Reference URL */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Reference Link
                  <span className="text-xs text-muted-foreground font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="Paste a reel or video link for inspiration..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border/50 bg-card/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border/30 pt-4 flex gap-2">
                <Button
                  type="button"
                  onClick={handleGenerate}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
                >
                  Generate Script
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="px-4 rounded-lg"
                >
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
