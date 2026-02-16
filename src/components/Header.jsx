import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Menu, X, User, PlusCircle } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`apnicar-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <Logo variant="light" />

                <nav className="desktop-actions">
                    <div className="nav-links">
                        <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`}>Marketplace</Link>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
                        <Link to="/careers" className={`nav-link ${isActive('/careers') ? 'active' : ''}`}>Careers</Link>
                    </div>

                    <div className="user-actions">
                        {user ? (
                            <>
                                <Link to="/dashboard" className={`account-link ${isActive('/dashboard') ? 'active' : ''}`}>
                                    <User size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                                <Link to="/add-vehicle" className="sell-btn">
                                    <PlusCircle size={18} />
                                    <span>Post Your Vehicle</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/seller-login" className={`login-link ${isActive('/seller-login') ? 'active' : ''}`}>Login</Link>
                                <Link to="/seller-signup" className="sell-btn">
                                    <PlusCircle size={18} />
                                    <span>Post Your Vehicle</span>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}>
                    <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <Logo variant="light" />
                            <div className="close-btn" onClick={() => setIsMenuOpen(false)}>
                                <X size={28} />
                            </div>
                        </div>
                        <div className="mobile-nav-links">
                            <Link to="/browse" className={isActive('/browse') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
                            <Link to="/about" className={isActive('/about') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>About Us</Link>
                            <Link to="/careers" className={isActive('/careers') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Careers</Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Logout Account</button>
                                </>
                            ) : (
                                <Link to="/seller-login" className={isActive('/seller-login') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Login to Account</Link>
                            )}
                        </div>
                        <Link to={user ? "/add-vehicle" : "/seller-signup"} className="sell-btn-mobile" onClick={() => setIsMenuOpen(false)}>
                            Post Your Vehicle Free
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                .apnicar-header {
                    position: sticky;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: white;
                    border-bottom: 1px solid var(--border);
                    transition: all 0.2s ease-in-out;
                    height: 64px;
                    display: flex;
                    align-items: center;
                }

                .apnicar-header.scrolled {
                    box-shadow: 0 4px 12px -5px rgba(0, 0, 0, 0.1);
                }

                .header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .desktop-actions {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }

                .nav-link {
                    color: var(--text-secondary);
                    font-weight: 500;
                    font-size: 0.95rem;
                    padding: 0.5rem 0;
                    position: relative;
                }

                .nav-link:hover {
                    color: var(--primary);
                }

                .nav-link.active {
                    color: var(--accent);
                    font-weight: 700;
                }

                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: var(--accent);
                    border-radius: 2px;
                }

                .user-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .login-link, .account-link {
                    color: var(--text-main);
                    font-weight: 600;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .login-link.active, .account-link.active {
                    color: var(--accent);
                }

                .logout-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-weight: 500;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: color 0.2s;
                    padding: 0.2rem 0.5rem;
                }

                .logout-btn:hover {
                    color: #ef4444;
                }

                .sell-btn {
                    background: var(--primary);
                    color: white;
                    padding: 0.6rem 1.1rem;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: all 0.2s;
                }

                .sell-btn:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
                }

                .mobile-toggle {
                    display: none;
                    cursor: pointer;
                    color: var(--primary);
                }

                .mobile-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.5);
                    backdrop-filter: blur(8px);
                    z-index: 1001;
                    display: flex;
                    justify-content: flex-end;
                }

                .mobile-menu {
                    width: 75%;
                    max-width: 320px;
                    height: 100%;
                    background: white;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
                    animation: slideLeft 0.3s ease-out;
                }

                @keyframes slideLeft {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .mobile-menu-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                }

                .mobile-nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .mobile-nav-links a, .mobile-nav-links button {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-main);
                    padding: 0.5rem 0;
                    border: none;
                    background: none;
                    text-align: left;
                    width: 100%;
                }

                .mobile-nav-links a.active {
                    color: var(--accent);
                    font-weight: 800;
                }

                .sell-btn-mobile {
                    background: var(--primary);
                    color: white;
                    padding: 1rem;
                    text-align: center;
                    border-radius: 12px;
                    margin-top: auto;
                    font-weight: 800;
                    font-size: 1rem;
                }

                @media (max-width: 1024px) {
                    .desktop-actions { display: none; }
                    .mobile-toggle { display: block; }
                    .apnicar-header { height: 56px; }
                }

                @media (max-width: 768px) {
                    .container { padding: 0 1rem; }
                }
            `}</style>
        </header>
    );
}
