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
        <div className="details-page-container">
            <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <Link to="/browse" className="back-link">
                    <ArrowLeft size={20} /> Back to Browse
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

                        <div className="specs-grid">
                            <div className="spec-item">
                                <Calendar size={20} className="spec-icon" />
                                <div>
                                    <label>Year</label>
                                    <span>{vehicle.year}</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <Fuel size={20} className="spec-icon" />
                                <div>
                                    <label>Fuel</label>
                                    <span>{vehicle.fuel_type}</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <Gauge size={20} className="spec-icon" />
                                <div>
                                    <label>Distance</label>
                                    <span>{vehicle.km_driven.toLocaleString()} km</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <span className="spec-icon" style={{ fontWeight: '800', fontSize: '14px' }}>type</span>
                                <div>
                                    <label>Type</label>
                                    <span>{vehicle.vehicle_type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="seller-card">
                            <h3 className="section-label">Seller Details</h3>
                            <div className="seller-info">
                                <div className="seller-avatar">
                                    {vehicle.sellers?.name?.[0] || 'S'}
                                </div>
                                <div>
                                    <p className="seller-name">{vehicle.sellers?.name || 'Private Seller'}</p>
                                    <p className="seller-location">{vehicle.sellers?.city || vehicle.location}</p>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <a href={`tel:${vehicle.sellers?.phone}`} className="btn-contact call">
                                    <Phone size={20} /> Call Seller
                                </a>
                                <a href={`https://wa.me/${vehicle.sellers?.phone}`} target="_blank" rel="noreferrer" className="btn-contact whatsapp">
                                    <MessageCircle size={20} /> Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="description-box">
                            <h3 className="section-label">Description</h3>
                            <p className="description-text">{vehicle.description || 'No description provided.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .details-page-container {
                    background-color: #f8fafc;
                    min-height: 100vh;
                    padding-bottom: 4rem;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    font-weight: 600;
                    margin-bottom: 2rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .back-link:hover { color: #0f172a; }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 3rem;
                    align-items: start;
                }

                /* Gallery Styling */
                .gallery-section {
                    position: sticky;
                    top: 2rem;
                }
                .main-image-container {
                    background: #000;
                    border-radius: 1rem;
                    overflow: hidden;
                    aspect-ratio: 16/9;
                    margin-bottom: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
                    padding-bottom: 0.5rem;
                    scrollbar-width: thin;
                }
                .thumbnail-btn {
                    flex-shrink: 0;
                    width: 100px;
                    aspect-ratio: 16/9;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    border: 2px solid transparent;
                    cursor: pointer;
                    padding: 0;
                    opacity: 0.7;
                    transition: all 0.2s;
                }
                .thumbnail-btn:hover { opacity: 1; }
                .thumbnail-btn.active {
                    border-color: #2563eb;
                    opacity: 1;
                }
                .thumbnail-btn img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Info Styling */
                .header-info { margin-bottom: 2rem; }
                .brand-badge {
                    display: inline-block;
                    background: #dbeafe;
                    color: #2563eb;
                    padding: 0.25rem 0.75rem;
                    border-radius: 2rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 0.75rem;
                }
                .vehicle-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.1;
                    margin-bottom: 0.5rem;
                }
                .price-tag {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #2563eb;
                    margin-bottom: 0.5rem;
                }
                .location-text {
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                }

                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .spec-item {
                    background: white;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .spec-icon { color: #64748b; }
                .spec-item div { display: flex; flex-direction: column; }
                .spec-item label { font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
                .spec-item span { font-size: 1rem; font-weight: 600; color: #0f172a; text-transform: capitalize; }

                .seller-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .section-label {
                    font-size: 0.9rem;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }
                .seller-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .seller-avatar {
                    width: 3.5rem;
                    height: 3.5rem;
                    background: #f1f5f9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.5rem;
                    color: #64748b;
                }
                .seller-name { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
                .seller-location { color: #64748b; font-size: 0.9rem; margin: 0; }

                .action-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .btn-contact {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: transform 0.1s;
                }
                .btn-contact:active { transform: scale(0.98); }
                .btn-contact.call { background: #0f172a; color: white; }
                .btn-contact.call:hover { background: #1e293b; }
                .btn-contact.whatsapp { background: #dcfce7; color: #16a34a; }
                .btn-contact.whatsapp:hover { background: #bbf7d0; }

                .description-box {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 1px solid #e2e8f0;
                }
                .description-text {
                    color: #475569;
                    line-height: 1.7;
                    white-space: pre-line;
                }

                /* Responsive Styles */
                @media (max-width: 1024px) {
                    .details-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .gallery-section { position: relative; top: 0; }
                    .vehicle-title { font-size: 2rem; }
                }

                @media (max-width: 640px) {
                    .container { padding: 1.5rem 1rem !important; }
                    .vehicle-title { font-size: 1.75rem; }
                    .price-tag { font-size: 1.75rem; }
                    .specs-grid { grid-template-columns: 1fr; gap: 0.75rem; }
                    .spec-item { padding: 0.75rem; }
                }
            `}</style>
        </div>
    );
}
