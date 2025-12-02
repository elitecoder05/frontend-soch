import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { adminAPI, Model, User } from '@/api/api-methods';
import { Loader2, Eye, Calendar, User as UserIcon, Tag, ExternalLink, Users } from 'lucide-react';
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
  const { toast } = useToast();

  // Format a date string nicely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString || '-';
    }
  };

  // Badge variant helper for status
  const getStatusBadgeVariant = (status: Model['status']) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Fetch data for models and users
  const fetchAdminModels = async (status?: string) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getAllModelsAdmin({ status: status === 'all' ? undefined : status });
      setModels(response.data.models || []);
    } catch (err: any) {
      toast({ title: 'Failed to fetch models', description: err.message || String(err), variant: 'destructive' });
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
      toast({ title: 'Failed to fetch users', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminModels(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // update model status
  const handleStatusUpdate = async (modelId: string, status: 'approved' | 'rejected' | 'pending') => {
    setUpdatingModel(modelId);
    try {
      const rejectionReason = rejectionReasons[modelId];
      const response = await adminAPI.updateModelStatus(modelId, status, status === 'rejected' ? rejectionReason : undefined);
      const updatedModel = response.data.model;
      setModels((prev) => prev.map((m) => (m._id === modelId ? updatedModel : m)));
      toast({ title: 'Model updated', description: `Model status updated to ${status}`, variant: 'default' });
    } catch (err: any) {
      toast({ title: 'Failed to update model', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setUpdatingModel(null);
      setRejectionReasons((prev) => ({ ...prev, [modelId]: '' }));
    }
  };

  const handleRejectionReasonChange = (modelId: string, reason: string) => {
    setRejectionReasons((prev) => ({ ...prev, [modelId]: reason }));
  };

  const handleUserSubscriptionToggle = async (userId: string, currentIsPro: boolean) => {
    setUpdatingUser(userId);
    try {
      const subscriptionType = currentIsPro ? 'free' : 'pro';
      const isProUser = !currentIsPro;
      const response = await adminAPI.updateUserSubscription(userId, { subscriptionType: subscriptionType as any, isProUser });
      const updatedUser = response.data.user;
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast({ title: 'User updated', description: `User subscription updated to ${subscriptionType}`, variant: 'default' });
    } catch (err: any) {
      toast({ title: 'Failed to update user', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setUpdatingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          {/* Models Tab */}
          {activeTab === 'models' && (
            <>
              <div className="mb-6">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Models</SelectItem>
                    <SelectItem value="approved">Approved Models</SelectItem>
                    <SelectItem value="rejected">Rejected Models</SelectItem>
                    <SelectItem value="all">All Models</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {models.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground text-lg">No models found for the selected filter.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    models.map((model) => (
                      <Card key={model._id} className="overflow-hidden">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-xl">{model.name}</CardTitle>
                                <Badge variant={getStatusBadgeVariant(model.status)}>
                                  {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                                </Badge>
                              </div>
                              <CardDescription className="text-base">
                                {model.shortDescription}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {model.uploadedBy?.firstName} {model.uploadedBy?.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-muted-foreground" />
                              <span>{model.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{formatDate(model.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Provider:</span>
                              <span>{model.provider}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Pricing:</span>
                              <Badge variant="outline">{model.pricing}</Badge>
                            </div>
                            {model.externalUrl && (
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                <a 
                                  href={model.externalUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate"
                                >
                                  {model.externalUrl}
                                </a>
                              </div>
                            )}
                          </div>

                          {model.longDescription && (
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">
                                {model.longDescription}
                              </p>
                            </div>
                          )}

                          {model.tags && model.tags.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Tags</h4>
                              <div className="flex flex-wrap gap-2">
                                {model.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {model.status === 'rejected' && model.rejectionReason && (
                            <div>
                              <h4 className="font-semibold mb-2 text-destructive">Rejection Reason</h4>
                              <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md">
                                {model.rejectionReason}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-4 border-t">
                            <Select
                              value={model.status}
                              onValueChange={(value) => handleStatusUpdate(model._id, value as 'approved' | 'rejected' | 'pending')}
                              disabled={updatingModel === model._id}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>

                            {updatingModel === model._id && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                              </div>
                            )}
                          </div>

                          {/* Rejection reason input for new rejections */}
                          <div className="space-y-2">
                            <label htmlFor={`rejection-${model._id}`} className="text-sm font-medium">
                              Rejection Reason (required for rejection)
                            </label>
                            <Textarea
                              id={`rejection-${model._id}`}
                              placeholder="Provide a reason for rejecting this model..."
                              value={rejectionReasons[model._id] || ''}
                              onChange={(e) => handleRejectionReasonChange(model._id, e.target.value)}
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </>
          )}
                      


                    {updatingModel === model._id && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </div>
                    )}
                  </div>

                  {/* Rejection reason input for new rejections */}
                  <div className="space-y-2">
                    <label htmlFor={`rejection-${model._id}`} className="text-sm font-medium">
                      Rejection Reason (required for rejection)
                    </label>
                    <Textarea
                      id={`rejection-${model._id}`}
                      placeholder="Provide a reason for rejecting this model..."
                      value={rejectionReasons[model._id] || ''}
                      onChange={(e) => handleRejectionReasonChange(model._id, e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
                </div>
        </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">User Subscription Management</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Toggle user subscription status for testing purposes. Pro users can upload models.
              </p>
            </div>

            {isUsersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground text-lg">No users found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  users.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription className="text-base">
                              {user.email}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={user.isProUser ? 'default' : 'secondary'}
                              className={user.isProUser ? 'bg-gradient-to-r from-primary to-blue-500' : ''}
                            >
                              {user.isProUser ? 'PRO USER' : 'FREE USER'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                            <span>Mobile: {user.mobileNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Joined: {formatDate(user.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Subscription Type:</span>
                            <Badge variant="outline">
                              {user.subscriptionType?.toUpperCase() || 'FREE'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                              {user.subscriptionStatus?.toUpperCase() || 'ACTIVE'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              {user.isProUser ? 'Downgrade to Free' : 'Upgrade to Pro'}:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Free</span>
                              <Switch
                                checked={user.isProUser || false}
                                onCheckedChange={() => handleUserSubscriptionToggle(user.id, user.isProUser || false)}
                                disabled={updatingUser === user.id}
                              />
                              <span className="text-xs text-muted-foreground">Pro</span>
                            </div>
                          </div>

                          {updatingUser === user.id && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Updating...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;