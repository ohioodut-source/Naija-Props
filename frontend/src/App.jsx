import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PropertyCard from './components/PropertyCard';
import SkeletonPropertyCard from './components/SkeletonPropertyCard';
import PostProperty from './pages/PostProperty';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import SellProperty from './pages/SellProperty';
import Agents from './pages/Agents';
import Profile from './pages/Profile';
import KYCVerification from './pages/KYCVerification';
import GovtProjects from './pages/GovtProjects';
import CityTours from './pages/CityTours';
import { API_URL } from './config';

function Home({ properties, loading, error, handleSearch }) {
  return (
    <>
      {/* Hero Section */}
      <div style={{
        height: '60vh',
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(/hero.jpg) center/cover fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        marginTop: '-80px', // Pull behind header
        paddingTop: '80px'
      }}>
        <div className="container">
          <h1 className="animate-fade-in" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: '1rem' }}>
            Find Your Dream Home <br />
            <span style={{ color: '#ec4899' }}>in Nigeria</span>
          </h1>
          <p className="animate-fade-in" style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Discover the best properties in Abuja and Lagos. Buy, sell, or rent with confidence.
          </p>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />

      <main className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Featured Properties</h2>
          <span style={{ color: 'var(--text-muted)' }}>{properties.length} Results Found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonPropertyCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: '#ff4444' }}>
            <p>{error}</p>
            <button
              className="btn btn-outline"
              style={{ marginTop: '1rem' }}
              onClick={() => handleSearch()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

// Helper to assign local images based on ID for demo purposes
const getImagesForId = (id) => {
  // If id is within our mock range (1-10), return local paths
  // Otherwise return empty array or placeholder
  if (id >= 1 && id <= 10) {
    return [
      `/properties/property-${id}.jpg`, // Main bedroom/facade
      `/properties/property-${id === 10 ? 1 : id + 1}.jpg`, // Kitchen
      `/properties/property-${id === 1 ? 10 : id - 1}.jpg`, // Living room
      `/properties/property-${id}.jpg`, // Bathroom
      `/properties/property-${id === 5 ? 1 : id + 2}.jpg`  // Exterior
    ];
  }
  return [];
};

const MOCK_DATA = [
  {
    id: 1,
    title: "Luxury Waterfront Villa",
    type: "Sale",
    location: "Lagos",
    price: 450000000,
    image_url: "/properties/property-1.jpg",
    images: ["/properties/property-1.jpg", "/properties/property-2.jpg", "/properties/property-3.jpg"],
    bedrooms: 5,
    bathrooms: 6
  },
  {
    id: 2,
    title: "Modern Duplex",
    type: "Rent",
    location: "Abuja",
    price: 15000000,
    image_url: "/properties/property-2.jpg",
    images: ["/properties/property-2.jpg", "/properties/property-3.jpg", "/properties/property-4.jpg"],
    bedrooms: 4,
    bathrooms: 4
  },
  {
    id: 3,
    title: "Cozy Apartment",
    type: "Rent",
    location: "Lagos",
    price: 2500000,
    image_url: "/properties/property-3.jpg",
    images: ["/properties/property-3.jpg", "/properties/property-4.jpg", "/properties/property-5.jpg"],
    bedrooms: 2,
    bathrooms: 2
  },
  {
    id: 4,
    title: "Executive Mansion",
    type: "Sale",
    location: "Abuja",
    price: 850000000,
    image_url: "/properties/property-4.jpg",
    images: ["/properties/property-4.jpg", "/properties/property-5.jpg", "/properties/property-6.jpg"],
    bedrooms: 7,
    bathrooms: 8
  },
  {
    id: 5,
    title: "Serviced Flat",
    type: "Rent",
    location: "Lagos",
    price: 5000000,
    image_url: "/properties/property-5.jpg",
    images: ["/properties/property-5.jpg", "/properties/property-6.jpg", "/properties/property-7.jpg"],
    bedrooms: 3,
    bathrooms: 3
  },
  {
    id: 6,
    title: "Penthouse Suite",
    type: "Sale",
    location: "Lagos",
    price: 350000000,
    image_url: "/properties/property-6.jpg",
    images: ["/properties/property-6.jpg", "/properties/property-7.jpg", "/properties/property-8.jpg"],
    bedrooms: 4,
    bathrooms: 5
  }
];

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/properties?`;
      if (query) url += `search=${query}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      // Transform data to use local images for known IDs
      const enhancedData = data.map(prop => {
        if (prop.id <= 10) {
          return {
            ...prop,
            image_url: `/properties/property-${prop.id}.jpg`,
            images: getImagesForId(prop.id)
          };
        }
        return prop;
      });

      setProperties(enhancedData);
    } catch (err) {
      console.error("Fetch error, falling back to mock data", err);
      // Fallback to mock data on error (for demo resilience)
      setProperties(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="app-container">
            <Header />
            <Routes>
              <Route path="/" element={<Home properties={properties} loading={loading} error={error} handleSearch={fetchProperties} />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post" element={<PostProperty />} />
              <Route path="/sell" element={<SellProperty />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/kyc" element={<KYCVerification />} />
              <Route path="/projects" element={<GovtProjects />} />
              <Route path="/tour" element={<CityTours />} />
            </Routes>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
