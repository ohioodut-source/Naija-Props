import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on load
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Try to fetch user info to validate token
                    const response = await fetch(`${API_URL}/users/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser({ ...userData, token }); // Store full user + token
                    } else {
                        // Token invalid/expired
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    // Network error, maybe just optimistically use the token
                    setUser({ token });
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (token) => {
        localStorage.setItem('token', token);
        // After login, fetch the actual user
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser({ ...userData, token });
            } else {
                setUser({ token });
            }
        } catch (e) {
            setUser({ token });
        }
    };

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${API_URL}/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser({ ...userData, token });
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
