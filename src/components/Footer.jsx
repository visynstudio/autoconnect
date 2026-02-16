import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-luxury">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Info */}
                    <div className="footer-brand">
                        <Logo variant="dark" className="footer-logo" />
                        <p className="footer-tagline">Apni Car, Apni Choice</p>
                        <p className="footer-desc">
                            Direct buyer-seller connections. No agents, no commission.
                            The most trusted vehicle marketplace in India.
                        </p>
                        <div className="social-links">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="social-icon">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="footer-nav-col">
                        <h4 className="footer-title">Marketplace</h4>
                        <Link to="/browse">Browse Vehicles</Link>
                        <Link to="/browse?type=car">Buy Cars</Link>
                        <Link to="/browse?type=bike">Buy Bikes</Link>
                        <Link to="/seller-signup">Start Selling</Link>
                    </div>

                    <div className="footer-nav-col">
                        <h4 className="footer-title">Company</h4>
                        <Link to="/about">About Us</Link>
                        <Link to="/careers">Careers</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                    </div>

                    {/* Contact */}
                    <div className="footer-nav-col">
                        <h4 className="footer-title">Support</h4>
                        <div className="contact-item">
                            <Mail size={16} />
                            <span>support@apnicar.com</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={16} />
                            <span>+91 8800 123 456</span>
                        </div>
                        <div className="contact-item">
                            <MapPin size={16} />
                            <span>New Delhi, India</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} ApniCar India. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#top" className="back-to-top">
                            <span>Back to top</span>
                            <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-luxury {
                    background: #0F172A;
                    color: white;
                    padding: 8rem 0 3rem;
                    margin-top: auto;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 1fr 1fr;
                    gap: 4rem;
                    margin-bottom: 6rem;
                }

                .footer-logo { height: 40px !important; margin-bottom: 0.5rem; }

                .footer-tagline {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--accent);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }

                .footer-desc {
                    color: #94A3B8;
                    font-size: 0.95rem;
                    line-height: 1.7;
                    margin-bottom: 2rem;
                    max-width: 320px;
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                }

                .social-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94A3B8;
                    transition: all 0.3s;
                    text-decoration: none;
                }

                .social-icon:hover {
                    background: var(--accent);
                    color: white;
                    transform: translateY(-3px);
                }

                .footer-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    color: white;
                }

                .footer-nav-col {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .footer-nav-col a {
                    color: #94A3B8;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.95rem;
                    transition: color 0.2s;
                }

                .footer-nav-col a:hover {
                    color: white;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: #94A3B8;
                    font-size: 0.95rem;
                }

                .footer-bottom {
                    border-top: 1px solid rgba(255,255,255,0.05);
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #64748B;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .back-to-top {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #94A3B8;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .back-to-top:hover { color: white; }

                @media (max-width: 991px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 3rem;
                    }
                }

                @media (max-width: 576px) {
                    .footer-luxury { padding-top: 5rem; }
                    .footer-grid { grid-template-columns: 1fr; gap: 3rem; }
                    .footer-bottom { flex-direction: column; gap: 1.5rem; text-align: center; }
                }
            `}</style>
        </footer>
    );
}
