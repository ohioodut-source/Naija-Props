// Dynamically resolve the API URL based on how the user accesses the frontend
export const API_URL = typeof window !== 'undefined'
    ? `http://${window.location.hostname}:8000`
    : 'http://localhost:8000';
