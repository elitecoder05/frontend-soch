import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Monitor, 
  Globe, 
  Rocket, 
  Sparkles,
  Star,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { subscriptionPlans } from '@/data/subscriptionPlans';

export const SubmitToolLanding = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const pricingRef = useRef<HTMLDivElement>(null);

  // Check if user has a paid subscription
  const isPaidUser = currentUser?.subscriptionType && 
    ['pro', 'enterprise', 'trial'].includes(currentUser.subscriptionType);

  const handleSubmitToolClick = () => {
    if (!isAuthenticated) {
      toast({ 
        title: "Login Required", 
        description: "Please login to submit tools.", 
        variant: "destructive" 
      });
      navigate('/login', { state: { from: { pathname: '/upload-model' } } });
      return;
    }

    // If user is on free plan, scroll to pricing section
    if (!isPaidUser) {
      pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Paid user - navigate to upload form
    navigate('/upload-model');
  };

  const handleBoostClick = () => {
    if (!isAuthenticated) {
      toast({ 
        title: "Login Required", 
        description: "Please login to boost tools.", 
        variant: "destructive" 
      });
      navigate('/login', { state: { from: { pathname: '/get-featured' } } });
      return;
    }
    navigate('/get-featured');
  };

  const stats = [
    {
      icon: Users,
      value: '12,000+',
      label: 'Monthly AI Tool Explorers',
      color: 'text-blue-400'
    },
    {
      icon: TrendingUp,
      value: 'Featured Placement',
      label: 'Top tools get homepage visibility',
      color: 'text-purple-400',
      isText: true
    },
    {
      icon: Monitor,
      value: 'Monetize Your AI Tool',
      label: 'Reach users actively searching for AI solutions',
      color: 'text-green-400',
      isText: true
    },
    {
      icon: Globe,
      value: '20+',
      label: 'Countries with active users',
      color: 'text-cyan-400',
      showFlags: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Main Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Reach a Premium Audience<br />of AI Users
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get your AI tool discovered by a fast-growing community of developers, founders, and 
              businesses exploring AI solutions on Soch AI Store.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card/50 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-4 ${stat.color}`}>
                    <stat.icon className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <div className={`font-bold mb-2 ${stat.isText ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'}`}>
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {stat.label}
                  </p>
                  {stat.showFlags && (
                    <div className="overflow-hidden mt-3 w-full">
                      <motion.div 
                        className="flex gap-2"
                        animate={{ x: [0, -320] }}
                        transition={{ 
                          duration: 8, 
                          repeat: Infinity, 
                          ease: "linear"
                        }}
                      >
                        <span className="text-2xl">🇮🇳</span>
                        <span className="text-2xl">🇺🇸</span>
                        <span className="text-2xl">🇧🇷</span>
                        <span className="text-2xl">🇬🇧</span>
                        <span className="text-2xl">🇨🇦</span>
                        <span className="text-2xl">🇦🇺</span>
                        <span className="text-2xl">🇩🇪</span>
                        <span className="text-2xl">🇫🇷</span>
                        <span className="text-2xl">🇮🇳</span>
                        <span className="text-2xl">🇺🇸</span>
                        <span className="text-2xl">🇧🇷</span>
                        <span className="text-2xl">🇬🇧</span>
                        <span className="text-2xl">🇨🇦</span>
                        <span className="text-2xl">🇦🇺</span>
                        <span className="text-2xl">🇩🇪</span>
                        <span className="text-2xl">🇫🇷</span>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Supporting Text */}
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="text-center text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Show your AI tool to a growing community of professionals, startups, and creators 
            actively searching for powerful AI tools on Soch AI Store.
          </motion.p>

          {/* Primary Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            {/* Submit AI Tool Card */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Submit AI Tool</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                List your AI tool on Soch AI Store and reach users actively searching for AI solutions.
              </p>
              <Button 
                onClick={handleSubmitToolClick}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl"
              >
                Submit AI Tool
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Boost AI Tool Card */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold">Boost AI Tool</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Get featured across the platform and increase visibility, clicks, and adoption.
              </p>
              <Button 
                onClick={handleBoostClick}
                variant="outline"
                className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 font-semibold py-6 rounded-xl"
              >
                Boost AI Tool
                <Star className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Pricing Plans Section */}
          {!isPaidUser && (
            <div ref={pricingRef} className="scroll-mt-24">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.6 }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Select a plan that fits your needs. All plans include listing on Soch AI Store with varying levels of visibility and features.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {subscriptionPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`relative bg-card border rounded-2xl p-6 flex flex-col ${
                      plan.popular 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/30'
                    } transition-all duration-300`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6 pt-2">
                      <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground text-sm">/{plan.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 flex-1 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="mt-0.5 text-green-500">✓</div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigate('/pricing')}
                      variant={plan.popular ? 'default' : 'outline'}
                      className={`w-full py-5 rounded-xl font-semibold ${
                        plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                      }`}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitToolLanding;
