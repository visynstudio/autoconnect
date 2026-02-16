import React from 'react';

export default function Terms() {
    return (
        <div className="terms-page-wrapper">
            {/* Header */}
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Terms of Service</h1>
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
                                Welcome to ApniCar. By accessing our platform and using our services, you agree to comply with and be bound by the following terms and conditions.
                                ApniCar is a direct-to-consumer marketplace connecting sellers and buyers of pre-owned vehicles.
                            </p>
                            <p className="policy-text" style={{ marginTop: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                                We do not own, inspect, or sell the vehicles listed. We act purely as a connection platform.
                            </p>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">2. Our Platform Role</h2>
                            <ul className="policy-list">
                                <li>We provide a venue for users to interact and negotiate directly.</li>
                                <li>We are <strong>not a party to any transaction</strong> between buyers and sellers.</li>
                                <li>We do not handle payments, escrow, title transfers, or shipping.</li>
                                <li>We do not guarantee the condition, safety, or legality of any vehicle listed.</li>
                            </ul>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">3. User Obligations</h2>
                            <p className="policy-text">
                                <strong>Sellers:</strong> You must have legal authority to sell the vehicle. All information provided must be accurate,
                                including price, condition, and ownership status.
                            </p>
                            <p className="policy-text" style={{ marginTop: '1rem' }}>
                                <strong>Buyers:</strong> You are responsible for inspecting the vehicle and verifying all legal documents before making any payment.
                            </p>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">4. Limitation of Liability</h2>
                            <p className="policy-text">
                                To the maximum extent permitted by law, ApniCar shall not be liable for any disputes,
                                financial losses, or damages arising from transactions initiated on the platform.
                                Users assume all risks associated with buying and selling used vehicles.
                            </p>
                        </div>

                        <div className="card policy-card">
                            <h2 className="policy-title">5. Legal Support</h2>
                            <p className="policy-text">
                                For any legal inquiries or concerns regarding these terms, please contact our legal department:<br />
                                <a href="mailto:legal@apnicar.com" className="policy-link">legal@apnicar.com</a>
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <style>{`
                .terms-page-wrapper {
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
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: var(--accent);
                    font-size: 1.5rem;
                    line-height: 1;
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
