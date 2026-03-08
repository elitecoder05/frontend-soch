// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Star, Check, Loader2, ShieldCheck } from 'lucide-react';
// import { Navbar } from '@/components/Navbar';
// // ✅ Import paymentAPI and modelsAPI
// import { modelsAPI, paymentAPI, Model } from '@/api/api-methods';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

// // Helper to load Razorpay SDK script dynamically
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     if ((window as any).Razorpay) {
//       resolve(true);
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// export const GetFeaturedPage = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const { toast } = useToast();
  
//   const [userModels, setUserModels] = useState<Model[]>([]);
//   const [selectedModel, setSelectedModel] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (currentUser) {
//       fetchUserModels();
//     }
//   }, [currentUser]);

//   const fetchUserModels = async () => {
//     try {
//       const res = await modelsAPI.getUserModels();
//       setUserModels(res.data.models);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (!selectedModel) {
//       toast({ 
//         title: "Selection Required", 
//         description: "Please select a tool to feature.", 
//         variant: "destructive" 
//       });
//       return;
//     }
    
//     setSubmitting(true);

//     try {
//         // 1. Load Razorpay SDK
//         const isLoaded = await loadRazorpayScript();
//         if (!isLoaded) {
//             throw new Error("Razorpay SDK failed to load. Check your internet connection.");
//         }

//         // 2. Create Promotion Order on Backend
//         // This calls the endpoint: /api/payments/create-promotion-order
//         const data = await paymentAPI.createPromotionOrder();
        
//         if (!data || !data.success) {
//             throw new Error(data?.message || "Failed to create payment order");
//         }

//         const { order, key_id } = data;

//         // 3. Initialize Razorpay Checkout
//         const options = {
//             key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
//             amount: order.amount,
//             currency: order.currency,
//             name: "Soch AI Store",
//             description: "Featured Tool Promotion (Weekly)",
//             order_id: order.id,
            
//             // 4. Success Handler
//             handler: async function (response: any) {
//                 try {
//                     toast({ 
//                         title: "Processing...", 
//                         description: "Verifying payment securely." 
//                     });
                    
//                     // 5. Verify Transaction on Backend & Activate Feature
//                     // This calls: /api/payments/verify-promotion
//                     const verifyRes = await paymentAPI.verifyPromotion({
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature,
//                         modelId: selectedModel // Pass the ID of the tool to feature
//                     });

//                     if (verifyRes.success) {
//                         toast({ 
//                             title: "🎉 Success!", 
//                             description: "Payment received! Your tool is now Featured on the homepage.",
//                             className: "bg-green-50 border-green-200 text-green-900"
//                         });
//                         navigate('/'); // Redirect to Home to see the change
//                     } else {
//                         throw new Error(verifyRes.message || "Verification failed");
//                     }

//                 } catch (verifyErr: any) {
//                     console.error("Verification Error:", verifyErr);
//                     toast({ 
//                         title: "Verification Failed", 
//                         description: verifyErr.message || "Payment succeeded but activation failed. Contact support.", 
//                         variant: "destructive" 
//                     });
//                 }
//             },
//             prefill: {
//                 name: `${currentUser?.firstName} ${currentUser?.lastName}`,
//                 email: currentUser?.email,
//                 contact: currentUser?.mobileNumber || ""
//             },
//             theme: {
//                 color: "#eab308" // Gold/Yellow color for "Featured" theme
//             }
//         };

//         const rzp = new (window as any).Razorpay(options);
        
//         rzp.on('payment.failed', function (response: any) {
//             toast({
//                 title: "Payment Failed",
//                 description: response.error.description || "Transaction was declined.",
//                 variant: "destructive"
//             });
//         });

//         rzp.open();

//     } catch (error: any) {
//         console.error("Payment Init Error:", error);
//         toast({ 
//             title: "Error", 
//             description: error.message || "Could not initiate payment.", 
//             variant: "destructive" 
//         });
//     } finally {
//         setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background pt-24 pb-12 px-4">
//       <Navbar />
//       <div className="max-w-3xl mx-auto">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-yellow-500/10 rounded-full">
//               <Star className="w-8 h-8 text-yellow-500" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold mb-4">Get Featured on Homepage</h1>
//           <p className="text-muted-foreground text-lg">Boost your visibility by 5x appearing in the "Soch AI Selection" section.</p>
//         </motion.div>

//         <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
//           <h3 className="text-xl font-semibold mb-6">1. Select Tool to Feature</h3>
          
//           {loading ? (
//             <div className="flex justify-center p-8">
//                 <Loader2 className="animate-spin text-primary w-8 h-8" />
//             </div>
//           ) : userModels.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//               {userModels.map((model) => (
//                 <div 
//                   key={model._id}
//                   onClick={() => setSelectedModel(model._id)}
//                   className={`relative p-4 border rounded-xl cursor-pointer transition-all ${
//                     selectedModel === model._id 
//                       ? 'border-yellow-500 bg-yellow-500/5 ring-1 ring-yellow-500' 
//                       : 'border-border hover:bg-muted'
//                   }`}
//                 >
//                   <div className="font-bold flex items-center justify-between">
//                     {model.name}
//                     {model.featured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/>}
//                   </div>
//                   <div className="text-xs text-muted-foreground truncate">{model.shortDescription}</div>
                  
//                   {selectedModel === model._id && (
//                     <div className="absolute top-2 right-2 text-yellow-600">
//                         <Check className="w-4 h-4" />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center p-6 border border-dashed rounded-xl mb-8">
//                 <p className="text-muted-foreground mb-2">You haven't uploaded any tools yet.</p>
//                 <button onClick={() => navigate('/upload-model')} className="text-primary font-medium hover:underline">
//                     Launch a tool first
//                 </button>
//             </div>
//           )}

//           <h3 className="text-xl font-semibold mb-6">2. Payment Details</h3>
//           <div className="p-6 border border-yellow-500/30 bg-yellow-500/5 rounded-xl mb-8 flex justify-between items-center">
//             <div>
//                 <span className="font-bold text-lg text-yellow-700 dark:text-yellow-500">Weekly Feature Plan</span>
//                 <ul className="text-sm text-muted-foreground mt-2 space-y-1">
//                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Top Homepage Spot</li>
//                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> "Soch AI Selection" Badge</li>
//                     <li className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-green-500"/> Secure Payment</li>
//                 </ul>
//             </div>
//             <div className="text-right">
//                 <span className="text-3xl font-bold">₹2,999</span>
//                 <span className="text-xs text-muted-foreground block">/week</span>
//             </div>
//           </div>

//           <button 
//             disabled={!selectedModel || submitting}
//             onClick={handlePayment}
//             className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
//           >
//             {submitting ? (
//                 <>
//                     <Loader2 className="animate-spin w-5 h-5"/> Processing...
//                 </>
//             ) : (
//                 <>
//                     Pay ₹2,999 & Feature Tool <Star className="w-4 h-4 fill-current" />
//                 </>
//             )}
//           </button>
          
//           <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
//             <ShieldCheck className="w-3 h-3" /> Secure payments powered by Razorpay
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };


// import { Link } from "react-router-dom";
// import { ArrowRight, Star, TrendingUp } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// interface Tool {
//   _id: string;
//   name: string;
//   slug: string;
//   iconUrl: string;
//   bannerUrl?: string;
//   shortDescription: string;
// }

// interface FeaturedSectionProps {
//   tools: Tool[];
//   title?: string;
//   variant?: "home" | "search" | "minimal";
//   className?: string;
// }

// export const GetFeaturedPage = ({ 
//   tools, 
//   title = "Get Featured Tools", 
//   variant = "home",
//   className = "" 
// }: FeaturedSectionProps) => {
//   if (!tools || tools.length === 0) return null;

//   // Limit to 5 tools as requested
//   const displayTools = tools.slice(0, 5);

//   return (
//     <div className={`w-full ${className}`}>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6 px-1">
//         <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
//           {variant === "home" ? (
//             <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
//           ) : (
//             <TrendingUp className="w-5 h-5 text-primary" />
//           )}
//           {title} <span className="text-primary hidden sm:inline">{'>>'}</span>
//         </h2>
        
//         {variant !== "minimal" && (
//           <Link to="/explorer?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
//             View all <ArrowRight className="w-4 h-4" />
//           </Link>
//         )}
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
//         {displayTools.map((tool) => (
//           <Link key={tool._id} to={`/tool/${tool.slug}`} className="block h-full group">
//             <Card className="h-full border-primary/10 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden relative">
              
//               {/* Banner */}
//               <div className="h-28 w-full bg-muted relative overflow-hidden">
//                 {tool.bannerUrl ? (
//                   <img src={tool.bannerUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
//                 )}
//                 <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-sm text-[10px] uppercase tracking-wider">
//                   Featured
//                 </Badge>
//               </div>

//               <CardContent className="p-4 pt-0 relative">
//                 {/* Logo */}
//                 <div className="absolute -top-6 left-4 w-12 h-12 rounded-xl border-2 border-background bg-white shadow-sm overflow-hidden p-0.5">
//                   <img src={tool.iconUrl} alt={tool.name} className="w-full h-full object-cover rounded-lg" />
//                 </div>

//                 <div className="mt-8">
//                   <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
//                     {tool.name}
//                   </h3>
//                   <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
//                     {tool.shortDescription}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// // };
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Star, Check, Loader2, ShieldCheck, Rocket } from 'lucide-react';
// import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/Footer';
// import { Button } from '@/components/ui/button';
// import { modelsAPI, Model } from '@/api/api-methods';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

// // ✅ CORRECTED IMPORT: Since BoostModal.tsx is in the same folder (pages)
// import { BoostModal } from "./BoostModal"; 

// export const GetFeaturedPage = () => {
//   const navigate = useNavigate();
//   const { currentUser, isAuthenticated } = useAuth();
//   const { toast } = useToast();
  
//   const [userModels, setUserModels] = useState<Model[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // State for Boost Modal
//   const [selectedTool, setSelectedTool] = useState<{ id: string; name: string } | null>(null);
//   const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated) {
//         navigate('/login');
//         return;
//     }
//     fetchUserModels();
//   }, [isAuthenticated, navigate]);

//   const fetchUserModels = async () => {
//     try {
//       const res = await modelsAPI.getUserModels();
//       // Only show approved tools for boosting
//       const approvedTools = res.data.models.filter((m: Model) => m.status === 'approved');
//       setUserModels(approvedTools);
//     } catch (error) {
//       console.error(error);
//       toast({ title: "Error", description: "Failed to load your tools.", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenBoost = (tool: Model) => {
//       setSelectedTool({ id: tool._id, name: tool.name });
//       setIsBoostModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-background font-sans flex flex-col">
//       <Navbar />
      
//       <main className="flex-1 container mx-auto px-4 py-24 pb-32">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-yellow-500/10 rounded-full">
//               <Rocket className="w-8 h-8 text-yellow-500" />
//             </div>
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">Boost Your Tool</h1>
//           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//             Get 5x more visibility by featuring your tool on our Homepage, Search, and Results.
//           </p>
//         </motion.div>

//         <div className="max-w-4xl mx-auto">
//           {/* List of User's Tools */}
//           <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
//             <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
//                 <Star className="w-5 h-5 text-primary" /> Select a tool to boost
//             </h3>
            
//             {loading ? (
//               <div className="flex justify-center p-8">
//                 <Loader2 className="animate-spin text-primary w-8 h-8" />
//               </div>
//             ) : userModels.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {userModels.map((model) => (
//                   <div 
//                     key={model._id}
//                     className="group relative p-4 border border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col"
//                   >
//                     <div className="flex items-start gap-3 mb-3">
//                         <div className="w-10 h-10 rounded-lg bg-muted border overflow-hidden shrink-0">
//                             <img src={model.iconUrl} alt="" className="w-full h-full object-cover" />
//                         </div>
//                         <div className="min-w-0">
//                             <div className="font-bold truncate">{model.name}</div>
//                             <div className="text-xs text-muted-foreground truncate">{model.shortDescription}</div>
//                         </div>
//                     </div>
                    
//                     <div className="mt-auto pt-3 border-t border-border/50 flex justify-between items-center">
//                         <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
//                             {model.featured ? "Currently Featured" : "Standard Listing"}
//                         </span>
//                         <Button size="sm" onClick={() => handleOpenBoost(model)} className="gap-2">
//                             <Rocket className="w-3 h-3" /> Boost
//                         </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center p-8 border border-dashed rounded-xl">
//                 <p className="text-muted-foreground mb-4">You don't have any approved tools to boost yet.</p>
//                 <Button onClick={() => navigate('/upload-model')} variant="outline">
//                     Submit a Tool First
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Pricing Info */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
//                 <h4 className="font-bold text-green-600 mb-1">Budget Friendly</h4>
//                 <p className="text-sm text-muted-foreground">Start from just ₹50/day</p>
//              </div>
//              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
//                 <h4 className="font-bold text-blue-600 mb-1">Flexible Duration</h4>
//                 <p className="text-sm text-muted-foreground">1 to 30 days - you choose</p>
//              </div>
//              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
//                 <h4 className="font-bold text-purple-600 mb-1">Instant Activation</h4>
//                 <p className="text-sm text-muted-foreground">Live immediately after payment</p>
//              </div>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       {/* Boost Modal Integration */}
//       {selectedTool && (
//         <BoostModal 
//             isOpen={isBoostModalOpen} 
//             onClose={() => {
//                 setIsBoostModalOpen(false);
//                 setSelectedTool(null);
//             }}
//             toolId={selectedTool.id}
//             toolName={selectedTool.name}
//         />
//       )}
//     </div>
//   );
// };

// export default GetFeaturedPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Loader2, Rocket, Wallet } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { modelsAPI, Model } from '@/api/api-methods';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// ✅ FIXED IMPORT: BoostModal is in the same directory (src/pages)
import { BoostModal } from "./BoostModal"; 

export const GetFeaturedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Boost Modal
  const [selectedTool, setSelectedTool] = useState<{ id: string; name: string } | null>(null);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    fetchUserModels();
  }, [isAuthenticated, navigate]);

  const fetchUserModels = async () => {
    try {
      const res = await modelsAPI.getUserModels();
      // Only show approved tools for boosting
      const approvedTools = res.data.models.filter((m: Model) => m.status === 'approved');
      setUserModels(approvedTools);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load your tools.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBoost = (tool: Model) => {
      setSelectedTool({ id: tool._id, name: tool.name });
      setIsBoostModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-24 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 mt-16 md:mt-0">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <Rocket className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Boost Your Tool</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto px-2">
            Get 5x more visibility by featuring your tool on our Homepage, Search, and Results.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* List of User's Tools */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Select a tool to boost
            </h3>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
              </div>
            ) : userModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userModels.map((model) => (
                  <div 
                    key={model._id}
                    className="group relative p-4 border border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col"
                  >
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-muted border overflow-hidden shrink-0">
                            <img src={model.iconUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold truncate text-base">{model.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{model.shortDescription}</div>
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-border/50 flex justify-between items-center">
                        <span className="text-[10px] md:text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                            {model.featured ? "Currently Featured" : "Standard Listing"}
                        </span>
                        <Button size="sm" onClick={() => handleOpenBoost(model)} className="gap-2 h-8 text-xs md:text-sm">
                            <Rocket className="w-3 h-3" /> Boost
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-xl">
                <p className="text-muted-foreground mb-4">You don't have any approved tools to boost yet.</p>
                <Button onClick={() => navigate('/upload-model')} variant="outline">
                    Submit a Tool First
                </Button>
              </div>
            )}
          </div>

          {/* Pricing Info - Stack on mobile, Grid on Desktop */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-center">
             <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                <h4 className="font-bold text-green-600 mb-1">Budget Friendly</h4>
                <p className="text-sm text-muted-foreground">Start from just $1/day</p>
             </div>
             <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <h4 className="font-bold text-blue-600 mb-1">Flexible Duration</h4>
                <p className="text-sm text-muted-foreground">1 to 30 days - you choose</p>
             </div>
             <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <h4 className="font-bold text-purple-600 mb-1">Instant Activation</h4>
                <p className="text-sm text-muted-foreground">Live immediately after payment</p>
             </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Boost Modal Integration */}
      {selectedTool && (
        <BoostModal 
            isOpen={isBoostModalOpen} 
            onClose={() => {
                setIsBoostModalOpen(false);
                setSelectedTool(null);
            }}
            toolId={selectedTool.id}
            toolName={selectedTool.name}
        />
      )}
    </div>
  );
};

export default GetFeaturedPage;