// // import { useState } from "react";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Label } from "@/components/ui/label";
// // import { Slider } from "@/components/ui/slider";
// // import { Rocket, Loader2, Calendar, Wallet } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";
// // import api from "@/lib/api"; // Your API instance

// // interface BoostModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   toolId: string;
// //   toolName: string;
// // }

// // export const BoostModal = ({ isOpen, onClose, toolId, toolName }: BoostModalProps) => {
// //   const [days, setDays] = useState(7); // Default 7 days
// //   const [isLoading, setIsLoading] = useState(false);
// //   const { toast } = useToast();
  
// //   const PRICE_PER_DAY = 50;
// //   const totalPrice = days * PRICE_PER_DAY;

// //   // Calculate end date for display
// //   const endDate = new Date();
// //   endDate.setDate(endDate.getDate() + days);

// //   // Helper for currency formatting
// //   const formatCurrency = (amount: number) => {
// //     return new Intl.NumberFormat('en-IN', {
// //       style: 'currency',
// //       currency: 'INR',
// //       maximumFractionDigits: 0
// //     }).format(amount);
// //   };

// //   const handlePayment = async () => {
// //     setIsLoading(true);
// //     try {
// //       // 1. Create Order
// //       const { data } = await api.post('/payments/create-boost-order', {
// //         toolId,
// //         days,
// //         amount: totalPrice
// //       });

// //       // 2. Open Razorpay
// //       const options = {
// //         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
// //         amount: data.order.amount,
// //         currency: "INR",
// //         name: "Soch AI Boost",
// //         description: `Boost ${toolName} for ${days} days`,
// //         order_id: data.order.id,
// //         handler: async function (response: any) {
// //           // 3. Verify
// //           await api.post('/payments/verify-boost', {
// //             razorpay_payment_id: response.razorpay_payment_id,
// //             razorpay_order_id: response.razorpay_order_id,
// //             razorpay_signature: response.razorpay_signature,
// //             toolId,
// //             days
// //           });
          
// //           toast({ 
// //             title: "Boost Activated! 🚀", 
// //             description: `Your tool is now featured for ${days} days.`,
// //             className: "bg-green-50 border-green-200"
// //           });
// //           onClose();
// //         },
// //         theme: { color: "#7c3aed" }
// //       };

// //       const rzp = new (window as any).Razorpay(options);
// //       rzp.open();

// //     } catch (error) {
// //       console.error(error);
// //       toast({ title: "Error", description: "Payment initiation failed.", variant: "destructive" });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
        
// //         {/* Header with Gradient */}
// //         <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 border-b">
// //           <DialogHeader>
// //             <DialogTitle className="flex items-center gap-2 text-xl">
// //               <Rocket className="w-5 h-5 text-primary fill-primary" /> 
// //               Boost Tool
// //             </DialogTitle>
// //             <p className="text-sm text-muted-foreground mt-1">
// //               Promoting <span className="font-semibold text-foreground">"{toolName}"</span>
// //             </p>
// //           </DialogHeader>
// //         </div>

// //         <div className="p-6 space-y-8">
          
// //           {/* Duration Slider Section */}
// //           <div className="space-y-4">
// //             <div className="flex justify-between items-end">
// //               <Label className="text-base font-semibold">Duration</Label>
// //               <span className="text-2xl font-bold text-primary">{days} <span className="text-sm font-normal text-muted-foreground">days</span></span>
// //             </div>
            
// //             <Slider 
// //               value={[days]} 
// //               onValueChange={(val) => setDays(val[0])} 
// //               min={1} 
// //               max={30} 
// //               step={1} 
// //               className="py-2 cursor-pointer"
// //             />
            
// //             <div className="flex justify-between text-xs text-muted-foreground font-medium">
// //               <span>1 Day</span>
// //               <span>30 Days</span>
// //             </div>

// //             <div className="flex items-center gap-2 text-xs bg-muted/50 p-2 rounded text-muted-foreground">
// //               <Calendar className="w-3 h-3" />
// //               <span>Runs until {endDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
// //             </div>
// //           </div>

// //           {/* Budget Summary Section */}
// //           <div className="bg-card border rounded-xl p-4 space-y-3">
// //             <div className="flex justify-between text-sm">
// //               <span className="text-muted-foreground">Daily Budget</span>
// //               <span className="font-medium">{formatCurrency(PRICE_PER_DAY)}</span>
// //             </div>
// //             <div className="h-px bg-border/50" />
// //             <div className="flex justify-between items-center">
// //               <span className="font-semibold">Total Cost</span>
// //               <div className="text-right">
// //                 <span className="text-xl font-bold block text-primary">{formatCurrency(totalPrice)}</span>
// //               </div>
// //             </div>
// //           </div>

// //         </div>

// //         <DialogFooter className="p-6 pt-0">
// //           <Button 
// //             className="w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20" 
// //             onClick={handlePayment} 
// //             disabled={isLoading}
// //           >
// //             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
// //               <span className="flex items-center gap-2">
// //                 <Wallet className="w-4 h-4" /> Pay {formatCurrency(totalPrice)} & Boost
// //               </span>
// //             )}
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };



// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Rocket, Loader2, Calendar, Wallet } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import api from "@/lib/api"; 

// interface BoostModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   toolId: string;
//   toolName: string;
// }

// export const BoostModal = ({ isOpen, onClose, toolId, toolName }: BoostModalProps) => {
//   const [days, setDays] = useState(7); 
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
  
//   const PRICE_PER_DAY = 50;
//   const totalPrice = days * PRICE_PER_DAY;

//   const endDate = new Date();
//   endDate.setDate(endDate.getDate() + days);

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

// const loadRazorpayScript = () => {
//     return new Promise<boolean>((resolve) => {
//       if ((window as any).Razorpay) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   // const handlePayment = async () => {
//   //   setIsLoading(true);
//   //   try {
//   //     // 1. Create Order
//   //     const { data } = await api.post('/payments/create-boost-order', {
//   //       toolId,
//   //       days,
//   //       amount: totalPrice
//   //     });

//   //     // 2. Open Razorpay
//   //     const options = {
//   //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//   //       amount: data.order.amount,
//   //       currency: "INR",
//   //       name: "Soch AI Boost",
//   //       description: `Boost ${toolName} for ${days} days`,
//   //       order_id: data.order.id,
//   //       handler: async function (response: any) {
//   //         // 3. Verify
//   //         await api.post('/payments/verify-boost', {
//   //           razorpay_payment_id: response.razorpay_payment_id,
//   //           razorpay_order_id: response.razorpay_order_id,
//   //           razorpay_signature: response.razorpay_signature,
//   //           toolId,
//   //           days
//   //         });
          
//   //         toast({ 
//   //           title: "Boost Activated! 🚀", 
//   //           description: `Your tool is now featured for ${days} days.`,
//   //           className: "bg-green-50 border-green-200 text-green-900"
//   //         });
//   //         onClose();
//   //       },
//   //       theme: { color: "#7c3aed" }
//   //     };

//   //     const rzp = new (window as any).Razorpay(options);
//   //     rzp.open();

//   //   } catch (error) {
//   //     console.error(error);
//   //     toast({ title: "Error", description: "Payment initiation failed.", variant: "destructive" });
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
// const handlePayment = async () => {
//     setIsLoading(true);
//     try {
//       // ✅ FIX: Load the SDK first!
//       const isLoaded = await loadRazorpayScript();
//       if (!isLoaded) {
//         toast({ title: "Error", description: "Razorpay SDK failed to load. Check connection.", variant: "destructive" });
//         setIsLoading(false);
//         return;
//       }

//       // 1. Create Order
//       const { data } = await api.post('/payments/create-boost-order', {
//         toolId,
//         days,
//         amount: totalPrice // Backend now expects simple toolId/days strings
//       });

//       // 2. Open Razorpay
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: data.order.amount,
//         currency: "INR",
//         name: "Soch AI Boost",
//         description: `Boost ${toolName} for ${days} days`,
//         order_id: data.order.id,
//         handler: async function (response: any) {
//              // ... existing handler code ...
//              await api.post('/payments/verify-boost', {
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//                 toolId,
//                 days
//              });
             
//              toast({ 
//                 title: "Boost Activated! 🚀", 
//                 description: `Your tool is now featured for ${days} days.`,
//                 className: "bg-green-50 border-green-200 text-green-900"
//              });
//              onClose();
//         },
//         theme: { color: "#7c3aed" }
//       };

//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();

//     } catch (error) {
//       console.error(error);
//       toast({ title: "Error", description: "Payment initiation failed.", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[400px] w-[95vw] p-0 overflow-hidden gap-0 rounded-xl">
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 border-b">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-xl">
//               <Rocket className="w-5 h-5 text-primary fill-primary" /> 
//               Boost Tool
//             </DialogTitle>
//             <p className="text-sm text-muted-foreground mt-1 truncate">
//               Promoting <span className="font-semibold text-foreground">"{toolName}"</span>
//             </p>
//           </DialogHeader>
//         </div>

//         <div className="p-6 space-y-8">
          
//           {/* Slider */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-end">
//               <Label className="text-base font-semibold">Duration</Label>
//               <span className="text-2xl font-bold text-primary">{days} <span className="text-sm font-normal text-muted-foreground">days</span></span>
//             </div>
            
//             <Slider 
//               value={[days]} 
//               onValueChange={(val) => setDays(val[0])} 
//               min={1} 
//               max={30} 
//               step={1} 
//               className="py-2 cursor-pointer"
//             />
            
//             <div className="flex justify-between text-xs text-muted-foreground font-medium">
//               <span>1 Day</span>
//               <span>30 Days</span>
//             </div>

//             <div className="flex items-center gap-2 text-xs bg-muted/50 p-2 rounded text-muted-foreground">
//               <Calendar className="w-3 h-3" />
//               <span>Runs until {endDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
//             </div>
//           </div>

//           {/* Budget */}
//           <div className="bg-card border rounded-xl p-4 space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Daily Budget</span>
//               <span className="font-medium">{formatCurrency(PRICE_PER_DAY)}</span>
//             </div>
//             <div className="h-px bg-border/50" />
//             <div className="flex justify-between items-center">
//               <span className="font-semibold">Total Cost</span>
//               <div className="text-right">
//                 <span className="text-xl font-bold block text-primary">{formatCurrency(totalPrice)}</span>
//               </div>
//             </div>
//           </div>

//         </div>

//         <DialogFooter className="p-6 pt-0">
//           <Button 
//             className="w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg" 
//             onClick={handlePayment} 
//             disabled={isLoading}
//           >
//             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
//               <span className="flex items-center gap-2">
//                 <Wallet className="w-4 h-4" /> Pay {formatCurrency(totalPrice)} & Boost
//               </span>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };










import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { modelsAPI } from "@/api/api-methods";

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  toolName: string;
}

const DURATION_OPTIONS = [
  { days: 7,  label: "7 Days",  description: "1 week spotlight" },
  { days: 14, label: "14 Days", description: "2 week spotlight" },
  { days: 30, label: "30 Days", description: "Full month spotlight" },
];

export const BoostModal = ({ isOpen, onClose, toolId, toolName }: BoostModalProps) => {
  const [selectedDays, setSelectedDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + selectedDays);

  const handleBoost = async () => {
    setIsLoading(true);
    try {
      await modelsAPI.boostModel(toolId, selectedDays);
      toast({
        title: "Boost Activated! 🚀",
        description: `"${toolName}" is now featured for ${selectedDays} days.`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Boost Failed",
        description: error.message || "Could not activate boost. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[95vw] p-0 overflow-hidden gap-0 rounded-xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Rocket className="w-5 h-5 text-yellow-500" />
              Boost Visibility
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Feature <span className="font-semibold text-foreground">"{toolName}"</span> in its category
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Select boost duration</p>

          <div className="space-y-2">
            {DURATION_OPTIONS.map(({ days, label, description }) => (
              <button
                key={days}
                onClick={() => setSelectedDays(days)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedDays === days
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-border hover:border-yellow-500/50"
                }`}
              >
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                {selectedDays === days && (
                  <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-start gap-2 text-xs bg-muted/50 p-3 rounded-lg text-muted-foreground">
            <Calendar className="w-3 h-3 mt-0.5 shrink-0" />
            <span>
              Featured until{" "}
              <strong>
                {endDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
              </strong>
              {" · "}Max 2 tools featured per category at a time
            </span>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            className="w-full h-11 text-base font-semibold bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
            onClick={handleBoost}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Activate Boost for {selectedDays} Days
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};