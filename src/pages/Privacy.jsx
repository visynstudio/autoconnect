import React from 'react';

export default function Privacy() {
    return (
        <div className="policy-page-wrapper">
            {/* Header */}
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Privacy Policy</h1>
                    <p className="page-subtitle">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>
            </header>

            {/* Content */}
            <section className="section">
                <div className="container" style={{ maxWidth: '900px' }}>

                    <div className="policy-stack">
                        <div className="card policy-card">
                            <h2 className="policy-title">1. Introduction</h2>
                            <p className="policy-text">
                                Your privacy matters to us. This Privacy Policy explains how ApniCar collects, uses, and protects your information when you use our platform.
                                We are committed to ensuring that your personal data is handled responsibly and transparently.
                            </p>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">2. Information We Collect</h2>
                            <p className="policy-text">To facilitate vehicle buying and selling, we collect minimal information:</p>
                            <ul className="policy-list">
                                <li><strong>Seller Information:</strong> When you post a vehicle, we collect your name, phone number, and city to display to potential buyers.</li>
                                <li><strong>Vehicle Details:</strong> Photos, descriptions, and specifications of the vehicles you list.</li>
                                <li><strong>Buyer Information:</strong> We do not require buyers to create an account to browse. Internal analytics may collect anonymous browser types.</li>
                            </ul>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">3. How We Use Your Information</h2>
                            <p className="policy-text">We use the information we collect solely for the purpose of operating the marketplace:</p>
                            <ul className="policy-list">
                                <li>To display your vehicle listing to potential buyers.</li>
                                <li>To enable interested buyers to contact you via phone or message.</li>
                                <li>To prevent fraud and maintain the security of our platform.</li>
                                <li>To improve our website's functionality and user experience.</li>
                            </ul>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">4. Data Sharing & Disclosure</h2>
                            <p className="policy-text">
                                <strong>We do not sell your personal data.</strong> Your contact information is shared on your listing page
                                only to allow buyers to contact you. We do not share your data with third-party advertisers or data brokers.
                            </p>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">5. Contact Us</h2>
                            <p className="policy-text">
                                If you have any questions about this Privacy Policy or your data, please contact our privacy officer at:<br />
                                <a href="mailto:privacy@apnicar.com" className="policy-link">privacy@apnicar.com</a>
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <style>{`
                .policy-page-wrapper {
                    background-color: var(--bg-page);
                }

                .policy-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .policy-card {
                    padding: 3rem !important;
                }

                .policy-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-bottom: 1.5rem;
                }

                .policy-text {
                    font-size: 1.05rem;
                    color: var(--text-secondary);
                    line-height: 1.8;
                }

                .policy-list {
                    margin-top: 1.5rem;
                    list-style: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .policy-list li {
                    position: relative;
                    padding-left: 1.5rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                .policy-list li::before {
                    content: "→";
                    position: absolute;
                    left: 0;
                    color: var(--accent);
                    font-weight: 900;
                }

                .policy-link {
                    color: var(--accent);
                    font-weight: 700;
                    text-decoration: none;
                }

                @media (max-width: 768px) {
                    .policy-card { padding: 2rem !important; }
                }
            `}</style>
        </div>
    );
}
