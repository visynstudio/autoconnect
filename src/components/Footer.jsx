import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '5rem 0 2rem', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>

                <div>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1', marginBottom: '1.5rem', opacity: 0.95 }}>
                        <div style={{ fontFamily: '"Outfit", sans-serif', fontSize: '1.5rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: '600', color: '#f8fafc' }}>Auto</span>
                            <span style={{ fontWeight: '800', color: '#3b82f6' }}>Connect</span>
                        </div>
                        <span style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.65rem',
                            fontWeight: '600',
                            color: '#94a3b8',
                            letterSpacing: '0.05em',
                            marginTop: '4px',
                            textTransform: 'uppercase'
                        }}>
                            Direct vehicle connections
                        </span>
                    </Link>
                    <p style={{ color: '#94a3b8', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '300px' }}>
                        The most trusted marketplace for buying and selling second-hand vehicles directly. No middlemen, just genuine deals.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" style={{
                                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.05)', borderRadius: '50%', color: '#94a3b8', transition: 'all 0.2s'
                            }}>
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* 2. Explore Links */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Explore</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: 'Browse All Vehicles', path: '/browse' },
                            { label: 'Cars for Sale', path: '/browse?type=car' },
                            { label: 'Bikes for Sale', path: '/browse?type=bike' },
                            { label: 'Commercial Vehicles', path: '/browse?type=truck' },
                            { label: 'Sell Your Vehicle', path: '/seller-signup' },
                        ].map((link, i) => (
                            <li key={i}>
                                <Link to={link.path} style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    <ChevronRight size={14} color="#64748b" /> {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. Company & Legal */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Company</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: 'About Us', path: '/about' },
                            { label: 'Careers', path: '/careers' },
                            { label: 'Terms of Service', path: '/terms' },
                            { label: 'Privacy Policy', path: '/privacy' },
                            { label: 'Contact Us', path: '/contact' },
                        ].map((link, i) => (
                            <li key={i}>
                                <Link to={link.path} style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 4. Contact Info */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Contact Support</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <li style={{ display: 'flex', gap: '1rem', color: '#94a3b8' }}>
                            <MapPin size={20} color="#3b82f6" style={{ minWidth: '20px' }} />
                            <span>123 Market Street, Tech Hub, <br /> Bangalore, India 560001</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', color: '#94a3b8' }}>
                            <Mail size={20} color="#3b82f6" />
                            <a href="mailto:support@automarket.com" style={{ color: 'inherit', textDecoration: 'none' }}>support@automarket.com</a>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', color: '#94a3b8' }}>
                            <Phone size={20} color="#3b82f6" />
                            <span>+91 8800 123 456</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="container" style={{ borderTop: '1px solid #1e293b', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                    <p>&copy; {new Date().getFullYear()} AutoMarket Platform. All rights reserved.</p>
                </div>
                <p style={{ opacity: 0.6 }}>Designed for simplified vehicle trading.</p>
            </div>
        </footer>
    );
}
