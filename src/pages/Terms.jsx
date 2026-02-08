import React from 'react';

export default function Terms() {
    return (
        <div style={{ backgroundColor: '#ffffff', color: '#334155', lineHeight: '1.7' }}>

            {/* Header */}
            <div style={{ backgroundColor: '#f8fafc', padding: '4rem 1rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                        Terms of Service
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
                        Last Updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1rem' }}>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>1. Introduction</h2>
                    <p>
                        Welcome to AutoMarket. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
                        Please review them carefully. If you do not agree to these terms, you should not use this platform.
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        AutoMarket is a platform that connects buyers and sellers of second-hand vehicles directly. We do not own, sell, or inspect the vehicles listed.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>2. Platform Role</h2>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>We act solely as a venue for users to interact.</li>
                        <li>We are <strong>not a party to any transaction</strong> between buyers and sellers.</li>
                        <li>We do not handle payments, transfer titles, or guarantee the condition of any vehicle.</li>
                        <li>We have no control over and do not guarantee the quality, safety, or legality of items advertised.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>3. User Responsibilities</h2>
                    <p><strong>For Sellers:</strong> You must be the legal owner of the vehicle you list. Your description must be accurate, truthful, and complete. You are responsible for all content you post.</p>
                    <p style={{ marginTop: '1rem' }}><strong>For Buyers:</strong> You are responsible for conducting your own due diligence. We strongly recommend inspecting the vehicle in person and verifying documents before making any payment.</p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>4. Prohibited Activities</h2>
                    <p>You agree not to use the platform for any of the following:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>Posting false, misleading, or fraudulent listings.</li>
                        <li>Violating any laws or third-party rights.</li>
                        <li>Distributing spam, chain letters, or pyramid schemes.</li>
                        <li>Harvesting user information without consent.</li>
                        <li>Posting content that is abusive, defamatory, or obscene.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>5. Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by law, AutoMarket shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                        or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses,
                        resulting from (a) your access to or use of or inability to access or use the services; (b) any conduct or content of any third party on the services;
                        or (c) unauthorized access, use, or alteration of your transmissions or content.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>6. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. We will post the most current version of these terms on our site.
                        By continuing to use the services after changes become effective, you agree to be bound by the revised terms.
                    </p>
                </section>

                <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at: <br />
                        <a href="mailto:legal@automarket.com" style={{ color: '#2563eb', fontWeight: '600' }}>legal@automarket.com</a>
                    </p>
                </section>

            </div>
        </div>
    );
}
