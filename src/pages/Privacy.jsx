import React from 'react';

export default function Privacy() {
    return (
        <div style={{ backgroundColor: '#ffffff', color: '#334155', lineHeight: '1.7' }}>

            {/* Header */}
            <div style={{ backgroundColor: '#f8fafc', padding: '4rem 1rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                        Privacy Policy
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
                        Your privacy matters to us. This Privacy Policy explains how AutoMarket collects, uses, and protects your information when you use our platform.
                        We are committed to ensuring that your personal data is handled responsibly and transparently.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>2. Information We Collect</h2>
                    <p style={{ marginBottom: '1rem' }}>To facilitate vehicle buying and selling, we collect minimal information:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>Seller Information:</strong> Only when you post a vehicle, we collect your name, phone number, and city to display to potential buyers.</li>
                        <li><strong>Vehicle Details:</strong> Photos, descriptions, and specifications of the vehicles you list.</li>
                        <li><strong>Buyer Information:</strong> We do not require buyers to create an account to browse. If a buyer contacts a seller, that communication happens directly between parties.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>3. How We Use Your Information</h2>
                    <p>We use the information we collect solely for the purpose of operating the marketplace:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>To display your vehicle listing to potential buyers.</li>
                        <li>To enable interested buyers to contact you via phone or message.</li>
                        <li>To prevent fraud and maintain the security of our platform.</li>
                        <li>To improve our website's functionality and user experience.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>4. Data Sharing & Disclosure</h2>
                    <p>
                        <strong>We do not sell your personal data.</strong> Your contact information (phone number) is shared publicly on your vehicle listing page
                        only because you have authorized it to allow buyers to contact you. We do not share your data with third-party advertisers.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>5. Security</h2>
                    <p>
                        We implement standard security measures to protect your data. However, please be aware that no method of transmission over the internet is 100% secure.
                        We strive to use commercially acceptable means to protect your personal information but cannot guarantee its absolute security.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>6. Cookies</h2>
                    <p>
                        We use cookies primarily for website functionality (e.g., keeping you logged in). We may use anonymous analytics cookies to understand how users browse our site,
                        but this data is not linked to your personal identity.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>7. Your Rights</h2>
                    <p>
                        You have the right to access, update, or delete your personal listing data at any time through your dashboard.
                        If you wish to permanently delete your account and all associated data, please contact our support team.
                    </p>
                </section>

                <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy or your data, please contact us at: <br />
                        <a href="mailto:privacy@automarket.com" style={{ color: '#2563eb', fontWeight: '600' }}>privacy@automarket.com</a>
                    </p>
                </section>

            </div>
        </div>
    );
}
