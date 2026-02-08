import React from 'react';
import { Newspaper, Download, Mail, MapPin, Info, Image, FileText } from 'lucide-react';

export default function Press() {
    return (
        <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>

            {/* 1. Page Header */}
            <section style={{ backgroundColor: '#f8fafc', padding: '5rem 1rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-1px' }}>
                        Press & Media
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: '500' }}>
                        Official updates, brand assets, and media resources.
                    </p>
                </div>
            </section>

            {/* 2. About the Platform */}
            <section style={{ padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ padding: '0 0 2rem', borderBottom: '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                            About AutoMarket
                        </h2>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#475569', marginBottom: '1.5rem' }}>
                            AutoMarket is a direct-to-consumer marketplace designed to simplify the buying and selling of second-hand vehicles.
                            By removing intermediaries, agents, and hidden fees, we ensure that value stays where it belongs—with the buyers and sellers.
                        </p>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#475569' }}>
                            Our platform prioritizes <strong>transparency</strong>, <strong>verified listings</strong>, and <strong>direct communication</strong>.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Media Coverage (Empty State) */}
            <section style={{ padding: '0 1rem 5rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                        Media Coverage
                    </h2>
                    <div style={{
                        backgroundColor: '#f8fafc',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '0.75rem',
                        padding: '3rem',
                        textAlign: 'center'
                    }}>
                        <Newspaper size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: '#64748b', fontSize: '1rem', fontStyle: 'italic' }}>
                            We are just getting started. Press mentions and feature stories will appear here soon.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Press Resources */}
            <section style={{ padding: '0 1rem 5rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem', color: '#0f172a' }}>
                        Brand Assets & Resources
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                            { icon: Image, title: 'Official Logo Pack', desc: 'High-res vector and PNG logos.', size: '2.4 MB' },
                            { icon: FileText, title: 'Brand Guidelines', desc: 'Usage rules for our brand identity.', size: '1.1 MB' },
                            { icon: Info, title: 'Fact Sheet', desc: 'Key statistics and company history.', size: '0.5 MB' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '1.25rem 1.5rem', backgroundColor: 'white',
                                border: '1px solid #e2e8f0', borderRadius: '0.75rem',
                                transition: 'border-color 0.2s'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ color: '#3b82f6' }}><item.icon size={24} /></div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{item.title}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{item.desc}</p>
                                    </div>
                                </div>
                                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                    Download <span style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>({item.size})</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Media Contact */}
            <section style={{ backgroundColor: '#f1f5f9', padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '2.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem', color: '#0f172a' }}>
                            Media Contact
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#2563eb' }}>
                                    <Mail size={24} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Press Inquiries</p>
                                    <a href="mailto:press@automarket.com" style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>press@automarket.com</a>
                                </div>
                            </div>

                            <div style={{ width: '100%', height: '1px', backgroundColor: '#f1f5f9' }}></div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#2563eb' }}>
                                    <MapPin size={24} />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>H.Q. Location</p>
                                    <p style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '500' }}>Bangalore, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
