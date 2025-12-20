// import { LucideIcon } from "lucide-react";
// import { Card } from "@/components/ui/card";

// interface InfoCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }

// const InfoCard = ({ icon, title, description }: InfoCardProps) => (
//   <Card className="bg-card/40 border-border/50 hover:bg-card/60 transition-colors p-6 flex flex-col gap-4">
//     <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
//       {icon}
//     </div>
//     <div>
//       <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
//       <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
//     </div>
//   </Card>
// );

// interface InfoSectionProps {
//   mainIcon: LucideIcon;
//   mainTitle: string;
//   cards: [InfoCardProps, InfoCardProps];
// }

// export const InfoSection = ({ mainIcon: MainIcon, mainTitle, cards }: InfoSectionProps) => {
//   return (
//     <div className="py-16 border-t border-border/30">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="flex flex-col items-center text-center mb-12">
//           <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]">
//             <MainIcon className="w-8 h-8 text-primary" />
//           </div>
//           <h2 className="text-3xl lg:text-4xl font-bold text-foreground max-w-2xl">
//             {mainTitle}
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-6 rounded-full opacity-50" />
//         </div>

//         {/* Cards Grid */}
//         <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
//           {cards.map((card, idx) => (
//             <InfoCard key={idx} {...card} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoCard = ({ icon, title, description }: InfoCardProps) => (
  <Card className="bg-card/40 border-border/50 hover:bg-card/60 transition-colors p-6 flex flex-col gap-4 h-full">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-bold text-foreground mb-3">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </Card>
);

interface InfoSectionProps {
  mainIcon: LucideIcon;
  mainTitle: string;
  cards: [InfoCardProps, InfoCardProps];
}

export const InfoSection = ({ mainIcon: MainIcon, mainTitle, cards }: InfoSectionProps) => {
  return (
    <div className="py-20 border-t border-border/30 relative">
      <div className="container mx-auto px-4">
        {/* Header Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-[0_0_40px_-10px_rgba(var(--primary),0.2)]">
            <MainIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground max-w-3xl tracking-tight">
            {mainTitle}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mt-8 rounded-full opacity-30" />
        </motion.div>

        {/* Cards Grid Animation */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <InfoCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};