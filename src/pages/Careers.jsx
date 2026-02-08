import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, UserPlus, Heart, Zap, Globe, Mail } from 'lucide-react';

const positions = [
    // Leave empty for now to show the "No Openings" state initially, 
    // or uncomment below to show jobs.
    /*
    { id: 1, title: 'Senior Frontend Engineer', type: 'Full-time', location: 'Remote (India)', department: 'Engineering' },
    { id: 2, title: 'Product Designer (UI/UX)', type: 'Full-time', location: 'Bangalore / Hybrid', department: 'Design' },
    { id: 3, title: 'Marketing Intern', type: 'Internship', location: 'Remote', department: 'Growth' },
    */
];

export default function Careers() {
    return (
        <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>

            {/* 1. Header */}
            <section style={{ backgroundColor: '#f8fafc', padding: '5rem 1rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-1px' }}>
                        Careers
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: '500' }}>
                        Build the future of vehicle marketplaces with us.
                    </p>
                </div>
            </section>

            {/* 2. Intro */}
            <section style={{ padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                        Join Our Mission
                    </h2>
                    <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#475569' }}>
                        We are building a simple, transparent, and trusted platform that connects vehicle buyers and sellers directly.
                        We believe in removing friction, empowering users, and creating a marketplace that just works.
                    </p>
                </div>
            </section>

            {/* 3. Why Work With Us */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#f1f5f9' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '3rem', color: '#0f172a', textAlign: 'center' }}>
                        Why Work With Us
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: Zap, title: 'Fast-Growing Startup', desc: 'Work in a high-energy environment where your impact is immediate and visible.' },
                            { icon: Heart, title: 'Impactful Product', desc: 'Solve real problems for thousands of people buying and selling their vehicles.' },
                            { icon: UserPlus, title: 'Learning First', desc: 'We value curiosity and growth. You will be challenged to learn and evolve every day.' },
                            { icon: Globe, title: 'Remote-Friendly', desc: 'We focus on output, not hours or location. Work from where you are most productive.' },
                        ].map((item, index) => (
                            <div key={index} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                                    <item.icon size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#0f172a' }}>{item.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Open Positions */}
            <section id="positions" style={{ padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>Open Positions</h2>
                        <p style={{ color: '#64748b' }}>Check out our current job openings.</p>
                    </div>

                    {positions.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {positions.map((job) => (
                                <div key={job.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                                    padding: '1.5rem 2rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }}
                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>{job.title}</h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Briefcase size={16} /> {job.department}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {job.type}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {job.location}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-secondary" style={{ borderRadius: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                                        Apply Now <ArrowRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // 5. No Openings State
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid dashed #cbd5e1' }}>
                            <div style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
                                <Briefcase size={48} strokeWidth={1.5} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.75rem' }}>No Open Positons Right Now</h3>
                            <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                                We're not actively hiring at the moment, but we're always looking for talented individuals.
                                Send your resume to our team.
                            </p>
                            <a href="mailto:careers@automarket.com" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={18} /> Email Your Resume
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* 6. Footer CTA */}
            <section style={{ backgroundColor: '#0f172a', padding: '4rem 1rem', textAlign: 'center', color: 'white' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
                        Interested in working with us?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2.5rem' }}>
                        We’d love to hear from you. Reach out even if you don't see a role that fits.
                    </p>
                    <a href="mailto:hello@automarket.com" className="btn btn-primary" style={{ backgroundColor: 'white', color: '#0f172a', padding: '1rem 2.5rem', fontWeight: '700' }}>
                        Contact Us
                    </a>
                </div>
            </section>

        </div>
    );
}
