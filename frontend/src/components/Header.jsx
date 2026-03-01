import React, { useState } from 'react';
import { Home, Key, Menu, X, PlusCircle, LogOut } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--secondary-color)' : 'var(--text-color)',
    fontWeight: isActive ? 600 : 500,
    position: 'relative'
  });

  return (
    <header className="glass-panel fixed top-0 w-full z-50 transition-all duration-300">
      <div className="container" style={{ padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              padding: '0.5rem',
              borderRadius: '12px',
              display: 'flex'
            }}>
              <Home size={24} color="white" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>
              Naija<span style={{ color: '#ec4899' }}>Props</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" style={navLinkStyle} end className="nav-link">Find a Home</NavLink>
            <NavLink to="/sell" style={navLinkStyle} className="nav-link">Sell/Rent</NavLink>
            <NavLink to="/agents" style={navLinkStyle} className="nav-link">Agents</NavLink>
            <NavLink to="/projects" style={navLinkStyle} className="nav-link">Govt Projects</NavLink>
            <NavLink to="/tour" style={navLinkStyle} className="nav-link">City Tours</NavLink>

            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', textDecoration: 'none', border: 'none', background: 'rgba(255,255,255,0.05)' }}>
                  Dashboard
                </Link>
                <Link to="/post" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', textDecoration: 'none' }}>
                  <PlusCircle size={18} /> Post Property
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', textDecoration: 'none' }}>
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '10px', textDecoration: 'none' }}>Sign In</Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden block"
            style={{ background: 'none', color: 'white' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden glass" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '1.5rem',
            margin: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <NavLink to="/" onClick={() => setIsMenuOpen(false)} style={navLinkStyle} end className="py-2">Find a Home</NavLink>
            <NavLink to="/sell" onClick={() => setIsMenuOpen(false)} style={navLinkStyle} className="py-2">Sell/Rent</NavLink>
            <NavLink to="/agents" onClick={() => setIsMenuOpen(false)} style={navLinkStyle} className="py-2">Agents</NavLink>
            <NavLink to="/projects" onClick={() => setIsMenuOpen(false)} style={navLinkStyle} className="py-2">Govt Projects</NavLink>
            <NavLink to="/tour" onClick={() => setIsMenuOpen(false)} style={navLinkStyle} className="py-2">City Tours</NavLink>
            <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: 'none' }} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/post" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }} onClick={() => setIsMenuOpen(false)}>
                  Post Property
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }} onClick={() => setIsMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
