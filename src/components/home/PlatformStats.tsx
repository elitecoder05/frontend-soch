import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Bot, Users, Eye } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  description: string;
  iconColor: string;
  delay: number;
  loading?: boolean;
}

const StatCard = ({ icon, label, value, suffix = "", description, iconColor, delay, loading = false }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Only start the count-up once we have real data (loading=false)
  useEffect(() => {
    if (loading) return; // wait for real value

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const duration = 1500;
          const steps = 50;
          const increment = value / steps;
          const stepDuration = duration / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current));
            }
          }, stepDuration);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [value, loading]);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 lg:p-8 hover:bg-card/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Icon with colored background */}
      <div className={`w-14 h-14 rounded-xl ${iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>

      {/* Animated Number */}
      <div className="text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight flex items-baseline">
        {loading ? (
          <div className="h-12 w-28 rounded-lg bg-muted animate-pulse" />
        ) : (
          <>
            <span>{formatNumber(displayValue)}</span>
            {suffix === '+' ? (
              <span className="ml-2 text-2xl lg:text-3xl font-extrabold text-primary" aria-hidden>
                +
              </span>
            ) : (
              <span className="ml-2 text-lg">{suffix}</span>
            )}
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${iconColor.replace('bg-', 'from-')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
    </motion.div>
  );
};

export const PlatformStats = () => {
  const [totalTools, setTotalTools] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/models/stats/count');
        const json = res.data;
        if (!mounted) return;
        if (json && json.success && json.data && typeof json.data.total === 'number') {
          setTotalTools(json.data.total);
        }
      } catch (err) {
        console.error('Failed to fetch platform stats via api client:', err);
      }
    };

    fetchStats();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-16 lg:py-24 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Trusted Worldwide
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
            Powering <span className="text-primary">AI Innovation</span> Globally
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From solo developers to growing teams — Soch AI connects thousands of users with the best AI tools.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-8 rounded-full opacity-50 mx-auto" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Total Tools Listed (fetched from API) */}
          <StatCard
            icon={<Bot className="w-7 h-7 text-white" />}
            iconColor="bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30"
            label="AI Tools Listed"
            value={totalTools ?? 0}
            suffix="+"
            loading={totalTools === null}
            description="Curated AI tools available for discovery"
            delay={0.1}
          />

          {/* Monthly Visitors */}
          <StatCard
            icon={<Eye className="w-7 h-7 text-white" />}
            iconColor="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
            label="Monthly Visitors"
            value={12000}
            suffix="+"
            description="Growing community of AI enthusiasts"
            delay={0.2}
          />

          {/* Active Users */}
          <StatCard
            icon={<Users className="w-7 h-7 text-white" />}
            iconColor="bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30"
            label="Active Users"
            value={300}
            suffix="+"
            description="Engaged users exploring AI tools"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};
