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
            const { data: { user }, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (user) {
                // 2. Insert into sellers table
                // Note: use upsert mostly harmless for id collision, but insert is safer for logic check
                const { error: dbError } = await supabase
                    .from('sellers')
                    .insert([{
                        id: user.id,
                        name: formData.name,
                        phone: formData.phone,
                        city: formData.city
                    }]);

                if (dbError) {
                    // If profile fails, we might want to delete the user or handle it. 
                    // For now just show error.
                    throw dbError;
                }

                alert('Signup successful! Redirecting to dashboard...');
                navigate('/dashboard');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '4rem', padding: '2rem' }}>
            <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Start Selling</h1>
            <form onSubmit={handleSignup} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                    <input type="text" name="name" placeholder="John Doe" required className="input-field" onChange={handleChange} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                    <input type="email" name="email" placeholder="john@example.com" required className="input-field" onChange={handleChange} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                    <input type="password" name="password" placeholder="Min. 6 characters" required className="input-field" onChange={handleChange} minLength={6} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" required className="input-field" onChange={handleChange} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City</label>
                    <input type="text" name="city" placeholder="Mumbai, Delhi, etc." required className="input-field" onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '1rem' }}>
                    {loading ? 'Creating Account...' : 'Create Seller Account'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/seller-login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
                </p>
            </form>
        </div>
    );
}
