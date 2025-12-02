import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedModelUploadProps {
  children: React.ReactNode;
}

export const ProtectedModelUpload = ({ children }: ProtectedModelUploadProps) => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload models.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (isAuthenticated && currentUser && !currentUser.isProUser) {
      toast({
        title: "Pro Subscription Required",
        description: "You need to be a Pro user to upload models. Please upgrade your subscription to continue.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }
  }, [isAuthenticated, currentUser, navigate, toast]);

  // Only render children if user is authenticated and is a pro user
  if (isAuthenticated && currentUser?.isProUser) {
    return <>{children}</>;
  }

  // Show loading or nothing while redirect happens
  return null;
};