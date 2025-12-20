import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Star, Megaphone, Handshake, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PromoCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  onClick: () => void;
  buttonText?: string;
}

const PromoCard = ({ icon: Icon, title, desc, color, onClick, buttonText = "Get Started" }: PromoCardProps) => (
  <Card 
    onClick={onClick}
    className="group relative overflow-hidden border-white/10 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer p-6 h-full flex flex-col justify-between"
  >
    {/* Decorative Background Icon */}
    <div className={`absolute -top-2 -right-2 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${color}`}>
      <Icon className="w-24 h-24" />
    </div>

    <div className="relative z-10">
      {/* Header Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      
      {/* Text Content */}
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6">{desc}</p>
    </div>

    {/* Action Button */}
    <Button 
      variant="outline" 
      className="w-full border-white/10 bg-transparent text-white group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
    >
      {buttonText} <ChevronRight className="w-4 h-4 ml-1" />
    </Button>
  </Card>
);

export const PromotionCards = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Creator Studio</h2>
          <p className="text-gray-400">Manage your tools and grow your audience.</p>
        </div>
        <Badge variant="secondary" className="w-fit px-3 py-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
          Ads Manager Beta
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Launch Tool Card */}
        <PromoCard 
          icon={Rocket} 
          title="Launch Tool" 
          desc="Submit your new AI tool to our directory and get indexed immediately."
          color="bg-blue-500 text-blue-500"
          buttonText="Launch Now"
          onClick={() => navigate('/launch')} 
        />

        {/* 2. Get Featured Card */}
        <PromoCard 
          icon={Star} 
          title="Get Featured" 
          desc="Pin your tool to the top of the homepage for maximum visibility."
          color="bg-yellow-500 text-yellow-500"
          buttonText="Boost (₹50/day)"
          onClick={() => navigate('/pricing')} 
        />

        {/* 3. Custom Campaigns Card */}
        <PromoCard 
          icon={Megaphone} 
          title="Custom Ads" 
          desc="Run banner ads, newsletter mentions, and social media blasts."
          color="bg-purple-500 text-purple-500"
          buttonText="Contact Sales"
          onClick={() => navigate('/contact')} 
        />

        {/* 4. Sponsorships Card */}
        <PromoCard 
          icon={Handshake} 
          title="Sponsorships" 
          desc="Long-term branding partnerships and category takeovers."
          color="bg-green-500 text-green-500"
          buttonText="Partner Up"
          onClick={() => navigate('/contact')} 
        />
      </div>
    </div>
  );
};

export default PromotionCards;