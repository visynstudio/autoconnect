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
        <div className="careers-page-wrapper">
            {/* 1. Header */}
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Build the Future</h1>
                    <p className="page-subtitle">Join us in our mission to create India's most trusted and transparent vehicle marketplace.</p>
                </div>
            </header>

            {/* 2. Culture/Values */}
            <section className="section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="section-title">Why Join ApniCar?</h2>
                        <p className="section-desc">We're a team of builders, dreamers, and doers working together to solve real-world problems.</p>
                    </div>

                    <div className="grid-2-2-1">
                        {[
                            { icon: Zap, title: 'Extreme Ownership', desc: 'We trust our team to take the lead. You own your projects from ideation to deployment.' },
                            { icon: Heart, title: 'Impact at Scale', desc: 'Every line of code you write and every design you create affects thousands of users across India.' },
                            { icon: UserPlus, title: 'Learning Culture', desc: 'We invest in your growth with mentorship, resources, and a focus on continuous learning.' },
                            { icon: Globe, title: 'Remote First', desc: 'We believe productivity isn\'t tied to an office. Work from wherever you feel inspired.' },
                        ].map((item, index) => (
                            <div key={index} className="culture-card card">
                                <div className="culture-icon-box">
                                    <item.icon size={26} strokeWidth={1.5} />
                                </div>
                                <h3 className="culture-title">{item.title}</h3>
                                <p className="culture-text">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Open Positions */}
            <section className="section section-bg">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="section-title">Open Positions</h2>
                        <p className="section-desc">Current opportunities to join our remote-friendly team.</p>
                    </div>

                    {positions.length > 0 ? (
                        <div className="jobs-stack">
                            {positions.map((job) => (
                                <div key={job.id} className="job-card card animate-fade-in">
                                    <div className="job-meta">
                                        <h3 className="job-title">{job.title}</h3>
                                        <div className="job-tags">
                                            <span><Briefcase size={16} /> {job.department}</span>
                                            <span><Clock size={16} /> {job.type}</span>
                                            <span><MapPin size={16} /> {job.location}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary job-apply-btn">
                                        Apply Now <ArrowRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-careers card">
                            <div className="empty-icon-box">
                                <Briefcase size={48} strokeWidth={1} />
                            </div>
                            <h3 className="empty-title">No Active Openings</h3>
                            <p className="empty-text">
                                We're not actively hiring right now, but we're always looking for exceptional talent.
                                Send your portfolio to our team.
                            </p>
                            <a href="mailto:careers@apnicar.com" className="btn btn-outline">
                                <Mail size={18} />
                                <span>Send Resume</span>
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Secondary CTA */}
            <section className="section">
                <div className="container">
                    <div className="talent-pool-box card">
                        <h2 className="talent-title">Not seeing your role?</h2>
                        <p className="talent-text">We're always open to meeting passionate people who believe in our mission.</p>
                        <a href="mailto:hello@apnicar.com" className="btn btn-primary" style={{ minWidth: '220px' }}>
                            Get in Touch
                        </a>
                    </div>
                </div>
            </section>

            <style>{`
                .careers-page-wrapper {
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
                    color: var(--text-secondary);
                    max-width: 700px;
                    margin: 0 auto;
                }

                .culture-card {
                    padding: 3rem 2rem !important;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .culture-icon-box {
                    width: 64px;
                    height: 64px;
                    background: var(--bg-subtle);
                    color: var(--accent);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .culture-title { font-size: 1.35rem; font-weight: 800; color: var(--primary); }
                .culture-text { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; }

                .jobs-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .job-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem !important;
                }

                .job-title { font-size: 1.25rem; font-weight: 800; color: var(--primary); margin-bottom: 0.75rem; }
                .job-tags { display: flex; gap: 1.5rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 700; }
                .job-tags span { display: flex; align-items: center; gap: 0.5rem; }

                .job-apply-btn { height: 48px; padding: 0 1.5rem; border-radius: 10px; }

                .empty-careers {
                    text-align: center;
                    padding: 5rem 2rem !important;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .empty-icon-box { color: var(--text-muted); }
                .empty-title { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
                .empty-text { font-size: 1.1rem; color: var(--text-secondary); max-width: 500px; line-height: 1.6; }

                .talent-pool-box {
                    text-align: center;
                    padding: 5rem 2rem !important;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: #ffffff;
                    border: none;
                }

                .talent-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; }
                .talent-text { font-size: 1.25rem; color: #94a3b8; margin-bottom: 2.5rem; }

                @media (max-width: 768px) {
                    .job-card { flex-direction: column; align-items: stretch; gap: 1.5rem; }
                    .job-tags { flex-direction: column; gap: 0.5rem; }
                    .job-apply-btn { width: 100%; }
                    .talent-title { font-size: 1.75rem; }
                }
            `}</style>
        </div>
    );
}
