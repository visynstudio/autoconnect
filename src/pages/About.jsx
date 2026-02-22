import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, DollarSign, Handshake, ChevronRight,
    FilePlus, Search, Phone
} from 'lucide-react';

export default function About() {
    return (
        <div className="about-page-wrapper">
            {/* 1 PAGE HEADER */}
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Our Story</h1>
                    <p className="page-subtitle">We're bridging the gap between buyers and sellers, making vehicle trading simple, direct, and commission-free.</p>
                </div>
            </header>

            {/* 2 WHO WE ARE */}
            <section className="section">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 className="section-title">Who We Are</h2>
                        <p className="section-desc">
                            ApniCar is a trusted marketplace designed for the modern Indian vehicle owner.
                            We realized that the traditional process was broken—filled with middlemen, hidden fees, and complex paperwork.
                            We built this platform to put the power back in your hands.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3 MISSION CARD */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="mission-card card animate-fade-in">
                        <h2 className="mission-title">Our Mission</h2>
                        <p className="mission-text">
                            "To build the most transparent and efficient direct-to-consumer vehicle marketplace in India."
                        </p>
                    </div>
                </div>
            </section>

            {/* 4 CORE VALUES */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="section-title">The ApniCar Advantage</h2>
                        <p className="section-desc">Why thousands trust us for their vehicle trading needs.</p>
                    </div>

                    <div className="grid-3-2-1">
                        {[
                            { icon: Handshake, title: 'Direct Connectivity', desc: 'No more middlemen. Talk to owners directly.' },
                            { icon: DollarSign, title: 'Zero Commission', desc: 'Every rupee stays with the buyer or seller.' },
                            { icon: Phone, title: 'Instant Contact', desc: 'Call or WhatsApp sellers in one click.' },
                            { icon: FilePlus, title: 'Lightning Listing', desc: 'Post your vehicle ad in under 2 minutes.' },
                            { icon: Search, title: 'Transparent Browsing', desc: 'No mandatory logins to see phone numbers.' },
                            { icon: ShieldCheck, title: 'Verified Seller Tools', desc: 'Smart tools to help you sell faster.' },
                        ].map((item, index) => (
                            <div key={index} className="advantage-card card">
                                <div className="advantage-icon-box">
                                    <item.icon size={26} strokeWidth={1.5} />
                                </div>
                                <h3 className="advantage-title">{item.title}</h3>
                                <p className="advantage-text">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5 HOW IT WORKS */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '4rem' }}>Simplified Process</h2>

                    <div className="process-grid">
                        {[
                            { step: '01', title: 'List Your Ride', desc: 'Upload high-quality photos and set your price.', icon: FilePlus },
                            { step: '02', title: 'Smart Match', desc: 'Buyers find your listing through localized search.', icon: Search },
                            { step: '03', title: 'Direct Deal', desc: 'Talk directly, inspect, and close the deal.', icon: Phone },
                        ].map((item, i) => (
                            <div key={i} className="process-item">
                                <div className="step-number">{item.step}</div>
                                <h3 className="process-title">{item.title}</h3>
                                <p className="process-text">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6 CTA */}
            <section className="section section-bg">
                <div className="container">
                    <div className="cta-box card">
                        <h2 className="cta-title">Join the Revolution</h2>
                        <p className="cta-text">Ready to experience the future of vehicle trading?</p>
                        <div className="cta-buttons">
                            <Link to="/browse" className="btn btn-primary" style={{ minWidth: '200px' }}>
                                Start Browsing
                            </Link>
                            <Link to="/seller-signup" className="btn btn-accent" style={{ minWidth: '200px' }}>
                                Start Selling
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .about-page-wrapper {
                    background-color: var(--bg-page);
                }
                
                .section-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-bottom: 1rem;
                }

                .section-desc {
                    font-size: 1.15rem;
                    line-height: 1.7;
                    color: var(--text-secondary);
                    max-width: 800px;
                    margin: 0 auto;
                }

                .mission-card {
                    background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%);
                    color: #ffffff;
                    text-align: center;
                    padding: 4rem 2rem;
                    border: none;
                }

                .mission-title {
                    color: var(--accent);
                    font-size: 0.9rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }

                .mission-text {
                    font-size: 1.85rem;
                    font-weight: 700;
                    line-height: 1.4;
                    max-width: 700px;
                    margin: 0 auto;
                }

                .advantage-card {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 2.5rem 1.5rem;
                }

                .advantage-icon-box {
                    width: 60px;
                    height: 60px;
                    background: var(--bg-subtle);
                    color: var(--accent);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .advantage-title { font-size: 1.25rem; font-weight: 800; color: var(--primary); }
                .advantage-text { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; }

                .process-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 3rem;
                    position: relative;
                }

                .process-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .step-number {
                    font-size: 3rem;
                    font-weight: 900;
                    color: var(--border);
                    line-height: 1;
                    margin-bottom: 1.5rem;
                }

                .process-title { font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 0.75rem; }
                .process-text { color: var(--text-secondary); line-height: 1.6; }

                .cta-box {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: #ffffff;
                }

                .cta-title { font-size: 2.5rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem; }
                .cta-text { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; }

                .cta-buttons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                @media (max-width: 768px) {
                    .section-title { font-size: 1.75rem; }
                    .mission-text { font-size: 1.35rem; }
                    .process-grid { grid-template-columns: 1fr; gap: 2rem; }
                    .cta-title { font-size: 1.75rem; }
                }
            `}</style>
        </div>
    );
}
