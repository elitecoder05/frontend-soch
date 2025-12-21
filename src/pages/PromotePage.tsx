// // import React, { useState, useEffect } from 'react';
// // import { useSearchParams, useNavigate } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import { Megaphone, Handshake, Loader2, Send } from 'lucide-react';
// // import { Navbar } from '@/components/Navbar';
// // import { Input } from '@/components/ui/input';
// // import { Textarea } from '@/components/ui/textarea';
// // import api from '@/lib/api';
// // import { useToast } from '@/hooks/use-toast';

// // export const PromotePage = () => {
// //   const [searchParams] = useSearchParams();
// //   const type = searchParams.get('type') || 'campaign';
// //   const { toast } = useToast();
// //   const navigate = useNavigate();
  
// //   const [loading, setLoading] = useState(false);
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     email: '',
// //     company: '',
// //     budget: '',
// //     goals: ''
// //   });

// //   const isSponsorship = type === 'sponsorship';

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //         // Send to backend (ensure you have a generic contact or campaign endpoint)
// //         await api.post('/contact', {
// //             subject: isSponsorship ? 'Sponsorship Inquiry' : 'Custom Campaign Request',
// //             message: `Company: ${formData.company}\nBudget: ${formData.budget}\nGoals: ${formData.goals}\n\nUser: ${formData.name} (${formData.email})`
// //         });
// //         toast({ title: "Request Sent", description: "Our marketing team will contact you within 24 hours." });
// //         navigate('/');
// //     } catch (error) {
// //         toast({ title: "Error", description: "Failed to send request.", variant: "destructive" });
// //     } finally {
// //         setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-background pt-24 pb-12 px-4">
// //       <Navbar />
// //       <div className="max-w-2xl mx-auto">
// //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
// //           <div className="flex justify-center mb-4">
// //             <div className={`p-4 rounded-full ${isSponsorship ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
// //               {isSponsorship ? <Handshake className="w-10 h-10 text-purple-500" /> : <Megaphone className="w-10 h-10 text-blue-500" />}
// //             </div>
// //           </div>
// //           <h1 className="text-4xl font-bold mb-4">{isSponsorship ? "Partner with SochAI" : "Launch a Custom Campaign"}</h1>
// //           <p className="text-muted-foreground text-lg">
// //             {isSponsorship 
// //                 ? "Become a long-term partner and integrate your brand across our platform." 
// //                 : "Tailored marketing strategies to drive traffic to your AI tool."}
// //           </p>
// //         </motion.div>

// //         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-8 shadow-lg">
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <div>
// //                         <label className="text-sm font-medium mb-2 block">Name</label>
// //                         <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your Name" />
// //                     </div>
// //                     <div>
// //                         <label className="text-sm font-medium mb-2 block">Work Email</label>
// //                         <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@company.com" />
// //                     </div>
// //                 </div>
// //                 <div>
// //                     <label className="text-sm font-medium mb-2 block">Company / Product Name</label>
// //                     <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Jasper AI" />
// //                 </div>
// //                 <div>
// //                     <label className="text-sm font-medium mb-2 block">Estimated Budget (USD/INR)</label>
// //                     <Input value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="e.g. $1000 or ₹80,000" />
// //                 </div>
// //                 <div>
// //                     <label className="text-sm font-medium mb-2 block">Campaign Goals</label>
// //                     <Textarea required className="h-32" value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} placeholder="Describe what you want to achieve (e.g. 1000 clicks, brand awareness)..." />
// //                 </div>
// //                 <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
// //                     {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Submit Request</>}
// //                 </button>
// //             </form>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // };



// import React, { useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Megaphone, Handshake, Loader2, Send } from 'lucide-react';
// import { Navbar } from '@/components/Navbar';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import api from '@/lib/api';
// import { useToast } from '@/hooks/use-toast';

// export const PromotePage = () => {
//   const [searchParams] = useSearchParams();
//   const type = searchParams.get('type') || 'campaign';
//   const { toast } = useToast();
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     company: '',
//     budget: '',
//     goals: ''
//   });

//   const isSponsorship = type === 'sponsorship';

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//         // ✅ FIX: Added 'name' and 'email' to the payload
//         await api.post('/contact', {
//             name: formData.name,   // Required by backend
//             email: formData.email, // Required by backend
//             subject: isSponsorship ? 'Sponsorship Inquiry' : 'Custom Campaign Request',
//             message: `Company: ${formData.company}\nBudget: ${formData.budget}\nGoals: ${formData.goals}`
//         });
        
//         toast({ title: "Request Sent", description: "Our marketing team will contact you within 24 hours." });
//         navigate('/');
//     } catch (error: any) {
//         console.error(error);
//         toast({ 
//             title: "Error", 
//             description: error.response?.data?.message || "Failed to send request.", 
//             variant: "destructive" 
//         });
//     } finally {
//         setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background pt-24 pb-12 px-4">
//       <Navbar />
//       <div className="max-w-2xl mx-auto">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
//           <div className="flex justify-center mb-4">
//             <div className={`p-4 rounded-full ${isSponsorship ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
//               {isSponsorship ? <Handshake className="w-10 h-10 text-purple-500" /> : <Megaphone className="w-10 h-10 text-blue-500" />}
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold mb-4">{isSponsorship ? "Partner with SochAI" : "Launch a Custom Campaign"}</h1>
//           <p className="text-muted-foreground text-lg">
//             {isSponsorship 
//                 ? "Become a long-term partner and integrate your brand across our platform." 
//                 : "Tailored marketing strategies to drive traffic to your AI tool."}
//           </p>
//         </motion.div>

//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-8 shadow-lg">
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="text-sm font-medium mb-2 block">Name</label>
//                         <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your Name" />
//                     </div>
//                     <div>
//                         <label className="text-sm font-medium mb-2 block">Work Email</label>
//                         <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@company.com" />
//                     </div>
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium mb-2 block">Company / Product Name</label>
//                     <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Jasper AI" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium mb-2 block">Estimated Budget (USD/INR)</label>
//                     <Input value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="e.g. $1000 or ₹80,000" />
//                 </div>
//                 <div>
//                     <label className="text-sm font-medium mb-2 block">Campaign Goals</label>
//                     <Textarea required className="h-32" value={formData.goals} onChange={e => setFormData({...formData, goals: e.target.value})} placeholder="Describe what you want to achieve (e.g. 1000 clicks, brand awareness)..." />
//                 </div>
//                 <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
//                     {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4" /> Submit Request</>}
//                 </button>
//             </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// };






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