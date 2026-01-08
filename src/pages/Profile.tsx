// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { 
// //   User, Calendar, Mail, Phone, Upload, Eye, Clock, 
// //   CheckCircle, XCircle, Loader2, Edit, Trash2, MoreVertical, 
// //   BarChart2, Zap 
// // } from "lucide-react";
// // import { Navbar } from "@/components/Navbar";
// // import { Footer } from "@/components/Footer";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";
// // import { useAuth } from "@/contexts/AuthContext";
// // import { modelsAPI, Model } from "@/api/api-methods";
// // import { useToast } from "@/hooks/use-toast";
// // import { PromotionWidget } from "@/components/home/PromotionWidget"; 

// // const Profile = () => {
// //   const navigate = useNavigate();
// //   const { currentUser, isAuthenticated } = useAuth();
// //   const { toast } = useToast();
  
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [userModels, setUserModels] = useState<Model[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
  
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
// //   const [isDeleting, setIsDeleting] = useState(false);

// //   useEffect(() => {
// //     if (!isAuthenticated) {
// //       navigate('/login');
// //       return;
// //     }
// //     fetchUserModels();
// //   }, [isAuthenticated, navigate]);

// //   const fetchUserModels = async () => {
// //     try {
// //       setIsLoading(true);
// //       const response = await modelsAPI.getUserModels();
// //       setUserModels(response.data.models);
// //     } catch (error: any) {
// //       console.error('Failed to fetch user models:', error);
// //       toast({
// //         title: "Error",
// //         description: error.message || "Failed to fetch your models.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const getInitials = (firstName: string, lastName: string) => {
// //     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
// //   };

// //   const handleEditModel = (model: Model) => {
// //     navigate('/upload-model', { state: { editMode: true, modelData: model } });
// //   };

// //   const handleDeleteModel = async (model: Model) => {
// //     setModelToDelete(model);
// //     setDeleteDialogOpen(true);
// //   };

// //   const confirmDeleteModel = async () => {
// //     if (!modelToDelete) return;
// //     try {
// //       setIsDeleting(true);
// //       await modelsAPI.deleteModel(modelToDelete._id);
// //       toast({ title: "Success", description: "Model deleted successfully." });
// //       fetchUserModels(); // Refresh list
// //     } catch (error: any) {
// //       toast({
// //         title: "Error",
// //         description: error.message || "Failed to delete model.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsDeleting(false);
// //       setDeleteDialogOpen(false);
// //       setModelToDelete(null);
// //     }
// //   };

// //   const getStatusIcon = (status: string) => {
// //     switch (status) {
// //       case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
// //       case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
// //       default: return <Clock className="w-4 h-4 text-yellow-500" />;
// //     }
// //   };

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case 'approved': return 'bg-green-100 text-green-700 border-green-200';
// //       case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
// //       default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
// //     }
// //   };

// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric', month: 'short', day: 'numeric'
// //     });
// //   };

// //   // Calculate Insights
// //   const totalViews = userModels.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
// //   const totalModels = userModels.length;
// //   const pendingModels = userModels.filter(m => m.status === 'pending').length;
// //   const approvedModels = userModels.filter(m => m.status === 'approved').length;

// //   if (!currentUser) {
// //     return (
// //       <div className="min-h-screen bg-background flex items-center justify-center">
// //         <Loader2 className="w-8 h-8 animate-spin text-primary" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
// //       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
// //       <div className="container mx-auto px-4 py-8 pt-24">
        
// //         {/* --- 1. USER HEADER SECTION --- */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
// //           {/* User Details (2/3 Width) */}
// //           <div className="lg:col-span-2 space-y-6">
// //             <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
// //               <CardContent className="p-6">
// //                 <div className="flex flex-col sm:flex-row items-start gap-6">
// //                   <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
// //                     <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-3xl font-bold">
// //                       {getInitials(currentUser.firstName, currentUser.lastName)}
// //                     </AvatarFallback>
// //                   </Avatar>
                  
// //                   <div className="flex-1 space-y-4 w-full">
// //                     <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
// //                       <div>
// //                         <h1 className="text-3xl font-bold text-foreground">
// //                           {currentUser.firstName} {currentUser.lastName}
// //                         </h1>
// //                         <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
// //                           AI Model Developer 
// //                           {currentUser.isProUser && <Badge variant="default" className="text-xs bg-primary/20 text-primary border-0">PRO</Badge>}
// //                         </p>
// //                       </div>
                      
// //                       <div className="flex gap-3 w-full sm:w-auto">
// //                         <Button 
// //                           onClick={() => navigate('/upload-model')} 
// //                           className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
// //                         >
// //                           <Upload className="w-4 h-4 mr-2" /> Upload Tool
// //                         </Button>
// //                       </div>
// //                     </div>

// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/50">
// //                       <div className="flex items-center gap-3">
// //                         <Mail className="w-4 h-4 text-primary" /> {currentUser.email}
// //                       </div>
// //                       <div className="flex items-center gap-3">
// //                         <Calendar className="w-4 h-4 text-primary" /> Joined {formatDate(currentUser.createdAt)}
// //                       </div>
// //                       <div className="flex items-center gap-3">
// //                         <Zap className="w-4 h-4 text-primary" /> Plan: {currentUser.subscriptionType?.toUpperCase() || 'FREE'}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* --- INSIGHTS / STATS --- */}
// //             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
// //                 <Card className="bg-card/50 hover:bg-card transition-colors">
// //                     <CardContent className="p-4 text-center">
// //                         <p className="text-3xl font-bold text-foreground">{totalModels}</p>
// //                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Total Models</p>
// //                     </CardContent>
// //                 </Card>
// //                 <Card className="bg-card/50 hover:bg-card transition-colors">
// //                     <CardContent className="p-4 text-center">
// //                         <p className="text-3xl font-bold text-green-500">{approvedModels}</p>
// //                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Approved</p>
// //                     </CardContent>
// //                 </Card>
// //                 <Card className="bg-card/50 hover:bg-card transition-colors">
// //                     <CardContent className="p-4 text-center">
// //                         <p className="text-3xl font-bold text-yellow-500">{pendingModels}</p>
// //                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Pending</p>
// //                     </CardContent>
// //                 </Card>
// //                 <Card className="bg-card/50 hover:bg-card transition-colors border-primary/20 bg-primary/5">
// //                     <CardContent className="p-4 text-center">
// //                         <p className="text-3xl font-bold text-primary">{totalViews}</p>
// //                         <p className="text-xs text-primary/80 uppercase tracking-wider font-medium mt-1">Total Views</p>
// //                     </CardContent>
// //                 </Card>
// //             </div>
// //           </div>

// //           {/* Right: Promotion Widget (1/3 Width) */}
// //           <div className="lg:col-span-1">
// //              <PromotionWidget />
// //           </div>
// //         </div>

// //         {/* --- 2. MY MODELS LIST --- */}
// //         <Card className="border-border/60 shadow-sm">
// //           <CardHeader className="flex flex-row items-center justify-between">
// //             <div>
// //                 <CardTitle className="flex items-center gap-2 text-xl">
// //                   <User className="w-5 h-5 text-primary" /> My AI Tools
// //                 </CardTitle>
// //                 <CardDescription>Manage your uploads and view performance</CardDescription>
// //             </div>
// //             {/* Insights Button (Optional action) */}
// //             <Button variant="outline" size="sm" className="gap-2 hidden sm:flex pointer-events-none opacity-50">
// //                 <BarChart2 className="w-4 h-4" /> detailed insights coming soon
// //             </Button>
// //           </CardHeader>
          
// //           <CardContent>
// //             {isLoading ? (
// //               <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
// //                 <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
// //                 <p>Loading your tools...</p>
// //               </div>
// //             ) : userModels.length === 0 ? (
// //               <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
// //                 <div className="bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
// //                     <Upload className="w-8 h-8 text-muted-foreground" />
// //                 </div>
// //                 <h3 className="text-lg font-semibold mb-2">No models uploaded yet</h3>
// //                 <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
// //                   Share your AI tool with the world. Track views, get feedback, and grow your audience.
// //                 </p>
// //                 <Button onClick={() => navigate('/upload-model')} className="bg-primary hover:bg-primary/90">
// //                   Upload Your First Tool
// //                 </Button>
// //               </div>
// //             ) : (
// //               <div className="space-y-4">
// //                 {userModels.map((model) => (
// //                   <div key={model._id} className="group border border-border/60 bg-card/50 hover:bg-card hover:border-primary/30 rounded-xl p-4 transition-all duration-200">
// //                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
// //                       {/* Model Info */}
// //                       <div className="flex items-start gap-4 flex-1">
// //                         <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 text-xl font-bold text-primary overflow-hidden">
// //                           {model.iconUrl ? <img src={model.iconUrl} className="w-full h-full object-cover" /> : model.name.charAt(0)}
// //                         </div>
// //                         <div className="min-w-0 flex-1">
// //                           <div className="flex items-center gap-2 mb-1 flex-wrap">
// //                             <h3 className="font-bold text-lg truncate hover:text-primary cursor-pointer" onClick={() => navigate(`/model/${model._id}`)}>
// //                                 {model.name}
// //                             </h3>
// //                             <Badge variant="outline" className={`h-5 text-[10px] ${getStatusColor(model.status)}`}>
// //                                 {getStatusIcon(model.status)} <span className="ml-1 capitalize">{model.status}</span>
// //                             </Badge>
// //                           </div>
// //                           <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{model.shortDescription}</p>
                          
// //                           {/* Individual Tool Views */}
// //                           <div className="flex items-center gap-4 text-xs text-muted-foreground">
// //                              <span className="flex items-center gap-1 text-primary/80 font-medium">
// //                                 <Eye className="w-3 h-3" /> {model.clicks || 0} views
// //                              </span>
// //                              <span className="hidden sm:inline">•</span>
// //                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(model.createdAt)}</span>
// //                              <span className="hidden sm:inline">•</span>
// //                              <span className="capitalize">{model.category}</span>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Actions */}
// //                       <div className="flex items-center gap-2 self-end sm:self-center">
// //                         <Button variant="ghost" size="sm" onClick={() => navigate(`/model/${model._id}`)}>
// //                             View
// //                         </Button>
                        
// //                         <DropdownMenu>
// //                           <DropdownMenuTrigger asChild>
// //                             <Button variant="ghost" size="icon" className="h-8 w-8">
// //                               <MoreVertical className="h-4 w-4" />
// //                             </Button>
// //                           </DropdownMenuTrigger>
// //                           <DropdownMenuContent align="end">
// //                             <DropdownMenuItem onClick={() => handleEditModel(model)}>
// //                               <Edit className="w-4 h-4 mr-2" /> Edit Details
// //                             </DropdownMenuItem>
// //                             <DropdownMenuItem onClick={() => handleDeleteModel(model)} className="text-red-600 focus:text-red-600">
// //                               <Trash2 className="w-4 h-4 mr-2" /> Delete
// //                             </DropdownMenuItem>
// //                           </DropdownMenuContent>
// //                         </DropdownMenu>
// //                       </div>

// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <Footer />

// //       {/* Delete Confirmation Dialog */}
// //       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle>Delete Tool?</AlertDialogTitle>
// //             <AlertDialogDescription>
// //               Are you sure you want to delete "{modelToDelete?.name}"? This action cannot be undone.
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter>
// //             <AlertDialogCancel>Cancel</AlertDialogCancel>
// //             <AlertDialogAction
// //               onClick={confirmDeleteModel}
// //               className="bg-red-500 hover:bg-red-600"
// //               disabled={isDeleting}
// //             >
// //               {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Delete'}
// //             </AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </div>
// //   );
// // };

// // export default Profile;






// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   User, Calendar, Mail, Upload, Eye, Clock, 
//   CheckCircle, XCircle, Loader2, Edit, Trash2, MoreVertical, 
//   BarChart2, Zap, Rocket 
// } from "lucide-react";
// import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useAuth } from "@/contexts/AuthContext";
// import { modelsAPI, Model } from "@/api/api-methods";
// import { useToast } from "@/hooks/use-toast";
// import { PromotionWidget } from "@/components/home/PromotionWidget"; 
// import { BoostModal } from "./BoostModal";
// const Profile = () => {
//   const navigate = useNavigate();
//   const { currentUser, isAuthenticated } = useAuth();
//   const { toast } = useToast();
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userModels, setUserModels] = useState<Model[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Boost Modal State
//   const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
//   const [toolToBoost, setToolToBoost] = useState<{ id: string; name: string } | null>(null);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }
//     fetchUserModels();
//   }, [isAuthenticated, navigate]);

//   const fetchUserModels = async () => {
//     try {
//       setIsLoading(true);
//       const response = await modelsAPI.getUserModels();
//       setUserModels(response.data.models);
//     } catch (error: any) {
//       console.error('Failed to fetch user models:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to fetch your models.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getInitials = (firstName: string, lastName: string) => {
//     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
//   };

//   const handleEditModel = (model: Model) => {
//     navigate('/upload-model', { state: { editMode: true, modelData: model } });
//   };

//   const handleDeleteModel = async (model: Model) => {
//     setModelToDelete(model);
//     setDeleteDialogOpen(true);
//   };

//   const handleBoostModel = (model: Model) => {
//     setToolToBoost({ id: model._id, name: model.name });
//     setIsBoostModalOpen(true);
//   };

//   const confirmDeleteModel = async () => {
//     if (!modelToDelete) return;
//     try {
//       setIsDeleting(true);
//       await modelsAPI.deleteModel(modelToDelete._id);
//       toast({ title: "Success", description: "Model deleted successfully." });
//       fetchUserModels(); // Refresh list
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete model.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsDeleting(false);
//       setDeleteDialogOpen(false);
//       setModelToDelete(null);
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-yellow-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'approved': return 'bg-green-100 text-green-700 border-green-200';
//       case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
//       default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric'
//     });
//   };

//   // Calculate Insights
//   const totalViews = userModels.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
//   const totalModels = userModels.length;
//   const pendingModels = userModels.filter(m => m.status === 'pending').length;
//   const approvedModels = userModels.filter(m => m.status === 'approved').length;

//   if (!currentUser) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
//       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
//       <div className="container mx-auto px-4 py-8 pt-24">
        
//         {/* --- 1. USER HEADER SECTION --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
//           {/* User Details (2/3 Width) */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
//               <CardContent className="p-6">
//                 <div className="flex flex-col sm:flex-row items-start gap-6">
//                   <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
//                     <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-3xl font-bold">
//                       {getInitials(currentUser.firstName, currentUser.lastName)}
//                     </AvatarFallback>
//                   </Avatar>
                  
//                   <div className="flex-1 space-y-4 w-full">
//                     <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
//                       <div>
//                         <h1 className="text-3xl font-bold text-foreground">
//                           {currentUser.firstName} {currentUser.lastName}
//                         </h1>
//                         {/* ✅ FIXED: Changed <p> to <div> to allow Badge (div) nesting */}
//                         <div className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
//                           AI Model Developer 
//                           {currentUser.isProUser && <Badge variant="default" className="text-xs bg-primary/20 text-primary border-0">PRO</Badge>}
//                         </div>
//                       </div>
                      
//                       <div className="flex gap-3 w-full sm:w-auto">
//                         <Button 
//                           onClick={() => navigate('/upload-model')} 
//                           className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
//                         >
//                           <Upload className="w-4 h-4 mr-2" /> Upload Tool
//                         </Button>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/50">
//                       <div className="flex items-center gap-3">
//                         <Mail className="w-4 h-4 text-primary" /> {currentUser.email}
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <Calendar className="w-4 h-4 text-primary" /> Joined {formatDate(currentUser.createdAt)}
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <Zap className="w-4 h-4 text-primary" /> Plan: {currentUser.subscriptionType?.toUpperCase() || 'FREE'}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* --- INSIGHTS / STATS --- */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 <Card className="bg-card/50 hover:bg-card transition-colors">
//                     <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-foreground">{totalModels}</p>
//                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Total Models</p>
//                     </CardContent>
//                 </Card>
//                 <Card className="bg-card/50 hover:bg-card transition-colors">
//                     <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-green-500">{approvedModels}</p>
//                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Approved</p>
//                     </CardContent>
//                 </Card>
//                 <Card className="bg-card/50 hover:bg-card transition-colors">
//                     <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-yellow-500">{pendingModels}</p>
//                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Pending</p>
//                     </CardContent>
//                 </Card>
//                 <Card className="bg-card/50 hover:bg-card transition-colors border-primary/20 bg-primary/5">
//                     <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-primary">{totalViews}</p>
//                         <p className="text-xs text-primary/80 uppercase tracking-wider font-medium mt-1">Total Views</p>
//                     </CardContent>
//                 </Card>
//             </div>
//           </div>

//           {/* Right: Promotion Widget (1/3 Width) */}
//           <div className="lg:col-span-1">
//              <PromotionWidget />
//           </div>
//         </div>

//         {/* --- 2. MY MODELS LIST --- */}
//         <Card className="border-border/60 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <div>
//                 <CardTitle className="flex items-center gap-2 text-xl">
//                   <User className="w-5 h-5 text-primary" /> My AI Tools
//                 </CardTitle>
//                 <CardDescription>Manage your uploads and view performance</CardDescription>
//             </div>
//             {/* Insights Button (Optional action) */}
//             <Button variant="outline" size="sm" className="gap-2 hidden sm:flex pointer-events-none opacity-50">
//                 <BarChart2 className="w-4 h-4" /> detailed insights coming soon
//             </Button>
//           </CardHeader>
          
//           <CardContent>
//             {isLoading ? (
//               <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//                 <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
//                 <p>Loading your tools...</p>
//               </div>
//             ) : userModels.length === 0 ? (
//               <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
//                 <div className="bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                     <Upload className="w-8 h-8 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">No models uploaded yet</h3>
//                 <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
//                   Share your AI tool with the world. Track views, get feedback, and grow your audience.
//                 </p>
//                 <Button onClick={() => navigate('/upload-model')} className="bg-primary hover:bg-primary/90">
//                   Upload Your First Tool
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {userModels.map((model) => (
//                   <div key={model._id} className="group border border-border/60 bg-card/50 hover:bg-card hover:border-primary/30 rounded-xl p-4 transition-all duration-200">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
//                       {/* Model Info */}
//                       <div className="flex items-start gap-4 flex-1">
//                         <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 text-xl font-bold text-primary overflow-hidden">
//                           {model.iconUrl ? <img src={model.iconUrl} className="w-full h-full object-cover" /> : model.name.charAt(0)}
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <div className="flex items-center gap-2 mb-1 flex-wrap">
//                             <h3 className="font-bold text-lg truncate hover:text-primary cursor-pointer" onClick={() => navigate(`/model/${model._id}`)}>
//                                 {model.name}
//                             </h3>
//                             <Badge variant="outline" className={`h-5 text-[10px] ${getStatusColor(model.status)}`}>
//                                 {getStatusIcon(model.status)} <span className="ml-1 capitalize">{model.status}</span>
//                             </Badge>
//                           </div>
//                           <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{model.shortDescription}</p>
                          
//                           {/* Individual Tool Views */}
//                           <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                              <span className="flex items-center gap-1 text-primary/80 font-medium">
//                                 <Eye className="w-3 h-3" /> {model.clicks || 0} views
//                              </span>
//                              <span className="hidden sm:inline">•</span>
//                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(model.createdAt)}</span>
//                              <span className="hidden sm:inline">•</span>
//                              <span className="capitalize">{model.category}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex items-center gap-2 self-end sm:self-center">
//                         {/* ✅ NEW: Quick Boost Button (Visible if Approved) */}
//                         {model.status === 'approved' && (
//                            <Button 
//                              size="sm" 
//                              className="bg-yellow-500 hover:bg-yellow-600 text-white hidden sm:flex"
//                              onClick={() => handleBoostModel(model)}
//                            >
//                              <Rocket className="w-3 h-3 mr-1" /> Boost
//                            </Button>
//                         )}

//                         <Button variant="ghost" size="sm" onClick={() => navigate(`/model/${model._id}`)}>
//                             View
//                         </Button>
                        
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => handleEditModel(model)}>
//                               <Edit className="w-4 h-4 mr-2" /> Edit Details
//                             </DropdownMenuItem>
                            
//                             {/* ✅ NEW: Boost Option in Dropdown (Mobile support) */}
//                             {model.status === 'approved' && (
//                                 <DropdownMenuItem onClick={() => handleBoostModel(model)} className="text-yellow-600 focus:text-yellow-700">
//                                   <Rocket className="w-4 h-4 mr-2" /> Boost Visibility
//                                 </DropdownMenuItem>
//                             )}

//                             <DropdownMenuItem onClick={() => handleDeleteModel(model)} className="text-red-600 focus:text-red-600">
//                               <Trash2 className="w-4 h-4 mr-2" /> Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>

//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <Footer />

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Tool?</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete "{modelToDelete?.name}"? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDeleteModel}
//               className="bg-red-500 hover:bg-red-600"
//               disabled={isDeleting}
//             >
//               {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Delete'}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* ✅ NEW: Boost Modal Integration */}
//       {toolToBoost && (
//         <BoostModal
//           isOpen={isBoostModalOpen}
//           onClose={() => {
//             setIsBoostModalOpen(false);
//             setToolToBoost(null);
//           }}
//           toolId={toolToBoost.id}
//           toolName={toolToBoost.name}
//         />
//       )}
//     </div>
//   );
// };

// export default Profile;





import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Calendar, Mail, Upload, Eye, Clock, 
  CheckCircle, XCircle, Loader2, Edit, Trash2, MoreVertical, 
  BarChart2, Zap, Rocket 
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { modelsAPI, Model } from "@/api/api-methods";
import { useToast } from "@/hooks/use-toast";
import { PromotionWidget } from "@/components/home/PromotionWidget"; 
// Ensure BoostModal is in the same folder or update path accordingly
import { BoostModal } from "./BoostModal"; 

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Boost Modal State
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [toolToBoost, setToolToBoost] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserModels();
  }, [isAuthenticated, navigate]);

  const fetchUserModels = async () => {
    try {
      setIsLoading(true);
      const response = await modelsAPI.getUserModels();
      setUserModels(response.data.models);
    } catch (error: any) {
      console.error('Failed to fetch user models:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch your models.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleEditModel = (model: Model) => {
    navigate('/upload-model', { state: { editMode: true, modelData: model } });
  };

  const handleDeleteModel = async (model: Model) => {
    setModelToDelete(model);
    setDeleteDialogOpen(true);
  };

  const handleBoostModel = (model: Model) => {
    setToolToBoost({ id: model._id, name: model.name });
    setIsBoostModalOpen(true);
  };

  // const confirmDeleteModel = async () => {
  //   if (!modelToDelete) return;
  //   try {
  //     setIsDeleting(true);
  //     await modelsAPI.deleteModel(modelToDelete._id);
  //     toast({ title: "Success", description: "Model deleted successfully." });
  //     fetchUserModels(); // Refresh list
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to delete model.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsDeleting(false);
  //     setDeleteDialogOpen(false);
  //     setModelToDelete(null);
  //   }
  // };

  const confirmDeleteModel = async () => {
    if (!modelToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // 1. Call the Backend API
      await modelsAPI.deleteModel(modelToDelete._id);
      
      // 2. ✅ FIX: Update the UI immediately by filtering the local array
      // This removes the model from the screen instantly without waiting for a re-fetch
      setUserModels((currentModels) => 
        currentModels.filter((model) => model._id !== modelToDelete._id)
      );

      toast({ title: "Success", description: "Model deleted successfully." });
      
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete model.",
        variant: "destructive",
      });
      // Optional: Re-fetch only if there was an error to ensure UI sync
      fetchUserModels(); 
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setModelToDelete(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Calculate Insights
  const totalViews = userModels.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalModels = userModels.length;
  const pendingModels = userModels.filter(m => m.status === 'pending').length;
  const approvedModels = userModels.filter(m => m.status === 'approved').length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Container: Added bottom padding so content isn't covered by mobile navs */}
      <div className="flex-1 container mx-auto px-4 py-6 md:py-10 pt-20 md:pt-24 pb-24">
        
        {/* --- 1. USER HEADER SECTION --- */}
        {/* Grid: Stack on mobile (1 col), Split on Desktop (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          
          {/* User Details (2/3 Width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                
                {/* Flex: Stack Vertically on Mobile, Row on Desktop */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  
                  {/* Avatar */}
                  <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-background shadow-xl shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-2xl md:text-3xl font-bold">
                      {getInitials(currentUser.firstName, currentUser.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                          {currentUser.firstName} {currentUser.lastName}
                        </h1>
                        {/* ✅ FIXED: Changed <p> to <div> to solve DOM Nesting Warning */}
                        <div className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                          AI Model Developer 
                          {currentUser.isProUser && <Badge variant="default" className="text-xs bg-primary/20 text-primary border-0">PRO</Badge>}
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto">
                        <Button 
                          onClick={() => navigate('/upload-model')} 
                          className="w-full md:w-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        >
                          <Upload className="w-4 h-4 mr-2" /> Upload Tool
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground bg-muted/30 p-3 md:p-4 rounded-xl border border-border/50 text-left">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-primary shrink-0" /> <span className="truncate">{currentUser.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary shrink-0" /> Joined {formatDate(currentUser.createdAt)}
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-primary shrink-0" /> Plan: {currentUser.subscriptionType?.toUpperCase() || 'FREE'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- INSIGHTS / STATS --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card className="bg-card/50 hover:bg-card transition-colors">
                    <CardContent className="p-3 md:p-4 text-center">
                        <p className="text-2xl md:text-3xl font-bold text-foreground">{totalModels}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Total Models</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 hover:bg-card transition-colors">
                    <CardContent className="p-3 md:p-4 text-center">
                        <p className="text-2xl md:text-3xl font-bold text-green-500">{approvedModels}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Approved</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 hover:bg-card transition-colors">
                    <CardContent className="p-3 md:p-4 text-center">
                        <p className="text-2xl md:text-3xl font-bold text-yellow-500">{pendingModels}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Pending</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 hover:bg-card transition-colors border-primary/20 bg-primary/5">
                    <CardContent className="p-3 md:p-4 text-center">
                        <p className="text-2xl md:text-3xl font-bold text-primary">{totalViews}</p>
                        <p className="text-[10px] md:text-xs text-primary/80 uppercase tracking-wider font-medium mt-1">Total Views</p>
                    </CardContent>
                </Card>
            </div>
          </div>

          {/* Right: Promotion Widget (1/3 Width on Desktop) */}
          <div className="lg:col-span-1">
             <PromotionWidget />
          </div>
        </div>

        {/* --- 2. MY MODELS LIST --- */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-primary" /> My AI Tools
                </CardTitle>
                <CardDescription>Manage your uploads and view performance</CardDescription>
            </div>
            {/* Insights Button */}
            <Button variant="outline" size="sm" className="gap-2 hidden sm:flex pointer-events-none opacity-50 w-full sm:w-auto">
                <BarChart2 className="w-4 h-4" /> insights coming soon
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>Loading your tools...</p>
              </div>
            ) : userModels.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border px-4">
                <div className="bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No models uploaded yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                  Share your AI tool with the world. Track views, get feedback, and grow your audience.
                </p>
                <Button onClick={() => navigate('/upload-model')} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Upload Your First Tool
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userModels.map((model) => (
                  // Responsive List Item: Stacks on mobile, Row on Desktop
                  <div key={model._id} className="group border border-border/60 bg-card/50 hover:bg-card hover:border-primary/30 rounded-xl p-3 md:p-4 transition-all duration-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Model Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 text-xl font-bold text-primary overflow-hidden">
                          {model.iconUrl ? <img src={model.iconUrl} className="w-full h-full object-cover" /> : model.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <h3 className="font-bold text-base md:text-lg truncate hover:text-primary cursor-pointer" onClick={() => navigate(`/model/${model._id}`)}>
                                {model.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`h-5 text-[10px] ${getStatusColor(model.status)}`}>
                                    {getStatusIcon(model.status)} <span className="ml-1 capitalize">{model.status}</span>
                                </Badge>
                                {/* Mobile-only boost badge */}
                                {model.featured && <Badge className="h-5 text-[10px] bg-yellow-100 text-yellow-800 border-yellow-200 md:hidden">Featured</Badge>}
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 mb-2">{model.shortDescription}</p>
                          
                          {/* Individual Tool Views */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                             <span className="flex items-center gap-1 text-primary/80 font-medium">
                                <Eye className="w-3 h-3" /> {model.clicks || 0} views
                             </span>
                             <span className="hidden sm:inline">•</span>
                             <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(model.createdAt)}</span>
                             <span className="hidden sm:inline">•</span>
                             <span className="capitalize">{model.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
                        {/* Quick Boost Button (Visible if Approved) */}
                        {model.status === 'approved' && (
                           <Button 
                             size="sm" 
                             className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs h-8"
                             onClick={() => handleBoostModel(model)}
                           >
                             <Rocket className="w-3 h-3 mr-1" /> Boost
                           </Button>
                        )}

                        <Button variant="ghost" size="sm" onClick={() => navigate(`/model/${model._id}`)} className="h-8 text-xs">
                            View
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditModel(model)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit Details
                            </DropdownMenuItem>
                            
                            {/* Boost in Dropdown for all screens */}
                            {model.status === 'approved' && (
                                <DropdownMenuItem onClick={() => handleBoostModel(model)} className="text-yellow-600 focus:text-yellow-700">
                                  <Rocket className="w-4 h-4 mr-2" /> Boost Visibility
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem onClick={() => handleDeleteModel(model)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="w-[90%] sm:max-w-lg rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tool?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{modelToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 justify-end">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteModel}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ Boost Modal Integration */}
      {toolToBoost && (
        <BoostModal
          isOpen={isBoostModalOpen}
          onClose={() => {
            setIsBoostModalOpen(false);
            setToolToBoost(null);
          }}
          toolId={toolToBoost.id}
          toolName={toolToBoost.name}
        />
      )}
    </div>
  );
};

export default Profile;