import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Phone, MessageCircle, MapPin, Fuel, Calendar, Gauge, ArrowLeft } from 'lucide-react';

export default function VehicleDetails() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        async function fetchDetails() {
            const { data: v, error } = await supabase
                .from('vehicles')
                .select(`
          *,
          sellers ( name, phone, city ),
          vehicle_images ( image_url )
        `)
                .eq('id', id)
                .single();

            if (error) console.error(error);
            if (v) {
                setVehicle(v);
                // Prioritize image_url, then first image in gallery
                const initialImage = v.image_url || (v.vehicle_images && v.vehicle_images.length > 0 ? v.vehicle_images[0].image_url : null);
                setMainImage(initialImage || 'https://placehold.co/600x400?text=No+Image');
            }
            setLoading(false);
        }
        fetchDetails();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading details...</div>;
    if (!vehicle) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Vehicle not found or removed.</div>;

    // Collect all images
    const images = [];
    if (vehicle.image_url) images.push(vehicle.image_url);
    if (vehicle.vehicle_images) {
        vehicle.vehicle_images.forEach(img => {
            if (!images.includes(img.image_url)) images.push(img.image_url);
        });
    }

    return (
        <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '90vh' }}>
            <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                <ArrowLeft size={18} /> Back to Browse
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '4rem', alignItems: 'start' }}>
                {/* Left: Images */}
                <div>
                    <div style={{ aspectRatio: '16/9', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--border)', background: '#000' }}>
                        <img src={mainImage} alt={vehicle.model} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMainImage(img)}
                                    style={{
                                        flexShrink: 0,
                                        width: '100px',
                                        aspectRatio: '16/9',
                                        borderRadius: '0.5rem',
                                        overflow: 'hidden',
                                        border: mainImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '0.5rem' }}>{vehicle.brand} {vehicle.model}</h1>
                        <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(vehicle.price)}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                            <Calendar className="text-muted" size={20} />
                            <span style={{ fontWeight: 600 }}>{vehicle.year}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                            <Fuel className="text-muted" size={20} />
                            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{vehicle.fuel_type}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                            <Gauge className="text-muted" size={20} />
                            <span style={{ fontWeight: 600 }}>{vehicle.km_driven.toLocaleString()} km</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                            <MapPin className="text-muted" size={20} />
                            <span style={{ fontWeight: 600 }}>{vehicle.location}</span>
                        </div>
                    </div>

                    <div style={{ background: 'white', border: '1px solid var(--border)', padding: '2rem', borderRadius: '1rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Seller Information</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{vehicle.sellers?.name || 'Private Seller'}</p>
                                <p style={{ color: 'var(--text-muted)' }}>{vehicle.sellers?.city || vehicle.location}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <a href={`tel:${vehicle.sellers?.phone}`} className="btn btn-primary" style={{ width: '100%', gap: '0.75rem', padding: '1rem' }}>
                                <Phone size={20} /> Call Seller
                            </a>
                            <a href={`https://wa.me/${vehicle.sellers?.phone}`} target="_blank" rel="noreferrer" className="btn" style={{ width: '100%', gap: '0.75rem', backgroundColor: '#25D366', color: 'white', padding: '1rem' }}>
                                <MessageCircle size={20} /> Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Description</h3>
                        <p style={{ lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{vehicle.description || 'No description provided by the seller.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
