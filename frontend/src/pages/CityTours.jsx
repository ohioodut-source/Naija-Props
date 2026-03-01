import React, { useState } from 'react';
import { Map, MapPin, Search, Star, Building2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const CityTours = () => {
    const [activeCity, setActiveCity] = useState('Lagos');

    const tourData = {
        Lagos: [
            {
                class: "High Class (Luxury & Premium)",
                icon: <Star className="text-yellow-400" size={24} />,
                description: "The peak of luxury living, featuring high-end apartments, ocean views, and exclusive communities.",
                areas: [
                    { name: "Eko Atlantic City", image: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&q=80&w=800", vibe: "Ultra-Modern, Exclusive" },
                    { name: "Victoria Island (VI)", image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800", vibe: "Commercial Hub, Nightlife" },
                    { name: "Ikoyi", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", vibe: "Old Money, Serene, Secure" }
                ]
            },
            {
                class: "Middle Class (Comfort & Value)",
                icon: <Building2 className="text-blue-400" size={24} />,
                description: "Great balance of lifestyle, accessibility, and modern amenities suitable for young professionals and families.",
                areas: [
                    { name: "Lekki Phase 1", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800", vibe: "Trendy, Fast-paced" },
                    { name: "Ikeja GRA", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800", vibe: "Central, Leafy, Airport Proximity" },
                    { name: "Surulere", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", vibe: "Cultural, Vibrant, Accessible" }
                ]
            },
            {
                class: "Growing/Affordable (Budget-Friendly)",
                icon: <Home className="text-green-400" size={24} />,
                description: "Emerging neighborhoods and suburban areas offering affordable housing and strong community ties.",
                areas: [
                    { name: "Yaba", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800", vibe: "Tech Hub, Student Energy" },
                    { name: "Ikorodu", image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800", vibe: "Suburban, Spacious" },
                    { name: "Alimosho", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", vibe: "Dense, Commercial, Affordable" }
                ]
            }
        ],
        Abuja: [
            {
                class: "High Class (Luxury & Premium)",
                icon: <Star className="text-yellow-400" size={24} />,
                description: "The diplomatic and political heart of Nigeria, offering expansive mansions and top-tier security.",
                areas: [
                    { name: "Maitama", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800", vibe: "Diplomatic, Exclusive, Quiet" },
                    { name: "Asokoro", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", vibe: "High Security, Elite" },
                    { name: "Wuse II", image: "https://images.unsplash.com/photo-1622866306950-71d2c6c39fbb?auto=format&fit=crop&q=80&w=800", vibe: "Commercial, Cosmopolitan" }
                ]
            },
            {
                class: "Middle Class (Comfort & Value)",
                icon: <Building2 className="text-blue-400" size={24} />,
                description: "Well-planned residential zones ideal for civil servants, business owners, and families.",
                areas: [
                    { name: "Gwarinpa", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800", vibe: "Large Estate, Self-Sufficient" },
                    { name: "Apo", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800", vibe: "Rapidly Developing, Residential" },
                    { name: "Jabi", image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800", vibe: "Lakeside, Leisure Hub" }
                ]
            },
            {
                class: "Growing/Affordable (Budget-Friendly)",
                icon: <Home className="text-green-400" size={24} />,
                description: "Satellite towns offering more space and affordability while remaining connected to the city center.",
                areas: [
                    { name: "Lugbe", image: "https://images.unsplash.com/photo-1510501655848-0ca1a9fbdf35?auto=format&fit=crop&q=80&w=800", vibe: "Airport Road, Accessible" },
                    { name: "Kubwa", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800", vibe: "Vibrant Satellite Town" },
                    { name: "Karu", image: "https://images.unsplash.com/photo-1512915922686-57c11dde9c6b?auto=format&fit=crop&q=80&w=800", vibe: "Gateway to the East, Bustling" }
                ]
            }
        ]
    };

    return (
        <div className="container" style={{ padding: '6rem 2rem 4rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
                <h1 className="animate-fade-in" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Explore City <span style={{ color: '#ec4899' }}>Neighborhoods</span>
                </h1>
                <p className="animate-fade-in" style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                    Not sure where to live? Tour the most popular areas in Nigeria's biggest cities, categorized by lifestyle and budget to help you find your perfect fit.
                </p>
            </div>

            {/* City Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                {['Lagos', 'Abuja'].map((city) => (
                    <button
                        key={city}
                        className={`btn ${activeCity === city ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', borderRadius: '30px' }}
                        onClick={() => setActiveCity(city)}
                    >
                        <Map size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
                        {city}
                    </button>
                ))}
            </div>

            {/* Tour Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {tourData[activeCity].map((category, idx) => (
                    <div key={idx} className="animate-fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            {category.icon}
                            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{category.class}</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>{category.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {category.areas.map((area, areaIdx) => (
                                <div key={areaIdx} className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '15px' }}>
                                    <div style={{ height: '200px', position: 'relative' }}>
                                        <img
                                            src={area.image}
                                            alt={area.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                            padding: '1.5rem 1rem 1rem 1rem'
                                        }}>
                                            <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <MapPin size={18} color="#ec4899" /> {area.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                            <strong>Vibe:</strong> {area.vibe}
                                        </p>
                                        <Link to={`/?search=${area.name}`} className="btn btn-outline" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>
                                            <Search size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                            View Properties
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CityTours;
