// // // import axios from 'axios';

// // // const api = axios.create({
// // // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',});

// // // // Automatically add the Auth Token to every request
// // // api.interceptors.request.use((config) => {
// // //   const token = localStorage.getItem('token'); // Assuming you save the token here on login
// // //   if (token) {
// // //     config.headers.Authorization = `Bearer ${token}`;
// // //   }
// // //   return config;
// // // });

// // // export default api;
// // import axios from 'axios';
// // import { getAuth } from 'firebase/auth'; // Import Firebase Auth

// // const api = axios.create({
// //   // Use the port 1000 as established in your backend logs
// //   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1000/api',
// // });

// // // Request Interceptor: Attaches the Token
// // api.interceptors.request.use(async (config) => {
// //   const auth = getAuth();
// //   const user = auth.currentUser;

// //   if (user) {
// //     // Get the raw Firebase ID token (forceRefresh = false)
// //     const token = await user.getIdToken();
// //     config.headers.Authorization = `Bearer ${token}`;
// //   } else {
// //     // Fallback: Check localStorage if you are manually saving it there
// //     // (Optional, but good if you have a hybrid auth system)
// //     const storedToken = localStorage.getItem('token');
// //     if (storedToken) {
// //         config.headers.Authorization = `Bearer ${storedToken}`;
// //     }
// //   }
  
// //   return config;
// // }, (error) => {
// //   return Promise.reject(error);
// // });

// // export default api;


// import axios from 'axios';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1000/api',
// });

// // Helper: Wait for Firebase Auth to initialize if it's in an intermediate state
// const getFirebaseToken = (): Promise<string | null> => {
//   return new Promise((resolve) => {
//     const auth = getAuth();
//     if (auth.currentUser) {
//       resolve(auth.currentUser.getIdToken());
//     } else {
//       // If currentUser is null, it might be loading. 
//       // We set a short timeout or just resolve null immediately depending on app structure.
//       // Usually, your AuthContext handles the "loading" state, so by the time 
//       // you make an API call, auth is ready. 
//       resolve(null);
//     }
//   });
// };

// // Request Interceptor
// api.interceptors.request.use(async (config) => {
//   try {
//     const token = await getFirebaseToken();
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       // Optional: Fallback to localStorage if you have a legacy token system
//       const localToken = localStorage.getItem('token');
//       if (localToken) {
//         config.headers.Authorization = `Bearer ${localToken}`;
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching auth token", error);
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // Response Interceptor (Optional: Handle 401s automatically)
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized! Redirecting to login...");
//       // Optional: window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const api = axios.create({
  // Note: Uses VITE_API_BASE_URL for consistency across the app
  // Routes automatically add /api prefix
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:1000',
});

// Helper: Truly wait for Firebase Auth to initialize
const getFirebaseToken = () => {
  return new Promise((resolve) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // 1. If user is already loaded, resolve immediately
    if (currentUser) {
      currentUser.getIdToken().then(resolve).catch(() => resolve(null));
      return;
    }

    // 2. If user is not loaded yet, wait for the state change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Unsubscribe immediately to avoid memory leaks
      if (user) {
        user.getIdToken().then(resolve).catch(() => resolve(null));
      } else {
        resolve(null);
      }
    });
  });
};

// Request Interceptor
api.interceptors.request.use(async (config) => {
  try {
    const token = await getFirebaseToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback: Check localStorage (legacy support)
      const localToken = localStorage.getItem('token');
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
      }
    }
  } catch (error) {
    console.error("Error attaching auth token", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Optional: Clean up local storage or trigger a logout action here
      // localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;