import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function SellerSignup() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        city: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Sign up auth user
            const { data: { user, session }, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                        city: formData.city
                    }
                }
            });

            if (authError) throw authError;

            if (user) {
                // 2. Insert into sellers table
                // Using upsert to handle cases where a trigger might have already created the row
                const { error: dbError } = await supabase
                    .from('sellers')
                    .upsert({
                        id: user.id,
                        name: formData.name,
                        phone: formData.phone,
                        city: formData.city,
                        created_at: new Date().toISOString()
                    }, { onConflict: 'id' });

                if (dbError) {
                    console.error('Error saving seller details:', dbError);
                    // If profile fails, alert user but don't block flow completely if auth worked
                    alert('Account created, but profile details failed specific save. Please update in Dashboard.');
                }

                alert('Signup successful! Redirecting to dashboard...');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert(error.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page-wrapper">
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Start Selling Today</h1>
                    <p className="page-subtitle">Join India's fastest growing pre-owned vehicle marketplace</p>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '600px', padding: '4rem 1.5rem' }}>
                <form onSubmit={handleSignup} className="card animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="signup-grid">
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="input-label">Full Name</label>
                            <input type="text" name="name" placeholder="John Doe" required className="input-field" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">Email Address</label>
                            <input type="email" name="email" placeholder="john@example.com" required className="input-field" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">Password</label>
                            <input type="password" name="password" placeholder="Min. 6 characters" required className="input-field" onChange={handleChange} minLength={6} />
                        </div>
                        <div>
                            <label className="input-label">Phone Number</label>
                            <input type="tel" name="phone" placeholder="98765 43210" required className="input-field" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="input-label">City</label>
                            <input type="text" name="city" placeholder="Mumbai, Delhi, etc." required className="input-field" onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
                        {loading ? 'Creating Your Profile...' : 'Complete Registration'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Already have an account? <Link to="/seller-login" style={{ color: 'var(--accent)', fontWeight: '700' }}>Sign In here</Link>
                    </p>
                </form>
            </div>

            <style>{`
                .signup-page-wrapper {
                    min-height: 100vh;
                    background: var(--bg-subtle);
                    padding-bottom: 5rem;
                }
                .input-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                @media (max-width: 640px) {
                    .signup-grid { grid-template-columns: 1fr !important; }
                    .signup-grid div { grid-column: span 1 !important; }
                }
            `}</style>
        </div>
    );
}
