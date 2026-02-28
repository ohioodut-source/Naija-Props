import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign, MapPin, Home, Type } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PostProperty = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: 'Abuja',
        type: 'Rent',
        category: 'House',
        rental_period: 'Yearly',
        min_duration: 1,
        max_duration: 365,
        bedrooms: '',
        bathrooms: '',
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Default image for demo
    });

    useEffect(() => {
        if (!authLoading && !user) {
            showToast('Please login to post a property', 'info');
            navigate('/login');
        }
    }, [user, authLoading, navigate, showToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: parseInt(formData.price),
            bedrooms: parseInt(formData.bedrooms) || 0,
            bathrooms: parseInt(formData.bathrooms) || 0,
            rental_period: formData.type === 'Rent' ? formData.rental_period : null,
            min_duration: formData.type === 'Rent' ? parseInt(formData.min_duration) || 1 : null,
            max_duration: formData.type === 'Rent' ? parseInt(formData.max_duration) || 365 : null
        };

        try {
            const response = await fetch('${API_URL}/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to post property');
            }

            showToast('Property posted successfully!', 'success');
            navigate('/');
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '8rem 2rem 4rem', maxWidth: '800px' }}>
            <div className="glass" style={{ padding: '3rem' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Post a Property</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2">

                    {/* Title */}
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Property Title</label>
                        <input
                            type="text"
                            name="title"
                            className="input"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Luxury 3 Bedroom Apartment"
                        />
                    </div>

                    {/* Location */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select name="location" className="input" style={{ paddingLeft: '3rem' }} value={formData.location} onChange={handleChange}>
                                <option value="Abuja">Abuja</option>
                                <option value="Lagos">Lagos</option>
                            </select>
                        </div>
                    </div>

                    {/* Type */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Listing Type</label>
                        <div style={{ position: 'relative' }}>
                            <Type size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select name="type" className="input" style={{ paddingLeft: '3rem' }} value={formData.type} onChange={handleChange}>
                                <option value="Rent">For Rent</option>
                                <option value="Buy">For Sale</option>
                            </select>
                        </div>
                    </div>

                    {/* Rental Constraints (Shows only if Renting) */}
                    {formData.type === 'Rent' && (
                        <>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rental Frequency</label>
                                <div style={{ position: 'relative' }}>
                                    <Type size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <select name="rental_period" className="input" style={{ paddingLeft: '3rem' }} value={formData.rental_period} onChange={handleChange}>
                                        <option value="Daily">Daily</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Min & Max Duration</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="number"
                                        name="min_duration"
                                        className="input"
                                        min="1"
                                        value={formData.min_duration}
                                        onChange={handleChange}
                                        placeholder="Min"
                                        style={{ width: '50%' }}
                                    />
                                    <input
                                        type="number"
                                        name="max_duration"
                                        className="input"
                                        min={formData.min_duration}
                                        value={formData.max_duration}
                                        onChange={handleChange}
                                        placeholder="Max"
                                        style={{ width: '50%' }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Category */}
                    <div className="input-group" style={{ gridColumn: formData.type === 'Rent' ? '1 / -1' : 'auto' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Property Category</label>
                        <div style={{ position: 'relative' }}>
                            <Home size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select name="category" className="input" style={{ paddingLeft: '3rem' }} value={formData.category} onChange={handleChange}>
                                <option value="House">House / Duplex</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Beach House">Beach House</option>
                                <option value="Shop/Plaza">Shop / Plaza</option>
                                <option value="Event Location">Event Location</option>
                                <option value="Airbnb">Airbnb</option>
                            </select>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price (₦)</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'bold' }}>₦</span>
                            <input
                                type="number"
                                name="price"
                                className="input"
                                required
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL</label>
                        <div style={{ position: 'relative' }}>
                            <Upload size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="url"
                                name="image_url"
                                className="input"
                                required
                                style={{ paddingLeft: '3rem' }}
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Bedrooms */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bedrooms</label>
                        <input
                            type="number"
                            name="bedrooms"
                            className="input"
                            required
                            value={formData.bedrooms}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Bathrooms */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bathrooms</label>
                        <input
                            type="number"
                            name="bathrooms"
                            className="input"
                            required
                            value={formData.bathrooms}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Description */}
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            name="description"
                            className="input"
                            required
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the property..."
                        ></textarea>
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Posting...' : 'Post Property'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PostProperty;
