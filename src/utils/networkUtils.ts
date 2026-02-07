// Network utility functions for debugging connectivity issues

import { getConnectionDiagnostics, switchToWorkingEndpoint, checkApiHealth } from '@/api';

/**
 * Test all available backend URLs and log results to console
 * Usage: Call this function from browser console to debug connectivity
 */
export const testAllConnections = async () => {
  console.log('🔍 Testing all backend connections...');
  
  try {
    const diagnostics = await getConnectionDiagnostics();
    
    console.log('\n📊 Connection Test Results:');
    console.log('═══════════════════════════');
    
    diagnostics.testedUrls.forEach((result, index) => {
      const icon = result.status === 'working' ? '✅' : '❌';
      const timing = result.responseTime < 1000 ? '🚀 Fast' : 
                    result.responseTime < 3000 ? '⚡ Normal' : '🐌 Slow';
      
      console.log(`${icon} ${result.url}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Response Time: ${result.responseTime}ms (${timing})`);
      console.log('');
    });
    
    console.log('🎯 Summary:');
    console.log(`Primary URL Status: ${diagnostics.primaryStatus}`);
    console.log(`Working URL Found: ${diagnostics.workingUrl || 'None'}`);
    
    if (diagnostics.workingUrl) {
      console.log('\n🔧 Recommendation: Your app should work normally');
      if (diagnostics.primaryStatus !== 'working') {
        console.log('💡 The app will automatically use fallback URLs');
      }
    } else {
      console.log('\n⚠️  Recommendation: Try these solutions:');
      console.log('1. Switch to mobile data if using WiFi');
      console.log('2. Switch to different WiFi network');
      console.log('3. Use a VPN (especially if using Jio/Airtel)');
      console.log('4. Check your firewall settings');
    }
    
    return diagnostics;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return null;
  }
};

/**
 * Quick connectivity fix - attempts to switch to working endpoint
 */
export const quickFix = async () => {
  console.log('🔧 Attempting quick connectivity fix...');
  
  try {
    const success = await switchToWorkingEndpoint();
    
    if (success) {
      console.log('✅ Successfully switched to working endpoint');
      const isHealthy = await checkApiHealth();
      
      if (isHealthy) {
        console.log('🎉 API is now reachable! Try refreshing the page.');
        return true;
      } else {
        console.log('⚠️  Endpoint switched but health check still fails');
        return false;
      }
    } else {
      console.log('❌ No working endpoints found');
      return false;
    }
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
    return false;
  }
};

/**
 * Network troubleshooting guide
 */
export const troubleshootingGuide = () => {
  console.log(`
🔧 NETWORK TROUBLESHOOTING GUIDE
═══════════════════════════════

If you're experiencing connectivity issues:

1️⃣ IMMEDIATE FIXES:
   • Run 'quickFix()' in console
   • Switch from WiFi to mobile data (or vice versa)
   • Try incognito/private browsing mode

2️⃣ ISP-SPECIFIC ISSUES:
   • Jio/Airtel users: Often have DNS blocking
   • Solution: Use mobile data or VPN
   • Alternative: Change DNS to 8.8.8.8 or 1.1.1.1

3️⃣ NETWORK ISSUES:
   • Corporate/school networks may block external APIs
   • Public WiFi often has restrictions
   • Try different network or use mobile hotspot

4️⃣ DEVICE ISSUES:
   • Clear browser cache and cookies
   • Disable browser extensions temporarily
   • Reset network settings (WiFi)

5️⃣ ADVANCED DEBUGGING:
   • Run 'testAllConnections()' for detailed diagnosis
   • Check browser console for error codes
   • Test from different devices on same network

📞 If nothing works:
   • The issue is likely temporary
   • Try again in 10-15 minutes
   • Contact support with console output from testAllConnections()
  `);
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  (window as any).testAllConnections = testAllConnections;
  (window as any).quickFix = quickFix;
  (window as any).troubleshootingGuide = troubleshootingGuide;
}

export default {
  testAllConnections,
  quickFix,
  troubleshootingGuide,
};