import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut, ChevronRight, User, Settings, Eye, Trash2, X, Phone, MapPin, Edit3 } from 'lucide-react';

export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [sellerProfile, setSellerProfile] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', city: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        const vehicle = vehicles.find(v => v.id === id);

        const { error } = await supabase.from('vehicles').delete().eq('id', id);
        if (!error) {
            setVehicles(vehicles.filter(v => v.id !== id));
            // Dispatch Notification
            if (vehicle) {
                await supabase.from('notifications').insert({
                    user_id: user.id,
                    title: 'Listing Deleted',
                    message: `Your ${vehicle.brand} ${vehicle.model} has been successfully deleted from our records.`,
                    type: 'system'
                });
            }
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

    const handleEditPrice = async (vehicle) => {
        const newPrice = window.prompt(`Update your asking price for ${vehicle.brand} ${vehicle.model}:`, vehicle.price);
        if (!newPrice) return;
        const parsedPrice = parseFloat(newPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) return alert('Invalid price');

        const { error } = await supabase.from('vehicles').update({ price: parsedPrice }).eq('id', vehicle.id);
        if (!error) {
            setVehicles(vehicles.map(v => v.id === vehicle.id ? { ...v, price: parsedPrice } : v));

            // Notify local buyers of price drop if newPrice < oldPrice
            if (parsedPrice < vehicle.price) {
                try {
                    const { data: locals } = await supabase.from('sellers').select('id').ilike('city', vehicle.location);
                    if (locals && locals.length > 0) {
                        const buyerNotifs = locals.filter(s => s.id !== user.id).map(s => ({
                            user_id: s.id,
                            title: 'Price Drop Alert',
                            message: `The ${vehicle.brand} ${vehicle.model} in ${vehicle.location} just dropped to ₹${parsedPrice.toLocaleString('en-IN')}.`,
                            type: 'system'
                        }));
                        if (buyerNotifs.length > 0) {
                            await supabase.from('notifications').insert(buyerNotifs);
                        }
                    }
                } catch (e) { }
            }
        } else {
            alert('Failed to update price');
        }
    };

    const openSettings = () => {
        setEditForm({
            name: sellerProfile?.name || '',
            phone: sellerProfile?.phone || '',
            city: sellerProfile?.city || ''
        });
        setIsEditingProfile(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        const { error } = await supabase
            .from('sellers')
            .upsert({
                id: user.id,
                name: editForm.name,
                phone: editForm.phone,
                city: editForm.city
            }, { onConflict: 'id' });

        if (!error) {
            setSellerProfile(prev => ({ ...prev, name: editForm.name, phone: editForm.phone, city: editForm.city }));
            setIsEditingProfile(false);
        } else {
            alert('Failed to update profile: ' + error.message);
        }
        setSavingProfile(false);
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-muted)' }}>
            Loading Profile...
        </div>
    );

    const liveCount = vehicles.filter(v => v.is_live).length;
    const isLimitReached = liveCount >= 5;

    return (
        <div className="app-profile">
            {/* Header Area */}
            <div className="profile-header">
                <h2>Profile</h2>
                <button className="settings-btn" onClick={openSettings}><Settings size={20} color="var(--primary)" /></button>
            </div>

            {/* User Info Card */}
            <div className="user-info-section">
                <div className="user-avatar">
                    <User size={36} color="white" />
                </div>
                <div className="user-details">
                    <h3>{sellerProfile?.name || 'ApniCar User'}</h3>
                    <p>{sellerProfile?.city || 'No Location'}</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-row">
                <div className="stat-pill">
                    <strong>{vehicles.length}</strong>
                    <span>Total Ads</span>
                </div>
                <div className="stat-pill">
                    <strong>{liveCount}/5</strong>
                    <span>Live Ads</span>
                </div>
            </div>

            {/* Actions List */}
            <div className="action-list">
                <Link to="/add-vehicle" className="action-item" onClick={(e) => { if (isLimitReached) { e.preventDefault(); alert("You reached the 5 live listings limit."); } }}>
                    <div className="icon-bg" style={{ background: '#dbeafe', color: '#2563eb' }}>
                        <PlusCircle size={20} />
                    </div>
                    <span>Post New Ad</span>
                    <ChevronRight size={18} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                </Link>
                <button onClick={handleLogout} className="action-item logout-item">
                    <div className="icon-bg" style={{ background: '#fee2e2', color: '#ef4444' }}>
                        <LogOut size={20} />
                    </div>
                    <span>Log Out</span>
                    <ChevronRight size={18} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                </button>
            </div>

            <div className="divider-thick"></div>

            {/* My Garage */}
            <div className="garage-section">
                <h3 className="section-title">My Garage</h3>
                {vehicles.length === 0 ? (
                    <div className="empty-garage">
                        <img src="https://placehold.co/100x100/f8fafc/cbd5e1?text=Car" alt="Empty" style={{ borderRadius: '50%' }} />
                        <p>No listings created yet</p>
                    </div>
                ) : (
                    <div className="garage-list">
                        {vehicles.map(v => (
                            <div key={v.id} className="garage-item">
                                <img src={v.vehicle_images?.[0]?.image_url || 'https://placehold.co/200x200?text=No+Photo'} alt={v.model} />
                                <div className="garage-info">
                                    <h4 className="g-title">{v.brand} {v.model}</h4>
                                    <span className="g-price">₹{v.price.toLocaleString('en-IN')}</span>
                                    <div className="g-status-block">
                                        <span className={`g-status ${v.is_live ? 'live' : 'offline'}`}>
                                            {v.is_live ? 'Active' : 'Offline'}
                                        </span>
                                    </div>
                                    <div className="g-actions">
                                        <button className={`g-btn ${v.is_live ? 'outline' : 'fill'}`} onClick={() => toggleLive(v)}>
                                            {v.is_live ? 'Deactivate' : 'Publish'}
                                        </button>
                                        <button className="g-icon-btn edit" onClick={() => handleEditPrice(v)}><Edit3 size={16} /></button>
                                        <Link to={`/vehicle/${v.id}`} className="g-icon-btn"><Eye size={16} /></Link>
                                        <button className="g-icon-btn delete" onClick={() => handleDelete(v.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Profile Drawer */}
            {isEditingProfile && (
                <div className="edit-drawer animate-slide-up">
                    <div className="drawer-header">
                        <button className="drawer-close" onClick={() => setIsEditingProfile(false)}>
                            <X size={24} />
                        </button>
                        <h2>Edit Profile</h2>
                        <div style={{ width: 44 }}></div>
                    </div>
                    <div className="drawer-content">
                        <form onSubmit={handleSaveProfile} className="edit-form-flex">
                            <div className="edit-input-group">
                                <label>Full Name</label>
                                <div className="edit-input-wrapper">
                                    <User size={20} color="#94a3b8" />
                                    <input
                                        type="text" required
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="edit-input-group">
                                <label>Phone Number</label>
                                <div className="edit-input-wrapper">
                                    <Phone size={20} color="#94a3b8" />
                                    <input
                                        type="tel" required
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="edit-input-group">
                                <label>City</label>
                                <div className="edit-input-wrapper">
                                    <MapPin size={20} color="#94a3b8" />
                                    <input
                                        type="text" required
                                        value={editForm.city}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={savingProfile} className="drawer-save-btn">
                                {savingProfile ? 'Saving...' : 'Save Details'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .app-profile {
                    background: #f8fafc;
                    min-height: calc(100vh - 56px - 60px);
                    display: flex;
                    flex-direction: column;
                }

                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: white;
                }

                .profile-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .settings-btn {
                    padding: 8px;
                    background: var(--bg-subtle);
                    border-radius: 50%;
                    border: none;
                }

                .user-info-section {
                    display: flex;
                    align-items: center;
                    padding: 24px 16px;
                    background: white;
                    gap: 16px;
                }

                .user-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: var(--accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(37,99,235,0.2);
                }

                .user-details h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .user-details p {
                    margin: 4px 0 0 0;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .stats-row {
                    display: flex;
                    gap: 12px;
                    padding: 0 16px 20px;
                    background: white;
                }

                .stat-pill {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: var(--bg-subtle);
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                }

                .stat-pill strong { font-size: 1.25rem; color: var(--primary); font-weight: 800; }
                .stat-pill span { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-top: 4px;}

                /* Drawer Styles */
                .edit-drawer {
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    max-width: 480px;
                    margin: 0 auto;
                    background: #ffffff;
                    z-index: 2000;
                    display: flex;
                    flex-direction: column;
                }
                .drawer-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid var(--border);
                }
                .drawer-header h2 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--primary);
                }
                .drawer-close {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: var(--bg-subtle);
                    color: var(--primary);
                    border: none;
                }
                .drawer-content {
                    padding: 24px;
                    flex: 1;
                    overflow-y: auto;
                }
                .edit-form-flex {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .edit-input-group label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .edit-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--bg-subtle);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 0 16px;
                    height: 56px;
                    transition: border-color 0.2s;
                }
                .edit-input-wrapper:focus-within {
                    border-color: var(--accent);
                }
                .edit-input-wrapper input {
                    flex: 1;
                    height: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    color: var(--primary);
                    font-weight: 500;
                    width: 100%;
                }
                .drawer-save-btn {
                    margin-top: 24px;
                    height: 56px;
                    border-radius: 16px;
                    background: var(--primary);
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border: none;
                    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);
                }
                .drawer-save-btn:disabled {
                    opacity: 0.7;
                }
                .animate-slide-up {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(100%); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .action-list {
                    background: white;
                    padding: 0 16px 16px;
                }

                .action-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: var(--bg-subtle);
                    border-radius: 16px;
                    margin-bottom: 12px;
                    text-decoration: none;
                    border: 1px solid var(--border);
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                }

                .action-item span {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--primary);
                }

                .icon-bg {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .divider-thick {
                    height: 8px;
                    background: var(--border);
                    opacity: 0.5;
                }

                .garage-section {
                    padding: 24px 16px;
                    background: white;
                    flex: 1;
                }

                .section-title {
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin: 0 0 16px 0;
                }

                .empty-garage {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding: 40px 0;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .garage-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .garage-item {
                    display: flex;
                    gap: 16px;
                    padding: 12px;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    background: #ffffff;
                }

                .garage-item img {
                    width: 100px;
                    height: 100px;
                    border-radius: 12px;
                    object-fit: cover;
                }

                .garage-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .g-title {
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .g-price {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--accent);
                    margin-top: 2px;
                }

                .g-status-block { margin-top: 6px; }

                .g-status {
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    padding: 4px 8px;
                    border-radius: 6px;
                }

                .g-status.live { background: #dcfce7; color: #166534; }
                .g-status.offline { background: #f1f5f9; color: #475569; }

                .g-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: auto;
                    padding-top: 8px;
                }

                .g-btn {
                    flex: 1;
                    height: 32px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                }

                .g-btn.fill { background: var(--primary); color: white; border: none; }
                .g-btn.outline { background: transparent; color: var(--primary); border: 1px solid var(--primary); }

                .g-icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: var(--bg-subtle);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    border: 1px solid var(--border);
                }

                .g-icon-btn.delete { color: #ef4444; border-color: #fee2e2; background: #fef2f2; }

            `}</style>
        </div>
    );
}
