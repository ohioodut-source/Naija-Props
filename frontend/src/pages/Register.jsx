import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Calendar, Shield, Upload, FileCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

import { API_URL } from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: '', username: '', email: '', password: '', confirmPassword: '',
        role: 'Client', phone_number: '', date_of_birth: '',
        id_document_type: 'National ID Card', id_document_url: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showToast('Passwords do not match!', 'error');
            return;
        }

        setLoading(true);

        try {
            // Mock file upload if a file was selected but no URL provided yet
            let finalUrl = formData.id_document_url;
            if (file && !finalUrl) {
                finalUrl = `/mock/uploads/id_${Date.now()}.jpg`;
            }

            // Remove confirmPassword from the payload sent to backend
            const { confirmPassword, ...payloadData } = formData;

            // Add the final document url
            if (formData.role !== 'Client') {
                payloadData.id_document_url = finalUrl;
            } else {
                // Clients don't submit ID initially
                delete payloadData.id_document_type;
                delete payloadData.id_document_url;
            }

            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadData),
            });

            if (!response.ok) {
                let errorMsg = 'Registration failed';
                try {
                    const data = await response.json();
                    errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail) || errorMsg;
                } catch {
                    // Ignored if response is not JSON
                }
                throw new Error(errorMsg);
            }

            showToast('Account created! Please login.', 'success');
            navigate('/login');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '8rem 2rem', maxWidth: '800px' }}>
            <div className="glass" style={{ padding: '3rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="full_name"
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: '1rem' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'bold' }}>@</span>
                                <input
                                    type="text"
                                    name="username"
                                    className="input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: '1rem' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date of Birth</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="input-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>I am registering as a:</label>
                        <select name="role" className="input" value={formData.role} onChange={handleChange}>
                            <option value="Client">Client (Buyer / Renter)</option>
                            <option value="Agent">Agent</option>
                            <option value="Developer">Developer</option>
                            <option value="Landlord">Landlord / Property Owner</option>
                        </select>
                    </div>

                    {formData.role !== 'Client' && (
                        <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                <Shield className="text-indigo-400" size={20} /> Identity Verification Required
                            </h4>
                            <p className="text-sm text-gray-400 mb-4">To register as an affiliate and list properties, please provide a valid means of identification.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Document Type</label>
                                    <select name="id_document_type" className="input" value={formData.id_document_type} onChange={handleChange}>
                                        <option value="National ID Card">National ID Card</option>
                                        <option value="International Passport">International Passport</option>
                                        <option value="Driver's License">Driver's License</option>
                                        <option value="Voter's Card (NIN)">Voter's Card (NIN)</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Document</label>
                                    <div
                                        onClick={() => document.getElementById('id-upload').click()}
                                        style={{
                                            border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '0.8rem',
                                            textAlign: 'center', cursor: 'pointer', background: 'var(--bg-dark)'
                                        }}>
                                        <input
                                            type="file"
                                            id="id-upload"
                                            style={{ display: 'none' }}
                                            onChange={(e) => setFile(e.target.files[0])}
                                            accept=".jpg,.jpeg,.png,.pdf"
                                        />
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            {file ? <FileCheck size={24} className="text-green-400" /> : <Upload size={24} className="text-gray-500" />}
                                            <span className="text-sm text-gray-400">{file ? file.name : "Click to select file"}</span>
                                        </div>
                                    </div>
                                    {!file && !formData.id_document_url && <p className="text-xs text-red-400 mt-1">Required</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: '1.5rem' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="password"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
