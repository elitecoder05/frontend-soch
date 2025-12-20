// import React, { useState, useEffect } from 'react';
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
// import { Loader2, Eye, Calendar, User as UserIcon, Tag, ExternalLink, Users } from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton';

// const Admin = () => {
//   const [activeTab, setActiveTab] = useState<'models' | 'users'>('models');
//   const [models, setModels] = useState<Model[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUsersLoading, setIsUsersLoading] = useState(false);
//   const [updatingModel, setUpdatingModel] = useState<string | null>(null);
//   const [updatingUser, setUpdatingUser] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState('pending');
//   const [rejectionReasons, setRejectionReasons] = useState<{[key: string]: string}>({});
//   const [trendingEdits, setTrendingEdits] = useState<Record<string, { trendingScore?: number; categoryTrendingScore?: number; featured?: boolean }>>({});
//   const [trendingUpdating, setTrendingUpdating] = useState<string | null>(null);
//   const { toast } = useToast();

//   // Format a date string nicely
//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//     } catch (error) {
//       return dateString || '-';
//     }
//   };

//   // Badge variant helper for status
//   const getStatusBadgeVariant = (status: Model['status']) => {
//     switch (status) {
//       case 'approved':
//         return 'default';
//       case 'rejected':
//         return 'destructive';
//       default:
//         return 'secondary';
//     }
//   };

//   // Fetch data for models and users
//   const fetchAdminModels = async (status?: string) => {
//     console.log('Fetching admin models with status:', status);
//     setIsLoading(true);
//     try {
//       const response = await adminAPI.getAllModelsAdmin({ status: status === 'all' ? undefined : status });
//       console.log('Admin models response:', response);
//       setModels(response.data.models || []);
//     } catch (err: any) {
//       console.error('Failed to fetch admin models:', err);
//       toast({ title: 'Failed to fetch models', description: err.message || String(err), variant: 'destructive' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     console.log('Fetching users...');
//     setIsUsersLoading(true);
//     try {
//       const response = await adminAPI.getAllUsers();
//       console.log('Users response:', response);
//       setUsers(response.data.users || []);
//     } catch (err: any) {
//       console.error('Failed to fetch users:', err);
//       toast({ title: 'Failed to fetch users', description: err.message || String(err), variant: 'destructive' });
//     } finally {
//       setIsUsersLoading(false);
//     }
//   };

//   // update model status
//   const handleStatusUpdate = async (modelId: string, status: 'approved' | 'rejected' | 'pending') => {
//     setUpdatingModel(modelId);
//     try {
//       const rejectionReason = rejectionReasons[modelId];
//       const response = await adminAPI.updateModelStatus(modelId, status, status === 'rejected' ? rejectionReason : undefined);
//       const updatedModel = response.data.model;
//       setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
//       toast({ title: 'Model updated', description: `Model status updated to ${status}`, variant: 'default' });
//     } catch (err: any) {
//       toast({ title: 'Failed to update model', description: err.message || String(err), variant: 'destructive' });
//     } finally {
//       setUpdatingModel(null);
//       setRejectionReasons((prev) => ({ ...prev, [modelId]: '' }));
//     }
//   };

//   const handleRejectionReasonChange = (modelId: string, reason: string) => {
//     setRejectionReasons((prev) => ({ ...prev, [modelId]: reason }));
//   };

//   const handleTrendingFieldChange = (
//     modelId: string,
//     field: 'trendingScore' | 'categoryTrendingScore' | 'featured',
//     value: number | boolean
//   ) => {
//     setTrendingEdits((prev) => ({
//       ...prev,
//       [modelId]: {
//         ...prev[modelId],
//         [field]: value
//       }
//     }));
//   };

//   const handleTrendingUpdate = async (modelId: string) => {
//     const payload = trendingEdits[modelId] ?? {};

//     // Avoid sending empty payload
//     if (Object.keys(payload).length === 0) {
//       toast({ title: 'No changes to save', description: 'Adjust trending values before saving.', variant: 'secondary' });
//       return;
//     }

//     setTrendingUpdating(modelId);
//     try {
//       const response = await adminAPI.updateModelTrending(modelId, payload);
//       const updatedModel = response.data.model;
//       setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
//       toast({ title: 'Trending updated', description: 'Trending values saved successfully.' });
//     } catch (err: any) {
//       toast({ title: 'Failed to update trending', description: err.message || String(err), variant: 'destructive' });
//     } finally {
//       setTrendingUpdating(null);
//     }
//   };

//   const handleUserSubscriptionToggle = async (userId: string, currentIsPro: boolean) => {
//     console.log('Toggling user subscription:', { userId, currentIsPro });
//     setUpdatingUser(userId);
//     try {
//       const response = await adminAPI.toggleUserSubscription(userId);
//       const updatedUser = response.data.user;
//       console.log('Toggle response:', response);
//       setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
//       toast({ 
//         title: 'User updated', 
//         description: response.message || `User subscription toggled successfully`, 
//         variant: 'default' 
//       });
//     } catch (err: any) {
//       console.error('Toggle error:', err);
//       toast({ 
//         title: 'Failed to update user', 
//         description: err.message || String(err), 
//         variant: 'destructive' 
//       });
//     } finally {
//       setUpdatingUser(null);
//     }
//   };

//   useEffect(() => {
//     fetchAdminModels(statusFilter);
//   }, [statusFilter]);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar searchQuery="" onSearchChange={() => {}} />
      
//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Admin Panel</h1>
          
//           <div className="flex space-x-4 mb-6">
//             <Button
//               variant={activeTab === 'models' ? 'default' : 'outline'}
//               onClick={() => setActiveTab('models')}
//             >
//               Models
//             </Button>
//             <Button
//               variant={activeTab === 'users' ? 'default' : 'outline'}
//               onClick={() => setActiveTab('users')}
//             >
//               Users
//             </Button>
//           </div>
//         </div>

//         {/* Models Tab */}
//           {activeTab === 'models' && (
//             <>
//               <div className="mb-6">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-48">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="pending">Pending Models</SelectItem>
//                     <SelectItem value="approved">Approved Models</SelectItem>
//                     <SelectItem value="rejected">Rejected Models</SelectItem>
//                     <SelectItem value="all">All Models</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {isLoading ? (
//                 <div className="space-y-4">
//                   {[...Array(5)].map((_, i) => (
//                     <Card key={i}>
//                       <CardHeader>
//                         <Skeleton className="h-6 w-1/3" />
//                         <Skeleton className="h-4 w-2/3" />
//                       </CardHeader>
//                       <CardContent>
//                         <Skeleton className="h-4 w-full mb-2" />
//                         <Skeleton className="h-4 w-3/4" />
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {models.length === 0 ? (
//                     <Card>
//                       <CardContent className="py-8 text-center">
//                         <p className="text-muted-foreground text-lg">No models found for the selected filter.</p>
//                       </CardContent>
//                     </Card>
//                   ) : (
//                     models.map((model) => (
//                       <Card key={model._id} className="overflow-hidden">
//                         <CardHeader>
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-3 mb-2">
//                                 <CardTitle className="text-xl">{model.name}</CardTitle>
//                                 <Badge variant={getStatusBadgeVariant(model.status)}>
//                                   {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
//                                 </Badge>
//                               </div>
//                               <CardDescription className="text-base">
//                                 {model.shortDescription}
//                               </CardDescription>
//                             </div>
//                           </div>
//                         </CardHeader>

//                         <CardContent className="space-y-4">
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//                             <div className="flex items-center gap-2">
//                               <UserIcon className="w-4 h-4 text-muted-foreground" />
//                               <span>
//                                 {model.uploadedBy?.firstName} {model.uploadedBy?.lastName}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Tag className="w-4 h-4 text-muted-foreground" />
//                               <span>{model.category}</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Calendar className="w-4 h-4 text-muted-foreground" />
//                               <span>{formatDate(model.createdAt)}</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="font-medium">Provider:</span>
//                               <span>{model.provider}</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="font-medium">Pricing:</span>
//                               <Badge variant="outline">{model.pricing}</Badge>
//                             </div>
//                             {model.externalUrl && (
//                               <div className="flex items-center gap-2">
//                                 <ExternalLink className="w-4 h-4 text-muted-foreground" />
//                                 <a 
//                                   href={model.externalUrl} 
//                                   target="_blank" 
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 hover:underline truncate"
//                                 >
//                                   {model.externalUrl}
//                                 </a>
//                               </div>
//                             )}
//                           </div>

//                           {model.longDescription && (
//                             <div>
//                               <h4 className="font-semibold mb-2">Description</h4>
//                               <p className="text-sm text-muted-foreground">
//                                 {model.longDescription}
//                               </p>
//                             </div>
//                           )}

//                           {model.tags && model.tags.length > 0 && (
//                             <div>
//                               <h4 className="font-semibold mb-2">Tags</h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {model.tags.map((tag, index) => (
//                                   <Badge key={index} variant="secondary">
//                                     {tag}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                           {model.status === 'rejected' && model.rejectionReason && (
//                             <div>
//                               <h4 className="font-semibold mb-2 text-destructive">Rejection Reason</h4>
//                               <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md">
//                                 {model.rejectionReason}
//                               </p>
//                             </div>
//                           )}

//                           <div className="flex items-center gap-4 pt-4 border-t">
//                             <Select
//                               value={model.status}
//                               onValueChange={(value) => handleStatusUpdate(model._id, value as 'approved' | 'rejected' | 'pending')}
//                               disabled={updatingModel === model._id}
//                             >
//                               <SelectTrigger className="w-40">
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="approved">Approved</SelectItem>
//                                 <SelectItem value="rejected">Rejected</SelectItem>
//                               </SelectContent>
//                             </Select>

//                             {updatingModel === model._id && (
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                 <Loader2 className="w-4 h-4 animate-spin" />
//                                 Updating...
//                               </div>
//                             )}
//                           </div>

//                           {/* Trending controls */}
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
//                             <div className="space-y-2">
//                               <label className="text-sm font-medium" htmlFor={`trending-${model._id}`}>
//                                 Trending score (0-100)
//                               </label>
//                               <Input
//                                 id={`trending-${model._id}`}
//                                 type="number"
//                                 min={0}
//                                 max={100}
//                                 value={(trendingEdits[model._id]?.trendingScore ?? model.trendingScore ?? 0).toString()}
//                                 onChange={(e) => handleTrendingFieldChange(model._id, 'trendingScore', Number(e.target.value))}
//                               />
//                             </div>

//                             <div className="space-y-2">
//                               <label className="text-sm font-medium" htmlFor={`cat-trending-${model._id}`}>
//                                 Category trending (0-100)
//                               </label>
//                               <Input
//                                 id={`cat-trending-${model._id}`}
//                                 type="number"
//                                 min={0}
//                                 max={100}
//                                 value={(trendingEdits[model._id]?.categoryTrendingScore ?? model.categoryTrendingScore ?? 0).toString()}
//                                 onChange={(e) => handleTrendingFieldChange(model._id, 'categoryTrendingScore', Number(e.target.value))}
//                               />
//                             </div>

//                             <div className="flex items-center gap-3 pt-6">
//                               <Switch
//                                 id={`featured-${model._id}`}
//                                 checked={Boolean(trendingEdits[model._id]?.featured ?? model.featured)}
//                                 onCheckedChange={(checked) => handleTrendingFieldChange(model._id, 'featured', checked)}
//                               />
//                               <label htmlFor={`featured-${model._id}`} className="text-sm font-medium">Featured</label>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-3">
//                             <Button
//                               variant="secondary"
//                               size="sm"
//                               disabled={trendingUpdating === model._id}
//                               onClick={() => handleTrendingUpdate(model._id)}
//                             >
//                               {trendingUpdating === model._id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                               Save trending
//                             </Button>
//                             <p className="text-xs text-muted-foreground">
//                               Global trending feeds Explorer; category trending feeds the category page.
//                             </p>
//                           </div>

//                           {/* Rejection reason input for new rejections */}
//                           <div className="space-y-2">
//                             <label htmlFor={`rejection-${model._id}`} className="text-sm font-medium">
//                               Rejection Reason (required for rejection)
//                             </label>
//                             <Textarea
//                               id={`rejection-${model._id}`}
//                               placeholder="Provide a reason for rejecting this model..."
//                               value={rejectionReasons[model._id] || ''}
//                               onChange={(e) => handleRejectionReasonChange(model._id, e.target.value)}
//                               rows={3}
//                             />
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))
//                   )}
//                 </div>
//               )}
//             </>
//           )}

//         {/* Users Tab */}
//         {activeTab === 'users' && (
//           <>
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold mb-4">User Subscription Management</h2>
//               <p className="text-sm text-muted-foreground mb-6">
//                 Toggle user subscription status for testing purposes. Pro users can upload models.
//               </p>
//             </div>

//             {isUsersLoading ? (
//               <div className="space-y-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Card key={i}>
//                     <CardHeader>
//                       <Skeleton className="h-6 w-1/3" />
//                       <Skeleton className="h-4 w-2/3" />
//                     </CardHeader>
//                     <CardContent>
//                       <Skeleton className="h-4 w-full mb-2" />
//                       <Skeleton className="h-4 w-3/4" />
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {users.length === 0 ? (
//                   <Card>
//                     <CardContent className="py-8 text-center">
//                       <p className="text-muted-foreground text-lg">No users found.</p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   users.map((user) => (
//                     <Card key={user.id} className="overflow-hidden">
//                       <CardHeader>
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <CardTitle className="text-lg">
//                               {user.firstName} {user.lastName}
//                             </CardTitle>
//                             <CardDescription className="text-base">
//                               {user.email}
//                             </CardDescription>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Badge 
//                               variant={user.isProUser ? 'default' : 'secondary'}
//                               className={user.isProUser ? 'bg-gradient-to-r from-primary to-blue-500' : ''}
//                             >
//                               {user.isProUser ? 'PRO USER' : 'FREE USER'}
//                             </Badge>
//                           </div>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                           <div className="flex items-center gap-2">
//                             <UserIcon className="w-4 h-4 text-muted-foreground" />
//                             <span>Mobile: {user.mobileNumber}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-muted-foreground" />
//                             <span>Joined: {formatDate(user.createdAt)}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="font-medium">Subscription Type:</span>
//                             <Badge variant="outline">
//                               {user.subscriptionType?.toUpperCase() || 'FREE'}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="font-medium">Plan Purchased:</span>
//                             <span className="text-sm">
//                               {(() => {
//                                 const pid = user.subscriptionPlanId;
//                                 switch (pid) {
//                                   case 'monthly': return 'Monthly';
//                                   case 'six_months': return '6 Months';
//                                   case 'annual': return 'Annual';
//                                   case 'pro': return 'Monthly (Pro)';
//                                   case 'enterprise': return 'Annual (Enterprise)';
//                                   case 'free': return 'Free';
//                                   case 'trial': return '14-day Trial';
//                                   default: return pid || 'N/A';
//                                 }
//                               })()}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="font-medium">Expires:</span>
//                             <span>{user.subscriptionEndDate ? formatDate(user.subscriptionEndDate) : 'N/A'}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="font-medium">Status:</span>
//                             <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
//                               {user.subscriptionStatus?.toUpperCase() || 'ACTIVE'}
//                             </Badge>
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between pt-4 border-t">
//                           <div className="flex items-center gap-3">
//                             <span className="text-sm font-medium">
//                               {user.isProUser ? 'Downgrade to Free' : 'Upgrade to Pro'}:
//                             </span>
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs text-muted-foreground">Free</span>
//                               <Switch
//                                 checked={user.isProUser || false}
//                                 onCheckedChange={() => handleUserSubscriptionToggle(user.id, user.isProUser || false)}
//                                 disabled={updatingUser === user.id}
//                               />
//                               <span className="text-xs text-muted-foreground">Pro</span>
//                             </div>
//                           </div>

//                           {updatingUser === user.id && (
//                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                               <Loader2 className="w-4 h-4 animate-spin" />
//                               Updating...
//                             </div>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Admin;

import React, { useState, useEffect } from 'react';
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
import { Loader2, Calendar, User as UserIcon, Tag, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'users'>('models');
  const [models, setModels] = useState<Model[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [updatingModel, setUpdatingModel] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectionReasons, setRejectionReasons] = useState<{[key: string]: string}>({});
  const [trendingEdits, setTrendingEdits] = useState<Record<string, { trendingScore?: number; categoryTrendingScore?: number; featured?: boolean }>>({});
  const [trendingUpdating, setTrendingUpdating] = useState<string | null>(null);
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
      // Calls GET /api/models/admin/all
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
      // Calls GET /api/auth/admin/users
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
    setUpdatingModel(modelId);
    try {
      const rejectionReason = rejectionReasons[modelId];
      // Calls PUT /api/models/admin/:id/status
      const response = await adminAPI.updateModelStatus(modelId, status, status === 'rejected' ? rejectionReason : undefined);
      
      const updatedModel = response.data.model;
      setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
      toast({ title: 'Success', description: `Model status updated to ${status}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' });
    } finally {
      setUpdatingModel(null);
    }
  };

  const handleTrendingUpdate = async (modelId: string) => {
    const payload = trendingEdits[modelId] ?? {};
    if (Object.keys(payload).length === 0) return;

    setTrendingUpdating(modelId);
    try {
      // Calls PUT /api/models/admin/:id/trending
      const response = await adminAPI.updateModelTrending(modelId, payload);
      const updatedModel = response.data.model;
      
      setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
      toast({ title: 'Success', description: 'Trending data saved' });
      
      // Clear local edits
      setTrendingEdits(prev => {
        const newState = { ...prev };
        delete newState[modelId];
        return newState;
      });
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to update trending', variant: 'destructive' });
    } finally {
      setTrendingUpdating(null);
    }
  };

  const handleUserSubscriptionToggle = async (userId: string, currentIsPro: boolean) => {
    setUpdatingUser(userId);
    try {
      // Calls PUT /api/auth/admin/toggle-subscription/:id
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

                        {/* Trending Controls */}
                        <div className="p-4 bg-black/40 rounded-lg border border-gray-800 space-y-4">
                          <h4 className="text-sm font-semibold text-gray-300">Trending & Visibility</h4>
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
                          <div className="flex justify-between items-center pt-2">
                             <div className="flex items-center gap-2">
                                <Switch 
                                  checked={trendingEdits[model._id]?.featured ?? model.featured ?? false}
                                  onCheckedChange={(checked) => setTrendingEdits(prev => ({...prev, [model._id]: {...prev[model._id], featured: checked}}))}
                                />
                                <label className="text-sm text-gray-400">Featured</label>
                             </div>
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
      </main>
    </div>
  );
};

export default Admin;