import React, { useState } from 'react';
import { MapPin, Phone, Mail, Star, Search } from 'lucide-react';

const mockAgents = [
    {
        id: 1,
        name: "Chidinma Okafor",
        location: "Lagos",
        phone: "+234 801 234 5678",
        email: "chidinma.o@naijaprops.com",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 124
    },
    {
        id: 2,
        name: "Tunde Bakare",
        location: "Abuja",
        phone: "+234 802 345 6789",
        email: "tunde.b@naijaprops.com",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        reviews: 89
    },
    {
        id: 3,
        name: "Amina Yusuf",
        location: "Abuja",
        phone: "+234 803 456 7890",
        email: "amina.y@naijaprops.com",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 156
    },
    {
        id: 4,
        name: "Emeka Okonkwo",
        location: "Lagos",
        phone: "+234 804 567 8901",
        email: "emeka.o@naijaprops.com",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 78
    },
    {
        id: 5,
        name: "Zainab Bello",
        location: "Lagos",
        phone: "+234 805 678 9012",
        email: "zainab.b@naijaprops.com",
        image: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        reviews: 210
    },
    {
        id: 6,
        name: "David West",
        location: "Abuja",
        phone: "+234 806 789 0123",
        email: "david.w@naijaprops.com",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.5,
        reviews: 54
    }
];

const Agents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');

    const filteredAgents = mockAgents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = locationFilter === 'All' || agent.location === locationFilter;
        return matchesSearch && matchesLocation;
    });

    return (
        <div className="container" style={{ padding: '8rem 2rem 4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="animate-fade-in">Find Your Agent</h1>
                <p className="animate-fade-in" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Connect with our top-rated real estate experts in Abuja and Lagos.
                </p>
            </div>

            {/* Filters */}
            <div className="glass animate-fade-in" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="input-group">
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="Search agent by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select
                            className="input"
                            style={{ paddingLeft: '3rem' }}
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="All">All Locations</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja">Abuja</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredAgents.map(agent => (
                    <div key={agent.id} className="card glass animate-fade-in">
                        <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={agent.image}
                                alt={agent.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '1rem',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                            }}>
                                <h3 style={{ color: 'white', margin: 0 }}>{agent.name}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MapPin size={14} /> {agent.location}, Nigeria
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{agent.rating}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({agent.reviews} reviews)</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <a href={`tel:${agent.phone}`} className="btn btn-outline" style={{ justifyContent: 'center', borderColor: 'var(--border-color)' }}>
                                    <Phone size={18} /> Call Agent
                                </a>
                                <a href={`mailto:${agent.email}`} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                                    <Mail size={18} /> Message
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAgents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <p>No agents found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Agents;
