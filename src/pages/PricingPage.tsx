// // import React, { useState } from 'react';
// // import { Check, Star, Loader2 } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { Navbar } from '@/components/Navbar';
// // import { Footer } from '@/components/Footer';
// // import { useToast } from '@/hooks/use-toast';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { useNavigate } from 'react-router-dom';
// // import { authAPI } from '@/api/api-methods';
// // import Cookies from 'js-cookie';
// // import {subscriptionPlans} from '@/data/subscriptionPlans';

// // const PricingPage = () => {
// //   const { toast } = useToast();
// //   const { currentUser, updateAuthState } = useAuth();
// //   const navigate = useNavigate();
// //   const pricingPlans = subscriptionPlans;
// //   const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

// //   const loadRazorpayScript = () => {
// //     return new Promise<boolean>((resolve) => {
// //       if ((window as any).Razorpay) return resolve(true);
// //       const script = document.createElement('script');
// //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// //       script.onload = () => resolve(true);
// //       script.onerror = () => resolve(false);
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const handlePlanSelect = async (planId: string) => {
// //     try {
// //       setLoadingPlanId(planId);
      
// //       // Call backend to create an order
// //       const apiBase = import.meta.env.VITE_API_BASE_URL || '';
// //       // If plan requires sales contact (enterprise), go to Contact page instead of trying to process via payment SDK
// //       if (planId === 'enterprise') {
// //         toast({
// //           title: 'Contact Sales',
// //           description: 'For Enterprise/Annual plans, please contact our sales team for a custom quote.',
// //         });
// //         navigate('/contact');
// //         return;
// //       }

// //       // Free trial: direct the user to signup (no payment required)
// //       if (planId === 'free') {
// //         toast({
// //           title: 'Free Trial',
// //           description: 'Start your free trial by creating an account. No payment needed.',
// //         });
// //         navigate('/signup');
// //         return;
// //       }

// //       const res = await fetch(`${apiBase}/api/payments/create-order`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ planId })
// //       });

// //       // Ensure we got a valid 2xx response — otherwise show a helpful message
// //       if (!res.ok) {
// //         console.error('Failed to create order', res.status, res.statusText);
// //         // 404 likely means that the backend route is not available or the API base URL is wrong
// //         toast({
// //           title: 'Payment Initialization Failed',
// //           description: res.status === 404 ? 'Payment endpoint not found on the server. Please contact support or try again later.' : 'Failed to initialize payment. Please try again later.',
// //           variant: 'destructive'
// //         });
// //         return;
// //       }

// //       // Check content type, avoid parsing HTML error pages as JSON
// //       const contentType = res.headers.get('content-type') || '';
// //       if (!contentType.includes('application/json')) {
// //         const text = await res.text();
// //         console.error('Unexpected response (not JSON):', text.substring(0, 400));
// //         toast({
// //           title: 'Payment Error',
// //           description: 'Unexpected server response while initializing payment. Please try again later.',
// //           variant: 'destructive'
// //         });
// //         return;
// //       }

// //       const data = await res.json();
// //       if (!data || !data.success) {
// //         console.error('Failed to create order', data);
// //         toast({
// //           title: 'Payment Error',
// //           description: data?.message || 'Failed to initialize payment. Please try again later.',
// //           variant: 'destructive'
// //         });
// //         return;
// //       }

// //       const { order, key_id } = data;

// //       const loaded = await loadRazorpayScript();
// //       if (!loaded) {
// //         alert('Could not load Razorpay SDK.');
// //         return;
// //       }

// //       const options = {
// //         key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
// //         amount: order.amount,
// //         currency: order.currency,
// //         name: 'SochAI',
// //         description: `${planId} subscription`,
// //         order_id: order.id,
// //         handler: async function (response: any) {
// //           // Payment successful — response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
// //           console.log('Payment successful', response);
          
// //             try {
// //             // Call backend to complete subscription
// //             const token = authAPI.getToken();
// //             if (!token) {
// //               throw new Error('Authentication required');
// //             }
            
// //             const completeRes = await fetch(`${apiBase}/api/payments/complete-subscription`, {
// //               method: 'POST',
// //               headers: { 
// //                 'Content-Type': 'application/json',
// //                 'Authorization': `Bearer ${token}`
// //               },
// //               body: JSON.stringify({ 
// //                 planId,
// //                 razorpay_payment_id: response.razorpay_payment_id,
// //                 razorpay_order_id: response.razorpay_order_id,
// //                 razorpay_signature: response.razorpay_signature
// //               })
// //             });
// //             // Ensure we got valid JSON and a 2xx response
// //             if (!completeRes.ok) {
// //               console.error('Failed to complete subscription', completeRes.status, completeRes.statusText);
// //               toast({
// //                 title: 'Subscription Update Failed',
// //                 description: 'Payment succeeded but updating the subscription failed. Contact support if you continue to see this.',
// //                 variant: 'destructive'
// //               });
// //               return;
// //             }

// //             const completeContentType = completeRes.headers.get('content-type') || '';
// //             if (!completeContentType.includes('application/json')) {
// //               const txt = await completeRes.text();
// //               console.error('Unexpected complete-subscription response (not JSON):', txt.substring(0, 400));
// //               toast({
// //                 title: 'Subscription Update Failed',
// //                 description: 'Unexpected response from server. Please contact support.',
// //                 variant: 'destructive'
// //               });
// //               return;
// //             }

// //             const completeData = await completeRes.json();
// //             if (completeData.success) {
// //               // Update user cookie and auth state with new user data
// //               if (completeData.data?.user) {
// //                 Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
// //                 updateAuthState();
// //               }
              
// //               // Show green success toast
// //               toast({
// //                 title: "✅ Successfully Subscribed!",
// //                 description: `You are now subscribed to the ${planId.toUpperCase()} plan. Enjoy all the premium features!`,
// //                 variant: "default",
// //                 className: "bg-green-50 border-green-200 text-green-800"
// //               });
// //             } else {
// //               throw new Error(completeData.message || 'Failed to complete subscription');
// //             }
// //           } catch (error: any) {
// //             console.error('Error completing subscription:', error);
// //             toast({
// //               title: "⚠️ Payment Successful, Subscription Pending",
// //               description: "Payment was successful but there was an issue updating your subscription. Please contact support.",
// //               variant: "destructive"
// //             });
// //           }
// //         },
// //         modal: {
// //           ondismiss: function () {
// //             console.log('Checkout closed');
// //           }
// //         },
// //         prefill: {
// //           name: '',
// //           email: ''
// //         },
// //         theme: {
// //           color: '#0ea5a0'
// //         }
// //       } as any;

// //       const rzp = new (window as any).Razorpay(options);
// //       rzp.open();
// //       setLoadingPlanId(null); // Clear loading state when Razorpay opens
// //     } catch (err) {
// //       console.error('Error in handlePlanSelect', err);
// //       alert('An error occurred while initiating payment.');
// //     } finally {
// //       setLoadingPlanId(null); // Ensure loading state is cleared
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <Navbar />
      
// //       <main className="container mx-auto px-4 py-12 pt-32">
// //         {/* Pricing Cards or Paid-user view */}
// //                 {currentUser && currentUser.isProUser ? (
// //                   <div className="max-w-3xl mx-auto">
// //                     <Card className="mb-8">
// //                       <CardHeader>
// //                         <CardTitle className="text-center">You have an active plan</CardTitle>
// //                         <CardDescription className="text-center">
// //                           {`Your current plan: ${currentUser.subscriptionType?.toUpperCase() || 'PRO'}`}
// //                         </CardDescription>
// //                       </CardHeader>
// //                       <CardContent className="text-center">
// //                         <p className="mb-4">You have an active subscription valid until:</p>
// //                         <p className="font-medium mb-4">{currentUser.subscriptionEndDate ? new Date(currentUser.subscriptionEndDate).toLocaleDateString() : 'N/A'}</p>
// //                         <div className="flex justify-center gap-4">
// //                           <Button onClick={() => navigate('/profile')}>Manage Subscription</Button>
// //                           <Button onClick={() => navigate('/pricing?show=upgrade')} className="bg-gradient-to-r from-primary to-blue-500 text-white">Upgrade</Button>
// //                         </div>
// //                       </CardContent>
// //                     </Card>

// //                     {/* Show upgrade cards separately */}
// //                     <div className="text-center mb-6">
// //                       <h3 className="text-lg font-semibold mb-2">Upgrade Options</h3>
// //                       <p className="text-sm text-muted-foreground">Choose an upgrade if you want extended benefits or enterprise features.</p>
// //                     </div>
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //                       {pricingPlans.filter(p => p.id !== 'free').map(plan => (
// //                         <Card key={plan.id} className="hover:shadow-lg transition">
// //                           <CardHeader className="text-center">
// //                             <CardTitle>{plan.name}</CardTitle>
// //                             <CardDescription>{plan.description}</CardDescription>
// //                             <div className="mt-2 text-2xl font-bold">{plan.price} <span className="text-sm text-muted-foreground">{plan.duration}</span></div>
// //                           </CardHeader>
// //                           <CardContent>
// //                             <ul className="space-y-2 mb-4">
// //                               {plan.features.map((f, i) => <li key={i} className="text-sm">{f}</li>)}
// //                             </ul>
// //                             <Button className="w-full" onClick={() => handlePlanSelect(plan.apiPlanId || plan.id)}>Upgrade to {plan.name}</Button>
// //                           </CardContent>
// //                         </Card>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
// //                     {pricingPlans.filter(p => p.id !== 'free').map((plan) => {
              
// //                       return (
// //                         <Card 
// //                           key={plan.id} 
// //                           className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
// //                             plan.popular ? 'border-primary shadow-xl scale-105' : 'hover:scale-105'
// //                           }`}>
// //                           {plan.popular && (
// //                             <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-blue-500 text-white text-center py-2 text-sm font-medium">
// //                               Most Popular
// //                             </div>
// //                           )}
                  
// //                           <CardHeader className={`text-center ${plan.popular ? 'pt-12' : ''}`}>
// //                             <div className="flex justify-center mb-4">
// //                               <div className={`p-3 rounded-full ${
// //                                 plan.popular ? 'bg-primary text-white' : 'bg-muted'
// //                               }`}>
// //                                 <Star className="w-6 h-6" />
// //                               </div>
// //                             </div>
                    
// //                             <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
// //                             <CardDescription className="text-muted-foreground">
// //                               {plan.description}
// //                             </CardDescription>
                    
// //                             <div className="mt-4">
// //                               <span className="text-4xl font-bold">{plan.price}</span>
// //                               <span className="text-muted-foreground">{plan.duration}</span>
// //                             </div>
// //                           </CardHeader>
                  
// //                           <CardContent className="space-y-6">
// //                             {/* Features */}
// //                             <div className="space-y-3">
// //                               <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
// //                                 Included Features
// //                               </h4>
// //                               <ul className="space-y-2">
// //                                 {plan.features.map((feature, index) => (
// //                                   <li key={index} className="flex items-start gap-3">
// //                                     <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
// //                                     <span className="text-sm">{feature}</span>
// //                                   </li>
// //                                 ))}
// //                               </ul>
// //                             </div>

// //                             {/* Limitations (for free plan) */}
// //                             {plan.limitations && plan.limitations.length > 0 && (
// //                               <div className="space-y-3">
// //                                 <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
// //                                   Limitations
// //                                 </h4>
// //                                 <ul className="space-y-2">
// //                                   {plan.limitations.map((limitation, index) => (
// //                                     <li key={index} className="flex items-start gap-3">
// //                                       <div className="w-4 h-4 border border-muted-foreground rounded-full mt-0.5 flex-shrink-0" />
// //                                       <span className="text-sm text-muted-foreground">{limitation}</span>
// //                                     </li>
// //                                   ))}
// //                                 </ul>
// //                               </div>
// //                             )}

// //                             {/* Button */}
// //                             <Button
// //                               variant={plan.popular ? 'default' : 'outline'}
// //                               className={`w-full mt-8 ${
// //                                 plan.popular 
// //                                   ? 'bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90' 
// //                                   : ''
// //                               }`}
// //                               onClick={() => handlePlanSelect(plan.apiPlanId || plan.id)}
// //                               disabled={loadingPlanId === (plan.apiPlanId || plan.id)}
// //                             >
// //                               {loadingPlanId === (plan.apiPlanId || plan.id) ? (
// //                                 <>
// //                                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
// //                                   Loading...
// //                                 </>
// //                               ) : (
// //                                 plan.id === 'free' ? 'Start Free Trial' : plan.apiPlanId === 'enterprise' ? 'Contact Sales' : 'Choose Plan'
// //                               )}
// //                             </Button>
// //                           </CardContent>
// //                         </Card>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //       </main>
      
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default PricingPage;




// import React, { useState } from 'react';
// import { Check, Star, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/Footer';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { subscriptionPlans } from '@/data/subscriptionPlans';
// import api from '../lib/api'; // Import your axios helper

// const PricingPage = () => {
//   const { toast } = useToast();
//   const { currentUser, updateAuthState } = useAuth();
//   const navigate = useNavigate();
//   const pricingPlans = subscriptionPlans;
//   const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

//   const loadRazorpayScript = () => {
//     return new Promise<boolean>((resolve) => {
//       if ((window as any).Razorpay) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePlanSelect = async (planId: string) => {
//     try {
//       setLoadingPlanId(planId);
      
//       // If plan requires sales contact (enterprise)
//       if (planId === 'enterprise') {
//         toast({
//           title: 'Contact Sales',
//           description: 'For Enterprise/Annual plans, please contact our sales team for a custom quote.',
//         });
//         navigate('/contact');
//         return;
//       }

//       // Free trial: direct the user to signup (no payment required)
//       if (planId === 'free') {
//         toast({
//           title: 'Free Trial',
//           description: 'Start your free trial by creating an account. No payment needed.',
//         });
//         navigate('/signup');
//         return;
//       }

//       // 1. Create Order via API (Axios automatically handles baseURL)
//       const res = await api.post('/payments/create-order', { planId });

//       const data = res.data;
//       if (!data || !data.success) {
//         throw new Error(data?.message || 'Failed to initialize payment');
//       }

//       const { order, key_id } = data;

//       const loaded = await loadRazorpayScript();
//       if (!loaded) {
//         alert('Could not load Razorpay SDK.');
//         return;
//       }

//       const options = {
//         key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: 'SochAI',
//         description: `${planId} subscription`,
//         order_id: order.id,
//         handler: async function (response: any) {
//           console.log('Payment successful', response);
          
//             try {
//             // 2. Complete Subscription via API
//             // Note: api.post automatically attaches the 'Authorization: Bearer token' header
//             // defined in src/lib/api.ts
//             const completeRes = await api.post('/payments/complete-subscription', {
//                 planId,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature
//             });

//             const completeData = completeRes.data;

//             if (completeData.success) {
//               // Update user cookie and auth state
//               if (completeData.data?.user) {
//                 Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
//                 updateAuthState();
//               }
              
//               toast({
//                 title: "✅ Successfully Subscribed!",
//                 description: `You are now subscribed to the ${planId.toUpperCase()} plan. Enjoy all the premium features!`,
//                 variant: "default",
//                 className: "bg-green-50 border-green-200 text-green-800"
//               });
              
//               // Optional: Refresh page or navigate
//               // window.location.reload(); 
//             } else {
//               throw new Error(completeData.message || 'Failed to complete subscription');
//             }
//           } catch (error: any) {
//             console.error('Error completing subscription:', error);
//             toast({
//               title: "⚠️ Payment Successful, Subscription Pending",
//               description: error.response?.data?.message || "Payment was successful but there was an issue updating your subscription.",
//               variant: "destructive"
//             });
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             console.log('Checkout closed');
//             setLoadingPlanId(null);
//           }
//         },
//         prefill: {
//           name: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : '',
//           email: currentUser?.email || ''
//         },
//         theme: {
//           color: '#0ea5a0'
//         }
//       } as any;

//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
//       // Keep loading state true until modal closes or payment finishes
      
//     } catch (err: any) {
//       console.error('Error in handlePlanSelect', err);
//       toast({
//         title: 'Payment Initialization Failed',
//         description: err.response?.data?.message || 'Failed to initialize payment. Please try again later.',
//         variant: 'destructive'
//       });
//       setLoadingPlanId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       <main className="container mx-auto px-4 py-12 pt-32">
//         {currentUser && currentUser.isProUser ? (
//           <div className="max-w-3xl mx-auto">
//             <Card className="mb-8 border-primary/20 bg-primary/5">
//               <CardHeader>
//                 <CardTitle className="text-center text-2xl">Active Subscription</CardTitle>
//                 <CardDescription className="text-center text-lg">
//                   {`Current Plan: ${currentUser.subscriptionType?.toUpperCase() || 'PRO'}`}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="text-center">
//                 <p className="mb-4 text-muted-foreground">Valid until:</p>
//                 <p className="font-bold text-xl mb-6">
//                   {currentUser.subscriptionEndDate ? new Date(currentUser.subscriptionEndDate).toLocaleDateString() : 'Lifetime'}
//                 </p>
//                 <div className="flex justify-center gap-4">
//                   <Button variant="outline" onClick={() => navigate('/profile')}>Manage Settings</Button>
//                   <Button onClick={() => navigate('/contact')} className="bg-gradient-to-r from-primary to-blue-500 text-white">Contact Support</Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="text-center mb-8">
//               <h3 className="text-xl font-bold mb-2">Available Upgrades</h3>
//             </div>
            
//             {/* Show Upgrade Options only */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
//               {pricingPlans.filter(p => p.id !== 'free' && p.id !== currentUser.subscriptionType).map(plan => (
//                 <Card key={plan.id} className="hover:shadow-lg transition">
//                   <CardHeader className="text-center">
//                     <CardTitle>{plan.name}</CardTitle>
//                     <div className="mt-2 text-2xl font-bold">{plan.price}</div>
//                   </CardHeader>
//                   <CardContent>
//                     <Button 
//                         className="w-full" 
//                         onClick={() => handlePlanSelect(plan.apiPlanId || plan.id)}
//                         disabled={loadingPlanId === (plan.apiPlanId || plan.id)}
//                     >
//                       {loadingPlanId === (plan.apiPlanId || plan.id) ? <Loader2 className="animate-spin" /> : `Switch to ${plan.name}`}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//             {pricingPlans.filter(p => p.id !== 'free').map((plan) => {
//               const isPopular = plan.popular;
//               return (
//                 <Card 
//                   key={plan.id} 
//                   className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col ${
//                     isPopular ? 'border-primary shadow-xl scale-105 z-10' : 'hover:scale-105'
//                   }`}
//                 >
//                   {isPopular && (
//                     <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-blue-500 text-white text-center py-2 text-sm font-medium">
//                       Most Popular
//                     </div>
//                   )}
            
//                   <CardHeader className={`text-center ${isPopular ? 'pt-12' : ''}`}>
//                     <div className="flex justify-center mb-4">
//                       <div className={`p-3 rounded-full ${isPopular ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
//                         <Star className="w-6 h-6" />
//                       </div>
//                     </div>
            
//                     <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
//                     <CardDescription className="text-muted-foreground mt-2">
//                       {plan.description}
//                     </CardDescription>
            
//                     <div className="mt-4">
//                       <span className="text-4xl font-bold">{plan.price}</span>
//                       <span className="text-muted-foreground ml-1">{plan.duration}</span>
//                     </div>
//                   </CardHeader>
            
//                   <CardContent className="space-y-6 flex-1 flex flex-col">
//                     <div className="space-y-3 flex-1">
//                       <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
//                         Everything in Free, plus:
//                       </h4>
//                       <ul className="space-y-3">
//                         {plan.features.map((feature, index) => (
//                           <li key={index} className="flex items-start gap-3">
//                             <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                             <span className="text-sm leading-tight">{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <Button
//                       variant={isPopular ? 'default' : 'outline'}
//                       className={`w-full mt-8 py-6 text-lg ${
//                         isPopular 
//                           ? 'bg-gradient-to-r from-primary to-blue-500 text-white hover:opacity-90' 
//                           : ''
//                       }`}
//                       onClick={() => handlePlanSelect(plan.apiPlanId || plan.id)}
//                       disabled={loadingPlanId === (plan.apiPlanId || plan.id)}
//                     >
//                       {loadingPlanId === (plan.apiPlanId || plan.id) ? (
//                         <>
//                           <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         plan.apiPlanId === 'enterprise' ? 'Contact Sales' : 'Get Started'
//                       )}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default PricingPage;




// import React, { useState } from 'react';
// import { Check, Loader2, Crown, Sparkles, Zap, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/Footer';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { subscriptionPlans } from '@/data/subscriptionPlans'; 
// import api from '../lib/api';

// const PricingPage = () => {
//   const { toast } = useToast();
//   const { currentUser, updateAuthState } = useAuth();
//   const navigate = useNavigate();
//   const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

//   // --- Payment Logic ---
//   const loadRazorpayScript = () => {
//     return new Promise<boolean>((resolve) => {
//       if ((window as any).Razorpay) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePlanSelect = async (planId: string) => {
//     try {
//       setLoadingPlanId(planId);

//       // 1. Login Check
//       if (!currentUser) {
//         toast({ title: "Login Required", description: "Please create an account to subscribe.", variant: "default" });
//         navigate('/signup');
//         return;
//       }

//       // 2. Create Order
//       const res = await api.post('/payments/create-order', { planId });
//       const data = res.data;

//       if (!data || !data.success) throw new Error(data?.message || 'Failed to initialize payment');

//       const { order, key_id } = data;
//       const loaded = await loadRazorpayScript();
//       if (!loaded) {
//         alert('Could not load Razorpay SDK.');
//         return;
//       }

//       const options = {
//         key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: 'SochAI Store',
//         description: `Subscription for ${planId}`,
//         order_id: order.id,
//         handler: async function (response: any) {
//           try {
//             const completeRes = await api.post('/payments/complete-subscription', {
//               planId,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature
//             });

//             const completeData = completeRes.data;
//             if (completeData.success) {
//               if (completeData.data?.user) {
//                 Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
//                 updateAuthState();
//               }
//               toast({
//                 title: "🎉 Welcome to Pro!",
//                 description: "Your subscription is active.",
//                 className: "bg-green-50 border-green-200 text-green-900"
//               });
//               navigate('/profile');
//             } else {
//               throw new Error(completeData.message);
//             }
//           } catch (error: any) {
//             console.error(error);
//             toast({
//               title: "Subscription Pending",
//               description: "Payment successful but update failed. Contact support.",
//               variant: "destructive"
//             });
//           }
//         },
//         prefill: {
//           name: `${currentUser.firstName} ${currentUser.lastName}`,
//           email: currentUser.email
//         },
//         theme: { color: '#0ea5a0' }
//       } as any;

//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
      
//     } catch (err: any) {
//       console.error(err);
//       toast({
//         title: 'Error',
//         description: err.response?.data?.message || 'Something went wrong.',
//         variant: 'destructive'
//       });
//       setLoadingPlanId(null); 
//     }
//   };

//   // --- Helper for Dynamic Styling ---
//   const getPlanStyles = (color: string | undefined, isPopular: boolean) => {
//     switch (color) {
//       case 'blue': return { border: 'border-primary/20', bg: 'bg-primary/5', text: 'text-primary', badge: 'bg-primary', btn: 'hover:bg-primary hover:text-white' };
//       case 'orange': return { border: 'border-primary/20', bg: 'bg-primary/5', text: 'text-primary', badge: 'bg-primary', btn: 'hover:bg-primary hover:text-white' };
//       case 'purple': return { border: 'border-primary/20', bg: 'bg-primary/5', text: 'text-primary', badge: 'bg-primary', btn: 'hover:bg-primary hover:text-white' };
//       // Default (Primary)
//       default: return { border: 'border-primary/20', bg: 'bg-primary/5', text: 'text-primary', badge: 'bg-primary', btn: 'hover:bg-primary hover:text-white' };
//     }
//   };

//   const getPlanIcon = (id: string) => {
//     if (id === 'lifetime') return <InfinityIcon className="w-6 h-6" />;
//     if (id === 'annual') return <ShieldCheck className="w-6 h-6" />;
//     if (id === 'six_months') return <Sparkles className="w-6 h-6" />;
//     return <Zap className="w-6 h-6" />;
//   };

//   return (
//     <div className="min-h-screen bg-background font-sans">
//       <Navbar />
      
//       <main className="container mx-auto px-4 py-24">
//         <div className="mb-12 text-center">
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//              Choose Your <span className="text-primary">Power</span>
//           </h1>
//           <p className="text-lg text-muted-foreground">
//              Whether you need a quick boost or lifetime access, we have a plan for every creator.
//           </p>
//         </div>

//         {/* --- ACTIVE PLAN VIEW --- */}
//         {currentUser && currentUser.isProUser && (
//           <Card className="max-w-2xl mx-auto mb-16 border-primary shadow-lg bg-gradient-to-br from-background to-primary/5">
//             <CardHeader className="text-center pb-2">
//               <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
//                 <Crown className="w-6 h-6" />
//               </div>
//               <CardTitle className="text-2xl">Active Subscription</CardTitle>
//               <CardDescription className="text-lg font-medium text-primary uppercase tracking-widest">
//                 {currentUser.subscriptionType || 'PRO'} PLAN
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="text-center pb-6">
//                <p className="text-muted-foreground mb-1">Valid Until</p>
//                <p className="text-2xl font-bold font-mono">
//                  {currentUser.subscriptionEndDate 
//                    ? new Date(currentUser.subscriptionEndDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
//                    : 'Forever'}
//                </p>
//             </CardContent>
//             <CardFooter className="flex justify-center border-t bg-muted/20 py-4">
//                <Button variant="outline" onClick={() => navigate('/contact')}>Need Help?</Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* --- PRICING GRID --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
//           {subscriptionPlans.map((plan) => {
//             const styles = getPlanStyles(plan.color, plan.popular || false);
//             const isPopular = plan.popular;
            
//             return (
//               <Card 
//                 key={plan.id} 
//                 className={`
//                   relative flex flex-col h-full transition-all duration-300 hover:shadow-xl
//                   /* 1. 'border' = 1px thin border (removed border-2)
//                      2. Removed scale properties so height/width is consistent
//                      3. z-10 ensures badges don't clip 
//                   */
//                   ${isPopular 
//                     ? `border ${styles.border} shadow-lg z-10` 
//                     : 'border border-border'
//                   }
//                 `}
//               >
//                 {/* Badge Logic: Shows for both Popular (6mo) and Limited Time (Lifetime) */}
//                 {plan.badge && (
//                   <div className="absolute -top-3 left-0 right-0 flex justify-center">
//                     <Badge className={`${styles.badge} hover:${styles.badge} px-3 py-1 text-xs shadow-md`}>
//                       {plan.badge}
//                     </Badge>
//                   </div>
//                 )}

//                 <CardHeader className={`text-center ${plan.badge ? 'pt-8' : 'pt-6'}`}>
//                   <div className={`mx-auto w-12 h-12 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center mb-4`}>
//                     {getPlanIcon(plan.id)}
//                   </div>
                  
//                   <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
//                   <CardDescription className="text-sm mt-2 min-h-[40px]">
//                     {plan.description}
//                   </CardDescription>
                  
//                   <div className="mt-4 flex items-end justify-center gap-1">
//                     <span className="text-3xl font-extrabold">{plan.price}</span>
//                     <span className="text-muted-foreground text-sm mb-1">/{plan.duration.replace('per ', '')}</span>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="flex-1">
//                   <ul className="space-y-3">
//                     {plan.features.map((feature, index) => (
//                       <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground text-left">
//                         {/* Green Ticks */}
//                         <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
//                         <span className="leading-snug">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>

//                 <CardFooter className="pt-4 pb-6">
//                   <Button
//                     variant={isPopular ? 'default' : 'outline'}
//                     className={`w-full font-semibold transition-all ${isPopular ? '' : styles.btn}`}
//                     onClick={() => handlePlanSelect(plan.id)}
//                     disabled={loadingPlanId === plan.id}
//                   >
//                     {loadingPlanId === plan.id ? (
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     ) : (
//                       'Choose Plan'
//                     )}
//                   </Button>
//                 </CardFooter>
//               </Card>
//             );
//           })}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default PricingPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Crown, Sparkles, Zap, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import Cookies from 'js-cookie';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Hooks & Context
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// API & Data
import api from '@/lib/api'; // Ensure this points to your axios instance
import { subscriptionPlans } from '@/data/subscriptionPlans'; 

const PricingPage = () => {
  const { toast } = useToast();
  const { currentUser, updateAuthState } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // --- Payment Logic ---
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlanSelect = async (planId: string) => {
    try {
      setLoadingPlanId(planId);

      // 1. Login Check
      if (!currentUser) {
        toast({ title: "Login Required", description: "Please create an account to subscribe.", variant: "default" });
        navigate('/signup');
        return;
      }

      // 2. Create Subscription Order (Backend)
      // ✅ Endpoint must match backend app.use('/api/payments', ...)
      const res = await api.post('/payments/create-order', { planId });
      const data = res.data;

      if (!data || !data.success) throw new Error(data?.message || 'Failed to initialize payment');

      const { order, key_id } = data;

      // 3. Load SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Could not load Razorpay SDK. Check your internet.');
        return;
      }

      // 4. Open Razorpay
      const options = {
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID, // Uses backend key or env fallback
        amount: order.amount,
        currency: order.currency,
        name: 'SochAI Store',
        description: `Subscription: ${planId}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            toast({ title: "Processing...", description: "Verifying your subscription status." });

            // 5. Verify & Activate Subscription (Backend)
            const completeRes = await api.post('/payments/complete-subscription', {
              planId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            const completeData = completeRes.data;

            if (completeData.success) {
              // Update local session
              if (completeData.data?.user) {
                Cookies.set('userData', JSON.stringify(completeData.data.user), { expires: 7 });
                await updateAuthState(); // Refresh context
              }
              
              toast({
                title: "🎉 Welcome to Pro!",
                description: "Your subscription is now active.",
                className: "bg-green-50 border-green-200 text-green-900"
              });
              
              navigate('/profile'); // Redirect to profile
            } else {
              throw new Error(completeData.message);
            }
          } catch (error: any) {
            console.error(error);
            toast({
              title: "Activation Failed",
              description: "Payment successful but account update failed. Contact support.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
          contact: currentUser.mobileNumber
        },
        theme: { color: '#7c3aed' } // Purple theme
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Something went wrong.',
        variant: 'destructive'
      });
    } finally {
      setLoadingPlanId(null); 
    }
  };

  // --- Styles Helper ---
  const getPlanStyles = (color: string | undefined, isPopular: boolean) => {
    // Default purple style for consistency
    return { 
        border: 'border-primary/50', 
        bg: 'bg-primary/5', 
        text: 'text-primary', 
        badge: 'bg-primary', 
        btn: 'hover:bg-primary hover:text-white' 
    };
  };

  const getPlanIcon = (id: string) => {
    if (id === 'lifetime') return <InfinityIcon className="w-6 h-6" />;
    if (id === 'annual') return <ShieldCheck className="w-6 h-6" />;
    if (id === 'six_months') return <Sparkles className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
             Choose Your <span className="text-primary">Power</span>
          </h1>
          <p className="text-lg text-muted-foreground">
             Unlock unlimited uploads and premium features.
          </p>
        </div>

        {/* --- ACTIVE PLAN CARD --- */}
        {currentUser && currentUser.isProUser && (
          <Card className="max-w-2xl mx-auto mb-16 border-primary shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Crown className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">Active Subscription</CardTitle>
              <CardDescription className="text-lg font-medium text-primary uppercase tracking-widest">
                {currentUser.subscriptionType || 'PRO'} PLAN
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
               <p className="text-muted-foreground mb-1">Valid Until</p>
               <p className="text-2xl font-bold font-mono">
                 {currentUser.subscriptionEndDate 
                   ? new Date(currentUser.subscriptionEndDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                   : 'Forever'}
               </p>
            </CardContent>
            <CardFooter className="flex justify-center border-t bg-muted/20 py-4">
               <Button variant="outline" onClick={() => navigate('/contact')}>Need Help?</Button>
            </CardFooter>
          </Card>
        )}

        {/* --- PRICING GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const styles = getPlanStyles(plan.color, plan.popular || false);
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id} 
                className={`
                  relative flex flex-col h-full transition-all duration-300 hover:shadow-xl
                  ${isPopular ? `border-2 ${styles.border} shadow-lg z-10` : 'border border-border'}
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <Badge className={`${styles.badge} px-3 py-1 text-xs shadow-md`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.badge ? 'pt-8' : 'pt-6'}`}>
                  <div className={`mx-auto w-12 h-12 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center mb-4`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mt-2 min-h-[40px]">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4 flex items-end justify-center gap-1">
                    <span className="text-3xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">/{plan.duration.replace('per ', '')}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground text-left">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={3} />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4 pb-6">
                  <Button
                    variant={isPopular ? 'default' : 'outline'}
                    className={`w-full font-semibold transition-all ${isPopular ? '' : styles.btn}`}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={loadingPlanId === plan.id}
                  >
                    {loadingPlanId === plan.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      'Choose Plan'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;