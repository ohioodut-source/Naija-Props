// Dynamically resolve the API URL based on how the user accesses the frontend
export const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://naija-props.onrender.com';
