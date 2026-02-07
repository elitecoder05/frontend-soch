import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Primary and fallback API URLs for better reliability
const API_URLS = {
  primary: import.meta.env.VITE_API_BASE_URL || 'https://backend-soch-production-56cd.up.railway.app',
  // Multiple fallback URLs for DNS resolution issues
  fallbacks: [
    import.meta.env.VITE_API_FALLBACK_URL || 'https://backend-soch-production-b526.up.railway.app',
    'https://backend-soch-production.up.railway.app', // Alternative Railway subdomain
    // Add your custom domain here when available: 'https://api.sochai.store'
  ],
  // Local development
  local: 'http://localhost:1000'
};

// Current base URL being used
let currentBaseURL = '';

// Get the API base URL - ensure it's properly set
const getBaseURL = (): string => {
  if (currentBaseURL) {
    return currentBaseURL;
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    console.log('[API] Using base URL:', envUrl);
    currentBaseURL = envUrl;
    return envUrl;
  }
  
  // In production, always use HTTPS backend - NEVER fallback to localhost
  if (import.meta.env.PROD) {
    console.log('[API] Production mode - using Railway backend');
    currentBaseURL = API_URLS.primary;
    return API_URLS.primary;
  }
  
  // Fallback for development
  console.warn('[API] VITE_API_BASE_URL not set, using localhost');
  currentBaseURL = API_URLS.local;
  return API_URLS.local;
};

// Function to try fallback URLs when primary fails
const tryFallbackURL = async (): Promise<string | null> => {
  for (const fallbackUrl of API_URLS.fallbacks) {
    try {
      console.log('[API] Trying fallback URL:', fallbackUrl);
      const response = await fetch(`${fallbackUrl}/api/ping`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        console.log('[API] Fallback URL working:', fallbackUrl);
        currentBaseURL = fallbackUrl;
        return fallbackUrl;
      }
    } catch (error) {
      console.warn('[API] Fallback URL failed:', fallbackUrl, error);
      continue;
    }
  }
  return null;
};

// Network diagnostics helper - useful for debugging regional issues
export const getNetworkDiagnostics = async (): Promise<{
  online: boolean;
  apiReachable: boolean;
  latency: number | null;
  error: string | null;
  region: string | null;
}> => {
  const diagnostics = {
    online: navigator.onLine,
    apiReachable: false,
    latency: null as number | null,
    error: null as string | null,
    region: null as string | null
  };

  if (!navigator.onLine) {
    diagnostics.error = 'Device is offline';
    return diagnostics;
  }

  const startTime = Date.now();
  try {
    const response = await fetch(`${getBaseURL()}/api/ping`, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000) // 15 second timeout for ping
    });
    
    diagnostics.latency = Date.now() - startTime;
    diagnostics.apiReachable = response.ok;
    
    if (!response.ok) {
      diagnostics.error = `Server returned ${response.status}`;
    }
  } catch (error: any) {
    diagnostics.latency = Date.now() - startTime;
    
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      diagnostics.error = 'Request timed out - server may be unreachable from your network';
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      diagnostics.error = 'Network error - possible DNS or ISP blocking issue';
    } else {
      diagnostics.error = error.message || 'Unknown network error';
    }
  }

  return diagnostics;
};

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 45000, // 45 seconds timeout - more forgiving for slow mobile networks in India
  withCredentials: true, // Include credentials for CORS requests
});

// DNS prefetch fallback URLs to improve connection speed
if (typeof window !== 'undefined') {
  API_URLS.fallbacks.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Retry configuration - more aggressive for unreliable networks
const MAX_RETRIES = 4;
const RETRY_DELAY = 1500; // 1.5 seconds base delay

// Helper function to check if error is retryable
const isRetryableError = (error: AxiosError): boolean => {
  // Retry on network errors (no response received)
  if (!error.response) {
    return true;
  }
  // Retry on specific server errors
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.response.status);
};

// Helper function to wait
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor to add auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available in cookies
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    (config as any).metadata = { startTime: new Date().getTime() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling with retry logic
apiClient.interceptors.response.use(
  (response) => {
    // Log response time for debugging slow connections
    const startTime = (response.config as any).metadata?.startTime;
    if (startTime) {
      const duration = new Date().getTime() - startTime;
      if (duration > 5000) {
        console.warn(`[API] Slow response: ${response.config.url} took ${duration}ms`);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as any;
    
    // Initialize retry count
    config.retryCount = config.retryCount || 0;
    
    // Check if we should retry
    if (isRetryableError(error) && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      console.log(`[API] Retrying request (${config.retryCount}/${MAX_RETRIES}): ${config.url}`);
      
      // For DNS errors, try fallback URLs first
      if (error.code === 'ERR_NAME_NOT_RESOLVED' && config.retryCount === 1) {
        const fallbackUrl = await tryFallbackURL();
        if (fallbackUrl) {
          console.log('[API] Switching to fallback URL due to DNS error');
          config.baseURL = fallbackUrl;
          return apiClient(config);
        }
      }
      
      // Exponential backoff with jitter to prevent thundering herd
      const jitter = Math.random() * 1000; // Random delay up to 1 second
      await delay(RETRY_DELAY * config.retryCount + jitter);
      
      return apiClient(config);
    }
    
    // Handle specific error types
    if (!error.response) {
      // Network error - no response from server
      const errorMessage = error.message || 'Unknown network error';
      console.error('[API] Network error - server unreachable:', errorMessage);
      console.error('[API] Error details:', {
        code: error.code,
        name: error.name,
        url: config?.url,
        retryCount: config?.retryCount,
        timeout: config?.timeout
      });
      
      // Create a more descriptive error for debugging
      let userMessage = 'Unable to connect to server. ';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        userMessage += 'The request timed out. This may be due to slow network conditions.';
      } else if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        userMessage += 'Please check your internet connection. If the issue persists, your ISP may be blocking the connection.';
      } else if (error.code === 'ERR_NAME_NOT_RESOLVED') {
        userMessage += 'DNS resolution failed. Try switching to a different network or using mobile data.';
      } else {
        userMessage += 'Please check your internet connection and try again.';
      }
      
      const networkError = new Error(userMessage);
      (networkError as any).isNetworkError = true;
      (networkError as any).originalError = error;
      (networkError as any).errorCode = error.code;
      (networkError as any).diagnosticInfo = {
        url: config?.url,
        retryCount: config?.retryCount,
        errorCode: error.code,
        errorName: error.name
      };
      return Promise.reject(networkError);
    }
    
    // Handle global errors here
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      Cookies.remove('authToken');
      Cookies.remove('userData');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Health check function to test connectivity with detailed diagnostics
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/api/health', { timeout: 15000 });
    return response.status === 200;
  } catch (error: any) {
    console.error('[API] Health check failed:', error.message || error);
    
    // Try fallback URLs if health check fails
    const fallbackUrl = await tryFallbackURL();
    if (fallbackUrl) {
      // Update axios instance baseURL
      apiClient.defaults.baseURL = fallbackUrl;
      try {
        const retryResponse = await apiClient.get('/api/health', { timeout: 15000 });
        return retryResponse.status === 200;
      } catch (retryError) {
        console.error('[API] Fallback health check also failed:', retryError);
      }
    }
    
    return false;
  }
};

// Function to manually switch to a working endpoint
export const switchToWorkingEndpoint = async (): Promise<boolean> => {
  const fallbackUrl = await tryFallbackURL();
  if (fallbackUrl) {
    apiClient.defaults.baseURL = fallbackUrl;
    return true;
  }
  return false;
};

// Get connection diagnostics for debugging
export const getConnectionDiagnostics = async (): Promise<{
  primaryStatus: 'working' | 'dns_error' | 'timeout' | 'other_error';
  workingUrl: string | null;
  testedUrls: { url: string; status: string; responseTime: number }[];
}> => {
  const results = {
    primaryStatus: 'other_error' as const,
    workingUrl: null as string | null,
    testedUrls: [] as { url: string; status: string; responseTime: number }[]
  };

  const urlsToTest = [API_URLS.primary, ...API_URLS.fallbacks];

  for (const url of urlsToTest) {
    const startTime = Date.now();
    try {
      const response = await fetch(`${url}/api/ping`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(10000)
      });
      
      const responseTime = Date.now() - startTime;
      const status = response.ok ? 'working' : `error_${response.status}`;
      
      results.testedUrls.push({ url, status, responseTime });
      
      if (response.ok && !results.workingUrl) {
        results.workingUrl = url;
        if (url === API_URLS.primary) {
          results.primaryStatus = 'working';
        }
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      let status = 'unknown_error';
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        status = 'dns_error';
        if (url === API_URLS.primary) {
          results.primaryStatus = 'dns_error';
        }
      } else if (error.name === 'AbortError') {
        status = 'timeout';
        if (url === API_URLS.primary) {
          results.primaryStatus = 'timeout';
        }
      }
      
      results.testedUrls.push({ url, status, responseTime });
    }
  }

  return results;
};

// Export the base URL for debugging
export const getApiBaseUrl = () => getBaseURL();

export default apiClient;