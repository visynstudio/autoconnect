
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

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
        <Link
            to={`/vehicle/${vehicle.id}`}
            className="vehicle-card-luxury"
        >
            {/* Image Container */}
            <div className="card-image-wrapper">
                <img
                    src={mainImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    loading="lazy"
                />
                <div className="card-overlay"></div>
            </div>

            {/* Content */}
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">
                        {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="card-price">
                        {formatPrice(vehicle.price)}
                    </p>
                </div>

                <div className="card-specs">
                    <span>{vehicle.year}</span>
                    <span className="dot">•</span>
                    <span style={{ textTransform: 'capitalize' }}>{vehicle.fuel_type}</span>
                    <span className="dot">•</span>
                    <span>{vehicle.km_driven?.toLocaleString()} km</span>
                </div>

                <div className="card-footer">
                    <div className="location-badge">
                        <MapPin size={14} className="icon" />
                        <span>{vehicle.city || vehicle.location}</span>
                    </div>
                </div>
            </div>

            <style>{`
                .vehicle-card-luxury {
                    display: block;
                    background: white;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    overflow: hidden;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .vehicle-card-luxury:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                    border-color: #cbd5e1;
                }

                .card-image-wrapper {
                    position: relative;
                    aspect-ratio: 4/3;
                    overflow: hidden;
                    background: #f1f5f9;
                }

                .card-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .vehicle-card-luxury:hover .card-image-wrapper img {
                    transform: scale(1.05);
                }

                .card-content {
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    gap: 0.75rem;
                }

                .card-header {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .card-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-main);
                    line-height: 1.3;
                    /* Truncate if too long */
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .card-price {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--accent);
                    letter-spacing: -0.02em;
                }

                .card-specs {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .dot { color: #cbd5e1; }

                .card-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .location-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                
                .location-badge .icon { color: var(--text-muted); }
            `}</style>
        </Link>
    );
}
