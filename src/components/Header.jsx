import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Menu, X, PlusCircle, User } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 1000,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border)',
            padding: '0.6rem 0',
            transition: 'all 0.3s ease'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* New Logo Implementation */}
                <Logo variant="light" />

                {/* Desktop Nav */}
                <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <Link to="/browse" style={{
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        letterSpacing: '0.01em'
                    }} className="nav-link">
                        Browse Vehicles
                    </Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={{
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.95rem'
                            }} className="nav-link">
                                <User size={18} /> Dashboard
                            </Link>
                            <button onClick={handleLogout} style={{
                                fontWeight: '600',
                                color: 'var(--text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                transition: 'color 0.2s'
                            }} className="nav-link-logout">Logout</button>
                            <Link to="/add-vehicle" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                                <PlusCircle size={16} /> Sell Vehicle
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/seller-login" style={{
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                fontSize: '0.95rem'
                            }} className="nav-link">
                                Log in
                            </Link>
                            <Link to="/seller-signup" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                                Start Selling
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle" style={{ display: 'none', cursor: 'pointer', color: 'var(--text-main)' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: 'white', borderBottom: '1px solid var(--border)',
                    padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 999
                }}>
                    <Link to="/browse" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600', color: 'var(--text-main)' }}>Browse Vehicles</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600', color: 'var(--text-main)' }}>Dashboard</Link>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600', color: 'var(--text-muted)' }}>Logout</button>
                        </>
                    ) : (
                        <Link to="/seller-login" onClick={() => setIsMenuOpen(false)} style={{ fontWeight: '600', color: 'var(--text-main)' }}>Log in</Link>
                    )}
                    <Link to={user ? "/add-vehicle" : "/seller-signup"} className="btn btn-primary" onClick={() => setIsMenuOpen(false)} style={{ justifyContent: 'center' }}>
                        {user ? 'Sell Vehicle' : 'Start Selling'}
                    </Link>
                </div>
            )}

            {/* Responsive Styles Injection */}
            <style>{`
                .nav-link:hover { color: var(--text-main) !important; }
                .nav-link-logout:hover { color: var(--text-main) !important; }
                @media (max-width: 768px) {
                  .desktop-nav { display: none !important; }
                  .mobile-toggle { display: block !important; }
                }
            `}</style>
        </header>
    );
}
