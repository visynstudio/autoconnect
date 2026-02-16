import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
    const mainImage = vehicle.vehicle_images?.[0]?.image_url || 'https://placehold.co/600x400?text=No+Image';

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="apnicar-card">
            <div className="card-media">
                <img
                    src={mainImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    loading="lazy"
                />
                <div className="category-badge">
                    {vehicle.vehicle_type}
                </div>
            </div>

            <div className="card-body">
                <div className="card-main-info">
                    <h3 className="vehicle-name">
                        {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="price-tag">
                        {formatPrice(vehicle.price)}
                    </div>
                </div>

                <div className="location-info">
                    <MapPin size={14} />
                    <span>{vehicle.city || vehicle.location}</span>
                </div>

                <div className="spec-row">
                    <span>{vehicle.year}</span>
                    <span className="dot">•</span>
                    <span className="fuel-text">{vehicle.fuel_type}</span>
                    <span className="dot">•</span>
                    <span>{vehicle.km_driven?.toLocaleString()} km</span>
                </div>

                <Link to={`/vehicle/${vehicle.id}`} className="view-btn">
                    <span>View Details</span>
                    <ArrowRight size={16} />
                </Link>
            </div>

            <style>{`
                .apnicar-card {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .apnicar-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    border-color: var(--accent);
                }

                .card-media {
                    position: relative;
                    aspect-ratio: 4/3;
                    overflow: hidden;
                    background: #f1f5f9;
                }

                .card-media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .apnicar-card:hover .card-media img {
                    transform: scale(1.1);
                }

                .category-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(4px);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: var(--primary);
                    border: 1px solid rgba(0,0,0,0.05);
                    letter-spacing: 0.05em;
                }

                .card-body {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .card-main-info {
                    margin-bottom: 0.5rem;
                }

                .vehicle-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 0.25rem;
                }

                .price-tag {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: var(--primary);
                    letter-spacing: -0.02em;
                }

                .location-info {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin-bottom: 1rem;
                }

                .spec-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    background: var(--bg-subtle);
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    width: fit-content;
                }

                .fuel-text { text-transform: capitalize; }
                .dot { color: var(--border); }

                .view-btn {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    background: #f8fafc;
                    color: var(--primary);
                    padding: 0.8rem;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    border: 1px solid var(--border);
                    text-decoration: none;
                }

                .view-btn:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
}
