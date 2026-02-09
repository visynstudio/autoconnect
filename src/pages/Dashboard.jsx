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
        <div className="dashboard-layout">

            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* SIDEBAR */}
            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#0f172a' }}>My Seller Hub</span>
                    <button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item active">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/add-vehicle" className={`nav-item ${isLimitReached ? 'disabled' : ''}`}>
                        <PlusCircle size={20} /> Add Vehicle
                    </Link>
                    <div className="nav-divider"></div>
                    <button onClick={handleLogout} className="nav-item logout">
                        <LogOut size={20} /> Logout
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} color="#64748b" />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{sellerProfile?.name || 'Seller'}</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{sellerProfile?.city}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn"><LayoutDashboard size={24} /></button>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Dashboard</span>
                </div>

                <div className="dashboard-content">
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 className="page-title">Overview</h1>
                        <p style={{ color: '#64748b' }}>Manage your listings and account status.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon bg-blue"><Car size={24} color="#2563eb" /></div>
                            <div>
                                <p className="stat-label">Total Listings</p>
                                <p className="stat-value">{totalCount}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon bg-green"><Eye size={24} color="#16a34a" /></div>
                            <div>
                                <p className="stat-label">Active Listings</p>
                                <p className="stat-value">{liveCount}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon bg-orange"><PlusCircle size={24} color="#f97316" /></div>
                            <div>
                                <p className="stat-label">Slots Remaining</p>
                                <p className="stat-value" style={{ color: remainingSlots === 0 ? '#ef4444' : '#0f172a' }}>{remainingSlots}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert / CTA */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        {isLimitReached ? (
                            <div className="alert-card error">
                                <AlertCircle size={24} className="alert-icon" />
                                <div>
                                    <h3>Limit Reached</h3>
                                    <p>You have 5 active listings. Mark some as sold to add more.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="alert-card info">
                                <div>
                                    <h3>Boost Your Sales</h3>
                                    <p>List a new vehicle today and reach thousands of buyers.</p>
                                </div>
                                <Link to="/add-vehicle" className="btn btn-primary">Post New Vehicle</Link>
                            </div>
                        )}
                    </div>

                    {/* Listings Table/List */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>My Listings</h2>

                        {vehicles.length === 0 ? (
                            <div className="empty-state">
                                <Car size={48} color="#cbd5e1" strokeWidth={1.5} />
                                <h3>No listings yet</h3>
                                <p>Get started by adding your first vehicle.</p>
                                <Link to="/add-vehicle" className="btn btn-outline">Create Listing</Link>
                            </div>
                        ) : (
                            <div className="vehicle-list">
                                {vehicles.map(vehicle => (
                                    <div key={vehicle.id} className="vehicle-item">
                                        <div className="vehicle-image">
                                            <img
                                                src={vehicle.vehicle_images?.[0]?.image_url || 'https://placehold.co/200?text=No+Image'}
                                                alt={vehicle.model}
                                            />
                                            <span className={`status-badge ${vehicle.is_live ? 'live' : 'sold'}`}>
                                                {vehicle.is_live ? 'LIVE' : 'SOLD'}
                                            </span>
                                        </div>

                                        <div className="vehicle-details">
                                            <h3>{vehicle.year} {vehicle.brand} {vehicle.model}</h3>
                                            <p className="price">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(vehicle.price)}
                                            </p>
                                            <div className="meta-tags">
                                                <span>{vehicle.km_driven} km</span>
                                                <span>{vehicle.fuel_type}</span>
                                                <span>{vehicle.location}</span>
                                            </div>
                                        </div>

                                        <div className="vehicle-actions">
                                            <button onClick={() => toggleLive(vehicle)} className={`action-btn ${vehicle.is_live ? 'mark-sold' : 'mark-live'}`}>
                                                {vehicle.is_live ? 'Mark Sold' : 'Activate'}
                                            </button>
                                            <button onClick={() => handleDelete(vehicle.id)} className="action-btn delete" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                            <Link to={`/vehicle/${vehicle.id}`} className="action-btn view" title="View">
                                                <ChevronRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                .dashboard-layout { display: flex; min-height: 100vh; background: #f8fafc; position: relative; }
                
                /* Sidebar Overlay */
                .sidebar-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.4); z-index: 40;
                    opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
                    backdrop-filter: blur(2px);
                }
                .sidebar-overlay.open { opacity: 1; pointer-events: auto; }

                /* Sidebar */
                .dashboard-sidebar {
                    width: 280px; background: white; border-right: 1px solid #e2e8f0;
                    display: flex; flex-direction: column; height: 100vh; position: sticky; top: 0;
                    padding: 1.5rem; transition: transform 0.3s ease; z-index: 50;
                }
                .sidebar-header { margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: center; }
                .mobile-close { display: none; background: none; border: none; cursor: pointer; color: #64748b; }
                
                .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
                .nav-item {
                    display: flex; alignItems: center; gap: 0.75rem; padding: 0.85rem 1rem;
                    border-radius: 0.5rem; color: #64748b; font-weight: 500; transition: all 0.2s;
                    text-decoration: none; border: none; background: none; width: 100%; text-align: left; font-size:1rem;
                    cursor: pointer;
                }
                .nav-item:hover { background: #f1f5f9; color: #0f172a; }
                .nav-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
                .nav-item.disabled { opacity: 0.5; pointer-events: none; }
                .nav-item.logout { color: #ef4444; }
                .nav-item.logout:hover { background: #fef2f2; }
                .nav-divider { border-top: 1px solid #e2e8f0; margin: 1rem 0; }
                
                .sidebar-footer { border-top: 1px solid #e2e8f0; padding-top: 1.5rem; margin-top: auto; }

                /* Main Content */
                .dashboard-main { flex: 1; width: 100%; }
                .mobile-header { display: none; padding: 1rem; background: white; border-bottom: 1px solid #e2e8f0; align-items: center; gap: 1rem; position: sticky; top: 0; z-index: 30; }
                .mobile-menu-btn { background: none; border: none; cursor: pointer; color: #0f172a; padding: 0.25rem; }
                .page-title { fontSize: 2rem; font-weight: 800; color: #0f172a; }

                .dashboard-content { padding: 3rem; max-width: 1200px; margin: 0 auto; }

                /* Stats */
                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; marginBottom: 2.5rem; }
                .stat-card { background: white; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; }
                .stat-icon { width: 3rem; height: 3rem; borderRadius: 0.75rem; display: flex; alignItems: center; justifyContent: center; flex-shrink: 0; }
                .bg-blue { background: #eff6ff; } .bg-green { background: #f0fdf4; } .bg-orange { background: #ffedd5; }
                .stat-label { color: #64748b; font-size: 0.875rem; font-weight: 500; }
                .stat-value { font-size: 1.5rem; fontWeight: 700; color: #0f172a; line-height: 1.2; }

                /* Alert */
                .alert-card { padding: 1.5rem; border-radius: 1rem; display: flex; align-items: center; gap: 1.5rem; justify-content: space-between; }
                .alert-card.error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
                .alert-card.info { background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); flex-wrap: wrap; }
                .alert-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; }
                .alert-icon { flex-shrink: 0; }
                
                /* Vehicle List */
                .vehicle-list { display: flex; flex-direction: column; gap: 1rem; }
                .vehicle-item { 
                    background: white; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1rem;
                    display: flex; gap: 1.5rem; align-items: center; transition: all 0.2s;
                }
                .vehicle-item:hover { border-color: #cbd5e1; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                
                .vehicle-image { width: 140px; height: 100px; border-radius: 0.75rem; overflow: hidden; position: relative; background: #f1f5f9; flex-shrink: 0; }
                .vehicle-image img { width: 100%; height: 100%; object-fit: cover; }
                .status-badge { position: absolute; top: 0.5rem; left: 0.5rem; font-size: 0.65rem; font-weight: 700; padding: 0.25rem 0.5rem; borderRadius: 0.25rem; text-transform: uppercase; }
                .status-badge.live { background: rgba(22, 163, 74, 0.9); color: white; }
                .status-badge.sold { background: rgba(15, 23, 42, 0.9); color: white; }

                .vehicle-details { flex: 1; min-width: 0; }
                .vehicle-details h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .price { font-size: 1rem; font-weight: 600; color: #2563eb; margin-bottom: 0.5rem; }
                .meta-tags { display: flex; gap: 0.75rem; color: #64748b; font-size: 0.85rem; flex-wrap: wrap; }
                .meta-tags span { background: #f1f5f9; padding: 0.25rem 0.5rem; borderRadius: 0.25rem; }

                .vehicle-actions { display: flex; gap: 0.5rem; align-items: center; }
                .action-btn { 
                    border: none; cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; 
                    display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; transition: all 0.2s;
                }
                .action-btn.mark-sold { background: #fef2f2; color: #dc2626; padding: 0.5rem 1rem; width: 100px; white-space: nowrap; }
                .action-btn.mark-live { background: #f0fdf4; color: #16a34a; padding: 0.5rem 1rem; width: 100px; white-space: nowrap; }
                .action-btn.delete { background: transparent; color: #94a3b8; }
                .action-btn.delete:hover { background: #fef2f2; color: #dc2626; }
                .action-btn.view { background: #f1f5f9; color: #475569; width: 36px; height: 36px; padding: 0; }
                .action-btn.view:hover { background: #e2e8f0; color: #0f172a; }

                .empty-state { text-align: center; padding: 4rem 2rem; background: white; border: 1px dashed #e2e8f0; borderRadius: 1rem; }
                .empty-state h3 { margin-top: 1rem; font-size: 1.25rem; font-weight: 700; color: #0f172a; }
                .empty-state p { color: #64748b; margin-bottom: 1.5rem; }
                .btn-outline { border: 1px solid #e2e8f0; background: white; color: #0f172a; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; display: inline-block; }

                /* Responsive */
                @media (max-width: 1024px) {
                    .dashboard-sidebar { 
                        position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); 
                        box-shadow: 20px 0 50px rgba(0,0,0,0.1); 
                    }
                    .dashboard-sidebar.open { transform: translateX(0); }
                    .mobile-close { display: block; }
                    .mobile-header { display: flex; }
                    .dashboard-content { padding: 1.5rem; }
                    /* Tablet: 2 columns for stats */
                    .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                }

                @media (max-width: 768px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .stat-card { padding: 1rem; }
                    .stat-icon { width: 2.5rem; height: 2.5rem; }
                    
                    .vehicle-item { flex-direction: column; align-items: stretch; gap: 1rem; }
                    .vehicle-image { width: 100%; height: 180px; }
                    
                    /* Actions row on mobile */
                    .vehicle-actions { 
                        justify-content: space-between; 
                        border-top: 1px solid #f1f5f9; 
                        padding-top: 1rem; 
                    }
                    .action-btn.view { width: auto; padding: 0.5rem 1rem; height: auto; border-radius: 0.5rem; flex: 1; }
                    .action-btn.delete { width: auto; padding: 0.5rem 1rem; border: 1px solid #e2e8f0; }
                }

                @media (max-width: 480px) {
                    .page-title { font-size: 1.5rem; }
                    .stats-grid { grid-template-columns: 1fr; }
                    .vehicle-details h3 { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
}
