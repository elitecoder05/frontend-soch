import { useState } from 'react';
import { Settings2, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const CreatorHero = () => {
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      navigate(`/script-generator?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <div className="relative pt-40 pb-16 lg:pt-48 lg:pb-24 overflow-hidden flex items-center">
      {/* Enhanced Background Effects */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,217,255,0.15),transparent_55%)] pointer-events-none"
      />

      {/* Floating orbs for visual interest */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 mx-auto px-4 text-center"
      >
        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 tracking-tight leading-tight"
        >
          Want to be a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-500">content creator?</span>
        </motion.h1>

        {/* Sub Heading */}
        <motion.p
          variants={itemVariants}
          className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Create viral scripts in seconds using AI
        </motion.p>

        {/* Input Bar */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="relative group w-full max-w-2xl mx-auto mb-12"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-md"></div>

          <div className="relative flex items-center bg-background/80 backdrop-blur-xl rounded-full border border-primary/20 shadow-2xl overflow-hidden h-12 md:h-14">
            {/* Settings Icon - Left */}
            <button
              type="button"
              className="p-3 text-muted-foreground hover:text-primary transition-colors z-20"
              title="Settings (Coming soon)"
            >
              <Settings2 className="w-5 h-5" />
            </button>

            {/* Input Field */}
            <Input
              type="text"
              placeholder="Enter your video topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base md:text-lg z-20 placeholder:text-muted-foreground/60 text-foreground px-4"
            />

            {/* Send Button - Right */}
            <Button
              type="submit"
              size="lg"
              className="rounded-full mr-1.5 px-4 md:px-6 h-9 md:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(var(--primary),0.4)] z-20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </motion.form>

        {/* Powered by text */}
        <motion.div variants={itemVariants} className="mt-6 flex flex-col items-center gap-1">
          <p className="text-foreground text-xs uppercase tracking-widest font-semibold">
            Powering AI Innovation Globally
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
