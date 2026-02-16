import React from 'react';
import { Newspaper, Download, Mail, MapPin, Info, Image, FileText } from 'lucide-react';

export default function Press() {
    return (
        <div className="press-page-wrapper">
            {/* 1. Page Header */}
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Press & Media</h1>
                    <p className="page-subtitle">Resources, brand assets, and official updates from the ApniCar newsroom.</p>
                </div>
            </header>

            {/* 2. About the Platform */}
            <section className="section">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="section-title">About ApniCar</h2>
                        <p className="section-desc" style={{ textAlign: 'left', margin: '0 0 1.5rem', fontSize: '1.1rem' }}>
                            ApniCar is India's premier direct-to-consumer vehicle marketplace.
                            Our platform empowers vehicle owners and buyers to connect without the friction of middlemen,
                            ensuring transparency and maximum value for both parties.
                        </p>
                        <p className="section-desc" style={{ textAlign: 'left', margin: 0, fontSize: '1.1rem' }}>
                            Launched with a vision to digitize the traditional pre-owned vehicle market,
                            ApniCar focuses on verified listings, secure direct communication, and a seamless user experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Media Coverage */}
            <section className="section section-bg">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Media Mentions</h2>
                        <div className="empty-press-card card">
                            <Newspaper size={48} strokeWidth={1} />
                            <p>We're making headlines. Recent press features and news updates will appear here.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Press Resources */}
            <section className="section">
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Media Kit & Assets</h2>
                        <div className="resources-stack">
                            {[
                                { icon: Image, title: 'Official Logo Pack', desc: 'Vector and high-resolution PNG assets.', size: '2.4 MB' },
                                { icon: FileText, title: 'Brand Guidelines', desc: 'Detailed rules for our visual identity.', size: '1.1 MB' },
                                { icon: Info, title: 'Company Fact Sheet', desc: 'Key stats, roadmap, and leadership info.', size: '0.8 MB' },
                            ].map((item, i) => (
                                <div key={i} className="resource-card card">
                                    <div className="resource-meta">
                                        <div className="resource-icon">
                                            <item.icon size={22} />
                                        </div>
                                        <div className="resource-info">
                                            <h3 className="resource-title">{item.title}</h3>
                                            <p className="resource-text">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline resource-btn">
                                        Download <span className="file-size">{item.size}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Media Contact */}
            <section className="section section-bg">
                <div className="container">
                    <div className="media-contact-box card">
                        <h2 className="section-title">Media Inquiries</h2>
                        <p className="section-desc" style={{ marginBottom: '3rem' }}>For interview requests or general media questions, reach out to our press office.</p>

                        <div className="contact-info-grid">
                            <div className="contact-info-item">
                                <div className="info-icon">
                                    <Mail size={22} />
                                </div>
                                <div className="item-text">
                                    <span className="item-label">Email Address</span>
                                    <a href="mailto:press@apnicar.com" className="item-value">press@apnicar.com</a>
                                </div>
                            </div>
                            <div className="contact-info-item">
                                <div className="info-icon">
                                    <MapPin size={22} />
                                </div>
                                <div className="item-text">
                                    <span className="item-label">Global H.Q.</span>
                                    <p className="item-value">Gurugram, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .press-page-wrapper {
                    background-color: var(--bg-page);
                }

                .section-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-bottom: 1.5rem;
                }

                .section-desc {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    line-height: 1.7;
                    margin: 0 auto;
                }

                .empty-press-card {
                    text-align: center;
                    padding: 4rem 2rem !important;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    color: var(--text-muted);
                    font-style: italic;
                    border: 2px dashed var(--border);
                    background: transparent;
                }

                .resources-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .resource-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem !important;
                }

                .resource-meta {
                    display: flex;
                    gap: 1.25rem;
                    align-items: center;
                }

                .resource-icon {
                    width: 44px;
                    height: 44px;
                    background: var(--bg-subtle);
                    color: var(--accent);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .resource-title { font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-bottom: 0.15rem; }
                .resource-text { font-size: 0.9rem; color: var(--text-secondary); }

                .resource-btn { height: 40px; font-size: 0.85rem; padding: 0 1rem; border-radius: 8px; }
                .file-size { color: var(--text-muted); margin-left: 0.5rem; font-weight: 400; }

                .media-contact-box {
                    text-align: center;
                    padding: 4rem 2rem !important;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .contact-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .contact-info-item {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    text-align: left;
                }

                .info-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--bg-subtle);
                    color: var(--accent);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .item-label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.2rem; }
                .item-value { font-size: 1.05rem; font-weight: 700; color: var(--primary); text-decoration: none; }

                @media (max-width: 768px) {
                    .resource-card { flex-direction: column; align-items: stretch; gap: 1.25rem; }
                    .contact-info-grid { grid-template-columns: 1fr; gap: 2rem; }
                }
            `}</style>
        </div>
    );
}
