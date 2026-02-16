import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function SellerLogin() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            alert(error.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="login-page-wrapper">
            <header className="page-header section-bg">
                <div className="container">
                    <h1 className="page-title">Welcome Back</h1>
                    <p className="page-subtitle">Access your seller dashboard to manage listings</p>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '480px', padding: '4rem 1.5rem' }}>
                <form onSubmit={handleLogin} className="card animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            required
                            className="input-field"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            className="input-field"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%' }}>
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        New to ApniCar? <Link to="/seller-signup" style={{ color: 'var(--accent)', fontWeight: '700' }}>Create an account</Link>
                    </p>
                </form>
            </div>

            <style>{`
                .login-page-wrapper {
                    min-height: 100vh;
                    background: var(--bg-subtle);
                    padding-bottom: 5rem;
                }
            `}</style>
        </div >
    );
}
