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
        <div className="details-page-wrapper">
            <div className="container details-inner">
                <Link to="/browse" className="back-link">
                    <ArrowLeft size={18} /> Back to Marketplace
                </Link>

                <div className="details-grid">
                    {/* Left Column: Gallery */}
                    <div className="gallery-section">
                        <div className="main-image-container">
                            <img src={mainImage} alt={`${vehicle.brand} ${vehicle.model}`} className="main-image" />
                        </div>

                        {images.length > 0 && (
                            <div className="thumbnails-scroll">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setMainImage(img)}
                                        className={`thumbnail-btn ${mainImage === img ? 'active' : ''}`}
                                    >
                                        <img src={img} alt={`View ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="info-section">
                        <div className="header-info">
                            <span className="brand-badge">{vehicle.brand}</span>
                            <h1 className="vehicle-title">{vehicle.brand} {vehicle.model}</h1>
                            <div className="price-tag">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(vehicle.price)}
                            </div>
                            <p className="location-text"><MapPin size={16} /> {vehicle.location}</p>
                        </div>

                        <div className="specs-grid-v2">
                            <div className="spec-item-v2">
                                <Calendar size={20} className="spec-icon-v2" />
                                <div className="spec-content-v2">
                                    <label className="spec-label-v2">Year</label>
                                    <span className="spec-value-v2">{vehicle.year}</span>
                                </div>
                            </div>
                            <div className="spec-item-v2">
                                <Fuel size={20} className="spec-icon-v2" />
                                <div className="spec-content-v2">
                                    <label className="spec-label-v2">Fuel</label>
                                    <span className="spec-value-v2">{vehicle.fuel_type}</span>
                                </div>
                            </div>
                            <div className="spec-item-v2">
                                <Gauge size={20} className="spec-icon-v2" />
                                <div className="spec-content-v2">
                                    <label className="spec-label-v2">Distance</label>
                                    <span className="spec-value-v2">{vehicle.km_driven.toLocaleString()} km</span>
                                </div>
                            </div>
                            <div className="spec-item-v2">
                                <Gauge size={20} className="spec-icon-v2" />
                                <div className="spec-content-v2">
                                    <label className="spec-label-v2">Category</label>
                                    <span className="spec-value-v2">{vehicle.vehicle_type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="seller-card-premium">
                            <h3 className="section-label-premium">Seller Network</h3>
                            <div className="seller-info-v2">
                                <div className="seller-avatar-v2">
                                    {vehicle.sellers?.name?.[0] || 'S'}
                                </div>
                                <div>
                                    <p className="seller-name-v2">{vehicle.sellers?.name || 'Private Seller'}</p>
                                    <p className="seller-location-v2">{vehicle.sellers?.city || vehicle.location}</p>
                                </div>
                            </div>

                            <div className="action-btns-v2">
                                <a href={`tel:${vehicle.sellers?.phone}`} className="btn btn-primary btn-call">
                                    <Phone size={20} /> Call Seller Now
                                </a>
                                <a href={`https://wa.me/${vehicle.sellers?.phone}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                                    <MessageCircle size={20} /> Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="description-card-premium">
                            <h3 className="section-label-premium">Listing Overview</h3>
                            <p className="description-text-v2">{vehicle.description || 'No description provided.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .details-page-wrapper {
                    background-color: var(--bg-subtle);
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }

                .details-inner {
                    padding: 2rem 0;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-secondary);
                    font-weight: 700;
                    margin-bottom: 2rem;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                }
                .back-link:hover { color: var(--accent); transform: translateX(-4px); }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1.25fr 0.75fr;
                    gap: 2.5rem;
                    align-items: start;
                }

                /* Gallery Styling */
                .gallery-section {
                    position: sticky;
                    top: 100px;
                }

                .main-image-container {
                    background: #000;
                    border-radius: 12px;
                    overflow: hidden;
                    aspect-ratio: 16/10;
                    margin-bottom: 1rem;
                    box-shadow: var(--shadow-md);
                    border: 1px solid var(--border);
                }

                .main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .thumbnails-scroll {
                    display: flex;
                    gap: 0.75rem;
                    overflow-x: auto;
                    padding-bottom: 0.75rem;
                }

                .thumbnail-btn {
                    flex-shrink: 0;
                    width: 100px;
                    aspect-ratio: 16/10;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid transparent;
                    cursor: pointer;
                    padding: 0;
                    opacity: 0.6;
                    transition: all 0.2s;
                }
                .thumbnail-btn:hover { opacity: 1; }
                .thumbnail-btn.active {
                    border-color: var(--accent);
                    opacity: 1;
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
                }
                .thumbnail-btn img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Info Styling */
                .header-info { margin-bottom: 2.5rem; }
                .brand-badge {
                    display: inline-block;
                    background: #dbeafe;
                    color: var(--accent);
                    padding: 0.35rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                .vehicle-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: var(--primary);
                    line-height: 1.1;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.04em;
                }

                .price-tag {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--accent);
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.02em;
                }

                .location-text {
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                }

                .specs-grid-v2 {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 2.5rem;
                }

                .spec-item-v2 {
                    background: #ffffff;
                    padding: 1.25rem;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .spec-icon-v2 { color: var(--text-secondary); }
                .spec-content-v2 { display: flex; flex-direction: column; }
                .spec-label-v2 { font-size: 0.7rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
                .spec-value-v2 { font-size: 1.05rem; font-weight: 700; color: var(--primary); }

                .seller-card-premium {
                    background: #ffffff;
                    border: 1px solid var(--border);
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2.5rem;
                    box-shadow: var(--shadow-sm);
                }

                .section-label-premium {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 800;
                    margin-bottom: 1.25rem;
                    display: block;
                }

                .seller-info-v2 {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    margin-bottom: 2rem;
                }

                .seller-avatar-v2 {
                    width: 64px;
                    height: 64px;
                    background: var(--bg-subtle);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.5rem;
                    color: var(--text-secondary);
                    border: 2px solid #ffffff;
                    box-shadow: var(--shadow-sm);
                }

                .seller-name-v2 { font-size: 1.25rem; font-weight: 800; color: var(--primary); margin: 0; }
                .seller-location-v2 { color: var(--text-secondary); font-size: 0.95rem; margin-top: 0.25rem; }

                .action-btns-v2 {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .btn-call { background: var(--primary); color: #ffffff; }
                .btn-whatsapp { background: #EBFDF1; color: #16A34A; border: 1px solid #DCFCE7; }
                .btn-whatsapp:hover { background: #DCFCE7; transform: translateY(-1px); }

                .description-card-premium {
                    background: #ffffff;
                    padding: 2rem;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                }

                .description-text-v2 {
                    color: var(--text-secondary);
                    line-height: 1.8;
                    font-size: 1rem;
                    white-space: pre-line;
                }

                /* Responsive Styles */
                @media (max-width: 1024px) {
                    .details-grid { grid-template-columns: 1fr; gap: 2.5rem; }
                    .gallery-section { position: relative; top: 0; }
                    .vehicle-title { font-size: 2.25rem; }
                }

                @media (max-width: 640px) {
                    .vehicle-title { font-size: 1.85rem; }
                    .price-tag { font-size: 1.85rem; }
                    .specs-grid-v2 { grid-template-columns: 1fr; }
                    .seller-card-premium, .description-card-premium { padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
