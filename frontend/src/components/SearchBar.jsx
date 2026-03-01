import React from 'react';
import { Search, MapPin, DollarSign, Filter, Bed } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [filters, setFilters] = React.useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        bedrooms: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>

                {/* Location */}
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Location</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            className="input"
                            style={{ paddingLeft: '3rem', appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="">Any Location</option>
                            <option value="Abuja">Abuja</option>
                            <option value="Lagos">Lagos</option>
                        </select>
                    </div>
                </div>

                {/* Property Type */}
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Property Type</label>
                    <div style={{ position: 'relative' }}>
                        <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleChange}
                            className="input"
                            style={{ paddingLeft: '3rem', appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="">Rent & Buy</option>
                            <option value="Rent">For Rent</option>
                            <option value="Buy">For Sale</option>
                        </select>
                    </div>
                </div>

                {/* Bedrooms */}
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Bedrooms</label>
                    <div style={{ position: 'relative' }}>
                        <Bed size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select
                            name="bedrooms"
                            value={filters.bedrooms}
                            onChange={handleChange}
                            className="input"
                            style={{ paddingLeft: '3rem', appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="">Any</option>
                            <option value="1">1+ Bed</option>
                            <option value="2">2+ Beds</option>
                            <option value="3">3+ Beds</option>
                            <option value="4">4+ Beds</option>
                            <option value="5">5+ Beds</option>
                        </select>
                    </div>
                </div>

                {/* Min Price */}
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Min Budget (₦)</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'bold' }}>₦</span>
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="e.g. 1,000,000"
                            value={filters.minPrice}
                            onChange={handleChange}
                            className="input"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                </div>

                {/* Max Price */}
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Max Budget (₦)</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'bold' }}>₦</span>
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="e.g. 50,000,000"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            className="input"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <button type="submit" className="btn btn-primary" style={{ height: '50px', width: '100%', maxWidth: '300px' }}>
                    <Search size={20} />
                    Search Properties
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
