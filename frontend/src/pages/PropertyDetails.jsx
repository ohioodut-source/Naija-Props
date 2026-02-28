import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, ArrowLeft, Phone, Mail, Share2, Grid } from 'lucide-react';
import { API_URL } from '../config';

// Helper to get mock images
const getImagesForId = (propId) => {
    // Generate valid local paths for the demo
    const id = parseInt(propId);
    if (!id || id > 10) return [];

    return [
        `/properties/property-${id}.jpg`,
        `/properties/property-${id === 10 ? 1 : id + 1}.jpg`,
        `/properties/property-${id === 1 ? 10 : id - 1}.jpg`,
        `/properties/property-${id}.jpg`,
        `/properties/property-${id === 5 ? 1 : id + 2}.jpg`
    ];
};

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [rentalDuration, setRentalDuration] = useState(1);

    useEffect(() => {
        if (property && property.min_duration) {
            setRentalDuration(property.min_duration);
        }
    }, [property]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                // Try fetching from backend
                const response = await fetch(`${API_URL}/properties/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch from backend');
                }

                const data = await response.json();

                // If successful, overlay our local mock images for the demo properties (IDs 1-10)
                if (data) {
                    let finalData = { ...data };

                    if (data.id <= 10) {
                        const localImages = getImagesForId(data.id);
                        finalData.images = localImages;
                        finalData.image_url = localImages[0];
                    }
                    setProperty(finalData);
                }
            } catch (err) {
                console.log("Backend fetch failed, falling back to mock data.");
                // Fallback Mock Data
                const propId = parseInt(id);
                const localImages = getImagesForId(propId);
                const mock = {
                    id: propId,
                    title: propId <= 5 ? `Luxury Villa ${propId} in Lagos` : `Modern Estate ${propId} in Abuja`,
                    type: propId % 2 === 0 ? "Sale" : "Rent",
                    location: propId <= 5 ? "Lagos" : "Abuja",
                    price: propId <= 5 ? 450000000 : 150000000,
                    bedrooms: 5,
                    bathrooms: 5,
                    description: "This is a premium property featuring state-of-the-art amenities, spacious interiors, and a prime location. Perfect for those seeking luxury and comfort.",
                    image_url: localImages[0] || '/properties/property-1.jpg',
                    images: localImages.length > 0 ? localImages : ['/properties/property-1.jpg']
                };
                setProperty(mock);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading...</div>;
    if (!property) return <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>Property not found</div>;

    const images = property.images && property.images.length > 0 ? property.images : [property.image_url];

    return (
        <div className="container" style={{ padding: '8rem 2rem 4rem' }}>
            <Link to="/" className="btn btn-outline" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={18} /> Back to Search
            </Link>

            {/* Gallery Grid */}
            <div className="gallery-grid" style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1rem',
                height: '500px',
                borderRadius: '1rem',
                overflow: 'hidden',
                marginBottom: '2rem'
            }}>
                <div style={{ height: '100%', position: 'relative' }}>
                    <img
                        src={images[0]}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => { setActiveImage(0); setShowAllPhotos(true); }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800'; }}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
                    <img
                        src={images[1] || images[0]}
                        alt="Interior"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => { setActiveImage(1); setShowAllPhotos(true); }}
                    />
                    <div style={{ position: 'relative', height: '100%' }}>
                        <img
                            src={images[2] || images[0]}
                            alt="Interior"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => { setActiveImage(2); setShowAllPhotos(true); }}
                        />
                        {images.length > 5 && (
                            <div
                                style={{
                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setShowAllPhotos(true)}
                            >
                                <Grid size={20} style={{ marginRight: '0.5rem' }} />
                                Show all photos
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h1 style={{ marginBottom: '0.5rem' }}>{property.title}</h1>
                                <p style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                                    <MapPin size={18} style={{ marginRight: '0.5rem' }} /> {property.location}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <div style={{
                                    background: 'var(--primary-color)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '2rem',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>
                                    {property.type}
                                </div>
                                {property.category && (
                                    <div style={{
                                        background: 'var(--secondary-color)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '2rem',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        {property.category}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '2rem' }}>
                        {property.bedrooms > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Bed size={20} /> <span>{property.bedrooms} Bedrooms</span>
                            </div>
                        )}
                        {property.bathrooms > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Bath size={20} /> <span>{property.bathrooms} Bathrooms</span>
                            </div>
                        )}
                        {property.bedrooms === 0 && property.bathrooms === 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <span>Open Space Area</span>
                            </div>
                        )}
                    </div>

                    <h2 style={{ marginBottom: '1rem' }}>Description</h2>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{property.description}</p>
                </div>

                <div>
                    <div className="glass" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                            ₦{parseInt(property.price).toLocaleString()}
                            {property.rental_period && <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {property.rental_period}</span>}
                        </h2>

                        {property.type === 'Rent' && property.rental_period && (
                            <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.03)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 'bold' }}>
                                    Duration ({property.rental_period === 'Daily' ? 'Days' : property.rental_period === 'Monthly' ? 'Months' : 'Years'})
                                    {(property.min_duration || property.max_duration) && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                                            (Min: {property.min_duration || 1}, Max: {property.max_duration || 365})
                                        </span>
                                    )}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                    <input
                                        type="number"
                                        min={property.min_duration || 1}
                                        max={property.max_duration || 365}
                                        value={rentalDuration}
                                        onChange={(e) => setRentalDuration(parseInt(e.target.value) || '')}
                                        onBlur={(e) => {
                                            let val = parseInt(e.target.value) || property.min_duration || 1;
                                            const min = property.min_duration || 1;
                                            const max = property.max_duration || 365;
                                            setRentalDuration(Math.min(max, Math.max(min, val)));
                                        }}
                                        className="input"
                                        style={{ width: '80px', padding: '0.5rem' }}
                                    />
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        Total: ₦{(parseInt(property.price) * (rentalDuration || property.min_duration || 1)).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                            {property.type === 'Rent' ? 'Book Now' : 'Schedule Tour'}
                        </button>
                        <button className="btn btn-outline" style={{ width: '100%' }}>
                            Request Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
