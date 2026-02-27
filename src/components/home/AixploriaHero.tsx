import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const AixploriaHero = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    // Top padding (pt-40) ensures content is below the fixed Navbar
    <div className="relative pt-40 pb-16 lg:pt-48 lg:pb-24 overflow-hidden flex items-center">
      {/* Enhanced Background Effects */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,217,255,0.15),transparent_55%)] pointer-events-none" 
      />
      
      {/* Additional floating orbs for visual interest */}
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
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-base font-medium shadow-lg backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>The World's Best AI Tools Directory</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-8xl font-extrabold text-foreground mb-8 tracking-tight leading-tight">
          Soch AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-500 animate-pulse">Store</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed">
          Soch AI Store is India's most reliable AI tools directory. We help creators, students, developers, and businesses discover the right AI tools without confusion. This AI tools directory helps you quickly find the best solutions for your workflow. With hundreds of AI startups launching every month, Soch AI Store makes it easy to search, compare, and choose the best AI tools in one place.
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-center mb-12">
          <a 
            href="/explorer" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#005fcc] hover:bg-[#004db3] text-white text-lg font-bold rounded-full shadow-lg shadow-[#005fcc]/30 hover:shadow-xl hover:shadow-[#005fcc]/40 transition-all hover:scale-105"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Additional decorative elements */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center items-center gap-8 opacity-60"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 bg-blue-400 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 bg-purple-400 rounded-full"
          />
        </motion.div>

      </motion.div>
    </div>
  );
};