import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import VehicleCard from '../components/VehicleCard';
import { Search, Filter, X, SlidersHorizontal, MapPin, ChevronDown, Eraser, LayoutGrid } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Browse() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // State
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Search Bar & Filter State
    const [tempFilters, setTempFilters] = useState({
        keyword: searchParams.get('city') || '',
        type: searchParams.get('type') || 'all',
        minPrice: '',
        maxPrice: '',
    });

    const [filters, setFilters] = useState({
        keyword: searchParams.get('city') || '',
        type: searchParams.get('type') || 'all',
        minPrice: '',
        maxPrice: '',
        fuel: 'all',
        sort: 'newest'
    });

    useEffect(() => {
        fetchVehicles();
    }, [filters]);

    async function fetchVehicles() {
        setLoading(true);

        let query = supabase
            .from('vehicles')
            .select(`
                *,
                vehicle_images(image_url)
            `)
            .eq('is_live', true);

        // Apply Filters
        if (filters.type !== 'all') {
            query = query.eq('vehicle_type', filters.type);
        }
        if (filters.fuel !== 'all') {
            query = query.eq('fuel_type', filters.fuel);
        }
        if (filters.keyword.trim()) {
            const term = `%${filters.keyword.trim()}%`;
            query = query.or(`brand.ilike.${term},model.ilike.${term},location.ilike.${term},city.ilike.${term}`);
        }
        if (filters.minPrice) {
            query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
            query = query.lte('price', filters.maxPrice);
        }

        // Apply Sorting
        if (filters.sort === 'newest') {
            query = query.order('created_at', { ascending: false });
        } else if (filters.sort === 'price_low') {
            query = query.order('price', { ascending: true });
        } else if (filters.sort === 'price_high') {
            query = query.order('price', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
        } else {
            setVehicles(data || []);
        }
        setLoading(false);
    }

    const handleTempChange = (e) => {
        setTempFilters({ ...tempFilters, [e.target.name]: e.target.value });
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearchClick = () => {
        setFilters({ ...filters, ...tempFilters });
        setShowMobileFilters(false);
    };

    const clearFilters = () => {
        const reset = {
            keyword: '',
            type: 'all',
            minPrice: '',
            maxPrice: '',
            fuel: 'all',
            sort: 'newest'
        };
        setTempFilters({
            keyword: '',
            type: 'all',
            minPrice: '',
            maxPrice: '',
        });
        setFilters(reset);
    };

    return (
        <div className="apnicar-browse">
            {/* 1. Page Header */}
            <header className="page-header section-bg">
                <div className="container animate-fade-in">
                    <h1 className="page-title">Browse Marketplace</h1>
                    <p className="page-subtitle">Find high-quality pre-owned vehicles at direct owner prices</p>
                </div>
            </header>

            {/* 2. Premium Search Bar Section */}
            <section className="search-bar-section">
                <div className="container">
                    <div className="premium-search-bar animate-fade-in">
                        <div className="search-input-group">
                            <div className="input-wrapper">
                                <MapPin size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="keyword"
                                    placeholder="Enter City..."
                                    className="search-input"
                                    value={tempFilters.keyword}
                                    onChange={handleTempChange}
                                />
                            </div>

                            <div className="input-divider"></div>

                            <div className="input-wrapper">
                                <LayoutGrid size={18} className="input-icon" />
                                <select
                                    name="type"
                                    className="search-select"
                                    value={tempFilters.type}
                                    onChange={handleTempChange}
                                >
                                    <option value="all">Category</option>
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                    <option value="cycle">Cycle</option>
                                    <option value="truck">Truck</option>
                                    <option value="tractor">Tractor</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="input-divider"></div>

                            <div className="price-inputs-group">
                                <input
                                    type="number"
                                    name="minPrice"
                                    placeholder="Min Price"
                                    className="search-input price-input"
                                    value={tempFilters.minPrice}
                                    onChange={handleTempChange}
                                />
                                <span className="price-sep">-</span>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    placeholder="Max Price"
                                    className="search-input price-input"
                                    value={tempFilters.maxPrice}
                                    onChange={handleTempChange}
                                />
                            </div>

                            <button onClick={handleSearchClick} className="btn btn-primary main-search-btn">
                                <Search size={20} />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container main-content-wrapper">
                <div className="browse-layout-v2">
                    {/* 3. Sidebar Filter (Desktop) */}
                    <aside className={`sidebar-filter-v2 ${showMobileFilters ? 'open' : ''}`}>
                        <div className="sidebar-header-v2">
                            <h3><Filter size={20} /> Advanced Filters</h3>
                            <button className="mobile-close-btn-v2" onClick={() => setShowMobileFilters(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="filter-group-v2">
                            <label className="filter-label">Fuel Type</label>
                            <select name="fuel" value={filters.fuel} onChange={handleFilterChange} className="input-field-sm-v2">
                                <option value="all">Any Fuel</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="cng">CNG</option>
                                <option value="electric">Electric</option>
                            </select>
                        </div>

                        <div className="filter-group-v2">
                            <label className="filter-label">Sort By</label>
                            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="input-field-sm-v2">
                                <option value="newest">Newest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>

                        <button onClick={clearFilters} className="clear-filters-btn-v2">
                            <Eraser size={16} /> Clear All
                        </button>
                    </aside>

                    {/* 4. Results Grid */}
                    <div className="results-panel">
                        <div className="results-header-v2">
                            <p className="results-count-v2">
                                Showing <strong>{loading ? '...' : vehicles.length}</strong> vehicles in marketplace
                            </p>
                            <button
                                className="mobile-filter-trigger-v2"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <SlidersHorizontal size={18} /> Filters
                            </button>
                        </div>

                        {loading ? (
                            <div className="grid-3-2-1">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="skeleton-card-v2">
                                        <div className="skeleton-img"></div>
                                        <div className="skeleton-body">
                                            <div className="skeleton-title"></div>
                                            <div className="skeleton-price"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : vehicles.length > 0 ? (
                            <div className="grid-3-2-1 animate-fade-in">
                                {vehicles.map(v => (
                                    <VehicleCard key={v.id} vehicle={v} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state-v2">
                                <div className="empty-icon-v2">
                                    <Search size={48} />
                                </div>
                                <h2>No vehicles found in this city</h2>
                                <p>Try adjusting your search filters or clear them to see all available vehicles.</p>
                                <button onClick={clearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {showMobileFilters && (
                <div className="mobile-backdrop-v2" onClick={() => setShowMobileFilters(false)}></div>
            )}

            <style>{`
                .apnicar-browse {
                    background-color: var(--bg-subtle);
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }

                /* Premium Search Bar Section */
                .search-bar-section {
                    margin-top: -32px;
                    margin-bottom: 3rem;
                    position: relative;
                    z-index: 20;
                }

                .premium-search-bar {
                    background: #ffffff;
                    padding: 8px;
                    border-radius: 12px;
                    box-shadow: var(--shadow-premium);
                    border: 1px solid var(--border);
                }

                .search-input-group {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }

                .input-wrapper {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    padding: 0 1.25rem;
                    position: relative;
                }

                .input-icon {
                    color: var(--accent);
                    margin-right: 0.75rem;
                }

                .search-input, .search-select {
                    width: 100%;
                    height: 48px;
                    border: none;
                    background: transparent;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-main);
                    outline: none;
                }

                .price-inputs-group {
                    flex: 1.2;
                    display: flex;
                    align-items: center;
                    padding: 0 1.25rem;
                }

                .price-input {
                    text-align: center;
                }

                .price-sep {
                    margin: 0 0.5rem;
                    color: var(--text-muted);
                    font-weight: 700;
                }

                .input-divider {
                    width: 1px;
                    height: 24px;
                    background-color: var(--border);
                }

                .main-search-btn {
                    height: 48px;
                    padding: 0 2rem;
                    border-radius: 10px;
                }

                /* Layout */
                .browse-layout-v2 {
                    display: flex;
                    gap: 2.5rem;
                    align-items: flex-start;
                }

                /* Sidebar */
                .sidebar-filter-v2 {
                    width: 280px;
                    flex-shrink: 0;
                    background: #ffffff;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    position: sticky;
                    top: 100px;
                }

                .sidebar-header-v2 h3 {
                    font-size: 1.1rem;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary);
                }

                .filter-group-v2 {
                    margin-bottom: 1.25rem;
                }

                .input-field-sm-v2 {
                    width: 100%;
                    height: 42px;
                    padding: 0 0.75rem;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    background-color: var(--bg-subtle);
                }

                .clear-filters-btn-v2 {
                    width: 100%;
                    margin-top: 1rem;
                    height: 42px;
                    background: transparent;
                    color: #ef4444;
                    border: 1px solid #fee2e2;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                    cursor: pointer;
                }

                .clear-filters-btn-v2:hover {
                    background: #fef2f2;
                }

                /* Results Panel */
                .results-panel {
                    flex: 1;
                }

                .results-header-v2 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .results-count-v2 {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                }

                .mobile-close-btn-v2, .mobile-filter-trigger-v2 {
                    display: none;
                }

                /* Empty State */
                .empty-state-v2 {
                    text-align: center;
                    padding: 5rem 2rem;
                    background: #ffffff;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                }

                .empty-icon-v2 {
                    width: 72px;
                    height: 72px;
                    background: var(--bg-subtle);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.25rem;
                    color: var(--text-muted);
                }

                .empty-state-v2 h2 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                }

                /* Mobile Filter Backdrop */
                .mobile-backdrop-v2 {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                    backdrop-filter: blur(4px);
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .search-bar-section { margin-top: -24px; }
                    .search-input-group { flex-direction: column; padding: 0.5rem; gap: 0.5rem; }
                    .input-divider { display: none; }
                    .input-wrapper, .price-inputs-group { width: 100%; border-bottom: 1px solid var(--border); padding: 0.75rem 1rem; }
                    .main-search-btn { width: 100%; }
                    
                    .sidebar-filter-v2 {
                        position: fixed;
                        top: 0; left: 0; bottom: 0;
                        z-index: 1000;
                        width: 100%;
                        max-width: 320px;
                        border-radius: 0;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        margin: 0;
                    }

                    .sidebar-filter-v2.open { transform: translateX(0); }
                    .mobile-close-btn-v2 { display: block; background: none; border: none; }
                    .mobile-filter-trigger-v2 { 
                        display: flex; align-items: center; gap: 0.5rem; 
                        padding: 0 1.25rem; height: 40px; background: var(--primary); color: #ffffff;
                        border-radius: 10px; font-weight: 700; font-size: 0.85rem;
                    }
                }

                @media (max-width: 768px) {
                    .input-wrapper, .price-inputs-group { border-bottom: none; }
                    .input-wrapper:not(:last-child) { border-bottom: 1px solid var(--border); }
                    .price-inputs-group:not(:last-child) { border-bottom: 1px solid var(--border); }
                }

                .skeleton-card-v2 { background: white; border-radius: 12px; height: 350px; border: 1px solid var(--border); }
                .skeleton-img { height: 200px; background: #e2e8f0; border-radius: 12px 12px 0 0; }
                .skeleton-body { padding: 1.5rem; }
                .skeleton-title { height: 20px; width: 80%; background: #f1f5f9; margin-bottom: 1rem; }
                .skeleton-price { height: 25px; width: 40%; background: #f1f5f9; }
            `}</style>
        </div>
    );
}
