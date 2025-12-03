import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authAPI, LoginData } from '@/api/api-methods';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, updateAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  // Process Google sign-in result (common for both popup and redirect)
  const processGoogleSignInResult = async (user: any) => {
    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Send to backend for user creation/login
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiBase}/api/auth/google-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data.user && data.data.token) {
        // Update auth context
        login(data.data.user, data.data.token);
        
        // Give a small delay to ensure cookies are set and state is updated
        setTimeout(() => {
          updateAuthState();
          
          toast({
            title: 'Welcome!',
            description: 'You have been signed in successfully with Google.',
          });
          
          // Get the intended destination from location state, or default to home
          const stateFrom = location.state?.from;
          let from = '/';
          if (typeof stateFrom === 'string') {
            from = stateFrom;
          } else if (stateFrom?.pathname) {
            from = stateFrom.pathname;
          }
          navigate(from, { replace: true });
        }, 100);
      } else {
        throw new Error(data.message || 'Google sign-in failed');
      }
    } catch (error: any) {
      console.error('Google sign-in processing error:', error);
      toast({
        title: 'Google Sign-in Failed',
        description: error.message || 'An error occurred during Google sign-in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // If user hits back button and there's no previous history, go to home
      navigate('/', { replace: true });
    };

    // Add event listener for back button
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Handle Google sign-in redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setIsGoogleLoading(true);
          await processGoogleSignInResult(result.user);
        }
      } catch (error: any) {
        console.error('Google redirect result error:', error);
        if (error.message && !error.message.includes('No redirect result available')) {
          toast({
            title: 'Google Sign-in Failed',
            description: error.message || 'An error occurred during Google sign-in. Please try again.',
            variant: 'destructive',
          });
        }
        setIsGoogleLoading(false);
      }
    };

    handleRedirectResult();
  }, [login, updateAuthState, toast, navigate, location.state?.from]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      
      if (response.success && response.data.user && response.data.token) {
        // Update auth context
        login(response.data.user, response.data.token);
        updateAuthState();
        
        toast({
          title: 'Welcome back!',
          description: 'You have been logged in successfully.',
        });
        
        // Get the intended destination from location state, or default to home
        const stateFrom = location.state?.from;
        let from = '/';
        if (typeof stateFrom === 'string') {
          from = stateFrom;
        } else if (stateFrom?.pathname) {
          from = stateFrom.pathname;
        }
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      
      // Try popup first, fallback to redirect if it fails
      try {
        const result = await signInWithPopup(auth, provider);
        await processGoogleSignInResult(result.user);
      } catch (popupError: any) {
        console.log('Popup failed, trying redirect:', popupError.message);
        // If popup fails (CORS issues, etc.), use redirect
        await signInWithRedirect(auth, provider);
        // The actual authentication handling will be done in useEffect
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Google Sign-in Failed',
        description: error.message || 'An error occurred during Google sign-in. Please try again.',
        variant: 'destructive',
      });
      setIsGoogleLoading(false);
    }
  };

  const handleGoBack = () => {
    // Check if there's history to go back to, otherwise go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Radial gradient overlays for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,217,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,217,255,0.1),transparent_50%)]" />
      
      <div className="relative flex min-h-screen items-center justify-center px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleGoBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        {/* Logo and Brand */}
        <Link to="/" className="absolute top-6 right-6 flex items-center gap-2">
          <img 
            src="https://www.sochai.store/sochailogo.jpg"
            alt="Soch AI Logo" 
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Soch AI</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              Store
            </span>
          </div>
        </Link>
        
        {/* Main Login Card */}
        <Card className="w-full max-w-md bg-card border-border shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="https://www.sochai.store/sochailogo.jpg"
                alt="Soch AI Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue exploring AI tools
              </CardDescription>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-input border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-input border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground h-11 pr-11"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link 
                  to="/contact?from=forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              
              {/* Google Sign In Button */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-border hover:bg-muted/50 transition-colors"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Create account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};