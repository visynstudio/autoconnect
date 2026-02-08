import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Menu, X, PlusCircle, User } from 'lucide-react';


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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 0'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo (Pure Text - Professional Startup Style) */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1' }}>
                    <div style={{ fontFamily: '"Outfit", sans-serif', fontSize: '1.5rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>Auto</span>
                        <span style={{ fontWeight: '800', color: '#2563eb' }}>Connect</span>
                    </div>
                    <span style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        color: '#64748b',
                        letterSpacing: '0.05em',
                        marginTop: '4px',
                        textTransform: 'uppercase'
                    }}>
                        Direct vehicle connections
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/browse" style={{ fontWeight: '500', color: 'var(--text-main)' }}>Browse Vehicles</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> Dashboard
                            </Link>
                            <button onClick={handleLogout} style={{ fontWeight: '500', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
                            <Link to="/add-vehicle" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                                <PlusCircle size={18} /> Post Your Vehicle
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/seller-login" style={{ fontWeight: '600', color: 'var(--text-main)' }}>Seller Login</Link>
                            <Link to="/seller-signup" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                                <PlusCircle size={18} /> Post Your Vehicle
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle" style={{ display: 'none', cursor: 'pointer' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: 'white', borderBottom: '1px solid var(--border)',
                    padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <Link to="/browse" onClick={() => setIsMenuOpen(false)}>Browse Vehicles</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Logout</button>
                        </>
                    ) : (
                        <Link to="/seller-login" onClick={() => setIsMenuOpen(false)}>Seller Login</Link>
                    )}
                    <Link to={user ? "/add-vehicle" : "/seller-signup"} className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                        Post Your Vehicle
                    </Link>
                </div>
            )}

            {/* Responsive Styles Injection */}
            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .logo-img { height: 28px !important; }
        }
      `}</style>
        </header>
    );
}
