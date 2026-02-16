import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    const [submitting, setSubmitting] = useState(false);

    // Simple form handler (just a mockup for now)
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            alert("Thank you for contacting us! We'll get back to you shortly.");
            setSubmitting(false);
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="contact-page-wrapper">
            {/* 1. Header */}
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Contact Our Team</h1>
                    <p className="page-subtitle">Have questions? We're here to help you navigate India's most transparent vehicle marketplace.</p>
                </div>
            </header>

            {/* 2. Content */}
            <section className="section">
                <div className="container">
                    <div className="contact-grid">

                        {/* Info Column */}
                        <div className="contact-info-col">
                            <h2 className="section-title">Get in Touch</h2>
                            <p className="contact-intro">
                                Our support team is available Mon-Fri, 9am - 6pm IST.
                                Whether you're a buyer seeking help or a seller with listing queries, we're just a message away.
                            </p>

                            <div className="info-cards-stack">
                                <div className="info-card-item">
                                    <div className="info-icon-box">
                                        <Mail size={22} />
                                    </div>
                                    <div className="info-text">
                                        <h3 className="info-label">Email Support</h3>
                                        <a href="mailto:support@apnicar.com" className="info-value">support@apnicar.com</a>
                                    </div>
                                </div>

                                <div className="info-card-item">
                                    <div className="info-icon-box">
                                        <Phone size={22} />
                                    </div>
                                    <div className="info-text">
                                        <h3 className="info-label">Phone Support</h3>
                                        <p className="info-value">+91 8800 123 456</p>
                                    </div>
                                </div>

                                <div className="info-card-item">
                                    <div className="info-icon-box">
                                        <MapPin size={22} />
                                    </div>
                                    <div className="info-text">
                                        <h3 className="info-label">Headquarters</h3>
                                        <p className="info-value">
                                            Sector 44, Tech City, <br />
                                            Gurugram, Haryana, 122003
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="contact-form-col">
                            <form onSubmit={handleSubmit} className="card contact-form animate-fade-in">
                                <div className="form-field">
                                    <label className="field-label">Full Name</label>
                                    <input type="text" required placeholder="Ex: Rahul Sharma" className="input-field" />
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Email Address</label>
                                    <input type="email" required placeholder="rahul@example.com" className="input-field" />
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Department</label>
                                    <select className="input-field" required>
                                        <option value="">Select Department</option>
                                        <option value="support">General Support</option>
                                        <option value="billing">Billing & Membership</option>
                                        <option value="trust">Trust & Safety</option>
                                        <option value="business">Business Inquiries</option>
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label className="field-label">Your Message</label>
                                    <textarea required rows="4" placeholder="How can we assist you today?" className="input-field" style={{ minHeight: '120px' }}></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', height: '54px' }}>
                                    {submitting ? 'Sending Request...' : (
                                        <>
                                            <span>Send Message</span>
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .contact-page-wrapper {
                    background-color: var(--bg-page);
                }

                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 5rem;
                    align-items: start;
                }

                .section-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-bottom: 1.5rem;
                }

                .contact-intro {
                    font-size: 1.1rem;
                    line-height: 1.7;
                    color: var(--text-secondary);
                    margin-bottom: 3rem;
                }

                .info-cards-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .info-card-item {
                    display: flex;
                    gap: 1.25rem;
                    align-items: flex-start;
                }

                .info-icon-box {
                    width: 48px;
                    height: 48px;
                    background: var(--bg-subtle);
                    color: var(--accent);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .info-label {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-bottom: 0.25rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .info-value {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    text-decoration: none;
                    line-height: 1.5;
                }

                a.info-value:hover {
                    color: var(--accent);
                }

                .contact-form {
                    padding: 3rem !important;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .field-label {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--primary);
                }

                @media (max-width: 1024px) {
                    .contact-grid { gap: 3rem; }
                    .contact-form { padding: 2rem !important; }
                }

                @media (max-width: 768px) {
                    .contact-grid { grid-template-columns: 1fr; gap: 4rem; }
                    .section-title { font-size: 1.75rem; text-align: center; }
                    .contact-intro { text-align: center; }
                }
            `}</style>
        </div>
    );
}
