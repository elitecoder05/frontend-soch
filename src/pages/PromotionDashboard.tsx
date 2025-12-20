import { Rocket, Star, Megaphone, Handshake, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PromoCard = ({ icon: Icon, title, desc, color }: any) => (
  <Card className="group relative overflow-hidden border-white/10 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer p-6">
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon className="w-24 h-24" />
    </div>
    <div className="relative z-10 flex flex-col items-center text-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      <Button variant="outline" className="w-full mt-2 border-white/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
        Start Campaign <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  </Card>
);

export const PromotionDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Promote your AI on Soch AI</h2>
        <Badge variant="secondary" className="px-3 py-1">Ads Manager</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PromoCard 
          icon={Rocket} 
          title="Launch Tool" 
          desc="Submit your tool to our directory and get indexed."
          color="bg-blue-500 text-blue-500"
        />
        <PromoCard 
          icon={Star} 
          title="Get Featured" 
          desc="Pin your tool to the top of the homepage. (₹50/day)"
          color="bg-yellow-500 text-yellow-500"
        />
        <PromoCard 
          icon={Megaphone} 
          title="Custom Campaign" 
          desc="Banner ads and newsletter mentions."
          color="bg-purple-500 text-purple-500"
        />
        <PromoCard 
          icon={Handshake} 
          title="Sponsorships" 
          desc="Long term partnership and branding."
          color="bg-green-500 text-green-500"
        />
      </div>

      {/* Campaign Preview / Pricing Logic (Simplified) */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Boost your reach today</h3>
            <p className="text-muted-foreground">Get 10x more clicks by featuring your tool on the homepage.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary">₹50</span>
            <span className="text-muted-foreground">/day</span>
            <div className="mt-2">
              <Button>Configure Ad</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};