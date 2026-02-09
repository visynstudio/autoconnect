import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import {
    Search, ShieldCheck, Handshake, ChevronRight,
    Car, Bike, Truck, ArrowRight, MapPin, SlidersHorizontal
} from 'lucide-react';

export default function Home() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Search State
    const [vehicleType, setVehicleType] = useState('all');
    const [city, setCity] = useState('');

    useEffect(() => {
        async function fetchVehicles() {
            const { data, error } = await supabase
                .from('vehicles')
                .select(`*, vehicle_images(image_url)`)
                .eq('is_live', true)
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) console.error('Error fetching vehicles:', error);
            else setVehicles(data || []);
            setLoading(false);
        }
        fetchVehicles();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/browse?type=${vehicleType}&city=${city}`);
    };

    const categories = [
        { id: 'car', label: 'Cars', icon: Car },
        { id: 'bike', label: 'Bikes', icon: Bike },
        { id: 'truck', label: 'Trucks', icon: Truck },
        { id: 'tractor', label: 'Tractors', icon: Truck }, // Using generic icon if needed
    ];

    return (
        <div className="home-page">

            {/* 1. HERO SECTION - Premium Split Layout */}
            <section className="hero-section">
                <div className="container hero-container">

                    {/* Left Content */}
                    <div className="hero-content animate-fade-in">
                        <div className="trust-pill">
                            <ShieldCheck size={14} className="icon" />
                            <span>No Commission. Direct Selling.</span>
                        </div>

                        <h1 className="hero-title">
                            Buying a Car? <br />
                            <span className="text-gradient">Deal Directly.</span>
                        </h1>

                        <p className="hero-subtitle">
                            Skip the dealers and hidden margins. Connect directly with verified sellers for the best price on your next vehicle.
                        </p>

                        {/* Luxury Search Bar */}
                        <div className="search-bar-luxury">
                            <div className="search-group border-r">
                                <Car className="search-icon" size={18} />
                                <select
                                    value={vehicleType}
                                    onChange={(e) => setVehicleType(e.target.value)}
                                    className="search-select"
                                >
                                    <option value="all">Any Vehicle</option>
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                    <option value="truck">Truck</option>
                                </select>
                            </div>
                            <div className="search-group">
                                <MapPin className="search-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="City (e.g. Delhi)"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <button onClick={handleSearch} className="search-btn-primary">
                                <Search size={18} />
                            </button>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <strong>10k+</strong> <span>Active Listings</span>
                            </div>
                            <div className="stat-separator"></div>
                            <div className="stat-item">
                                <strong>0%</strong> <span>Commission</span>
                            </div>
                            <div className="stat-separator"></div>
                            <div className="stat-item">
                                <strong>100%</strong> <span>Direct Chat</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image/Graphic */}
                    <div className="hero-image-wrapper animate-fade-in-delay">
                        <div className="image-card glow-effect">
                            <img
                                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop"
                                alt="Luxury Car"
                                className="hero-img"
                            />
                            <div className="floating-card glass">
                                <ShieldCheck size={20} color="#2563eb" />
                                <div>
                                    <p className="fc-title">Verified Seller</p>
                                    <p className="fc-sub">Instant Connection</p>
                                </div>
                            </div>
                        </div>
                        <div className="decorative-circle blur-blue"></div>
                        <div className="decorative-circle blur-indigo"></div>
                    </div>

                </div>
            </section>

            {/* 2. CURATED LISTINGS */}
            <section className="section bg-subtle">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Fresh Arrivals</h2>
                            <p className="section-desc">Handpicked vehicles for the discerning buyer.</p>
                        </div>
                        <Link to="/browse" className="link-arrow">
                            View All Inventory <ArrowRight size={18} />
                        </Link>
                    </div>

                    {!loading && vehicles.length > 0 ? (
                        <div className="listings-grid">
                            {vehicles.map(v => (
                                <VehicleCard key={v.id} vehicle={v} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Loading curated inventory...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. SIMPLIFIED PROCESS */}
            <section className="section">
                <div className="container">
                    <div className="process-grid">
                        <div className="process-content">
                            <h2 className="section-title">Selling Made Simple.</h2>
                            <p className="section-desc">
                                We've removed the chaos from selling used vehicles.
                                List in minutes, chat directly with buyers, and close the deal on your terms.
                            </p>
                            <Link to="/seller-signup" className="btn btn-primary mt-4">
                                List Your Vehicle
                            </Link>
                        </div>
                        <div className="process-steps">
                            <div className="step-item">
                                <div className="step-number">01</div>
                                <div>
                                    <h4>Create Account</h4>
                                    <p>Sign up as a verified seller in seconds.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <div className="step-number">02</div>
                                <div>
                                    <h4>Post Ad</h4>
                                    <p>Upload photos and details. Go live instantly.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <div className="step-number">03</div>
                                <div>
                                    <h4>Close Deal</h4>
                                    <p>Connect with buyers directly. No commissions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. PREMIUM CTA */}
            <section className="cta-minimal">
                <div className="container text-center">
                    <h2 className="cta-headline">Ready to upgrade your journey?</h2>
                    <p className="cta-subhead">Join the most trusted vehicle community in India today.</p>
                    <div className="cta-actions">
                        <Link to="/browse" className="btn btn-secondary">Browse Inventory</Link>
                        <Link to="/seller-signup" className="btn btn-primary">Start Selling</Link>
                    </div>
                </div>
            </section>

            <style>{`
                /* HERO SECTION */
                .hero-section {
                    padding: 4rem 0 6rem;
                    background: #ffffff;
                    position: relative;
                    overflow: hidden;
                }
                
                .hero-container {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    align-items: center;
                    gap: 4rem;
                }

                /* Left Content */
                .hero-content {
                    max-width: 600px;
                }

                .trust-pill {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    background: #eff6ff; color: #2563eb;
                    padding: 0.5rem 1rem; border-radius: 2rem;
                    font-size: 0.85rem; font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .hero-title {
                    font-size: 3.75rem;
                    margin-bottom: 1.25rem;
                    color: var(--text-main);
                    letter-spacing: -0.03em;
                    line-height: 1.1;
                }
                
                .text-gradient {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.125rem;
                    color: var(--text-secondary);
                    margin-bottom: 2.5rem;
                    line-height: 1.7;
                    max-width: 90%;
                }

                /* Search Bar */
                .search-bar-luxury {
                    background: white;
                    padding: 0.4rem;
                    border-radius: 1rem; /* Less rounded than a full pill, more modern UI */
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.08);
                    display: flex; alignItems: center;
                    border: 1px solid var(--border);
                    margin-bottom: 3rem;
                    position: relative;
                    z-index: 10;
                }
                
                .search-group {
                    flex: 1; position: relative;
                }
                .search-group.border-r {
                    border-right: 1px solid #f1f5f9;
                }
                
                .search-select, .search-input {
                    width: 100%; border: none; outline: none; background: transparent;
                    padding: 0 1rem 0 3rem; /* Adjusted padding */
                    height: 3.5rem; /* Explicit height */
                    line-height: normal;
                    font-size: 1rem; color: var(--text-main); font-weight: 500;
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    position: relative;
                    z-index: 5; /* Input below icon but clickable */
                }
                .search-icon {
                    position: absolute; left: 1.25rem; top: 0; bottom: 0; margin: auto;
                    height: 1.25rem; /* 20px */
                    color: #94a3b8; pointer-events: none;
                    z-index: 10;
                }
                .search-input::placeholder { color: #94a3b8; opacity: 1; }

                .search-btn-primary {
                    width: 3.5rem; 
                    height: 3.5rem;
                    flex-shrink: 0;
                    border-radius: 0.75rem; /* 12px */
                    background-color: #0F172A; /* Deep Navy - Explicit */
                    color: #FFFFFF;
                    border: none;
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    cursor: pointer; 
                    transition: all 0.2s ease;
                    margin-left: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.1);
                }

                .search-btn-primary:hover {
                    background-color: #1E293B; /* Lighter Navy */
                    transform: translateY(-1px);
                    box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
                }

                .search-btn-primary svg {
                    color: #FFFFFF;
                    width: 20px;
                    height: 20px;
                    stroke-width: 2.5px; /* Bolder icon */
                }

                /* Stats */
                .hero-stats {
                    display: flex; align-items: center; gap: 2rem;
                }
                .stat-item {
                    display: flex; flex-direction: column;
                }
                .stat-item strong {
                    font-size: 1.5rem; font-weight: 800; color: var(--text-main);
                    line-height: 1; margin-bottom: 0.25rem;
                }
                .stat-item span {
                    font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;
                }
                .stat-separator {
                    width: 1px; height: 2.5rem; background: #e2e8f0;
                }

                /* Right Image Section */
                .hero-image-wrapper {
                    position: relative;
                    display: flex;
                    justify-content: center;
                }

                .image-card {
                    position: relative;
                    border-radius: 2rem;
                    overflow: hidden;
                    width: 100%;
                    max-width: 500px;
                    aspect-ratio: 4/5;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    transform: rotate(2deg);
                    z-index: 2;
                }
                
                .hero-img {
                    width: 100%; height: 100%; object-fit: cover;
                }

                /* Gimmicks */
                .floating-card {
                    position: absolute; bottom: 2rem; left: -2rem;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    padding: 1rem 1.5rem;
                    border-radius: 1rem;
                    display: flex; alignItems: center; gap: 1rem;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    animation: float 6s ease-in-out infinite;
                    z-index: 3;
                    border: 1px solid rgba(255,255,255,0.5);
                }
                .fc-title { font-weight: 700; color: var(--text-main); font-size: 0.9rem; margin: 0; }
                .fc-sub { font-size: 0.75rem; color: var(--text-secondary); margin: 0; }

                .decorative-circle {
                    position: absolute; border-radius: 50%; z-index: 0;
                    filter: blur(80px); opacity: 0.6;
                }
                .blur-blue {
                    width: 300px; height: 300px; background: #bfdbfe;
                    top: -20px; right: -50px;
                }
                .blur-indigo {
                    width: 250px; height: 250px; background: #e0e7ff;
                    bottom: -20px; left: 0;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                /* COMMON SECTIONS */
                /* SECTION HEADERS */
                .section-header {
                    display: flex; justify-content: space-between; align-items: flex-end;
                    margin-bottom: 3rem;
                }
                .section-title {
                    font-size: 2.25rem; letter-spacing: -0.03em; color: var(--text-main);
                    margin-bottom: 0.5rem;
                }
                .section-desc {
                    font-size: 1.1rem; color: var(--text-secondary); max-width: 500px;
                }
                .link-arrow {
                    display: flex; alignItems: center; gap: 0.5rem;
                    font-weight: 600; color: var(--accent); transition: gap 0.2s;
                }
                .link-arrow:hover { gap: 0.75rem; color: var(--accent-hover); }

                /* LISTINGS GRID */
                .listings-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
                }
                .bg-subtle { background-color: var(--bg-subtle); }

                /* PROCESS SECTION */
                .process-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; alignItems: center;
                }
                .step-item {
                    display: flex; gap: 1.5rem; margin-bottom: 2rem;
                }
                .step-number {
                    font-size: 1.5rem; font-weight: 800; color: var(--border);
                    line-height: 1; flex-shrink: 0;
                }
                .step-item h4 { font-size: 1.1rem; margin-bottom: 0.25rem; font-weight: 700; }
                .step-item p { color: var(--text-secondary); font-size: 0.95rem; }
                .mt-4 { margin-top: 1.5rem; }

                /* CTA MINIMAL */
                .cta-minimal {
                    padding: 8rem 0; background: var(--bg-page);
                    border-top: 1px solid var(--border);
                }
                .cta-headline { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.03em; }
                .cta-subhead { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 2.5rem; }
                .cta-actions { display: flex; gap: 1rem; justify-content: center; }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .hero-container { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
                    .hero-content { margin: 0 auto; }
                    .hero-image-wrapper { display: none; } /* Hide complicated image on tablet for simpler view or adjust */
                    
                    /* If you want to keep image on tablet, adjust grid or stack */
                    .search-bar-luxury { max-width: 600px; margin-left: auto; margin-right: auto; }
                    .hero-stats { justify-content: center; }

                    .listings-grid { grid-template-columns: repeat(2, 1fr); }
                    .process-grid { grid-template-columns: 1fr; gap: 3rem; }
                }
                
                @media (max-width: 768px) {
                    .hero-section { padding: 3rem 0; }
                    .hero-title { font-size: 2.75rem; }
                    .search-bar-luxury { flex-direction: column; padding: 1rem; gap: 0.75rem; width: 100%; border-radius: 1.5rem; }
                    .search-group { width: 100%; border-right: none !important; border-bottom: 1px solid #f1f5f9; }
                    .search-btn-primary { width: 100%; border-radius: 0.75rem; height: 3rem; margin: 0; }
                    .search-select, .search-input { padding-left: 3rem; }
                    .search-icon { left: 1rem; }

                    .section-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                    .listings-grid { grid-template-columns: 1fr; }
                    .hero-meta { flex-direction: column; gap: 0.5rem; }
                }
            `}</style>
        </div>
    );
}
