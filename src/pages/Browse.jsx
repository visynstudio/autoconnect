import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import VehicleCard from '../components/VehicleCard';
import { Search, Filter, X, SlidersHorizontal, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Browse() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSearch = searchParams.get('search') || '';

    // State
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Search Bar & Filter State
    const [filters, setFilters] = useState({
        keyword: initialSearch,
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
            .select(`*, vehicle_images(image_url)`)
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
        if (filters.sort === 'newest') query = query.order('created_at', { ascending: false });
        else if (filters.sort === 'price_low') query = query.order('price', { ascending: true });
        else if (filters.sort === 'price_high') query = query.order('price', { ascending: false });

        const { data, error } = await query;
        if (error) console.error(error);
        else setVehicles(data || []);

        setLoading(false);
    }

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({ keyword: '', type: 'all', minPrice: '', maxPrice: '', fuel: 'all', sort: 'newest' });
        setShowFilters(false);
    };

    return (
        <div className="app-browse">
            {/* Top Search Area */}
            <div className="browse-header">
                <div className="search-pill">
                    <Search size={18} color="#94A3B8" />
                    <input
                        type="text"
                        name="keyword"
                        placeholder="Search cars, cities..."
                        value={filters.keyword}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>

            {/* Results Header */}
            <div className="results-info">
                <span>{loading ? 'Searching...' : `${vehicles.length} listings found`}</span>
            </div>

            {/* Content Grid */}
            <div className="browse-content">
                {loading ? (
                    <div className="app-grid skeleton-grid">
                        {[1, 2, 3, 4].map(n => <div key={n} className="skeleton-card"></div>)}
                    </div>
                ) : vehicles.length > 0 ? (
                    <div className="app-grid">
                        {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Search size={40} color="#cbd5e1" />
                        <h3>No vehicles found</h3>
                        <p>Try changing your search terms or filters.</p>
                        <button onClick={clearFilters} className="clear-btn">Clear Filters</button>
                    </div>
                )}
            </div>

            {/* Floating Filter Button */}
            <button className="floating-filter-btn" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal size={20} />
                <span>Filters</span>
            </button>

            {/* Filter Bottom Sheet */}
            {showFilters && (
                <>
                    <div className="backdrop" onClick={() => setShowFilters(false)}></div>
                    <div className="bottom-sheet">
                        <div className="sheet-header">
                            <h3>Filters</h3>
                            <button onClick={() => setShowFilters(false)}><X size={24} /></button>
                        </div>

                        <div className="sheet-body">
                            <div className="filter-group">
                                <label>Category</label>
                                <select name="type" value={filters.type} onChange={handleFilterChange}>
                                    <option value="all">Any Category</option>
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                    <option value="truck">Truck</option>
                                    <option value="tractor">Tractor</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Fuel Type</label>
                                <select name="fuel" value={filters.fuel} onChange={handleFilterChange}>
                                    <option value="all">Any Fuel</option>
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="cng">CNG</option>
                                    <option value="electric">Electric</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Price Range</label>
                                <div className="price-inputs">
                                    <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} />
                                    <span>-</span>
                                    <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} />
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>Sort By</label>
                                <select name="sort" value={filters.sort} onChange={handleFilterChange}>
                                    <option value="newest">Newest First</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="sheet-footer">
                            <button className="btn-outline-app" onClick={clearFilters}>Reset</button>
                            <button className="btn-primary-app" onClick={() => setShowFilters(false)}>Apply</button>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                .app-browse {
                    display: flex;
                    flex-direction: column;
                    min-height: calc(100vh - 56px - 60px); /* header + bottom nav approx */
                    background: var(--bg-subtle);
                }

                .browse-header {
                    padding: 16px;
                    display: flex;
                    gap: 12px;
                    background: #ffffff;
                    position: sticky;
                    top: 56px;
                    z-index: 100;
                    border-bottom: 1px solid var(--border);
                }

                .search-pill {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--bg-subtle);
                    padding: 0 16px;
                    border-radius: 999px;
                    height: 44px;
                }

                .search-pill input {
                    border: none;
                    background: transparent;
                    outline: none;
                    width: 100%;
                    font-size: 0.95rem;
                    color: var(--text-main);
                }

                .results-info {
                    padding: 16px;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .browse-content {
                    padding: 0 16px 24px;
                    flex: 1;
                }

                .app-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .floating-filter-btn {
                    position: fixed;
                    bottom: 80px; /* Above BottomNav */
                    right: 50%;
                    transform: translateX(50%);
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 999px;
                    padding: 12px 24px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.4);
                    z-index: 90;
                }

                /* Bottom Sheet */
                .backdrop {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.4);
                    z-index: 1001;
                    animation: fadeIn 0.2s;
                }

                .bottom-sheet {
                    position: fixed;
                    bottom: 0; left: 0; right: 0;
                    max-width: 480px; /* map app container */
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 20px 20px 0 0;
                    z-index: 1002;
                    padding: 24px 20px;
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    max-height: 85vh;
                    overflow-y: auto;
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }

                .sheet-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .sheet-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                }

                .sheet-body {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .filter-group label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .filter-group select, .price-inputs input {
                    width: 100%;
                    height: 44px;
                    border: 1px solid var(--border);
                    border-radius: 10px;
                    padding: 0 12px;
                    background: #ffffff;
                    font-family: inherit;
                    font-size: 0.95rem;
                }

                .price-inputs {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .sheet-footer {
                    display: flex;
                    gap: 12px;
                    margin-top: 8px;
                }

                .btn-primary-app {
                    flex: 2;
                    height: 48px;
                    background: var(--primary);
                    color: white;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .btn-outline-app {
                    flex: 1;
                    height: 48px;
                    background: var(--bg-subtle);
                    color: var(--text-main);
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .skeleton-grid .skeleton-card {
                    height: 280px;
                    background: #e2e8f0;
                    border-radius: 16px;
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.6; }
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                    background: #ffffff;
                    border-radius: 16px;
                }

                .empty-state h3 { font-size: 1.1rem; margin: 16px 0 8px; }
                .empty-state p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px; }
                .clear-btn {
                    color: var(--accent);
                    font-weight: 700;
                    padding: 10px 20px;
                    background: #eff6ff;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
}
