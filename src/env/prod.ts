export const prodConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://devtoolkit-backend-production.up.railway.app/api',
  environment: 'production',
  debug: false,
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
  }
}; 