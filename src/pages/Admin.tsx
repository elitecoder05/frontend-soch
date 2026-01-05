// import React, { useState, useEffect } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { modelKeys } from '@/hooks/useModels';
// import { Navbar } from '@/components/Navbar';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';
// import { adminAPI, Model, User } from '@/api/api-methods';
// import { Loader2, Calendar, User as UserIcon, Tag, ExternalLink, MessageSquare } from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton';
// // ✅ Import the new component
// import { AdminMessages } from './AdminMessages';
// const Admin = () => {

//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState<'models' | 'users' | 'inquiries'>('models');
  
//   // Models State
//   const [models, setModels] = useState<Model[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [updatingModel, setUpdatingModel] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState('pending');
//   const [rejectionReasons, setRejectionReasons] = useState<{[key: string]: string}>({});
//   const [trendingEdits, setTrendingEdits] = useState<Record<string, { trendingScore?: number; categoryTrendingScore?: number; featured?: boolean; isSponsored?: boolean; hasCustomCampaign?: boolean }>>({});
//   const [trendingUpdating, setTrendingUpdating] = useState<string | null>(null);

//   // Users State
//   const [users, setUsers] = useState<User[]>([]);
//   const [isUsersLoading, setIsUsersLoading] = useState(false);
//   const [updatingUser, setUpdatingUser] = useState<string | null>(null);

//   const { toast } = useToast();

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'short', day: 'numeric',
//       });
//     } catch (error) { return dateString || '-'; }
//   };

//   const getStatusBadgeVariant = (status: Model['status']) => {
//     switch (status) {
//       case 'approved': return 'default';
//       case 'rejected': return 'destructive';
//       default: return 'secondary';
//     }
//   };

//   // --- API Functions ---
//   const fetchAdminModels = async (status?: string) => {
//     setIsLoading(true);
//     try {
//       const response = await adminAPI.getAllModelsAdmin({ status: status === 'all' ? undefined : status });
//       setModels(response.data.models || []);
//     } catch (err: any) {
//       console.error(err);
//       toast({ title: 'Error', description: 'Failed to fetch models', variant: 'destructive' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     setIsUsersLoading(true);
//     try {
//       const response = await adminAPI.getAllUsers();
//       setUsers(response.data.users || []);
//     } catch (err: any) {
//       console.error(err);
//       toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
//     } finally {
//       setIsUsersLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (modelId: string, status: 'approved' | 'rejected' | 'pending') => {
//     setUpdatingModel(modelId);
//     try {
//       const rejectionReason = rejectionReasons[modelId];
//       const response = await adminAPI.updateModelStatus(modelId, status, status === 'rejected' ? rejectionReason : undefined);
//       queryClient.invalidateQueries({ queryKey: modelKeys.all });
//       await fetchAdminModels(statusFilter);
//       // const updatedModel = response.data.model;
//       // setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
//       toast({ title: 'Success', description: `Model status updated to ${status}` });
//     } catch (err: any) {
//       toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' });
//     } finally {
//       setUpdatingModel(null);
//     }
//   };

//   // const handleTrendingUpdate = async (modelId: string) => {
//   //   const payload = trendingEdits[modelId] ?? {};
//   //   if (Object.keys(payload).length === 0) return;

//   //   setTrendingUpdating(modelId);
//   //   try {
//   //     const response = await adminAPI.updateModelTrending(modelId, payload);
//   //     const updatedModel = response.data.model;
      
//   //     setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
//   //     toast({ title: 'Success', description: 'Trending data saved' });
      
//   //     // Clear local edits
//   //     setTrendingEdits(prev => {
//   //       const newState = { ...prev };
//   //       delete newState[modelId];
//   //       return newState;
//   //     });
//   //   } catch (err: any) {
//   //     toast({ title: 'Error', description: 'Failed to update trending', variant: 'destructive' });
//   //   } finally {
//   //     setTrendingUpdating(null);
//   //   }
//   // };
// const handleTrendingUpdate = async (modelId: string) => {
//     const payload = trendingEdits[modelId] ?? {};
    
//     // --- DEBUG LOG START ---
//     console.log("🚀 ADMIN: Attempting to save trending stats for:", modelId);
//     console.log("📦 ADMIN: Payload being sent:", payload);
//     // --- DEBUG LOG END ---

//     if (Object.keys(payload).length === 0) {
//         console.warn("⚠️ ADMIN: Payload is empty. Nothing to save.");
//         return;
//     }

//     setTrendingUpdating(modelId);
//     try {
//       const response = await adminAPI.updateModelTrending(modelId, payload);
      
//       // --- DEBUG LOG START ---
//       console.log("✅ ADMIN: Backend Response:", response);
//       // --- DEBUG LOG END ---

//       queryClient.invalidateQueries({ queryKey: modelKeys.all });
//       await fetchAdminModels(statusFilter);

//       // const updatedModel = response.data.model;
//       // setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
//       toast({ title: 'Success', description: 'Trending data saved' });
      
//       setTrendingEdits(prev => {
//         const newState = { ...prev };
//         delete newState[modelId];
//         return newState;
//       });
//     } catch (err: any) {
//       console.error("❌ ADMIN: API Error:", err);
//       toast({ title: 'Error', description: 'Failed to update trending', variant: 'destructive' });
//     } finally {
//       setTrendingUpdating(null);
//     }
//   };
//   const handleUserSubscriptionToggle = async (userId: string, currentIsPro: boolean) => {
//     setUpdatingUser(userId);
//     try {
//       const response = await adminAPI.toggleUserSubscription(userId);
//       const updatedUser = response.data.user;
      
//       setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
//       toast({ title: 'Success', description: `User toggled to ${updatedUser.isProUser ? 'PRO' : 'FREE'}` });
//     } catch (err: any) {
//       toast({ title: 'Error', description: 'Failed to toggle subscription', variant: 'destructive' });
//     } finally {
//       setUpdatingUser(null);
//     }
//   };

//   // --- Effects ---
//   useEffect(() => {
//     if (activeTab === 'models') fetchAdminModels(statusFilter);
//   }, [statusFilter, activeTab]);

//   useEffect(() => {
//     if (activeTab === 'users') fetchUsers();
//   }, [activeTab]);

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Navbar searchQuery="" onSearchChange={() => {}} />
      
//       <main className="container mx-auto px-4 py-8 pt-24">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
//             Admin Dashboard
//           </h1>
//           <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
//             <Button 
//               variant={activeTab === 'models' ? 'default' : 'ghost'} 
//               onClick={() => setActiveTab('models')}
//               className={activeTab === 'models' ? 'bg-gray-800' : 'hover:bg-gray-800 text-gray-400'}
//             >
//               Models
//             </Button>
//             <Button 
//               variant={activeTab === 'users' ? 'default' : 'ghost'} 
//               onClick={() => setActiveTab('users')}
//               className={activeTab === 'users' ? 'bg-gray-800' : 'hover:bg-gray-800 text-gray-400'}
//             >
//               Users
//             </Button>
//             <Button 
//               variant={activeTab === 'inquiries' ? 'default' : 'ghost'} 
//               onClick={() => setActiveTab('inquiries')}
//               className={activeTab === 'inquiries' ? 'bg-gray-800' : 'hover:bg-gray-800 text-gray-400'}
//             >
//               Inquiries
//             </Button>
//           </div>
//         </div>

//         {/* --- MODELS TAB --- */}
//         {activeTab === 'models' && (
//           <div className="space-y-6">
//             <div className="flex justify-end">
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 text-white">
//                   <SelectValue placeholder="Filter Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="approved">Approved</SelectItem>
//                   <SelectItem value="rejected">Rejected</SelectItem>
//                   <SelectItem value="all">All Models</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {isLoading ? (
//               <div className="space-y-4">
//                 {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full bg-gray-900 rounded-xl" />)}
//               </div>
//             ) : models.length === 0 ? (
//               <div className="text-center py-12 text-gray-500 bg-gray-900/50 rounded-xl border border-gray-800">
//                 No models found for this filter.
//               </div>
//             ) : (
//               <div className="grid gap-6">
//                 {models.map((model) => (
//                   <Card key={model._id} className="bg-gray-900 border-gray-800 text-gray-100 overflow-hidden">
//                     <CardHeader className="flex flex-row items-start justify-between pb-2 bg-black/20">
//                       <div>
//                         <div className="flex items-center gap-3 flex-wrap">
//                           <CardTitle className="text-xl text-white">{model.name}</CardTitle>
//                           <Badge variant={getStatusBadgeVariant(model.status)} className="capitalize">
//                             {model.status}
//                           </Badge>
//                           {model.featured && <Badge variant="default" className="bg-yellow-600/20 text-yellow-500 border-yellow-600/50 hover:bg-yellow-600/30">Featured</Badge>}
//                           {model.isSponsored && <Badge variant="default" className="bg-orange-600/20 text-orange-500 border-orange-600/50">Sponsored</Badge>}
//                           {model.hasCustomCampaign && <Badge variant="default" className="bg-blue-600/20 text-blue-500 border-blue-600/50">Campaign</Badge>}
//                         </div>
//                         <CardDescription className="mt-1 text-gray-400">{model.shortDescription}</CardDescription>
//                       </div>
//                       {model.externalUrl && (
//                         <a href={model.externalUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
//                           <ExternalLink className="h-5 w-5" />
//                         </a>
//                       )}
//                     </CardHeader>

//                     <CardContent className="space-y-6 p-6">
//                       {/* Meta Info */}
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
//                         <div className="flex items-center gap-2"><UserIcon className="w-4 h-4"/> {model.uploadedBy?.firstName || 'Unknown'}</div>
//                         <div className="flex items-center gap-2 capitalize"><Tag className="w-4 h-4"/> {model.category}</div>
//                         <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {formatDate(model.createdAt)}</div>
//                         <div className="flex items-center gap-2"><Badge variant="outline" className="border-gray-700 bg-gray-950">{model.pricing}</Badge></div>
//                       </div>

//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {/* Approval Controls */}
//                         <div className="p-4 bg-black/40 rounded-lg border border-gray-800 space-y-4">
//                             <h4 className="text-sm font-semibold text-gray-300">Review Action</h4>
//                             <div className="flex items-center gap-4">
//                               <Select 
//                                 value={model.status} 
//                                 onValueChange={(val: any) => handleStatusUpdate(model._id, val)}
//                                 disabled={updatingModel === model._id}
//                               >
//                                 <SelectTrigger className="w-[140px] bg-gray-950 border-gray-700 h-9">
//                                   <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="pending">Pending</SelectItem>
//                                   <SelectItem value="approved">Approved</SelectItem>
//                                   <SelectItem value="rejected">Rejected</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               {updatingModel === model._id && <Loader2 className="w-4 h-4 animate-spin text-purple-500" />}
//                             </div>

//                             {/* Rejection Reason */}
//                             {(model.status === 'rejected' || (updatingModel === model._id)) && (
//                               <Input 
//                                 placeholder="Reason for rejection..." 
//                                 value={rejectionReasons[model._id] || model.rejectionReason || ''}
//                                 onChange={(e) => setRejectionReasons(prev => ({...prev, [model._id]: e.target.value}))}
//                                 className="bg-gray-950 border-gray-700 text-sm"
//                               />
//                             )}
//                         </div>

//                         {/* Trending & Promotion Controls */}
//                         <div className="p-4 bg-black/40 rounded-lg border border-gray-800 space-y-4">
//                           <h4 className="text-sm font-semibold text-gray-300">Visibility & Promotions</h4>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="text-xs text-gray-500 block mb-1">Global Score</label>
//                               <Input type="number" className="bg-gray-950 border-gray-700 h-9" 
//                                 value={trendingEdits[model._id]?.trendingScore ?? model.trendingScore ?? 0}
//                                 onChange={(e) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], trendingScore: parseInt(e.target.value)}}))}
//                               />
//                             </div>
//                             <div>
//                               <label className="text-xs text-gray-500 block mb-1">Category Score</label>
//                               <Input type="number" className="bg-gray-950 border-gray-700 h-9"
//                                 value={trendingEdits[model._id]?.categoryTrendingScore ?? model.categoryTrendingScore ?? 0}
//                                 onChange={(e) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], categoryTrendingScore: parseInt(e.target.value)}}))}
//                               />
//                             </div>
//                           </div>
                          
//                           {/* Toggles for Featured, Sponsored, Campaign */}
//                           <div className="grid grid-cols-2 gap-y-3 pt-2">
//                              <div className="flex items-center gap-2">
//                                 <Switch 
//                                   checked={trendingEdits[model._id]?.featured ?? model.featured ?? false}
//                                   onCheckedChange={(checked) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], featured: checked}}))}
//                                 />
//                                 <label className="text-sm text-gray-400">Featured</label>
//                              </div>
//                              <div className="flex items-center gap-2">
//                                 <Switch 
//                                   checked={trendingEdits[model._id]?.isSponsored ?? model.isSponsored ?? false}
//                                   onCheckedChange={(checked) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], isSponsored: checked}}))}
//                                 />
//                                 <label className="text-sm text-gray-400">Sponsored</label>
//                              </div>
//                              <div className="flex items-center gap-2 col-span-2">
//                                 <Switch 
//                                   checked={trendingEdits[model._id]?.hasCustomCampaign ?? model.hasCustomCampaign ?? false}
//                                   onCheckedChange={(checked) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], hasCustomCampaign: checked}}))}
//                                 />
//                                 <label className="text-sm text-gray-400">Custom Campaign (Banner)</label>
//                              </div>
//                           </div>

//                           <div className="pt-2 text-right">
//                              <Button size="sm" variant="secondary" onClick={() => handleTrendingUpdate(model._id)} disabled={trendingUpdating === model._id}>
//                                 {trendingUpdating === model._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save Stats'}
//                              </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* --- USERS TAB --- */}
//         {activeTab === 'users' && (
//            <div className="space-y-6">
//              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
//                 <p className="text-sm text-gray-400">Manage user subscriptions manually. "Pro" users can upload models.</p>
//              </div>
             
//              {isUsersLoading ? <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full bg-gray-900 rounded-xl" />)}</div> : (
//                <div className="grid gap-4">
//                  {users.map(user => (
//                    <Card key={user.id} className="bg-gray-900 border-gray-800 text-gray-100">
//                      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
//                        <div>
//                          <div className="flex items-center gap-2">
//                             <h3 className="font-bold text-lg text-white">{user.firstName} {user.lastName}</h3>
//                             {user.googleUid && <Badge variant="secondary" className="text-[10px] h-5">Google</Badge>}
//                          </div>
//                          <p className="text-gray-400 text-sm">{user.email}</p>
//                          <div className="flex gap-2 mt-2">
//                            <Badge variant="outline" className="border-gray-700">{user.subscriptionType || 'free'}</Badge>
//                            <Badge variant={user.isProUser ? 'default' : 'secondary'} className={user.isProUser ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : ''}>
//                              {user.isProUser ? 'PRO STATUS' : 'FREE STATUS'}
//                            </Badge>
//                          </div>
//                        </div>
//                        <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-gray-800">
//                          <div className="text-right">
//                             <span className="block text-sm font-medium text-gray-300">Access Level</span>
//                             <span className="block text-xs text-gray-500">{user.isProUser ? 'Can Upload' : 'View Only'}</span>
//                          </div>
//                          <Switch 
//                            checked={user.isProUser} 
//                            onCheckedChange={() => handleUserSubscriptionToggle(user.id, user.isProUser)}
//                            disabled={updatingUser === user.id}
//                          />
//                          {updatingUser === user.id && <Loader2 className="w-4 h-4 animate-spin" />}
//                        </div>
//                      </CardContent>
//                    </Card>
//                  ))}
//                </div>
//              )}
//            </div>
//         )}

//         {/* --- NEW: INQUIRIES TAB (Promotions/Sponsorships) --- */}
//         {activeTab === 'inquiries' && (
//             <AdminMessages />
//         )}

//       </main>
//     </div>
//   );
// };

// export default Admin;


import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { modelKeys } from '@/hooks/useModels';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { adminAPI, Model, User } from '@/api/api-methods';
import { Loader2, Calendar, User as UserIcon, Tag, ExternalLink, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
// ✅ Import the new component
import { AdminMessages } from './AdminMessages';
const Admin = () => {

  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'models' | 'users' | 'inquiries'>('models');
  
  // Models State
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingModel, setUpdatingModel] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectionReasons, setRejectionReasons] = useState<{[key: string]: string}>({});
  const [trendingEdits, setTrendingEdits] = useState<Record<string, { trendingScore?: number; categoryTrendingScore?: number; featured?: boolean; isSponsored?: boolean; hasCustomCampaign?: boolean }>>({});
  const [trendingUpdating, setTrendingUpdating] = useState<string | null>(null);

  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch (error) { return dateString || '-'; }
  };

  const getStatusBadgeVariant = (status: Model['status']) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  // --- API Functions ---
  const fetchAdminModels = async (status?: string) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getAllModelsAdmin({ status: status === 'all' ? undefined : status });
      setModels(response.data.models || []);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to fetch models', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleStatusUpdate = async (modelId: string, status: 'approved' | 'rejected' | 'pending') => {
  const previousModels = [...models];
  
  setModels(prev => prev.filter(m => m._id !== modelId));
  setUpdatingModel(modelId);

  try {
    const rejectionReason = rejectionReasons[modelId];
        await adminAPI.updateModelStatus(modelId, status, status === 'rejected' ? rejectionReason : undefined);
    
    await queryClient.invalidateQueries({ queryKey: modelKeys.all, exact: false });
    setRejectionReasons(prev => {
      const newState = { ...prev };
      delete newState[modelId];
      return newState;
    });

    toast({ title: 'Success', description: `Model marked as ${status}` });
  } catch (err: any) {
    setModels(previousModels);
    toast({ 
      title: 'Error', 
      description: err.response?.data?.message || 'Failed to update. Rolled back.', 
      variant: 'destructive' 
    });
  } finally {
    setUpdatingModel(null);
  }
};

const handleTrendingUpdate = async (modelId: string) => {
    const payload = trendingEdits[modelId] ?? {};
    if (Object.keys(payload).length === 0) return;

    const previousModels = [...models];
    setTrendingUpdating(modelId);

    setModels(prev => prev.map(m => 
        m._id === modelId ? { ...m, ...payload } : m
    ));

    try {
      await adminAPI.updateModelTrending(modelId, payload);
      
      await queryClient.invalidateQueries({ queryKey: modelKeys.all });

      toast({ title: 'Success', description: 'Trending data saved' });
      
      setTrendingEdits(prev => {
        const newState = { ...prev };
        delete newState[modelId];
        return newState;
      });
    } catch (err: any) {
      setModels(previousModels);
      console.error("❌ ADMIN: API Error:", err);
      toast({ title: 'Error', description: 'Failed to update. Stats restored.', variant: 'destructive' });
    } finally {
      setTrendingUpdating(null);
    }
  };

  const handleUserSubscriptionToggle = async (userId: string, currentIsPro: boolean) => {
    setUpdatingUser(userId);
    try {
      const response = await adminAPI.toggleUserSubscription(userId);
      const updatedUser = response.data.user;
      
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast({ title: 'Success', description: `User toggled to ${updatedUser.isProUser ? 'PRO' : 'FREE'}` });
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to toggle subscription', variant: 'destructive' });
    } finally {
      setUpdatingUser(null);
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (activeTab === 'models') fetchAdminModels(statusFilter);
  }, [statusFilter, activeTab]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Admin Dashboard
          </h1>
          <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <Button 
              variant={activeTab === 'models' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('models')}
              className={activeTab === 'models' ? 'bg-gray-800' : 'hover:bg-gray-800 text-gray-400'}
            >
              Models
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('users')}
              className={activeTab === 'users' ? 'bg-gray-800' : 'hover:bg-gray-800 text-gray-400'}
            >
              Users
            </Button>
            <Button 
              variant={activeTab === 'inquiries' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('inquiries')}
              className={activeTab === 'inquiries' ? 'bg-gray-800' : 'hover:bg-gray-800 text-gray-400'}
            >
              Inquiries
            </Button>
          </div>
        </div>

        {/* --- MODELS TAB --- */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="all">All Models</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full bg-gray-900 rounded-xl" />)}
              </div>
            ) : models.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-900/50 rounded-xl border border-gray-800">
                No models found for this filter.
              </div>
            ) : (
              <div className="grid gap-6">
                {models.map((model) => (
                  <Card key={model._id} className="bg-gray-900 border-gray-800 text-gray-100 overflow-hidden">
                    <CardHeader className="flex flex-row items-start justify-between pb-2 bg-black/20">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-xl text-white">{model.name}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(model.status)} className="capitalize">
                            {model.status}
                          </Badge>
                          {model.featured && <Badge variant="default" className="bg-yellow-600/20 text-yellow-500 border-yellow-600/50 hover:bg-yellow-600/30">Featured</Badge>}
                          {model.isSponsored && <Badge variant="default" className="bg-orange-600/20 text-orange-500 border-orange-600/50">Sponsored</Badge>}
                          {model.hasCustomCampaign && <Badge variant="default" className="bg-blue-600/20 text-blue-500 border-blue-600/50">Campaign</Badge>}
                        </div>
                        <CardDescription className="mt-1 text-gray-400">{model.shortDescription}</CardDescription>
                      </div>
                      {model.externalUrl && (
                        <a href={model.externalUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-6 p-6">
                      {/* Meta Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2"><UserIcon className="w-4 h-4"/> {model.uploadedBy?.firstName || 'Unknown'}</div>
                        <div className="flex items-center gap-2 capitalize"><Tag className="w-4 h-4"/> {model.category}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {formatDate(model.createdAt)}</div>
                        <div className="flex items-center gap-2"><Badge variant="outline" className="border-gray-700 bg-gray-950">{model.pricing}</Badge></div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Approval Controls */}
                        <div className="p-4 bg-black/40 rounded-lg border border-gray-800 space-y-4">
                            <h4 className="text-sm font-semibold text-gray-300">Review Action</h4>
                            <div className="flex items-center gap-4">
                              <Select 
                                value={model.status} 
                                onValueChange={(val: any) => handleStatusUpdate(model._id, val)}
                                disabled={updatingModel === model._id}
                              >
                                <SelectTrigger className="w-[140px] bg-gray-950 border-gray-700 h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                              {updatingModel === model._id && <Loader2 className="w-4 h-4 animate-spin text-purple-500" />}
                            </div>

                            {/* Rejection Reason */}
                            {(model.status === 'rejected' || (updatingModel === model._id)) && (
                              <Input 
                                placeholder="Reason for rejection..." 
                                value={rejectionReasons[model._id] || model.rejectionReason || ''}
                                onChange={(e) => setRejectionReasons(prev => ({...prev, [model._id]: e.target.value}))}
                                className="bg-gray-950 border-gray-700 text-sm"
                              />
                            )}
                        </div>

                        {/* Trending & Promotion Controls */}
                        <div className="p-4 bg-black/40 rounded-lg border border-gray-800 space-y-4">
                          <h4 className="text-sm font-semibold text-gray-300">Visibility & Promotions</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Global Score</label>
                              <Input type="number" className="bg-gray-950 border-gray-700 h-9" 
                                value={trendingEdits[model._id]?.trendingScore ?? model.trendingScore ?? 0}
                                onChange={(e) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], trendingScore: parseInt(e.target.value)}}))}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Category Score</label>
                              <Input type="number" className="bg-gray-950 border-gray-700 h-9"
                                value={trendingEdits[model._id]?.categoryTrendingScore ?? model.categoryTrendingScore ?? 0}
                                onChange={(e) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], categoryTrendingScore: parseInt(e.target.value)}}))}
                              />
                            </div>
                          </div>
                          
                          {/* Toggles for Featured, Sponsored, Campaign */}
                          <div className="grid grid-cols-2 gap-y-3 pt-2">
                             <div className="flex items-center gap-2">
                                <Switch 
                                  checked={trendingEdits[model._id]?.featured ?? model.featured ?? false}
                                  onCheckedChange={(checked) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], featured: checked}}))}
                                />
                                <label className="text-sm text-gray-400">Featured</label>
                             </div>
                             <div className="flex items-center gap-2">
                                <Switch 
                                  checked={trendingEdits[model._id]?.isSponsored ?? model.isSponsored ?? false}
                                  onCheckedChange={(checked) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], isSponsored: checked}}))}
                                />
                                <label className="text-sm text-gray-400">Sponsored</label>
                             </div>
                             <div className="flex items-center gap-2 col-span-2">
                                <Switch 
                                  checked={trendingEdits[model._id]?.hasCustomCampaign ?? model.hasCustomCampaign ?? false}
                                  onCheckedChange={(checked) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], hasCustomCampaign: checked}}))}
                                />
                                <label className="text-sm text-gray-400">Custom Campaign (Banner)</label>
                             </div>
                          </div>

                          <div className="pt-2 text-right">
                             <Button size="sm" variant="secondary" onClick={() => handleTrendingUpdate(model._id)} disabled={trendingUpdating === model._id}>
                                {trendingUpdating === model._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save Stats'}
                             </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
           <div className="space-y-6">
             <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400">Manage user subscriptions manually. "Pro" users can upload models.</p>
             </div>
             
             {isUsersLoading ? <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full bg-gray-900 rounded-xl" />)}</div> : (
               <div className="grid gap-4">
                 {users.map(user => (
                   <Card key={user.id} className="bg-gray-900 border-gray-800 text-gray-100">
                     <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                       <div>
                         <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-white">{user.firstName} {user.lastName}</h3>
                            {user.googleUid && <Badge variant="secondary" className="text-[10px] h-5">Google</Badge>}
                         </div>
                         <p className="text-gray-400 text-sm">{user.email}</p>
                         <div className="flex gap-2 mt-2">
                           <Badge variant="outline" className="border-gray-700">{user.subscriptionType || 'free'}</Badge>
                           <Badge variant={user.isProUser ? 'default' : 'secondary'} className={user.isProUser ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : ''}>
                             {user.isProUser ? 'PRO STATUS' : 'FREE STATUS'}
                           </Badge>
                         </div>
                       </div>
                       <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-gray-800">
                         <div className="text-right">
                            <span className="block text-sm font-medium text-gray-300">Access Level</span>
                            <span className="block text-xs text-gray-500">{user.isProUser ? 'Can Upload' : 'View Only'}</span>
                         </div>
                         <Switch 
                           checked={user.isProUser} 
                           onCheckedChange={() => handleUserSubscriptionToggle(user.id, user.isProUser)}
                           disabled={updatingUser === user.id}
                         />
                         {updatingUser === user.id && <Loader2 className="w-4 h-4 animate-spin" />}
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             )}
           </div>
        )}

        {activeTab === 'inquiries' && (
            <AdminMessages />
        )}

      </main>
    </div>
  );
};

export default Admin;