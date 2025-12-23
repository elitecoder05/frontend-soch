// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react-swc";
// // import path from "path";
// // import { componentTagger } from "lovable-tagger";

// // // https://vitejs.dev/config/
// // export default defineConfig(({ mode }) => ({
// //   server: {
// //     host: "::",
// //     port: 2000,
// //     // allow the production host (Railway deployment) so dev server accepts requests
// //     allowedHosts: ["frontend-soch-production.up.railway.app"],
// //   },
// //   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
// //   resolve: {
// //     alias: {
// //       "@": path.resolve(__dirname, "./src"),
// //     },
// //   },
// // }));









// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 2000,
//     // allow the production host (Railway deployment) so dev server accepts requests
//     allowedHosts: ["frontend-soch-production.up.railway.app"],
    
//     // ✅ FIX: Add headers to allow popups (Razorpay/Google) to work and close properly
//     headers: {
//       "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
//       "Cross-Origin-Embedder-Policy": "unsafe-none",
//     },
//   },
//   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Allows access from outside (Network)
    port: 2000,
    
    // ✅ FIX: Set to 'true' to allow your phone/tablet to connect via IP address
    // (This fixes the "Site can't be reached" error on other devices)
    allowedHosts: true,
    
    // ✅ HEADERS: Allows Popups (Google/Razorpay) to work correctly
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));