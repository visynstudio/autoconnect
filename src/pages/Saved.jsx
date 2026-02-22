import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import { Bookmark } from 'lucide-react';

export default function Saved() {
    const [savedVehicles, setSavedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSaved = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/seller-login');
                return;
            }

            // Fetch the vehicle details linked to the saved IDs
            const { data, error } = await supabase
                .from('saved_vehicles')
                .select(`
                    id,
                    vehicle_id,
                    vehicles (
                        id,
                        brand,
                        model,
                        year,
                        fuel_type,
                        price,
                        city,
                        location,
                        vehicle_type,
                        km_driven,
                        is_live,
                        vehicle_images ( image_url )
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Filter out any where vehicles might have been deleted, then map to clean vehicle object
                const vehicles = data
                    .filter(s => s.vehicles !== null)
                    .map(s => s.vehicles);
                setSavedVehicles(vehicles);
            }
            setLoading(false);
        };

        fetchSaved();
    }, [navigate]);

    if (loading) {
        return <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading saved vehicles...</div>;
    }

    return (
        <div className="saved-page animate-fade-in">
            <div className="saved-header">
                <div className="title-row">
                    <div className="icon-box">
                        <Bookmark size={24} color="var(--primary)" />
                    </div>
                    <h1>Saved Vehicles</h1>
                </div>
                {savedVehicles.length > 0 && (
                    <span className="count-badge">{savedVehicles.length} Saved</span>
                )}
            </div>

            <div className="saved-content">
                {savedVehicles.length === 0 ? (
                    <div className="empty-saved">
                        <div className="empty-icon-box">
                            <Bookmark size={40} color="#cbd5e1" />
                        </div>
                        <h2>No saved vehicles yet</h2>
                        <p>Hit the heart icon on any car you like to save it here for later.</p>
                        <button className="browse-btn" onClick={() => navigate('/browse')}>
                            Start Browsing
                        </button>
                    </div>
                ) : (
                    <div className="saved-grid">
                        {savedVehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .saved-page {
                    background: #f8fafc;
                    min-height: 100vh;
                    padding-bottom: 24px;
                }

                .saved-header {
                    background: #ffffff;
                    padding: 24px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--border);
                }

                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .icon-box {
                    width: 44px;
                    height: 44px;
                    background: #f1f5f9;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .saved-header h1 {
                    margin: 0;
                    font-size: 1.35rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .count-badge {
                    background: #f1f5f9;
                    color: var(--text-secondary);
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                }

                .saved-content {
                    padding: 16px;
                }

                .saved-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .empty-saved {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
                    border: 1px dashed var(--border);
                    margin-top: 20px;
                }

                .empty-icon-box {
                    width: 80px;
                    height: 80px;
                    background: #f8fafc;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .empty-saved h2 {
                    margin: 0 0 8px 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .empty-saved p {
                    margin: 0 0 24px 0;
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    line-height: 1.5;
                    max-width: 250px;
                }

                .browse-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1rem;
                    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);
                }

                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

            `}</style>
        </div>
    );
}
