import React, { useEffect, useState } from 'react';
import { getNetworkDiagnostics, getConnectionDiagnostics, switchToWorkingEndpoint } from '@/api';
import { WifiOff, RefreshCw } from 'lucide-react';

interface NetworkStatusProps {
  onRetry?: () => void;
}

interface DiagnosticInfo {
  online: boolean;
  apiReachable: boolean;
  latency: number | null;
  error: string | null;
  region: string | null;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ onRetry }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiReachable, setApiReachable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);

  // Check browser online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Reset failures when coming back online
      setConsecutiveFailures(0);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial API health check on mount
  useEffect(() => {
    // Check API health after a short delay to not block initial render
    const timer = setTimeout(() => {
      checkApi(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Check API health when coming back online
  useEffect(() => {
    if (isOnline && !apiReachable) {
      checkApi();
    }
  }, [isOnline]);

  const checkApi = async (silent = false) => {
    if (!silent) {
      setIsChecking(true);
    }
    
    try {
      // Get comprehensive connection diagnostics
      const connectionDiagnostics = await getConnectionDiagnostics();
      
      // Also get the old diagnostics for latency info
      const diagResult = await getNetworkDiagnostics();
      
      setDiagnostics(diagResult);
      
      // Check if we have a working URL
      if (connectionDiagnostics.primaryStatus === 'working') {
        setApiReachable(true);
        setConsecutiveFailures(0);
        if (onRetry) {
          onRetry();
        }
      } else if (connectionDiagnostics.workingUrl) {
        // Primary failed but we have a fallback
        console.log('[NetworkStatus] Primary URL failed, automatically switched to fallback');
        setApiReachable(true);
        setConsecutiveFailures(0);
        
        // Try to switch to the working endpoint
        await switchToWorkingEndpoint();
        
        if (onRetry) {
          onRetry();
        }
      } else {
        // No working URLs found
        setApiReachable(false);
        setConsecutiveFailures(prev => prev + 1);
      }
      
      // Store connection diagnostics for debugging
      (window as any).connectionDiagnostics = connectionDiagnostics;
      
    } catch (error) {
      console.error('[NetworkStatus] Diagnostic check failed:', error);
      setApiReachable(false);
      setConsecutiveFailures(prev => prev + 1);
    } finally {
      setIsChecking(false);
    }
  };

  // Don't show anything if everything is working
  if (isOnline && apiReachable) {
    return null;
  }

  // Show more prominent warning after multiple failures
  const isSerious = consecutiveFailures >= 2;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-2xl z-50 font-sans">
      <div className="flex items-start gap-3">
        <div className="bg-gray-100 p-2 rounded-full flex-shrink-0 mt-0.5">
          <WifiOff className="h-4 w-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {!isOnline ? 'No Internet Connection' : 'Connection Unstable'}
          </h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Please check your internet connection and try again.
          </p>
          
          <button
            onClick={() => checkApi()}
            disabled={isChecking}
            className="mt-3 w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Connecting...' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
