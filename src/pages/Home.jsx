import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import {
    Search, ShieldCheck, Handshake, ChevronRight,
    Car, Bike, Truck, ArrowRight, MapPin,
    LayoutGrid, Timer, BadgeCheck, Zap,
    ArrowUpRight, CircleDot, Bike as BikeIcon,
    Truck as TruckIcon, Tractor, Rocket, UserPlus, FileEdit, CheckCircle2
} from 'lucide-react';

export default function Home() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Search State
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('all');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        async function fetchVehicles() {
            const { data, error } = await supabase
                .from('vehicles')
                .select(`*, vehicle_images(image_url)`)
                .eq('is_live', true)
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) console.error('Error fetching vehicles:', error);
            else setVehicles(data || []);
            setLoading(false);
        }
        fetchVehicles();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        let query = `/browse?type=${category}`;
        if (city) query += `&city=${city}`;
        if (maxPrice) query += `&maxPrice=${maxPrice}`;
        navigate(query);
    };

    const categories = [
        { id: 'car', label: 'Car', icon: Car, color: '#2563EB' },
        { id: 'bike', label: 'Bike', icon: BikeIcon, color: '#16A34A' },
        { id: 'cycle', label: 'Cycle', icon: Bike, color: '#7C3AED' },
        { id: 'truck', label: 'Truck', icon: TruckIcon, color: '#EA580C' },
        { id: 'tractor', label: 'Tractor', icon: Tractor, color: '#DC2626' },
        { id: 'other', label: 'Other', icon: CircleDot, color: '#64748B' },
    ];

    const features = [
        { title: 'Direct Owner Deals', desc: 'No middleman interference. Talk directly to the owners.', icon: Handshake },
        { title: 'No Commission', desc: 'Pay 0% commission on every single transaction.', icon: Zap },
        { title: 'Trusted Listings', desc: 'Every listing is verified for quality and authenticity.', icon: BadgeCheck },
        { title: 'Easy & Fast Search', desc: 'Find your dream vehicle in seconds with smart filters.', icon: Timer },
    ];

    const steps = [
        { title: 'List Your Vehicle', desc: 'Add detailed information and high-quality photos.', icon: FileEdit },
        { title: 'Connect with Buyers', desc: 'Receive inquiries directly via chat or phone.', icon: UserPlus },
        { title: 'Close the Deal', desc: 'Finalize the price and hand over the keys safely.', icon: CheckCircle2 },
    ];

    return (
        <div className="home-wrapper">

            {/* 1. HERO SECTION V3 (IMAGELESS PREMIUM) */}
            <section className="hero-v3-abstract">
                <div className="mesh-bg"></div>
                <div className="container">
                    <div className="hero-content-center animate-fade-in">
                        <div className="premium-badge-v3">
                            <Rocket size={14} />
                            <span>Revolutionizing Direct Trading</span>
                        </div>

                        <h1 className="hero-heading-v3">
                            The Smartest Way to <br />
                            <span className="text-glow-v3">Buy & Sell Directly</span>
                        </h1>

                        <p className="hero-lead-v3">
                            Experience India's first agent-free vehicle marketplace.
                            <strong> Zero Commission. Zero Middlemen. 100% Transparency.</strong>
                        </p>

                        <div className="search-glass-container">
                            <form onSubmit={handleSearch} className="search-glass-inner">
                                <div className="glass-field">
                                    <MapPin size={20} className="field-icon" />
                                    <input
                                        type="text"
                                        placeholder="Location (e.g. Delhi)"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className="glass-divider"></div>
                                <div className="glass-field">
                                    <Car size={20} className="field-icon" />
                                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="all">Every Category</option>
                                        <option value="car">Luxury Cars</option>
                                        <option value="bike">Premium Bikes</option>
                                        <option value="truck">Payload Trucks</option>
                                        <option value="tractor">Agri Tractors</option>
                                    </select>
                                </div>
                                <button type="submit" className="glass-submit-btn">
                                    <Search size={20} />
                                    <span>Discover Deals</span>
                                </button>
                            </form>
                        </div>

                        <div className="trust-row-v3">
                            <div className="trust-item">
                                <BadgeCheck size={18} className="text-accent" />
                                <span>Verified Listings</span>
                            </div>
                            <div className="trust-item">
                                <ShieldCheck size={18} className="text-accent" />
                                <span>Direct Owner Contact</span>
                            </div>
                            <div className="trust-item">
                                <Zap size={18} className="text-accent" />
                                <span>No Hidden Fees</span>
                            </div>
                        </div>

                        <div className="hero-stats-centered">
                            <div className="h-stat">
                                <strong>12,400+</strong>
                                <small>Vehicles Listed</small>
                            </div>
                            <div className="h-stat">
                                <strong>850+</strong>
                                <small>Cities Covered</small>
                            </div>
                            <div className="h-stat">
                                <strong>24/7</strong>
                                <small>Buyer Support</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. POPULAR CATEGORIES */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title-centered">Browse by Category</h2>
                    <p className="section-subtitle-centered">Explore diverse range of vehicles tailored to your needs</p>

                    <div className="category-grid-v2">
                        {categories.map(cat => (
                            <Link to={`/browse?type=${cat.id}`} key={cat.id} className="category-card-v2">
                                <div className="cat-icon-box-v2" style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                                    <cat.icon size={28} style={{ color: cat.color }} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <span className="cat-label-v2">{cat.label}</span>
                                    <div className="cat-count-v2">Top Deals</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURED VEHICLES */}
            <section className="section section-bg">
                <div className="container">
                    <div className="flex-header">
                        <div className="flex-title-block">
                            <h2 className="section-title-left">Fresh Arrivals</h2>
                            <p className="text-muted">Hand-picked premium listings in your area</p>
                        </div>
                        <Link to="/browse" className="view-all-link">
                            <span>Explore Marketplace</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid-4-2-1">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className="text-center">
                                        <Timer className="animate-spin text-accent" size={32} />
                                        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Loading listings...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid-4-2-1">
                            {vehicles.map(v => (
                                <VehicleCard key={v.id} vehicle={v} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. WHY APNICAR */}
            <section className="section section-bg">
                <div className="container">
                    <h2 className="section-title-centered">Direct. Simple. Transparent.</h2>
                    <p className="section-subtitle-centered">Building India's most trusted direct-to-owner vehicle marketplace</p>

                    <div className="feature-grid-v2">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card-v2">
                                <div className="feature-icon-v2">
                                    <f.icon size={26} strokeWidth={1.5} />
                                </div>
                                <h4 className="feature-title-v2">{f.title}</h4>
                                <p className="feature-desc-v2">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title-centered">How It Works</h2>
                    <p className="section-subtitle-centered">Experience a seamless journey from listing to ownership</p>

                    <div className="how-grid-v3">
                        {steps.map((s, i) => (
                            <div key={i} className="how-step-v3">
                                <div className="step-num-v3">0{i + 1}</div>
                                <div className="step-icon-v3">
                                    <s.icon size={36} strokeWidth={1.5} />
                                </div>
                                <h4 className="step-title-v3">{s.title}</h4>
                                <p className="step-desc-v3">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST BANNER */}
            <section className="section-bg" style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div className="trust-banner-v2">
                        <div className="trust-icon-box-v2">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="trust-text-v2">
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Your Safety is Our Priority</h3>
                            <p style={{ margin: '0.25rem 0 0', opacity: 0.7 }}>We verify all listings and ensure direct owner connections to prevent fraud.</p>
                        </div>
                        <Link to="/about" className="btn btn-outline" style={{ marginLeft: 'auto', background: 'white' }}>Learn More</Link>
                    </div>
                </div>
            </section>

            {/* 6. CTA SECTION */}
            <section className="section">
                <div className="container">
                    <div className="premium-cta-v2">
                        <div className="cta-content-v2 animate-fade-in">
                            <h2 className="cta-title-v2">Ready to Sell Your <br />Vehicle Today?</h2>
                            <p className="cta-desc-v2">Post your first listing in under 2 minutes. Tap into India's largest direct buyer network.</p>

                            <div className="cta-actions-v2">
                                <Link to="/seller-signup" className="btn btn-accent cta-btn-v2" style={{ background: '#2563EB' }}>
                                    <span>Post Free Listing</span>
                                    <ArrowRight size={20} />
                                </Link>
                                <Link to="/contact" className="btn btn-outline cta-btn-v2" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                                    <span>Contact Support</span>
                                </Link>
                            </div>
                        </div>

                        <div className="cta-visual-v2">
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <div className="cta-rocket-box">
                                    <Rocket size={64} color="#2563EB" fill="#2563EB" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .home-wrapper {
                    background: var(--bg-page);
                }

                /* HERO V3 - ABSTRACT & IMAGELESS */
                .hero-v3-abstract {
                    position: relative;
                    padding: 8rem 0 10rem;
                    background: #ffffff;
                    overflow: hidden;
                    text-align: center;
                }

                .mesh-bg {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.05) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.05) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, rgba(20, 184, 166, 0.05) 0px, transparent 50%);
                    z-index: 1;
                }

                .hero-content-center {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .premium-badge-v3 {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(37, 99, 235, 0.08);
                    color: var(--accent);
                    padding: 0.6rem 1.25rem;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 2.5rem;
                    border: 1px solid rgba(37, 99, 235, 0.1);
                }

                .hero-heading-v3 {
                    font-size: 5.5rem;
                    font-weight: 800;
                    line-height: 1;
                    letter-spacing: -0.05em;
                    color: var(--primary);
                    margin-bottom: 2rem;
                    font-family: 'Outfit', sans-serif;
                }

                .text-glow-v3 {
                    background: linear-gradient(135deg, var(--primary) 30%, var(--accent) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-lead-v3 {
                    font-size: 1.4rem;
                    color: var(--text-secondary);
                    max-width: 700px;
                    line-height: 1.6;
                    margin-bottom: 4rem;
                }

                /* Search Glass - Center */
                .search-glass-container {
                    width: 100%;
                    max-width: 800px;
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    padding: 0.75rem;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    margin-bottom: 4rem;
                }

                .search-glass-inner {
                    display: flex;
                    align-items: center;
                    background: white;
                    border-radius: 16px;
                    padding: 0.25rem;
                }

                .glass-field {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0 1.5rem;
                }

                .glass-field .field-icon {
                    color: var(--accent);
                    opacity: 0.7;
                }

                .glass-field input, .glass-field select {
                    width: 100%;
                    height: 3.5rem;
                    border: none;
                    background: transparent;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--primary);
                    outline: none;
                    font-family: inherit;
                }

                .glass-divider {
                    width: 1px;
                    height: 2.5rem;
                    background: var(--border);
                }

                .glass-submit-btn {
                    height: 4rem;
                    padding: 0 2.5rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 14px;
                    font-weight: 800;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .glass-submit-btn:hover {
                    background: var(--accent);
                    transform: scale(1.02);
                    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
                }

                /* Trust Row */
                .trust-row-v3 {
                    display: flex;
                    gap: 3rem;
                    margin-bottom: 5rem;
                }

                .trust-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                }

                /* CATEGORIES SECTION */
                .category-grid-v2 {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 1.5rem;
                    margin-top: 1rem;
                }

                .category-card-v2 {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 2rem 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.25rem;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .category-card-v2::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 4px;
                    background: var(--accent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .category-card-v2:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.06);
                    border-color: var(--accent);
                }

                .category-card-v2:hover::before {
                    opacity: 1;
                }

                .cat-icon-box-v2 {
                    width: 64px;
                    height: 64px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s;
                }

                .category-card-v2:hover .cat-icon-box-v2 {
                    transform: scale(1.1) rotate(5deg);
                }

                .cat-label-v2 {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: var(--primary);
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                }

                .cat-count-v2 {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                @media (max-width: 1200px) {
                    .category-grid-v2 { grid-template-columns: repeat(3, 1fr); }
                }

                @media (max-width: 640px) {
                    .category-grid-v2 { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                    .category-card-v2 { padding: 1.5rem 1rem; }
                }

                /* SECTION UTILS */
                .hero-stats-centered {
                    display: flex;
                    gap: 6rem;
                    padding-top: 4rem;
                    border-top: 1px solid var(--border);
                    width: 100%;
                    max-width: 900px;
                    justify-content: center;
                }

                .h-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .h-stat strong {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: var(--primary);
                    letter-spacing: -0.02em;
                    line-height: 1;
                }

                .h-stat small {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                /* WHY CHOOSE SECTION */
                .feature-grid-v2 {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2.5rem;
                }

                .feature-card-v2 {
                    padding: 2.5rem;
                    background: white;
                    border-radius: 20px;
                    border: 1px solid var(--border);
                    transition: all 0.3s;
                }

                .feature-card-v2:hover {
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    border-color: var(--accent);
                }

                .feature-icon-v2 {
                    width: 56px;
                    height: 56px;
                    background: var(--bg-subtle);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent);
                    margin-bottom: 2rem;
                    transition: transform 0.3s;
                }

                /* FRESH ARRIVALS HEADER */
                .flex-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3.5rem;
                }

                .flex-title-block {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .section-title-left {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--primary);
                    letter-spacing: -0.03em;
                    margin: 0;
                }

                .view-all-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.25rem;
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 0.95rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .view-all-link:hover {
                    border-color: var(--accent);
                    color: var(--accent);
                    transform: translateX(5px);
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
                }

                @media (max-width: 768px) {
                    .flex-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                    .view-all-link { width: 100%; justify-content: center; }
                }

                .feature-card-v2:hover .feature-icon-v2 {
                    transform: scale(1.1) rotate(-5deg);
                    background: var(--accent);
                    color: white;
                }

                .feature-title-v2 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-bottom: 1rem;
                    letter-spacing: -0.01em;
                }

                .feature-desc-v2 {
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                /* HOW IT WORKS SECTION */
                .how-grid-v3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 3rem;
                    position: relative;
                }

                .how-step-v3 {
                    background: white;
                    padding: 3rem 2rem;
                    border-radius: 24px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: 1px solid var(--border);
                    z-index: 2;
                    transition: transform 0.3s;
                }

                .how-step-v3:hover {
                    transform: translateY(-5px);
                }

                .step-num-v3 {
                    width: 32px;
                    height: 32px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 800;
                    margin-bottom: 2rem;
                }

                .step-icon-v3 {
                    width: 80px;
                    height: 80px;
                    background: #f8fafc;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    margin-bottom: 2rem;
                }

                .step-title-v3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin-bottom: 1rem;
                }

                .step-desc-v3 {
                    color: var(--text-secondary);
                    font-size: 1rem;
                    line-height: 1.6;
                }

                /* CTA SECTION */
                .premium-cta-v2 {
                    background: var(--primary);
                    background-image: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
                    border-radius: 32px;
                    padding: 6rem 4rem;
                    display: grid;
                    grid-template-columns: 1fr 0.8fr;
                    gap: 4rem;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                }

                .cta-content-v2 {
                    position: relative;
                    z-index: 2;
                }

                .cta-title-v2 {
                    font-size: 3.5rem;
                    line-height: 1.1;
                    color: white;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    font-family: 'Outfit', sans-serif;
                }

                .cta-desc-v2 {
                    font-size: 1.25rem;
                    color: #94A3B8;
                    margin-bottom: 3rem;
                    line-height: 1.6;
                }

                .cta-actions-v2 {
                    display: flex;
                    gap: 1.5rem;
                }

                .cta-btn-v2 {
                    height: 60px;
                    padding: 0 2.5rem;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 1.05rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .cta-visual-v2 {
                    position: relative;
                    height: 100%;
                }

                .cta-rocket-box {
                    width: 120px;
                    height: 120px;
                    background: rgba(37, 99, 235, 0.1);
                    border-radius: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(-15deg);
                    box-shadow: 0 0 50px rgba(37, 99, 235, 0.2);
                }



                /* TRUST BANNER */
                .trust-banner-v2 {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 2.5rem 3rem;
                    display: flex;
                    align-items: center;
                    gap: 2.5rem;
                    box-shadow: var(--shadow-sm);
                }

                .trust-icon-box-v2 {
                    width: 64px;
                    height: 64px;
                    background: #F0FDF4;
                    color: #16A34A;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .trust-banner-v2 { flex-direction: column; text-align: center; padding: 2rem; }
                    .trust-banner-v2 .btn { width: 100%; margin: 0 !important; }
                }

                /* RESPONSIVE */
                @media (max-width: 1200px) {
                    .feature-grid-v2 { grid-template-columns: repeat(2, 1fr); }
                    .premium-cta-v2 { grid-template-columns: 1fr; text-align: center; }
                    .cta-actions-v2 { justify-content: center; }
                    .cta-title-v2 { font-size: 2.75rem; }
                    .cta-visual-v2 { display: none; }
                }

                @media (max-width: 1024px) {
                    .how-grid-v3 { grid-template-columns: 1fr; }
                }

                @media (max-width: 640px) {
                    .feature-grid-v2 { grid-template-columns: 1fr; }
                    .premium-cta-v2 { padding: 4rem 2rem; }
                    .cta-actions-v2 { flex-direction: column; }
                    .cta-btn-v2 { width: 100%; }
                }
            `}</style>
        </div>
    );
}
