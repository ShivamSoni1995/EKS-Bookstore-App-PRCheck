// API configuration for different environments
const getApiBaseUrl = () => {
  // In Kubernetes cluster (production)
  if (process.env.NODE_ENV === 'production') {
    // Use internal service communication
    return 'http://bookstore-api-service:5000/api';
  }
  
  // Local development
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default development URL
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
