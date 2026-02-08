import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import {
    Search, ShieldCheck, DollarSign, Handshake, ChevronRight,
    Car, Bike, Truck, Sparkles, MapPin, Tractor, Circle
} from 'lucide-react';

export default function Home() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search State
    const [vehicleType, setVehicleType] = useState('all');
    const [city, setCity] = useState('');

    useEffect(() => {
        async function fetchVehicles() {
            const { data, error } = await supabase
                .from('vehicles')
                .select(`
          *,
          vehicle_images(image_url)
        `)
                .eq('is_live', true)
                .order('created_at', { ascending: false })
                .limit(6);

            if (error) console.error('Error fetching vehicles:', error);
            else setVehicles(data || []);
            setLoading(false);
        }
        fetchVehicles();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = `/browse?type=${vehicleType}&city=${city}`;
    };

    const categories = [
        { id: 'car', label: 'Cars', icon: Car },
        { id: 'bike', label: 'Bikes', icon: Bike },
        { id: 'cycle', label: 'Cycles', icon: Circle }, // Using Circle as placeholder for Cycle if specific icon unavailable
        { id: 'truck', label: 'Trucks', icon: Truck },
        { id: 'tractor', label: 'Tractors', icon: Tractor },
        { id: 'other', label: 'Others', icon: Sparkles },
    ];

    return (
        <div className="home-page">

            {/* 1. HERO SECTION */}
            <section className="hero-section" style={{
                position: 'relative',
                padding: '8rem 1rem 6rem',
                backgroundColor: '#0f172a', /* Dark primary background */
                color: 'white',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                {/* Abstract Background Shapes */}
                <div style={{
                    position: 'absolute', top: '-50%', left: '-20%', width: '80%', height: '200%',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 60%)',
                    zIndex: 0
                }}></div>
                <div style={{
                    position: 'absolute', bottom: '-50%', right: '-20%', width: '80%', height: '200%',
                    background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 60%)',
                    zIndex: 0
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem', borderRadius: '2rem',
                        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                        marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0'
                    }}>
                        <Sparkles size={16} className="text-accent" style={{ color: '#60a5fa' }} />
                        <span>India's Most Trusted Marketplace</span>
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem',
                        letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #cbd5e1)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>
                        Find Your Perfect Vehicle <br /> Without The Commission.
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '3rem', lineHeight: 1.6 }}>
                        Connect directly with verified sellers. No hidden fees. <br className="hidden-mobile" />
                        Just honest deals on Cars, Bikes, Tractors, and more.
                    </p>

                    {/* Integrated Search Bar */}
                    <div className="search-box" style={{
                        background: 'white', padding: '0.75rem', borderRadius: '1rem',
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ flex: 1, position: 'relative', borderRight: '1px solid #e2e8f0' }}>
                            <Car className="search-icon" size={20} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <select
                                value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem', border: 'none', outline: 'none',
                                    fontWeight: '600', color: '#334155', appearance: 'none', background: 'transparent'
                                }}
                            >
                                <option value="all">All Vehicle Types</option>
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="cycle">Cycle</option>
                                <option value="truck">Truck</option>
                                <option value="tractor">Tractor</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={{ flex: 1.5, position: 'relative' }}>
                            <MapPin className="search-icon" size={20} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text" placeholder="City or Location..."
                                value={city} onChange={(e) => setCity(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem', border: 'none', outline: 'none',
                                    fontWeight: '600', color: '#334155'
                                }}
                            />
                        </div>

                        <button onClick={handleSearch} className="btn btn-primary" style={{ padding: '0.85rem 2rem', borderRadius: '0.75rem' }}>
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. BROWSE BY CATEGORY */}
            <section style={{ padding: '4rem 0', background: '#ffffff' }}>
                <div className="container">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', color: '#0f172a' }}>Browse by Category</h3>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.5rem',
                        textAlign: 'center'
                    }} className="category-grid">
                        {categories.map((cat) => (
                            <Link to={`/browse?type=${cat.id}`} key={cat.id} className="category-card" style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                                padding: '1.5rem 1rem', borderRadius: '1rem', background: '#f8fafc',
                                border: '1px solid #f1f5f9', transition: 'all 0.2s', textDecoration: 'none'
                            }}>
                                <div style={{
                                    width: '3rem', height: '3rem', background: '#e0f2fe', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7'
                                }}>
                                    <cat.icon size={24} />
                                </div>
                                <span style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. LATEST LISTINGS */}
            <section className="section" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Fresh Recommendations</h2>
                            <p style={{ color: '#64748b' }}>Handpicked listings just for you.</p>
                        </div>
                        <Link to="/browse" className="btn btn-secondary" style={{ borderRadius: '2rem', padding: '0.5rem 1.5rem' }}>
                            View All Listings <ChevronRight size={16} />
                        </Link>
                    </div>

                    {!loading && vehicles.length > 0 ? (
                        <div className="grid-cols-3">
                            {vehicles.map(v => (
                                <VehicleCard key={v.id} vehicle={v} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                            <p style={{ color: '#64748b' }}>No verified listings available right now. Be the first to sell!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section style={{ padding: '6rem 0', background: 'white' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
                    <div style={{ marginBottom: '4rem' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Simple Process</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginTop: '0.5rem' }}>How it works</h2>
                    </div>

                    <div className="grid-cols-3 how-it-works-grid" style={{ gap: '4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '4rem', height: '4rem', background: '#dbeafe', color: '#2563eb', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Search size={32} />
                            </div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>1. Find a Vehicle</h4>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>Browse thousands of curated listings with detailed information and photos.</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '4rem', height: '4rem', background: '#dbeafe', color: '#2563eb', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Handshake size={32} />
                            </div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>2. Contact Seller</h4>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>Connect directly via phone or chat. Discuss price and arrange a test drive.</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '4rem', height: '4rem', background: '#dbeafe', color: '#2563eb', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <ShieldCheck size={32} />
                            </div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>3. Seal the Deal</h4>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>Close the deal directly. No hidden commissions or middleman agents.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', overflow: 'hidden', position: 'relative' }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '700px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Ready to sell your vehicle?</h2>
                    <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        Join thousands of happy sellers. List your vehicle in under 2 minutes and get the best price from direct buyers.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/seller-signup" className="btn" style={{ background: '#2563eb', color: 'white', padding: '1rem 2.5rem', border: 'none' }}>
                            Start Selling Now
                        </Link>
                        <Link to="/about" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem 2.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Responsive & Custom Styles */}
            <style>{`
                .category-card:hover {
                    transform: translateY(-5px);
                    border-color: #cbd5e1 !important;
                    background: white !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                /* Default Desktop Styles handled by inline styles + utilities */

                /* Tablet Breakpoint */
                @media (max-width: 1024px) {
                    .hero-section { padding: 6rem 1rem 5rem !important; }
                    .hero-section h1 { font-size: 3rem !important; }
                    
                    .category-grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                    }
                }

                /* Mobile Breakpoint */
                @media (max-width: 768px) {
                    .hero-section { padding: 4rem 1.5rem 4rem !important; }
                    .hero-section h1 { font-size: 2.25rem !important; line-height: 1.2 !important; }
                    .hero-section p { font-size: 1rem !important; margin-bottom: 2rem !important; }
                    
                    .search-box {
                        flex-direction: column;
                        padding: 1.25rem !important;
                        gap: 1rem !important;
                    }
                    .search-box > div { 
                        width: 100%; 
                        border-right: none !important; 
                        border-bottom: 1px solid #e2e8f0; 
                        padding-bottom: 0.75rem; 
                    }
                    .search-box button { width: 100%; justify-content: center; }

                    .category-grid {
                        grid-template-columns: repeat(2, 1fr) !important; /* 2 columns on mobile */
                        gap: 1rem !important;
                    }

                    .grid-cols-3 { 
                        grid-template-columns: 1fr !important; 
                        gap: 2.5rem !important; 
                    }
                    
                    /* Adjust How It Works section gap locally */
                    .how-it-works-grid {
                        gap: 3rem !important;
                    }

                    .hidden-mobile { display: none; }
                    
                    .section { padding: 3rem 0 !important; }
                }

                /* Small Mobile */
                @media (max-width: 480px) {
                    .hero-section h1 { font-size: 1.85rem !important; }
                }
            `}</style>
        </div>
    );
}
