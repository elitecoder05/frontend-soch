import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { Model } from '@/api/api-methods';

export const SpotlightBanner = ({ tools }: { tools: Model[] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (tools.length <= 1) return; // Don't rotate if only 1 tool exists

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tools.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [tools.length]);

  if (!tools || tools.length === 0) return null;

  const tool = tools[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-16">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-black border border-white/10 shadow-2xl min-h-[400px] flex items-center">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {/* Content Slider */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={tool._id} // Key change triggers animation
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12"
          >
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3" /> Spotlight Selection
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {tool.name}
              </h2>
              
              <p className="text-gray-300 text-lg mb-8 max-w-xl line-clamp-2 md:mx-0 mx-auto">
                {tool.shortDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => navigate(`/model/${tool.slug}`)}
                  className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Try It Now <ArrowRight className="w-4 h-4" />
                </button>
                {tool.externalUrl && (
                  <button 
                    onClick={() => window.open(tool.externalUrl, '_blank')}
                    className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-colors flex items-center gap-2 justify-center"
                  >
                    Visit Website <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Image/Icon */}
            <div className="shrink-0 relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl overflow-hidden">
                 {tool.iconUrl ? (
                   <img src={tool.iconUrl} className="w-full h-full object-cover" alt={tool.name} />
                 ) : (
                   <span className="text-6xl font-bold text-white/20">{tool.name.charAt(0)}</span>
                 )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots (Only if multiple tools exist) */}
        {tools.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {tools.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
};