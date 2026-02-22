import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function VehicleCard({ vehicle }) {
    const mainImage = vehicle.vehicle_images?.[0]?.image_url || 'https://placehold.co/600x400?text=No+Image';

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkSavedStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data } = await supabase
                    .from('saved_vehicles')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('vehicle_id', vehicle.id)
                    .single();
                if (data) setIsSaved(true);
            }
        };
        checkSavedStatus();
    }, [vehicle.id]);

    const toggleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/seller-login');
            return;
        }

        if (isSaved) {
            await supabase.from('saved_vehicles').delete()
                .eq('user_id', user.id)
                .eq('vehicle_id', vehicle.id);
            setIsSaved(false);
        } else {
            await supabase.from('saved_vehicles').insert({
                user_id: user.id,
                vehicle_id: vehicle.id
            });
            setIsSaved(true);
        }
    };

    return (
        <Link to={`/vehicle/${vehicle.id}`} className="app-card">
            <div className="card-media">
                <img
                    src={mainImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    loading="lazy"
                />
                <div className="category-badge">
                    {vehicle.vehicle_type}
                </div>
                <button
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    onClick={toggleSave}
                >
                    <Heart
                        size={20}
                        color={isSaved ? '#ef4444' : '#ffffff'}
                        fill={isSaved ? '#ef4444' : 'none'}
                    />
                </button>
            </div>

            <div className="card-body">
                <div className="title-price-row">
                    <h3 className="vehicle-name">
                        {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="price-tag">
                        {formatPrice(vehicle.price)}
                    </div>
                </div>

                <div className="location-row">
                    <MapPin size={14} color="#94A3B8" />
                    <span>{vehicle.city || vehicle.location}</span>
                </div>

                <div className="spec-row">
                    <span>{vehicle.year}</span>
                    <span className="dot">•</span>
                    <span className="fuel-text">{vehicle.fuel_type}</span>
                    <span className="dot">•</span>
                    <span>{vehicle.km_driven?.toLocaleString()} km</span>
                </div>
            </div>

            <style>{`
                .app-card {
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
                    border: 1px solid var(--border);
                    transition: transform 0.2s, box-shadow 0.2s;
                    -webkit-tap-highlight-color: transparent;
                }

                .app-card:active {
                    transform: scale(0.98);
                    box-shadow: 0 1px 4px rgba(0,0,0,0.02);
                }

                .card-media {
                    position: relative;
                    aspect-ratio: 16/10;
                    background: #f1f5f9;
                    overflow: hidden;
                }

                .card-media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .category-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(4px);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #ffffff;
                    letter-spacing: 0.05em;
                }

                .save-btn {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(15, 23, 42, 0.5);
                    backdrop-filter: blur(4px);
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    -webkit-tap-highlight-color: transparent;
                }
                
                .save-btn.saved {
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .card-body {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .title-price-row {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .vehicle-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin: 0;
                    line-height: 1.3;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .price-tag {
                    font-size: 1.35rem;
                    font-weight: 800;
                    color: var(--primary);
                    letter-spacing: -0.02em;
                }

                .location-row {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .spec-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                    margin-top: 4px;
                    background: var(--bg-subtle);
                    padding: 6px 10px;
                    border-radius: 8px;
                    width: fit-content;
                }

                .fuel-text { text-transform: capitalize; }
                .dot { color: var(--border); }
            `}</style>
        </Link>
    );
}
