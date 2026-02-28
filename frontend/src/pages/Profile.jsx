import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, PlusCircle, Home, LogOut, Settings, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';

const Profile = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: '',
        username: '',
        email: '',
        profile_picture_url: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch profile');
                const data = await response.json();
                setProfileData(data);
                setEditForm({
                    full_name: data.full_name || '',
                    username: data.username || '',
                    email: data.email || '',
                    profile_picture_url: data.profile_picture_url || ''
                });
            } catch (error) {
                console.error('Profile fetch error:', error);
                showToast('Failed to load profile data', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user, authLoading, navigate, showToast]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // Simulate avatar change (In a real app, this would upload a file to a server/S3)
    const handleAvatarClick = () => {
        if (!isEditing) return;

        // Very simple simulation: ask for a URL or just set a random robust avatar placeholder
        const newUrl = prompt("Enter a direct link to an image (URL), or leave blank to clear:", editForm.profile_picture_url);
        if (newUrl !== null) {
            setEditForm(prev => ({ ...prev, profile_picture_url: newUrl }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to update profile');
            }

            const updatedData = await response.json();
            setProfileData(updatedData);
            setIsEditing(false);
            showToast('Profile updated successfully!', 'success');

            // Optionally, we might need to update the main AuthContext if it stores user name.

        } catch (error) {
            console.error('Update profile error:', error);
            showToast(error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        // Reset form back to original data
        setEditForm({
            full_name: profileData.full_name || '',
            username: profileData.username || '',
            email: profileData.email || '',
            profile_picture_url: profileData.profile_picture_url || ''
        });
    };

    if (loading || authLoading) {
        return (
            <div className="container" style={{ paddingTop: '8rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '8rem 2rem 4rem', maxWidth: '1000px' }}>

            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Your Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Welcome back, {profileData?.full_name?.split(' ')[0] || 'User'}!</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/post')} style={{ borderRadius: '12px' }}>
                        <PlusCircle size={20} />
                        List Property
                    </button>
                    <button className="btn btn-outline" onClick={handleLogout} style={{ borderRadius: '12px', color: '#ff4444', borderColor: '#ff4444' }}>
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>

                {/* Profile Card */}
                <div className="glass" style={{ padding: '2rem', borderRadius: '24px', gridColumn: 'span 1' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>

                        {/* Avatar */}
                        <div
                            onClick={handleAvatarClick}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: (isEditing && editForm.profile_picture_url) || (!isEditing && profileData?.profile_picture_url)
                                    ? `url(${(isEditing ? editForm.profile_picture_url : profileData.profile_picture_url)}) center/cover`
                                    : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                                cursor: isEditing ? 'pointer' : 'default',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Initials Fallback */}
                            {!(isEditing ? editForm.profile_picture_url : profileData?.profile_picture_url) && (
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                                    {profileData?.full_name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}

                            {/* Edit Overlay */}
                            {isEditing && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'rgba(0,0,0,0.6)',
                                    padding: '4px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Camera size={16} color="white" />
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <h3 style={{ marginBottom: '0.25rem', fontSize: '1.5rem', opacity: 0.5 }}>Editing Profile</h3>
                        ) : (
                            <>
                                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.5rem' }}>{profileData?.full_name}</h3>
                                {profileData?.username && (
                                    <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.25rem' }}>@{profileData?.username}</p>
                                )}
                                <p style={{ color: 'var(--text-muted)' }}>Member Profile</p>
                            </>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: '1.5rem -2rem', padding: '1.5rem 2rem 0' }}>

                        {/* Full Name Field */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                                <User size={20} style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: isEditing ? '0.5rem' : '0.2rem' }}>Full Name</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={editForm.full_name}
                                        onChange={handleEditChange}
                                        className="input"
                                        style={{ padding: '0.5rem', width: '100%', paddingLeft: '0.75rem' }}
                                    />
                                ) : (
                                    <p style={{ fontWeight: 500 }}>{profileData?.full_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Username Field */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', minWidth: '36px', textAlign: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>@</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: isEditing ? '0.5rem' : '0.2rem' }}>Username</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={editForm.username}
                                        onChange={handleEditChange}
                                        className="input"
                                        style={{ padding: '0.5rem', width: '100%', paddingLeft: '0.75rem' }}
                                    />
                                ) : (
                                    <p style={{ fontWeight: 500 }}>{profileData?.username || 'Not set'}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                                <Mail size={20} style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: isEditing ? '0.5rem' : '0.2rem' }}>Email Address</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        className="input"
                                        style={{ padding: '0.5rem', width: '100%', paddingLeft: '0.75rem' }}
                                    />
                                ) : (
                                    <p style={{ fontWeight: 500, wordBreak: 'break-all' }}>{profileData?.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={cancelEdit} disabled={saving}>
                                    <X size={18} /> Cancel
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
                                    <Save size={18} /> {saving ? '...' : 'Save'}
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }} onClick={() => setIsEditing(true)}>
                                <Settings size={18} />
                                Edit Profile
                            </button>
                        )}

                    </div>
                </div>

                {/* Dashboard Stats / Main Area */}
                <div style={{ gridColumn: 'span 1 / span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Stats */}
                    <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '16px', color: 'var(--primary-color)' }}>
                                    <Home size={28} />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>0</h2>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Active Listings</p>
                        </div>
                        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '1rem', borderRadius: '16px', color: 'var(--secondary-color)' }}>
                                    <Home size={28} />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>0</h2>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Saved Properties</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', flex: 1 }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>My Properties</h3>

                        <div style={{
                            textAlign: 'center',
                            padding: '3rem 1rem',
                            color: 'var(--text-muted)',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '16px',
                            border: '1px dashed var(--border-color)'
                        }}>
                            <Home size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>You haven't listed any properties yet.</p>
                            <button className="btn btn-outline" onClick={() => navigate('/post')} style={{ margin: '0 auto' }}>
                                Create your first listing
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Profile;
