import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Handshake, Loader2, Send } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const PromotePage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'campaign';
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : '',
    email: currentUser?.email || '',
    company: '',
    budget: '',
    goals: ''
  });

  const isSponsorship = type === 'sponsorship';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // ✅ FIX: Sending correct payload structure
        await api.post('/contact', {
            name: formData.name, 
            email: formData.email,
            subject: isSponsorship ? 'Sponsorship Inquiry' : 'Custom Campaign Request',
            message: `
Request Type: ${isSponsorship ? 'Sponsorship' : 'Campaign'}
Company: ${formData.company}
Budget: ${formData.budget}
Goals: ${formData.goals}
            `
        });
        toast({ title: "Request Sent", description: "Our team will contact you shortly." });
        navigate('/');
    } catch (error: any) {
        console.error("Promote Error:", error.response?.data);
        toast({ 
            title: "Error", 
            description: error.response?.data?.message || "Failed to send request.", 
            variant: "destructive" 
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <Navbar />
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${isSponsorship ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
              {isSponsorship ? <Handshake className="w-10 h-10 text-purple-500" /> : <Megaphone className="w-10 h-10 text-blue-500" />}
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">{isSponsorship ? "Partner with SochAI" : "Launch a Campaign"}</h1>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Name</label>
                        <Input 
                            required 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            placeholder="Your Name" 
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <Input 
                            required 
                            type="email" 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            placeholder="you@company.com" 
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">Company Name</label>
                    <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">Budget</label>
                    <Input value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="e.g. ₹50,000" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">Goals</label>
                    <Textarea required className="h-32" value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} placeholder="Describe your goals..." />
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "Submit Request"}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};