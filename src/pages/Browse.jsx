import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import VehicleCard from '../components/VehicleCard';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Browse() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // State
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        keyword: searchParams.get('city') || '',
        type: searchParams.get('type') || 'all',
        minPrice: '',
        maxPrice: '',
        fuel: 'all'
    });

    // Debounce trigger (optional, simplified here to effect dependency)

    useEffect(() => {
        fetchVehicles();
    }, [filters]); // Re-fetch when filters change (simple implementation)

    async function fetchVehicles() {
        setLoading(true);

        let query = supabase
            .from('vehicles')
            .select(`
        *,
        vehicle_images(image_url)
      `)
            .eq('is_live', true)
            .order('created_at', { ascending: false });

        // Apply Filters
        if (filters.type !== 'all') {
            query = query.eq('vehicle_type', filters.type);
        }
        if (filters.fuel !== 'all') {
            query = query.eq('fuel_type', filters.fuel);
        }
        if (filters.keyword.trim()) {
            // Search in Brand, Model, or City (Location)
            // Supabase 'or' syntax: brand.ilike.%k%,model.ilike.%k%,location.ilike.%k%
            const term = `%${filters.keyword.trim()}%`;
            query = query.or(`brand.ilike.${term},model.ilike.${term},location.ilike.${term}`);
        }
        if (filters.minPrice) {
            query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
            query = query.lte('price', filters.maxPrice);
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
        } else {
            setVehicles(data || []);
        }
        setLoading(false);
    }

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            keyword: '',
            type: 'all',
            minPrice: '',
            maxPrice: '',
            fuel: 'all'
        });
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

            {/* 2. Page Title Header */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
                <div className="container">
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Browse Vehicles</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <p style={{ color: '#64748b' }}>Direct seller contact. No agents. No commission.</p>
                        <button
                            className="mobile-filter-btn btn btn-secondary"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            style={{ gap: '0.5rem' }}
                        >
                            <SlidersHorizontal size={18} /> Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'start', position: 'relative' }}>

                {/* 3. Filter Sidebar (Responsive) */}
                <aside className={`filter-sidebar ${showMobileFilters ? 'open' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={20} /> Filters
                        </h3>
                        <button className="mobile-close-btn" onClick={() => setShowMobileFilters(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Search */}
                        <div>
                            <label className="filter-label">Search</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    name="keyword"
                                    value={filters.keyword}
                                    onChange={handleFilterChange}
                                    placeholder="Brand, Model, City..."
                                    className="input-field"
                                    style={{ paddingLeft: '2.25rem' }}
                                />
                            </div>
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="filter-label">Vehicle Type</label>
                            <select name="type" value={filters.type} onChange={handleFilterChange} className="input-field">
                                <option value="all">All Types</option>
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="cycle">Cycle</option>
                                <option value="truck">Truck</option>
                                <option value="tractor">Tractor</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="filter-label">Price Range (₹)</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Min"
                                    className="input-field"
                                />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Max"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Fuel Type */}
                        <div>
                            <label className="filter-label">Fuel Type</label>
                            <select name="fuel" value={filters.fuel} onChange={handleFilterChange} className="input-field">
                                <option value="all">Any Fuel</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="cng">CNG</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        <button onClick={clearFilters} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Clear All Filters
                        </button>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {showMobileFilters && (
                    <div
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
                        onClick={() => setShowMobileFilters(false)}
                    />
                )}


                {/* 4. Vehicle Grid */}
                <div style={{ flex: 1 }}>

                    {loading ? (
                        <div className="grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} style={{ height: '350px', background: 'white', borderRadius: '1rem', border: '1px solid var(--border)' }} className="skeleton-card">
                                    <div style={{ height: '200px', background: '#e2e8f0', borderRadius: '1rem 1rem 0 0' }} className="skeleton-pulse"></div>
                                    <div style={{ padding: '1rem' }}>
                                        <div style={{ height: '20px', width: '70%', background: '#f1f5f9', marginBottom: '1rem' }} className="skeleton-pulse"></div>
                                        <div style={{ height: '15px', width: '40%', background: '#f1f5f9' }} className="skeleton-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : vehicles.length > 0 ? (
                        <div className="grid-cols-3">
                            {vehicles.map(v => (
                                <VehicleCard key={v.id} vehicle={v} />
                            ))}
                        </div>
                    ) : (
                        // 5. Empty State
                        <div style={{
                            textAlign: 'center', padding: '6rem 2rem', background: 'white',
                            borderRadius: '1rem', border: '1px solid var(--border)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}>
                            <div style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                                <Search size={64} color="#94a3b8" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>No vehicles found</h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem' }}>We couldn't find any listings matching your current filters.</p>
                            <button onClick={clearFilters} className="btn btn-primary">
                                Clear Filters & View All
                            </button>
                        </div>
                    )}

                </div>

            </div>

            {/* Styles for Mobile Drawer & Skeletons */}
            <style>{`
        .skeleton-pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        @media (max-width: 1024px) {
           .grid-cols-3 { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 768px) {
           .grid-cols-3 { grid-template-columns: 1fr !important; }
           .mobile-filter-btn { display: inline-flex !important; }
           
           /* Mobile Filter Sidebar = Drawer */
           .filter-sidebar {
             position: fixed; top: 0; left: 0; bottom: 0; width: 85% !important; z-index: 2000;
             border-radius: 0 !important; transform: translateX(-100%); transition: transform 0.3s ease;
             background: white; padding: 2rem; overflow-y: auto; display: block !important;
             border-right: 1px solid #e2e8f0;
           }
           .filter-sidebar.open { transform: translateX(0); box-shadow: 20px 0 50px rgba(0,0,0,0.1); }
           .mobile-close-btn { display: block !important; background: none; border: none; cursor: pointer; color: #64748b; margin-bottom: 1rem; }
           
           /* Backdrop when open */
           .filter-sidebar.open::before {
             content: ''; position: fixed; top: 0; left: 100%; width: 100vw; height: 100%;
             background: rgba(0,0,0,0.5); pointer-events: none;
           }
        }
      `}</style>
        </div >
    );
}
