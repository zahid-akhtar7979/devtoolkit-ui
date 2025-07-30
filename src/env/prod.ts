export const prodConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.devtoolkit.com/api',
  environment: 'production',
  debug: false,
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
  }
}; 