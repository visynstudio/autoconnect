import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, DollarSign, Handshake, ChevronRight,
    FilePlus, Search, Phone
} from 'lucide-react';

export default function About() {
    return (
        <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>

            {/* 1️⃣ PAGE HEADER */}
            <section style={{
                backgroundColor: '#f8fafc',
                padding: '4rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-1px'
                    }}>
                        About Us
                    </h1>
                    <p style={{
                        fontSize: '1.25rem', color: '#64748b', fontWeight: '500'
                    }}>
                        Connecting buyers and sellers directly.
                    </p>
                </div>
            </section>

            {/* 2️⃣ WHO WE ARE */}
            <section style={{ padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                        Who We Are
                    </h2>
                    <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#475569' }}>
                        We are a simple and trusted platform that helps people buy and sell second-hand vehicles directly.
                        Our goal is to remove agents, commissions, and unnecessary steps, making vehicle buying and selling fast and transparent.
                    </p>
                </div>
            </section>

            {/* 3️⃣ OUR MISSION */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#f1f5f9' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '3rem',
                        borderRadius: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                            Our Mission
                        </h2>
                        <p style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#334155', maxWidth: '700px' }}>
                            To create a trusted marketplace where vehicle owners and buyers can connect directly,
                            without middlemen, hidden charges, or complicated processes.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4️⃣ WHY WE EXIST */}
            <section style={{ padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>Why We Exist</h2>
                        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Eliminating the hassle from vehicle trading.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: Handshake, title: 'No Agents or Brokers', desc: 'Direct deals only.' },
                            { icon: DollarSign, title: 'No Commissions', desc: 'Keep 100% of the sale price.' },
                            { icon: Phone, title: 'Direct Contact', desc: 'Speak directly with the owner.' },
                            { icon: FilePlus, title: 'Simple Listings', desc: 'Post an ad in minutes.' },
                            { icon: Search, title: 'No Buyer Login', desc: 'Browse freely without signup.' },
                        ].map((item, index) => (
                            <div key={index} style={{
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                transition: 'transform 0.2s ease-in-out'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    width: '48px', height: '48px',
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#3b82f6',
                                    flexShrink: 0
                                }}>
                                    <item.icon size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5️⃣ HOW IT WORKS */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '3rem', color: '#0f172a' }}>
                        How It Works
                    </h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
                        {[
                            { step: '1', title: 'Seller Lists Vehicle', desc: 'Takes 2 minutes to post details & photos.', icon: FilePlus },
                            { step: '2', title: 'Buyer Finds Vehicle', desc: 'Search by city, budget, or model.', icon: Search },
                            { step: '3', title: 'Direct Contact', desc: 'Call or message the seller directly.', icon: Phone },
                        ].map((item, i) => (
                            <div key={i} style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    width: '64px', height: '64px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    color: '#0f172a',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>{item.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6️⃣ TRUST & TRANSPARENCY */}
            <section style={{ padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '50%', marginBottom: '1.5rem', color: '#3b82f6' }}>
                        <ShieldCheck size={48} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                        Trust & Transparency
                    </h2>
                    <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: '#475569' }}>
                        We do not act as a middleman. We do not handle payments.
                        We simply connect buyers and sellers directly, so both sides stay in control
                        and negotiate freely without interference.
                    </p>
                </div>
            </section>

            {/* 7️⃣ CALL TO ACTION */}
            <section style={{ backgroundColor: '#f1f5f9', padding: '5rem 1rem', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>
                        Ready to buy or sell a vehicle?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2.5rem' }}>
                        Join thousands of users trading directly today.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/browse" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                            Browse Vehicles
                        </Link>
                        <Link to="/seller-signup" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                            Post Your Vehicle
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
