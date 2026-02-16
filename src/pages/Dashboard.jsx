import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, PlusCircle, Car, LogOut, Trash2,
    MapPin, Fuel, Calendar, MoreVertical, AlertCircle, X, ChevronRight, Eye, Settings, User
} from 'lucide-react';

export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [sellerProfile, setSellerProfile] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Sidebar state (mobile)
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/seller-login');
                return;
            }
            setUser(user);

            // Fetch seller profile
            const { data: profile } = await supabase
                .from('sellers')
                .select('*')
                .eq('id', user.id)
                .single();
            setSellerProfile(profile);

            // Fetch vehicles
            const { data, error } = await supabase
                .from('vehicles')
                .select(`*, vehicle_images(image_url)`)
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error(error);
            else setVehicles(data || []);

            setLoading(false);
        }
        init();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;

        const { error } = await supabase.from('vehicles').delete().eq('id', id);
        if (!error) {
            setVehicles(vehicles.filter(v => v.id !== id));
        } else {
            alert('Error deleting: ' + error.message);
        }
    };

    const toggleLive = async (vehicle) => {
        const newValue = !vehicle.is_live;
        if (newValue === true) {
            const liveCount = vehicles.filter(v => v.is_live).length;
            if (liveCount >= 5) {
                alert("You cannot activate more than 5 listings.");
                return;
            }
        }
        const { error } = await supabase.from('vehicles').update({ is_live: newValue }).eq('id', vehicle.id);
        if (!error) {
            setVehicles(vehicles.map(v => v.id === vehicle.id ? { ...v, is_live: newValue } : v));
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--primary)', borderRadius: '50%' }}></div>
        </div>
    );

    const liveCount = vehicles.filter(v => v.is_live).length;
    const totalCount = vehicles.length;
    const remainingSlots = 5 - liveCount;
    const isLimitReached = liveCount >= 5;

    return (
        <div className="dashboard-container">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* SIDEBAR */}
            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-brand">Seller Center</span>
                    <button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </Link>
                    <Link to="/add-vehicle" className={`nav-item ${isLimitReached ? 'disabled' : ''}`}>
                        <PlusCircle size={20} />
                        <span>Add Vehicle</span>
                    </Link>
                    <div className="nav-divider"></div>
                    <button onClick={handleLogout} className="nav-item logout">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </nav>

                <div className="sidebar-profile">
                    <div className="profile-inner">
                        <div className="profile-avatar">
                            <User size={20} />
                        </div>
                        <div className="profile-meta">
                            <p className="profile-name">{sellerProfile?.name || 'Seller'}</p>
                            <p className="profile-loc">{sellerProfile?.city}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                {/* Mobile Header Bar */}
                <div className="mobile-header-bar">
                    <button onClick={() => setSidebarOpen(true)} className="mobile-trigger">
                        <LayoutDashboard size={24} />
                    </button>
                    <span className="mobile-title">Dashboard</span>
                </div>

                <div className="dashboard-content">
                    <header className="content-header">
                        <div>
                            <h1 className="page-title">Listing Dashboard</h1>
                            <p className="page-subtitle">Welcome back, {sellerProfile?.name?.split(' ')[0] || 'Seller'}</p>
                        </div>
                        <Link to="/add-vehicle" className={`btn btn-primary dash-cta-btn ${isLimitReached ? 'disabled' : ''}`}>
                            <PlusCircle size={20} />
                            <span>Post New Ad</span>
                        </Link>
                    </header>

                    {/* Stats Section */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-icon-box blue">
                                <Car size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Total Listings</span>
                                <span className="stat-value">{totalCount}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-box green">
                                <Eye size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Active Now</span>
                                <span className="stat-value">{liveCount}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-box orange">
                                <AlertCircle size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Slots Left</span>
                                <span className="stat-value" style={{ color: remainingSlots === 0 ? 'var(--error)' : 'inherit' }}>
                                    {remainingSlots}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="content-body">
                        <div className="body-header">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>My Managed Listings</h2>
                        </div>

                        {vehicles.length === 0 ? (
                            <div className="empty-state-v3">
                                <div className="empty-v3-icon">
                                    <Car size={48} strokeWidth={1} />
                                </div>
                                <h3>No listings created yet</h3>
                                <p>Start selling by posting your first vehicle listing.</p>
                                <Link to="/add-vehicle" className="btn btn-outline">Add Your First Vehicle</Link>
                            </div>
                        ) : (
                            <div className="listings-stack">
                                {vehicles.map(vehicle => (
                                    <div key={vehicle.id} className="listing-card card">
                                        <div className="listing-thumb">
                                            <img
                                                src={vehicle.vehicle_images?.[0]?.image_url || 'https://placehold.co/400x300?text=No+Photo'}
                                                alt={vehicle.model}
                                            />
                                            <div className={`listing-badge ${vehicle.is_live ? 'is-live' : 'is-sold'}`}>
                                                {vehicle.is_live ? 'ACTIVE' : 'OFFLINE'}
                                            </div>
                                        </div>

                                        <div className="listing-info">
                                            <div className="listing-main">
                                                <h3 className="listing-title">{vehicle.year} {vehicle.brand} {vehicle.model}</h3>
                                                <p className="listing-price">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(vehicle.price)}
                                                </p>
                                            </div>
                                            <div className="listing-tags">
                                                <span>{vehicle.km_driven.toLocaleString()} km</span>
                                                <span>{vehicle.fuel_type}</span>
                                                <span>{vehicle.location}</span>
                                            </div>
                                        </div>

                                        <div className="listing-actions">
                                            <button
                                                onClick={() => toggleLive(vehicle)}
                                                className={`btn dash-action-btn ${vehicle.is_live ? 'btn-deactivate' : 'btn-activate'}`}
                                            >
                                                {vehicle.is_live ? 'Mark Sold' : 'Relist'}
                                            </button>
                                            <div className="action-icons">
                                                <Link to={`/vehicle/${vehicle.id}`} className="icon-btn-dash info" title="Preview">
                                                    <Eye size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(vehicle.id)} className="icon-btn-dash danger" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                .dashboard-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: var(--bg-subtle);
                }

                /* Sidebar */
                .dashboard-sidebar {
                    width: 280px;
                    background: #ffffff;
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    z-index: 100;
                    transition: transform 0.3s ease;
                }

                .sidebar-header {
                    padding: 2rem 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .sidebar-brand {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--primary);
                    letter-spacing: -0.02em;
                }

                .sidebar-nav {
                    padding: 0 1rem;
                    flex: 1;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.85rem 1rem;
                    border-radius: 12px;
                    color: var(--text-secondary);
                    font-weight: 700;
                    text-decoration: none;
                    margin-bottom: 0.5rem;
                    transition: all 0.2s;
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                    font-size: 0.95rem;
                }

                .nav-item:hover {
                    background: var(--bg-subtle);
                    color: var(--primary);
                }

                .nav-item.active {
                    background: var(--accent);
                    color: #ffffff;
                }

                .nav-item.logout {
                    color: #ef4444;
                    margin-top: 1rem;
                }

                .nav-item.logout:hover {
                    background: #fee2e2;
                }

                .nav-divider {
                    height: 1px;
                    background: var(--border);
                    margin: 1.5rem 1rem;
                }

                .sidebar-profile {
                    padding: 1.5rem;
                    border-top: 1px solid var(--border);
                }

                .profile-inner {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: var(--bg-subtle);
                    padding: 0.75rem;
                    border-radius: 12px;
                }

                .profile-avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    color: #ffffff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .profile-name { font-weight: 800; font-size: 0.85rem; color: var(--primary); margin: 0; }
                .profile-loc { font-size: 0.75rem; color: var(--text-muted); margin: 0; }

                /* Main Content */
                .dashboard-main {
                    flex: 1;
                    min-width: 0;
                }

                .dashboard-content {
                    padding: 3rem;
                    max-width: 1200px;
                }

                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                }

                /* Stats Row */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }

                .stat-card {
                    background: #ffffff;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    box-shadow: var(--shadow-sm);
                }

                .stat-icon-box {
                    width: 54px;
                    height: 54px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-icon-box.blue { background: #eff6ff; color: #2563eb; }
                .stat-icon-box.green { background: #f0fdf4; color: #16a34a; }
                .stat-icon-box.orange { background: #fff7ed; color: #f97316; }

                .stat-label { display: block; font-size: 0.85rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .stat-value { font-size: 1.75rem; font-weight: 800; color: var(--primary); line-height: 1.2; }

                /* Listings Stack */
                .listings-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .listing-card {
                    display: flex;
                    gap: 1.5rem;
                    padding: 1rem !important;
                    align-items: center;
                }

                .listing-thumb {
                    width: 140px;
                    height: 100px;
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                    flex-shrink: 0;
                    background: var(--bg-subtle);
                }

                .listing-thumb img { width: 100%; height: 100%; object-fit: cover; }

                .listing-badge {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: #ffffff;
                }

                .listing-badge.is-live { background: #16a34a; }
                .listing-badge.is-sold { background: #475569; }

                .listing-info { flex: 1; min-width: 0; }
                .listing-title { font-size: 1.15rem; font-weight: 800; color: var(--primary); margin-bottom: 0.35rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .listing-price { font-size: 1.05rem; font-weight: 700; color: var(--accent); margin-bottom: 0.75rem; }

                .listing-tags { display: flex; gap: 0.5rem; }
                .listing-tags span { background: var(--bg-subtle); color: var(--text-secondary); font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; }

                .listing-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .dash-action-btn { font-size: 0.85rem; height: 40px; padding: 0 1rem; border-radius: 8px; width: 110px; }
                .btn-activate { background: #f0fdf4; color: #16a34a; }
                .btn-activate:hover { background: #dcfce7; }
                .btn-deactivate { background: #fee2e2; color: #dc2626; }
                .btn-deactivate:hover { background: #fecaca; }

                .action-icons { display: flex; gap: 0.5rem; }
                .icon-btn-dash { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border: 1px solid var(--border); color: var(--text-secondary); }
                .icon-btn-dash.info:hover { color: var(--accent); border-color: var(--accent); background: #f0f7ff; }
                .icon-btn-dash.danger:hover { color: #dc2626; border-color: #dc2626; background: #fef2f2; }

                /* Generic */
                .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 90; opacity: 0; pointer-events: none; transition: opacity 0.3s; backdrop-filter: blur(4px); }
                .sidebar-overlay.open { opacity: 1; pointer-events: auto; }
                .mobile-header-bar { display: none; padding: 1rem 1.5rem; background: #ffffff; border-bottom: 1px solid var(--border); align-items: center; gap: 1rem; position: sticky; top: 0; z-index: 80; }
                
                .empty-state-v3 {
                    text-align: center;
                    padding: 4rem 2rem;
                    border: 2px dashed var(--border);
                    border-radius: 12px;
                    background: #ffffff;
                }
                .empty-v3-icon { margin-bottom: 1.5rem; color: var(--text-muted); }

                @media (max-width: 1024px) {
                    .dashboard-sidebar {
                        position: fixed;
                        transform: translateX(-100%);
                    }
                    .dashboard-sidebar.open { transform: translateX(0); }
                    .mobile-header-bar { display: flex; }
                    .dashboard-content { padding: 2rem 1.5rem; }
                    .content-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                    .dash-cta-btn { width: 100%; }
                }

                @media (max-width: 768px) {
                    .stats-row { grid-template-columns: 1fr; }
                    .listing-card { flex-direction: column; align-items: stretch; }
                    .listing-thumb { width: 100%; height: 200px; }
                    .listing-actions { border-top: 1px solid var(--border); padding-top: 1rem; justify-content: space-between; }
                }
            `}</style>
        </div>
    );
}
