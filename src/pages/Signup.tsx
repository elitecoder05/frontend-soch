import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authAPI, SignupData } from '@/api/api-methods';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, updateAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
  });

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobileNumber || !formData.password) {
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

    // Mobile number validation (basic)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 10-digit mobile number.',
        variant: 'destructive',
      });
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.signup(formData);
      
      if (response.success && response.data.user && response.data.token) {
        // Update auth context
        login(response.data.user, response.data.token);
        updateAuthState();
        
        toast({
          title: 'Success!',
          description: 'Account created successfully. Welcome to Soch AI!',
        });
        navigate('/'); // Redirect to home page after successful signup
      }
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
      
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
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
            src="https://firebasestorage.googleapis.com/v0/b/sochai-2025.firebasestorage.app/o/website-assets%2Fsochailogo.jpg?alt=media&token=3fda20fa-6dcd-41cc-b898-7b0e3f3c1ca7" 
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
        
        {/* Main Signup Card */}
        <Card className="w-full max-w-lg bg-card border-border shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">Join Soch AI</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create your account to explore 120+ AI tools
              </CardDescription>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-input border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-input border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground h-11"
                  />
                </div>
              </div>
              
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
                <Label htmlFor="mobileNumber" className="text-foreground font-medium">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-input border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground h-11"
                  maxLength={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Terms and Privacy */}
              <div className="text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link to="/refund-policy" className="text-primary hover:text-primary/80 underline">
                  Terms of Service
                </Link>
                .
              </div>
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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};