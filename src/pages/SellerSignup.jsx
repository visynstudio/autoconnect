import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

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
                    alert('Account created, but profile details failed specific save. Please update in Dashboard.');
                }
                navigate('/dashboard');
            }
        } catch (error) {
            alert(error.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-auth-screen">
            {/* Header */}
            <div className="auth-header">
                <button onClick={() => navigate(-1)} className="auth-back">
                    <ChevronLeft size={24} />
                </button>
                <h2>Sign Up</h2>
                <div style={{ width: 44 }}></div>
            </div>

            {/* Content */}
            <div className="auth-content">
                <div className="auth-title-box">
                    <h1>Create Account</h1>
                    <p>Join India's fastest growing marketplace</p>
                </div>

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="auth-input-group">
                        <label>Full Name</label>
                        <div className="auth-input-wrapper">
                            <User size={20} color="#94a3b8" />
                            <input
                                type="text" name="name" placeholder="John Doe" required
                                value={formData.name} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Email Address</label>
                        <div className="auth-input-wrapper">
                            <Mail size={20} color="#94a3b8" />
                            <input
                                type="email" name="email" placeholder="john@example.com" required
                                value={formData.email} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <Lock size={20} color="#94a3b8" />
                            <input
                                type="password" name="password" placeholder="Min. 6 characters" required
                                minLength={6} value={formData.password} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="auth-scroll-row">
                        <div className="auth-input-group">
                            <label>Phone</label>
                            <div className="auth-input-wrapper">
                                <Phone size={20} color="#94a3b8" />
                                <input
                                    type="tel" name="phone" placeholder="Mobile" required
                                    value={formData.phone} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <label>City</label>
                            <div className="auth-input-wrapper">
                                <MapPin size={20} color="#94a3b8" />
                                <input
                                    type="text" name="city" placeholder="Location" required
                                    value={formData.city} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                        {loading ? 'Creating...' : 'Register Now'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/seller-login">Sign In</Link></p>
                </div>
            </div>

            <style>{`
                .app-auth-screen {
                    min-height: calc(100vh - 56px - 60px);
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                }

                .auth-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid var(--border);
                }

                .auth-header h2 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .auth-back {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: var(--bg-subtle);
                    color: var(--primary);
                }

                .auth-content {
                    padding: 32px 24px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .auth-title-box { margin-bottom: 32px; }
                .auth-title-box h1 { font-size: 2rem; font-weight: 800; color: var(--primary); margin: 0; line-height: 1.2; letter-spacing: -0.03em; }
                .auth-title-box p { font-size: 1rem; color: var(--text-secondary); margin: 8px 0 0 0; }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    flex: 1;
                }

                .auth-scroll-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .auth-input-group label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .auth-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--bg-subtle);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 0 16px;
                    height: 56px;
                    transition: border-color 0.2s;
                }

                .auth-input-wrapper:focus-within {
                    border-color: var(--accent);
                }

                .auth-input-wrapper input {
                    flex: 1;
                    height: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    color: var(--primary);
                    font-weight: 500;
                    width: 100%;
                }

                .auth-submit-btn {
                    margin-top: 24px;
                    height: 56px;
                    border-radius: 16px;
                    background: var(--primary);
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border: none;
                    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);
                    margin-bottom: 24px;
                }

                .auth-footer {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .auth-footer p {
                    margin: 0;
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .auth-footer a {
                    color: var(--accent);
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
}
