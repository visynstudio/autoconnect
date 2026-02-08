
import { Link } from 'react-router-dom';
import { MapPin, Fuel, Calendar, Gauge } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
    // Handle image from potential join or direct prop
    const image = vehicle.vehicle_images?.[0]?.image_url || 'https://placehold.co/400x300?text=No+Image';

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <Link to={`/vehicle/${vehicle.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                <img src={image} alt={`${vehicle.brand} ${vehicle.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'rgba(37, 99, 235, 0.9)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '2rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    {formatPrice(vehicle.price)}
                </span>
                <span style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '2rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    letterSpacing: '0.05em'
                }}>
                    {vehicle.vehicle_type}
                </span>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: 1.2, marginBottom: '0.25rem' }}>
                        {vehicle.brand} {vehicle.model}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {vehicle.city || vehicle.location}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={16} color="var(--primary)" />
                        <span>{vehicle.year}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Fuel size={16} color="var(--primary)" />
                        <span style={{ textTransform: 'capitalize' }}>{vehicle.fuel_type}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Gauge size={16} color="var(--primary)" />
                        <span>{vehicle.km_driven?.toLocaleString()} km</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
