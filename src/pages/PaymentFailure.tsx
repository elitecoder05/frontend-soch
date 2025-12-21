import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCcw, HelpCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get error details from URL if passed (e.g. ?reason=network_error)
  const errorReason = searchParams.get('reason');
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-12 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-50 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px]" />
        </div>

        <Card className="w-full max-w-lg shadow-2xl border-red-100 dark:border-red-900/30 bg-card/80 backdrop-blur-sm relative z-10 animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
          
          <CardHeader className="text-center pt-10 pb-2">
            <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <XCircle className="w-10 h-10 text-red-500" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Payment Failed</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              We couldn't process your transaction.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 text-center px-8">
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-sm space-y-2">
              <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span>Don't worry, you haven't been charged.</span>
              </div>
              <p className="text-muted-foreground">
                {errorReason ? `Reason: ${errorReason}` : "Common causes: Insufficient funds, incorrect CVV, or bank server timeout."}
              </p>
              {paymentId && (
                <p className="text-xs text-muted-foreground font-mono mt-2 pt-2 border-t border-border/50">
                  Reference ID: {paymentId}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-8 pb-10">
            <Button 
              size="lg" 
              className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
              onClick={() => navigate('/pricing')}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" onClick={() => navigate('/')}>
                    Go Home
                </Button>
                <Button variant="ghost" onClick={() => navigate('/contact')}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Contact Support
                </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFailure;