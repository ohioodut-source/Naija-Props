import React from 'react';
import { MapPin, Bed, Bath, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
    return (
        <div className="glass card card-hover-effect animate-fade-in">
            <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                <img
                    src={property.image_url}
                    alt={property.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${property.type === 'Rent' ? 'badge-rent' : 'badge-buy'}`} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                        {property.type}
                    </span>
                    <span className="badge" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)' }}>
                        {property.location}
                    </span>
                    {property.category && (
                        <span className="badge" style={{ backgroundColor: 'var(--primary-color)', color: 'white', backdropFilter: 'blur(4px)' }}>
                            {property.category}
                        </span>
                    )}
                </div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '1.5rem 1rem 1rem' }}>
                    <h3 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>
                        ₦{property.price.toLocaleString()}
                        {property.rental_period && <span style={{ fontSize: '1rem', opacity: 0.8, fontWeight: 'normal' }}> / {property.rental_period}</span>}
                    </h3>
                </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} /> {property.location}, Nigeria
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {property.bedrooms > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bed size={18} color="var(--primary-color)" />
                            <span>{property.bedrooms} Beds</span>
                        </div>
                    )}
                    {property.bathrooms > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bath size={18} color="var(--secondary-color)" />
                            <span>{property.bathrooms} Baths</span>
                        </div>
                    )}
                </div>

                <Link to={`/property/${property.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1rem', textDecoration: 'none' }}>
                    View Details <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default PropertyCard;
