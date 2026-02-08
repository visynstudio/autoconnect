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
        <div style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>

            {/* 1. Header */}
            <section style={{ backgroundColor: '#f8fafc', padding: '4rem 1rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
                        Contact Us
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: '500' }}>
                        We're here to help. Reach out to our team.
                    </p>
                </div>
            </section>

            {/* 2. Contact Content */}
            <section style={{ padding: '5rem 1rem' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>

                    {/* Left: Info */}
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>
                            Get in Touch
                        </h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#475569', marginBottom: '2.5rem' }}>
                            Have questions about buying, selling, or our platform policies?
                            Our support team is available Mon-Fri, 9am - 6pm.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', color: '#2563eb' }}>
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#0f172a' }}>Email Us</h3>
                                    <a href="mailto:support@automarket.com" style={{ color: '#64748b', fontSize: '1rem' }}>support@automarket.com</a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', color: '#2563eb' }}>
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#0f172a' }}>Call Us</h3>
                                    <p style={{ color: '#64748b', fontSize: '1rem' }}>+91 8800 123 456</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', color: '#2563eb' }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#0f172a' }}>Visit Us</h3>
                                    <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>
                                        123 Market Street, Tech Hub, <br /> Bangalore, India 560001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Your Name</label>
                                <input type="text" required placeholder="John Doe" className="input-field" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Email Address</label>
                                <input type="email" required placeholder="john@example.com" className="input-field" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Subject</label>
                                <select className="input-field" required>
                                    <option value="">Select a topic</option>
                                    <option value="support">General Support</option>
                                    <option value="billing">Billing & Fees</option>
                                    <option value="safety">Trust & Safety</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>Message</label>
                                <textarea required rows="4" placeholder="How can we help you?" className="input-field" style={{ resize: 'vertical' }}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                                {submitting ? 'Sending...' : (
                                    <>Send Message <Send size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </section>

        </div>
    );
}
