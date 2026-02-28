import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign, MapPin, Home, Type, Camera, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SellProperty = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        type: 'Buy', // Defaulting to Sale as per "Sell" page intent
        bedrooms: '',
        bathrooms: '',
        image_url: '', // We will still use URL but simulate upload
        document_url: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            // Optional: Redirect or just show a banner. 
            // We'll let them see the form but block submit
        }
    }, [user, authLoading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Simulate file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a fake preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                // For this demo, we can't actually upload to a server without a backend endpoint for files.
                // We'll set a placeholder URL or keep the one entered manually if this was a real app.
                // Here we will just use the preview as a visual indicator.
                showToast('Image selected (simulation)', 'info');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast('Please login to list your property', 'error');
            navigate('/login');
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            price: parseInt(formData.price),
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            // Use a default image if none provided via URL, since file upload is partial
            image_url: formData.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        };

        try {
            const response = await fetch(`${API_URL}/properties`, {
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

            showToast('Property listed successfully!', 'success');
            navigate('/');
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    if (!user) {
        return (
            <div className="container flex flex-col items-center" style={{ paddingTop: '10rem', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Please log in to list a property</h2>
                <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Go to Login</button>
            </div>
        );
    }

    if (!user.is_verified) {
        return (
            <div className="container flex flex-col items-center" style={{ paddingTop: '10rem', textAlign: 'center', minHeight: '60vh' }}>
                <Info size={48} className="mx-auto text-indigo-500 mb-4" />
                <h2 style={{ marginBottom: '1rem' }}>Verification Required</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', marginInline: 'auto' }}>
                    To ensure trust and safety, all sellers and agents must complete a quick identity verification before posting properties.
                </p>
                <button onClick={() => navigate('/kyc')} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                    Verify Identity Now
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '8rem 2rem 4rem', maxWidth: '900px' }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="animate-fade-in">List Your Property</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Sell or rent your property to thousands of potential buyers in Nigeria.
                </p>
            </div>

            <div className="glass animate-fade-in" style={{ padding: '3rem' }}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2">

                    {/* Section: Property Details */}
                    <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                            <Home size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Property Details
                        </h3>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Property Title</label>
                        <input
                            type="text"
                            name="title"
                            className="input"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Modern 4 Bedroom Duplex in Lekki"
                        />
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Listing Type</label>
                        <div style={{ position: 'relative' }}>
                            <Type size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select name="type" className="input" style={{ paddingLeft: '3rem' }} value={formData.type} onChange={handleChange}>
                                <option value="Buy">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>
                    </div>

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

                    {/* Section: Features */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '2rem', marginBottom: '1rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                            <Info size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Features & Description
                        </h3>
                    </div>

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

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            name="description"
                            className="input"
                            required
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the property features, neighborhood, etc..."
                        ></textarea>
                    </div>

                    {/* Section: Media */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '2rem', marginBottom: '1rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                            <Camera size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Media
                        </h3>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Data Image URL</label>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <Upload size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="url"
                                name="image_url"
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://... (Optional if uploading below)"
                            />
                        </div>

                        <div style={{
                            border: '2px dashed var(--border-color)',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.02)'}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                                ) : (
                                    <>
                                        <div style={{ background: 'var(--primary-color)', borderRadius: '50%', padding: '1rem' }}>
                                            <Upload size={32} color="white" />
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>SVG, PNG, JPG or GIF (max. 3MB)</p>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Property Document (Proof of Ownership)</label>
                        <div style={{ position: 'relative' }}>
                            <Upload size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="url"
                                name="document_url"
                                className="input"
                                required
                                style={{ paddingLeft: '3rem' }}
                                value={formData.document_url}
                                onChange={handleChange}
                                placeholder="Link to ownership documents (PDF/Image URL)..."
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Required for compliance. This document will not be shown publicly to buyers.</p>
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                            {loading ? 'Listing Property...' : 'List Property Now'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SellProperty;
