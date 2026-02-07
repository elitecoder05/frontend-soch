import React, { useEffect, useState } from 'react';
import { checkApiHealth, getNetworkDiagnostics, getApiBaseUrl, getConnectionDiagnostics, switchToWorkingEndpoint } from '@/api';
import { WifiOff, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

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
  const [showDiagnostics, setShowDiagnostics] = useState(false);
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
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 ${isSerious ? 'bg-orange-50 border-orange-300' : 'bg-red-50 border-red-200'} border rounded-lg p-4 shadow-lg z-50`}>
      <div className="flex items-start gap-3">
        {isSerious ? (
          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${isSerious ? 'text-orange-800' : 'text-red-800'}`}>
            {!isOnline ? 'No Internet Connection' : 'Server Unreachable'}
          </h4>
          <p className={`text-xs ${isSerious ? 'text-orange-600' : 'text-red-600'} mt-1`}>
            {!isOnline
              ? 'Please check your internet connection and try again.'
              : isSerious 
                ? 'Persistent connection issues. This might be caused by your ISP or network. Try switching to mobile data or a different network.'
                : 'Unable to connect to the server. This might be a temporary issue.'}
          </p>
          
          {/* Diagnostic info toggle */}
          {isOnline && diagnostics && (
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className={`mt-2 inline-flex items-center gap-1 text-xs ${isSerious ? 'text-orange-600' : 'text-red-600'} hover:underline`}
            >
              <Info className="h-3 w-3" />
              {showDiagnostics ? 'Hide' : 'Show'} details
            </button>
          )}
          
          {/* Diagnostic details */}
          {showDiagnostics && diagnostics && (
            <div className={`mt-2 p-2 ${isSerious ? 'bg-orange-100' : 'bg-red-100'} rounded text-xs space-y-1`}>
              <p><strong>API Server:</strong> {getApiBaseUrl()}</p>
              <p><strong>Latency:</strong> {diagnostics.latency ? `${diagnostics.latency}ms` : 'N/A'}</p>
              <p><strong>Error:</strong> {diagnostics.error || 'Unknown'}</p>
              <p className="mt-1 text-[10px] opacity-75">
                If using Jio, Airtel, or similar ISP, try switching to mobile data or use a VPN.
              </p>
            </div>
          )}
          
          <button
            onClick={() => checkApi()}
            disabled={isChecking}
            className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${isSerious ? 'text-orange-700 hover:text-orange-800' : 'text-red-700 hover:text-red-800'} disabled:opacity-50`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
