import React, { useState } from 'react';
import { MapPin, Building, Briefcase, ChevronRight, Landmark, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const GovtProjects = () => {
    const [activeTab, setActiveTab] = useState('government');

    const governmentProjects = [
        {
            id: 1,
            title: "Lagos-Calabar Coastal Highway",
            status: "In Progress",
            location: "Lagos to Cross River",
            description: "A 700km highway project to connect Lagos to Calabar, expected to boost trade and real estate values along the corridor.",
            image: "https://images.unsplash.com/photo-1545638531-50e58f0dc498?auto=format&fit=crop&q=80&w=800",
            impact: "High Property Appreciation expected in Epe, Ibeju-Lekki, and neighboring states.",
            completionDate: "2032"
        },
        {
            id: 2,
            title: "Eko Atlantic City Development",
            status: "Ongoing",
            location: "Victoria Island, Lagos",
            description: "A planned city being constructed on land reclaimed from the Atlantic Ocean. It will be the new financial center of West Africa.",
            image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=800",
            impact: "Premium Luxury Real Estate Hub. High Demand for surrounding VI properties.",
            completionDate: "Phased"
        },
        {
            id: 3,
            title: "Abuja Urban Renewal Project",
            status: "Planning Phase",
            location: "FCT, Abuja",
            description: "Comprehensive upgrade of inner-city infrastructure, roads, and public utilities in the Federal Capital Territory.",
            image: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&q=80&w=800",
            impact: "Increased rental yields in central zones due to better infrastructure.",
            completionDate: "2028"
        }
    ];

    const developerProjects = [
        {
            id: 4,
            title: "Blue Water Apartments",
            status: "Selling Fast",
            location: "Lekki Phase 1, Lagos",
            description: "Luxury high-rise apartments offering premium living with ocean views, smart home technology, and resort-style amenities.",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
            impact: "High ROI for shortlets and luxury long-term rentals.",
            completionDate: "Q4 2026"
        },
        {
            id: 5,
            title: "Centenary City Phase 1",
            status: "Under Construction",
            location: "Airport Road, Abuja",
            description: "A massive private mixed-use development featuring commercial hubs, residences, and entertainment centers.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
            impact: "Creating a new commercial center; strong capital appreciation for early buyers.",
            completionDate: "2027"
        },
        {
            id: 6,
            title: "The Haven Estate",
            status: "Pre-Launch",
            location: "Ibeju-Lekki, Lagos",
            description: "Affordable luxury bungalows in a gated community, perfect for first-time homeowners and long-term land bankers.",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
            impact: "Excellent entry-level investment in the rapidly growing New Lagos corridor.",
            completionDate: "2025"
        }
    ];

    const renderProjects = (projects) => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {projects.map(project => (
                    <div key={project.id} className="card property-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '15px', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                            <img
                                src={project.image}
                                alt={project.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span className="badge" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary-color)', color: 'white' }}>
                                {project.status}
                            </span>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{project.title}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                <MapPin size={16} />
                                <span>{project.location}</span>
                                <span style={{ margin: '0 0.5rem' }}>|</span>
                                <Building size={16} />
                                <span>ETA: {project.completionDate}</span>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5, flexGrow: 1 }}>
                                {project.description}
                            </p>

                            <div style={{
                                marginTop: 'auto',
                                padding: '1rem',
                                background: 'rgba(236, 72, 153, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(236, 72, 153, 0.1)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--secondary-color)', fontWeight: 600, fontSize: '0.9rem' }}>
                                    <Briefcase size={16} />
                                    <span>Real Estate Impact</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{project.impact}</p>
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <Link to="/" className="btn btn-outline" style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}>
                                    View Properties Here <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container" style={{ padding: '6rem 2rem 4rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
                <h1 className="animate-fade-in" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Major <span style={{ color: '#ec4899' }}>Projects</span> & Infrastructure
                </h1>
                <p className="animate-fade-in" style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                    Discover how government initiatives and top private developers are shaping the real estate landscape in Nigeria. Invest smartly by tracking upcoming mega-developments.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <button
                    className={`btn ${activeTab === 'government' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', borderRadius: '30px' }}
                    onClick={() => setActiveTab('government')}
                >
                    <Landmark size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
                    Government
                </button>
                <button
                    className={`btn ${activeTab === 'developers' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', borderRadius: '30px' }}
                    onClick={() => setActiveTab('developers')}
                >
                    <HardHat size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
                    Developers
                </button>
            </div>

            {activeTab === 'government' ? renderProjects(governmentProjects) : renderProjects(developerProjects)}

        </div>
    );
};

export default GovtProjects;
