// // // import React, { useState, useEffect } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { motion } from 'framer-motion';
// // // import { Star, Check, Loader2 } from 'lucide-react';
// // // import { Navbar } from '@/components/Navbar';
// // // import { modelsAPI, Model } from '@/api/api-methods';
// // // import { useAuth } from '@/contexts/AuthContext';
// // // import { useToast } from '@/hooks/use-toast';

// // // export const GetFeaturedPage = () => {
// // //   const navigate = useNavigate();
// // //   const { currentUser } = useAuth();
// // //   const { toast } = useToast();
  
// // //   const [userModels, setUserModels] = useState<Model[]>([]);
// // //   const [selectedModel, setSelectedModel] = useState<string>("");
// // //   const [loading, setLoading] = useState(true);
// // //   const [submitting, setSubmitting] = useState(false);

// // //   useEffect(() => {
// // //     if (currentUser) {
// // //       fetchUserModels();
// // //     }
// // //   }, [currentUser]);

// // //   const fetchUserModels = async () => {
// // //     try {
// // //       const res = await modelsAPI.getUserModels();
// // //       setUserModels(res.data.models);
// // //     } catch (error) {
// // //       console.error(error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handlePayment = async () => {
// // //     if (!selectedModel) return;
// // //     setSubmitting(true);
    
// // //     try {
// // //         // Here you would integrate Razorpay/Stripe
// // //         // For now, we simulate a successful transaction API call
// // //         await modelsAPI.updateModelTrending(selectedModel, { featured: true });
        
// // //         toast({ title: "Success!", description: "Your tool is now Featured!" });
// // //         navigate('/');
// // //     } catch (error) {
// // //         toast({ title: "Error", description: "Payment failed", variant: "destructive" });
// // //     } finally {
// // //         setSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-background pt-24 pb-12 px-4">
// // //       <Navbar />
// // //       <div className="max-w-3xl mx-auto">
// // //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
// // //           <div className="flex justify-center mb-4">
// // //             <div className="p-3 bg-yellow-500/10 rounded-full">
// // //               <Star className="w-8 h-8 text-yellow-500" />
// // //             </div>
// // //           </div>
// // //           <h1 className="text-4xl font-bold mb-4">Get Featured on Homepage</h1>
// // //           <p className="text-muted-foreground text-lg">Boost your visibility by 5x appearing in the "Soch AI Selection" section.</p>
// // //         </motion.div>

// // //         <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
// // //           <h3 className="text-xl font-semibold mb-6">1. Select Tool to Feature</h3>
          
// // //           {loading ? (
// // //             <Loader2 className="animate-spin" />
// // //           ) : userModels.length > 0 ? (
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
// // //               {userModels.map((model) => (
// // //                 <div 
// // //                   key={model._id}
// // //                   onClick={() => setSelectedModel(model._id)}
// // //                   className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedModel === model._id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}
// // //                 >
// // //                   <div className="font-bold">{model.name}</div>
// // //                   <div className="text-xs text-muted-foreground truncate">{model.shortDescription}</div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           ) : (
// // //             <div className="text-center p-6 border border-dashed rounded-xl mb-8">
// // //                 <p>You haven't uploaded any tools yet.</p>
// // //                 <button onClick={() => navigate('/launch')} className="text-primary underline mt-2">Launch a tool first</button>
// // //             </div>
// // //           )}

// // //           <h3 className="text-xl font-semibold mb-6">2. Select Duration</h3>
// // //           <div className="p-6 border border-primary bg-primary/5 rounded-xl mb-8 flex justify-between items-center">
// // //             <div>
// // //                 <span className="font-bold text-lg">Weekly Feature</span>
// // //                 <ul className="text-sm text-muted-foreground mt-2 space-y-1">
// // //                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Homepage Placement</li>
// // //                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Verified Badge</li>
// // //                 </ul>
// // //             </div>
// // //             <div className="text-right">
// // //                 <span className="text-2xl font-bold">₹2,999</span>
// // //                 <span className="text-xs text-muted-foreground block">/week</span>
// // //             </div>
// // //           </div>

// // //           <button 
// // //             disabled={!selectedModel || submitting}
// // //             onClick={handlePayment}
// // //             className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
// // //           >
// // //             {submitting ? <Loader2 className="animate-spin mx-auto"/> : "Pay & Feature Now"}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };









// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import { Star, Check, Loader2 } from 'lucide-react';
// // import { Navbar } from '@/components/Navbar';
// // import { modelsAPI, Model } from '@/api/api-methods';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { useToast } from '@/hooks/use-toast';

// // export const GetFeaturedPage = () => {
// //   const navigate = useNavigate();
// //   const { currentUser } = useAuth();
// //   const { toast } = useToast();
  
// //   const [userModels, setUserModels] = useState<Model[]>([]);
// //   const [selectedModel, setSelectedModel] = useState<string>("");
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);

// //   useEffect(() => {
// //     if (currentUser) {
// //       fetchUserModels();
// //     }
// //   }, [currentUser]);

// //   const fetchUserModels = async () => {
// //     try {
// //       const res = await modelsAPI.getUserModels();
// //       setUserModels(res.data.models);
// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handlePayment = async () => {
// //     if (!selectedModel) return;
// //     setSubmitting(true);
    
// //     try {
// //         // ✅ FIX: Added dummy scores to satisfy strict backend validation
// //         // (If backend expects numbers, sending undefined might cause 400)
// //         await modelsAPI.updateModelTrending(selectedModel, { 
// //             featured: true,
// //             trendingScore: 100, // Boost score since they paid
// //             categoryTrendingScore: 100 
// //         });
        
// //         toast({ title: "Success!", description: "Your tool is now Featured!" });
// //         navigate('/');
// //     } catch (error: any) {
// //         console.error("Payment API Error:", error);
// //         toast({ 
// //             title: "Error", 
// //             description: error.response?.data?.message || "Payment failed. Please try again.", 
// //             variant: "destructive" 
// //         });
// //     } finally {
// //         setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-background pt-24 pb-12 px-4">
// //       <Navbar />
// //       <div className="max-w-3xl mx-auto">
// //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
// //           <div className="flex justify-center mb-4">
// //             <div className="p-3 bg-yellow-500/10 rounded-full">
// //               <Star className="w-8 h-8 text-yellow-500" />
// //             </div>
// //           </div>
// //           <h1 className="text-4xl font-bold mb-4">Get Featured on Homepage</h1>
// //           <p className="text-muted-foreground text-lg">Boost your visibility by 5x appearing in the "Soch AI Selection" section.</p>
// //         </motion.div>

// //         <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
// //           <h3 className="text-xl font-semibold mb-6">1. Select Tool to Feature</h3>
          
// //           {loading ? (
// //             <Loader2 className="animate-spin" />
// //           ) : userModels.length > 0 ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
// //               {userModels.map((model) => (
// //                 <div 
// //                   key={model._id}
// //                   onClick={() => setSelectedModel(model._id)}
// //                   className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedModel === model._id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}
// //                 >
// //                   <div className="font-bold">{model.name}</div>
// //                   <div className="text-xs text-muted-foreground truncate">{model.shortDescription}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center p-6 border border-dashed rounded-xl mb-8">
// //                 <p>You haven't uploaded any tools yet.</p>
// //                 <button onClick={() => navigate('/launch')} className="text-primary underline mt-2">Launch a tool first</button>
// //             </div>
// //           )}

// //           <h3 className="text-xl font-semibold mb-6">2. Select Duration</h3>
// //           <div className="p-6 border border-primary bg-primary/5 rounded-xl mb-8 flex justify-between items-center">
// //             <div>
// //                 <span className="font-bold text-lg">Weekly Feature</span>
// //                 <ul className="text-sm text-muted-foreground mt-2 space-y-1">
// //                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Homepage Placement</li>
// //                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Verified Badge</li>
// //                 </ul>
// //             </div>
// //             <div className="text-right">
// //                 <span className="text-2xl font-bold">₹2,999</span>
// //                 <span className="text-xs text-muted-foreground block">/week</span>
// //             </div>
// //           </div>

// //           <button 
// //             disabled={!selectedModel || submitting}
// //             onClick={handlePayment}
// //             className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
// //           >
// //             {submitting ? <Loader2 className="animate-spin mx-auto"/> : "Pay & Feature Now"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Star, Check, Loader2 } from 'lucide-react';
// import { Navbar } from '@/components/Navbar';
// // 👇 CHANGE 1: Import adminAPI
// import { modelsAPI, adminAPI, Model } from '@/api/api-methods'; 
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

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
//     if (!selectedModel) return;
//     setSubmitting(true);
    
//     try {
//         // 👇 CHANGE 2: Use adminAPI instead of modelsAPI
//         await adminAPI.updateModelTrending(selectedModel, { 
//             featured: true,
//             trendingScore: 100, 
//             categoryTrendingScore: 100 
//         });
        
//         toast({ title: "Success!", description: "Your tool is now Featured!" });
//         navigate('/');
//     } catch (error: any) {
//         console.error("Payment API Error:", error);
//         toast({ 
//             title: "Error", 
//             description: error.response?.data?.message || "Payment failed. Please try again.", 
//             variant: "destructive" 
//         });
//     } finally {
//         setSubmitting(false);
//     }
//   };

//   // ... rest of your JSX (return statement) remains the same
//   return (
//     <div className="min-h-screen bg-background pt-24 pb-12 px-4">
//       <Navbar />
//       {/* ... keep your existing JSX content ... */}
//       <div className="max-w-3xl mx-auto">
//         {/* ... */}
//         <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
//            {/* ... form content ... */}
//            {/* Ensure the button calls handlePayment */}
//            <button 
//             disabled={!selectedModel || submitting}
//             onClick={handlePayment}
//             className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
//           >
//             {submitting ? <Loader2 className="animate-spin mx-auto"/> : "Pay & Feature Now"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };





// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Star, Check, Loader2 } from 'lucide-react';
// import { Navbar } from '@/components/Navbar';
// // ✅ Import modelsAPI (we don't need adminAPI anymore for this)
// import { modelsAPI, Model } from '@/api/api-methods';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

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
//     if (!selectedModel) return;
//     setSubmitting(true);
    
//     try {
//         // ✅ FIX: Use the new public promotion endpoint
//         await modelsAPI.promoteModel(selectedModel);
        
//         toast({ title: "Success!", description: "Payment received! Your tool is now Featured." });
//         navigate('/api/payments'); // Redirect to home to see the change
//     } catch (error: any) {
//         console.error("Payment API Error:", error);
//         toast({ 
//             title: "Error", 
//             description: error.message || "Payment failed. Please try again.", 
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
//             <Loader2 className="animate-spin" />
//           ) : userModels.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//               {userModels.map((model) => (
//                 <div 
//                   key={model._id}
//                   onClick={() => setSelectedModel(model._id)}
//                   className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedModel === model._id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}
//                 >
//                   <div className="font-bold">{model.name}</div>
//                   <div className="text-xs text-muted-foreground truncate">{model.shortDescription}</div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center p-6 border border-dashed rounded-xl mb-8">
//                 <p>You haven't uploaded any tools yet.</p>
//                 <button onClick={() => navigate('/launch')} className="text-primary underline mt-2">Launch a tool first</button>
//             </div>
//           )}

//           <h3 className="text-xl font-semibold mb-6">2. Select Duration</h3>
//           <div className="p-6 border border-primary bg-primary/5 rounded-xl mb-8 flex justify-between items-center">
//             <div>
//                 <span className="font-bold text-lg">Weekly Feature</span>
//                 <ul className="text-sm text-muted-foreground mt-2 space-y-1">
//                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Homepage Placement</li>
//                     <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Verified Badge</li>
//                 </ul>
//             </div>
//             <div className="text-right">
//                 <span className="text-2xl font-bold">₹2,999</span>
//                 <span className="text-xs text-muted-foreground block">/week</span>
//             </div>
//           </div>

//           <button 
//             disabled={!selectedModel || submitting}
//             onClick={handlePayment}
//             className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
//           >
//             {submitting ? <Loader2 className="animate-spin mx-auto"/> : "Pay & Feature Now"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Check, Loader2, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
// ✅ Import paymentAPI and modelsAPI
import { modelsAPI, paymentAPI, Model } from '@/api/api-methods';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Helper to load Razorpay SDK script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const GetFeaturedPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserModels();
    }
  }, [currentUser]);

  const fetchUserModels = async () => {
    try {
      const res = await modelsAPI.getUserModels();
      setUserModels(res.data.models);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedModel) {
      toast({ 
        title: "Selection Required", 
        description: "Please select a tool to feature.", 
        variant: "destructive" 
      });
      return;
    }
    
    setSubmitting(true);

    try {
        // 1. Load Razorpay SDK
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            throw new Error("Razorpay SDK failed to load. Check your internet connection.");
        }

        // 2. Create Promotion Order on Backend
        // This calls the endpoint: /api/payments/create-promotion-order
        const data = await paymentAPI.createPromotionOrder();
        
        if (!data || !data.success) {
            throw new Error(data?.message || "Failed to create payment order");
        }

        const { order, key_id } = data;

        // 3. Initialize Razorpay Checkout
        const options = {
            key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Soch AI Store",
            description: "Featured Tool Promotion (Weekly)",
            order_id: order.id,
            
            // 4. Success Handler
            handler: async function (response: any) {
                try {
                    toast({ 
                        title: "Processing...", 
                        description: "Verifying payment securely." 
                    });
                    
                    // 5. Verify Transaction on Backend & Activate Feature
                    // This calls: /api/payments/verify-promotion
                    const verifyRes = await paymentAPI.verifyPromotion({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        modelId: selectedModel // Pass the ID of the tool to feature
                    });

                    if (verifyRes.success) {
                        toast({ 
                            title: "🎉 Success!", 
                            description: "Payment received! Your tool is now Featured on the homepage.",
                            className: "bg-green-50 border-green-200 text-green-900"
                        });
                        navigate('/'); // Redirect to Home to see the change
                    } else {
                        throw new Error(verifyRes.message || "Verification failed");
                    }

                } catch (verifyErr: any) {
                    console.error("Verification Error:", verifyErr);
                    toast({ 
                        title: "Verification Failed", 
                        description: verifyErr.message || "Payment succeeded but activation failed. Contact support.", 
                        variant: "destructive" 
                    });
                }
            },
            prefill: {
                name: `${currentUser?.firstName} ${currentUser?.lastName}`,
                email: currentUser?.email,
                contact: currentUser?.mobileNumber || ""
            },
            theme: {
                color: "#eab308" // Gold/Yellow color for "Featured" theme
            }
        };

        const rzp = new (window as any).Razorpay(options);
        
        rzp.on('payment.failed', function (response: any) {
            toast({
                title: "Payment Failed",
                description: response.error.description || "Transaction was declined.",
                variant: "destructive"
            });
        });

        rzp.open();

    } catch (error: any) {
        console.error("Payment Init Error:", error);
        toast({ 
            title: "Error", 
            description: error.message || "Could not initiate payment.", 
            variant: "destructive" 
        });
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Get Featured on Homepage</h1>
          <p className="text-muted-foreground text-lg">Boost your visibility by 5x appearing in the "Soch AI Selection" section.</p>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-semibold mb-6">1. Select Tool to Feature</h3>
          
          {loading ? (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
          ) : userModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {userModels.map((model) => (
                <div 
                  key={model._id}
                  onClick={() => setSelectedModel(model._id)}
                  className={`relative p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedModel === model._id 
                      ? 'border-yellow-500 bg-yellow-500/5 ring-1 ring-yellow-500' 
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    {model.name}
                    {model.featured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/>}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{model.shortDescription}</div>
                  
                  {selectedModel === model._id && (
                    <div className="absolute top-2 right-2 text-yellow-600">
                        <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-xl mb-8">
                <p className="text-muted-foreground mb-2">You haven't uploaded any tools yet.</p>
                <button onClick={() => navigate('/upload-model')} className="text-primary font-medium hover:underline">
                    Launch a tool first
                </button>
            </div>
          )}

          <h3 className="text-xl font-semibold mb-6">2. Payment Details</h3>
          <div className="p-6 border border-yellow-500/30 bg-yellow-500/5 rounded-xl mb-8 flex justify-between items-center">
            <div>
                <span className="font-bold text-lg text-yellow-700 dark:text-yellow-500">Weekly Feature Plan</span>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> Top Homepage Spot</li>
                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> "Soch AI Selection" Badge</li>
                    <li className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-green-500"/> Secure Payment</li>
                </ul>
            </div>
            <div className="text-right">
                <span className="text-3xl font-bold">₹2,999</span>
                <span className="text-xs text-muted-foreground block">/week</span>
            </div>
          </div>

          <button 
            disabled={!selectedModel || submitting}
            onClick={handlePayment}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {submitting ? (
                <>
                    <Loader2 className="animate-spin w-5 h-5"/> Processing...
                </>
            ) : (
                <>
                    Pay ₹2,999 & Feature Tool <Star className="w-4 h-4 fill-current" />
                </>
            )}
          </button>
          
          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Secure payments powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
};