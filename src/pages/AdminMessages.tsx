import React, { useEffect, useState } from 'react';
import { 
  Megaphone, Handshake, MessageSquare, Check, 
  Clock, Mail, Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'sponsorship' | 'campaign';
  status: 'unread' | 'read' | 'contacted';
  createdAt: string;
}

export const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const res = await api.get('/auth/admin/messages');
      setMessages(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/auth/admin/messages/${id}/status`, { status: newStatus });
      setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, status: newStatus as any } : msg));
      toast({ title: "Updated", description: `Marked as ${newStatus}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const getIcon = (type: string) => {
    if (type === 'sponsorship') return <Handshake className="w-5 h-5 text-purple-500" />;
    if (type === 'campaign') return <Megaphone className="w-5 h-5 text-blue-500" />;
    return <MessageSquare className="w-5 h-5 text-gray-500" />;
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inquiries & Requests</h2>
      
      <div className="grid gap-4">
        {messages.length === 0 ? (
            <p className="text-muted-foreground">No new messages.</p>
        ) : (
            messages.map((msg) => (
            <Card key={msg._id} className={`transition-all ${msg.status === 'unread' ? 'border-l-4 border-l-primary bg-primary/5' : 'opacity-80'}`}>
                <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-full border shadow-sm">
                            {getIcon(msg.type)}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{msg.subject}</CardTitle>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                {msg.name} &bull; <Mail className="w-3 h-3" /> {msg.email} &bull; {new Date(msg.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={msg.status === 'unread' ? 'destructive' : 'outline'}>
                            {msg.status}
                        </Badge>
                        
                        {msg.status !== 'contacted' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(msg._id, 'contacted')}>
                                Mark Contacted
                            </Button>
                        )}
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-background/50 p-4 rounded-lg border border-border whitespace-pre-line text-sm">
                        {msg.message}
                    </div>
                </CardContent>
            </Card>
            ))
        )}
      </div>
    </div>
  );
};