import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import {
    Search, Car, Bike, Truck, Tractor, CircleDot,
    ShieldCheck, Handshake, BadgeIndianRupee, X, MapPin
} from 'lucide-react';

export default function Home() {
    const [recentVehicles, setRecentVehicles] = useState([]);
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userCity, setUserCity] = useState('');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const [detectingLocation, setDetectingLocation] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [manualCityInput, setManualCityInput] = useState('');

    useEffect(() => {
        async function fetchInitial() {
            setLoading(true);
            const savedCity = localStorage.getItem('userCity');

            // Check auth
            const { data: { user } } = await supabase.auth.getUser();
            let dbCity = null;
            if (user) {
                const { data: profile } = await supabase.from('sellers').select('city').eq('id', user.id).single();
                if (profile?.city) dbCity = profile.city;
            }

            const activeCity = savedCity || dbCity || null;
            if (activeCity) {
                setUserCity(activeCity);
                localStorage.setItem('userCity', activeCity);
                fetchVehiclesByCity(activeCity);
            } else {
                detectLocation();
            }
        }
        fetchInitial();
    }, []);

    const fetchVehiclesByCity = async (city) => {
        setLoading(true);
        const searchCity = (city === 'India' || !city) ? '' : city;

        let queryRecent = supabase.from('vehicles').select(`*, vehicle_images(image_url)`).eq('is_live', true).order('created_at', { ascending: false }).limit(4);
        if (searchCity) queryRecent = queryRecent.ilike('location', `%${searchCity}%`);
        const { data: recent } = await queryRecent;

        let queryFeatured = supabase.from('vehicles').select(`*, vehicle_images(image_url)`).eq('is_live', true).order('price', { ascending: false }).limit(4);
        if (searchCity) queryFeatured = queryFeatured.ilike('location', `%${searchCity}%`);
        const { data: featured } = await queryFeatured;

        setRecentVehicles(recent || []);
        setFeaturedVehicles(featured || []);
        setLoading(false);
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            handleLocationFallback('India');
            return;
        }

        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || 'India';
                    setUserCity(city);
                    localStorage.setItem('userCity', city);
                    fetchVehiclesByCity(city);
                } catch (e) {
                    handleLocationFallback('India');
                }
                setDetectingLocation(false);
            },
            () => {
                handleLocationFallback('India');
                setDetectingLocation(false);
            },
            { timeout: 8000 }
        );
    };

    const handleLocationFallback = (defaultCity) => {
        setUserCity(defaultCity);
        fetchVehiclesByCity(defaultCity);
    };

    const handleManualCitySave = (e) => {
        e.preventDefault();
        if (manualCityInput.trim()) {
            setUserCity(manualCityInput);
            localStorage.setItem('userCity', manualCityInput);
            setShowCityModal(false);
            fetchVehiclesByCity(manualCityInput);
            setManualCityInput('');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse?search=${searchQuery}`);
        }
    };

    const categories = [
        { id: 'car', label: 'Car', icon: Car },
        { id: 'bike', label: 'Bike', icon: Bike },
        { id: 'cycle', label: 'Cycle', icon: CircleDot },
        { id: 'truck', label: 'Truck', icon: Truck },
        { id: 'tractor', label: 'Tractor', icon: Tractor },
        { id: 'other', label: 'Other', icon: CircleDot }
    ];

    return (
        <div className="home-container">
            {/* 1. Smart Search Section */}
            <section className="home-section top-search-section">
                <form onSubmit={handleSearch} className="smart-search-bar">
                    <Search size={20} color="#64748B" />
                    <input
                        type="text"
                        placeholder="Search vehicles in your city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <div className="location-indicator">
                    <div className="loc-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={16} color="var(--primary)" />
                        <span>Showing results near: </span>
                        <strong>{detectingLocation ? 'Detecting...' : (userCity || 'India')}</strong>
                    </div>
                    <button className="change-loc-btn" onClick={() => setShowCityModal(true)}>Change</button>
                </div>
            </section>

            {/* City Override Modal */}
            {showCityModal && (
                <div className="modal-overlay">
                    <div className="city-modal animate-slide-up">
                        <div className="modal-header">
                            <h3>Select Your City</h3>
                            <button className="close-btn" onClick={() => setShowCityModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleManualCitySave} className="city-form">
                            <div className="city-input-wrapper">
                                <MapPin size={20} color="#94A3B8" />
                                <input
                                    type="text"
                                    placeholder="Enter your city name"
                                    value={manualCityInput}
                                    onChange={(e) => setManualCityInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={detectLocation}>
                                    {detectingLocation ? 'Detecting...' : 'Auto Detect'}
                                </button>
                                <button type="submit" className="btn-primary" disabled={!manualCityInput.trim()}>
                                    Save City
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Horizontal Category Scroll */}
            <section className="home-section no-side-pad">
                <div className="category-scroll-container">
                    {categories.map((cat) => (
                        <Link to={`/browse?type=${cat.id}`} key={cat.id} className="cat-chip">
                            <div className="cat-chip-icon">
                                <cat.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span>{cat.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. Featured Vehicles */}
            <section className="home-section">
                <div className="section-header">
                    <h2>Featured Vehicles</h2>
                    <Link to="/browse">View All</Link>
                </div>
                {loading || detectingLocation ? (
                    <div className="loading-state">Loading featured...</div>
                ) : featuredVehicles.length === 0 ? (
                    <div className="empty-state">No featured vehicles found in your area.</div>
                ) : (
                    <div className="vehicle-grid-2">
                        {featuredVehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </section>

            {/* 4. Recently Added */}
            <section className="home-section">
                <div className="section-header">
                    <h2>Recently Added</h2>
                    <Link to="/browse">View All</Link>
                </div>
                {loading || detectingLocation ? (
                    <div className="loading-state">Loading recent...</div>
                ) : recentVehicles.length === 0 ? (
                    <div className="empty-state">No recent vehicles found in your area.</div>
                ) : (
                    <div className="vehicle-grid-2">
                        {recentVehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </section>

            {/* 5. Why ApniCar */}
            <section className="home-section why-section">
                <h2>Why ApniCar?</h2>
                <div className="why-grid">
                    <div className="why-card">
                        <div className="icon-wrapper blue">
                            <Handshake size={24} />
                        </div>
                        <p>Direct Owner Deals</p>
                    </div>
                    <div className="why-card">
                        <div className="icon-wrapper green">
                            <BadgeIndianRupee size={24} />
                        </div>
                        <p>Zero Commission</p>
                    </div>
                    <div className="why-card">
                        <div className="icon-wrapper orange">
                            <ShieldCheck size={24} />
                        </div>
                        <p>Trusted Listings</p>
                    </div>
                </div>
            </section>

            <style>{`
                /* Global App Container constraints */
                .home-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    padding-bottom: 32px;
                    padding-top: 16px;
                    font-family: 'Manrope', sans-serif;
                }

                .home-section {
                    padding: 0 16px;
                }
                
                .no-side-pad {
                    padding: 0;
                }

                /* 1. Smart Search */
                .smart-search-bar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #ffffff;
                    border: 1px solid var(--border);
                    padding: 14px 16px;
                    border-radius: 100px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
                    transition: box-shadow 0.2s;
                }
                .smart-search-bar:focus-within {
                    border-color: var(--accent);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
                }
                .smart-search-bar input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: var(--text-main);
                }
                .smart-search-bar input::placeholder {
                    color: #94A3B8;
                    font-weight: 500;
                }
                .location-indicator {
                    margin-top: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #f8fafc;
                    padding: 8px 12px;
                    border-radius: 8px;
                }
                .loc-text {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }
                .loc-text strong {
                    color: var(--primary);
                    font-weight: 800;
                }
                .change-loc-btn {
                    background: none;
                    border: none;
                    color: var(--accent);
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                    padding: 4px 8px;
                    -webkit-tap-highlight-color: transparent;
                }

                /* Modals */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(4px);
                    z-index: 3000;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }
                .city-modal {
                    background: #ffffff;
                    width: 100%;
                    max-width: 480px;
                    border-radius: 20px 20px 0 0;
                    padding: 24px;
                    box-shadow: 0 -8px 24px rgba(0,0,0,0.1);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .modal-header h3 { margin: 0; font-weight: 800; font-size: 1.1rem; color: var(--primary); }
                .close-btn { background: none; border: none; padding: 4px; color: var(--text-muted); }
                
                .city-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #f1f5f9;
                    padding: 0 16px;
                    border-radius: 12px;
                    height: 52px;
                    margin-bottom: 16px;
                }
                .city-input-wrapper input {
                    border: none; background: transparent; outline: none; flex: 1;
                    font-size: 1rem; color: var(--primary); font-weight: 600;
                }
                .modal-actions {
                    display: flex;
                    gap: 12px;
                }
                .btn-secondary {
                    flex: 1;
                    height: 50px;
                    border-radius: 12px;
                    background: #eff6ff;
                    color: #3b82f6;
                    border: none;
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                .btn-primary {
                    flex: 1;
                    height: 50px;
                    border-radius: 12px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                .btn-primary:disabled { opacity: 0.5; }
                .animate-slide-up { animation: slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes slideUpModal {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }

                /* 2. Category Scroll */
                .category-scroll-container {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding: 4px 16px 12px 16px;
                    scrollbar-width: none;
                }
                .category-scroll-container::-webkit-scrollbar {
                    display: none;
                }
                .cat-chip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #ffffff;
                    padding: 10px 16px;
                    border-radius: 100px;
                    border: 1px solid var(--border);
                    text-decoration: none;
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 0.85rem;
                    white-space: nowrap;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
                    transition: transform 0.2s, background 0.2s;
                    -webkit-tap-highlight-color: transparent;
                }
                .cat-chip:active {
                    transform: scale(0.96);
                    background: #f8fafc;
                }
                .cat-chip-icon {
                    color: var(--accent);
                }

                /* 3. & 4. Feeds */
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    margin-bottom: 16px;
                }
                .section-header h2 {
                    margin: 0;
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: var(--primary);
                    letter-spacing: -0.01em;
                }
                .section-header a {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--accent);
                    text-decoration: none;
                }

                .vehicle-grid-2 {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                
                /* Override VehicleCard internal padding for compact 2-col */
                .vehicle-grid-2 .card-body {
                    padding: 10px !important;
                }
                .vehicle-grid-2 .title-price-row {
                    flex-direction: column !important;
                    align-items: flex-start !important;
                    gap: 2px !important;
                }
                .vehicle-grid-2 .vehicle-name {
                    font-size: 0.85rem !important;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                }
                .vehicle-grid-2 .price-tag {
                    align-self: flex-start !important;
                    font-size: 0.95rem !important;
                    padding: 2px 0 !important;
                    background: transparent !important;
                    color: var(--primary) !important;
                }
                .vehicle-grid-2 .spec-row {
                    font-size: 0.65rem !important;
                    flex-wrap: wrap;
                }
                .vehicle-grid-2 .location-row {
                    font-size: 0.7rem !important;
                    margin: 4px 0 !important;
                }

                .loading-state, .empty-state {
                    text-align: center;
                    padding: 30px;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    font-weight: 600;
                    background: #f8fafc;
                    border-radius: 16px;
                }

                /* 5. Why section */
                .why-section h2 {
                    font-size: 1.15rem;
                    font-weight: 800;
                    margin: 0 0 16px 0;
                    color: var(--primary);
                }
                .why-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }
                .why-card {
                    background: #ffffff;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 16px 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }
                .why-card p {
                    margin: 0;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    line-height: 1.2;
                }
                .icon-wrapper {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-wrapper.blue { background: #eff6ff; color: #3b82f6; }
                .icon-wrapper.green { background: #f0fdf4; color: #22c55e; }
                .icon-wrapper.orange { background: #fff7ed; color: #f97316; }
            `}</style>
        </div>
    );
}
