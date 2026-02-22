import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Phone, MessageCircle, MapPin, Fuel, Calendar, Gauge, ArrowLeft, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehicleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImgIndex, setMainImgIndex] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        async function fetchDetails() {
            setLoading(true);
            const { data: v, error } = await supabase
                .from('vehicles')
                .select(`*, sellers ( name, phone, city ), vehicle_images ( image_url )`)
                .eq('id', id)
                .single();

            if (error) console.error(error);
            if (v) {
                setVehicle(v);

                // View tracking logic to prevent spam
                const viewedVars = JSON.parse(localStorage.getItem('viewedVehicles') || '[]');
                if (!viewedVars.includes(v.id)) {
                    viewedVars.push(v.id);
                    localStorage.setItem('viewedVehicles', JSON.stringify(viewedVars));

                    // Verify visitor is not the seller themselves
                    const { data: { session } } = await supabase.auth.getSession();
                    const isOwner = session?.user?.id === v.seller_id;

                    if (!isOwner && v.seller_id) {
                        try {
                            await supabase.from('notifications').insert({
                                user_id: v.seller_id,
                                title: 'New Viewer',
                                message: `Someone is checking out your ${v.brand} ${v.model}.`,
                                type: 'system'
                            });
                        } catch (e) { /* ignore notification errors */ }
                    }
                }
            }

            setLoading(false);
        }
        fetchDetails();
    }, [id]);

    if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading details...</div>;
    if (!vehicle) return <div style={{ padding: '24px', textAlign: 'center' }}>Vehicle not found.</div>;

    const images = [];
    if (vehicle.image_url) images.push(vehicle.image_url);
    if (vehicle.vehicle_images) {
        vehicle.vehicle_images.forEach(img => {
            if (!images.includes(img.image_url)) images.push(img.image_url);
        });
    }
    if (images.length === 0) images.push('https://placehold.co/600x400?text=No+Image');

    const handleWhatsApp = () => {
        const phone = vehicle.sellers?.phone;
        const msg = `Hi, I am interested in your ${vehicle.brand} ${vehicle.model} listed on ApniCar for ₹${vehicle.price}.`;
        if (phone) window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const handleCall = () => {
        const phone = vehicle.sellers?.phone;
        if (phone) window.location.href = `tel:${phone}`;
    };

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        const index = Math.round(scrollLeft / width);
        if (index !== mainImgIndex) {
            setMainImgIndex(index);
        }
    };

    const scrollToImg = (index) => {
        if (!sliderRef.current) return;
        setMainImgIndex(index);
        sliderRef.current.scrollTo({
            left: sliderRef.current.offsetWidth * index,
            behavior: 'smooth'
        });
    };

    return (
        <div className="app-details-page">
            {/* Top Bar Overlay */}
            <div className="top-nav-overlay">
                <button className="icon-circle" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
                <div className="actions">
                    <button className="icon-circle"><Share2 size={20} /></button>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="app-gallery">
                <div className="gallery-slider" ref={sliderRef} onScroll={handleScroll}>
                    {images.map((img, idx) => (
                        <div key={idx} className="slide">
                            <img src={img} alt={`Vehicle Image ${idx + 1}`} className="slide-img" />
                        </div>
                    ))}
                </div>

                {/* Floating Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            className="gallery-arrow gallery-arrow-left"
                            onClick={() => scrollToImg(Math.max(0, mainImgIndex - 1))}
                            disabled={mainImgIndex === 0}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="gallery-arrow gallery-arrow-right"
                            onClick={() => scrollToImg(Math.min(images.length - 1, mainImgIndex + 1))}
                            disabled={mainImgIndex === images.length - 1}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {images.length > 1 && (
                    <div className="dots-container">
                        {images.map((_, idx) => (
                            <div key={idx} className={`dot ${idx === mainImgIndex ? 'active' : ''}`} onClick={() => scrollToImg(idx)} />
                        ))}
                    </div>
                )}
            </div>

            {/* Main Info */}
            <div className="details-card">
                <div className="header-info">
                    <div className="title-row">
                        <h1>{vehicle.brand} {vehicle.model}</h1>
                        <span className="price">₹{vehicle.price.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="location"><MapPin size={14} /> {vehicle.city || vehicle.location}</p>
                </div>

                <div className="divider"></div>

                {/* Key Specs */}
                <h3 className="section-title">Key Specifications</h3>
                <div className="specs-grid">
                    <div className="spec-item">
                        <Calendar size={20} color="#64748b" />
                        <div>
                            <span>Year</span>
                            <strong>{vehicle.year}</strong>
                        </div>
                    </div>
                    <div className="spec-item">
                        <Fuel size={20} color="#64748b" />
                        <div>
                            <span>Fuel</span>
                            <strong style={{ textTransform: 'capitalize' }}>{vehicle.fuel_type}</strong>
                        </div>
                    </div>
                    <div className="spec-item">
                        <Gauge size={20} color="#64748b" />
                        <div>
                            <span>Driven</span>
                            <strong>{vehicle.km_driven?.toLocaleString() || '-'} km</strong>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Description */}
                <h3 className="section-title">Description</h3>
                <p className="desc-text">{vehicle.description || 'No description provided.'}</p>

                <div className="divider"></div>

                {/* Seller Info */}
                <h3 className="section-title">Seller Details</h3>
                <div className="seller-box">
                    <div className="s-avatar">{vehicle.sellers?.name?.charAt(0) || 'S'}</div>
                    <div className="s-info">
                        <strong>{vehicle.sellers?.name || 'Unknown Seller'}</strong>
                        <span>ApniCar Verified Seller</span>
                    </div>
                </div>

                {/* Spacer to allow scrolling above sticky bar */}
                <div style={{ height: '100px' }}></div>
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky-action-bar">
                <button className="action-btn call-btn" onClick={handleCall}>
                    <Phone size={20} /> Call Seller
                </button>
                <button className="action-btn wa-btn" onClick={handleWhatsApp}>
                    <MessageCircle size={20} /> WhatsApp
                </button>
            </div>

            <style>{`
                .app-details-page {
                    background: #f8fafc;
                    min-height: 100vh;
                    position: relative;
                }

                .top-nav-overlay {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    right: 16px;
                    display: flex;
                    justify-content: space-between;
                    z-index: 10;
                }

                .icon-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.9);
                    backdrop-filter: blur(4px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    border: none;
                    cursor: pointer;
                }

                .app-gallery {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4/3;
                    background: #e2e8f0;
                    overflow: hidden;
                }

                .gallery-slider {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE/Edge */
                    scroll-behavior: smooth;
                }
                
                .gallery-slider::-webkit-scrollbar {
                    display: none; /* Chrome/Safari */
                }

                .slide {
                    flex: 0 0 100%;
                    width: 100%;
                    height: 100%;
                    scroll-snap-align: center;
                }

                .slide-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .gallery-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.85);
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                }
                
                .gallery-arrow:disabled {
                    opacity: 0;
                    pointer-events: none;
                }

                .gallery-arrow-left {
                    left: 16px;
                }

                .gallery-arrow-right {
                    right: 16px;
                }

                .dots-container {
                    position: absolute;
                    bottom: 24px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    background: rgba(255,255,255,0.5);
                    border-radius: 50%;
                }

                .dot.active {
                    background: #ffffff;
                    transform: scale(1.2);
                }

                .details-card {
                    background: #ffffff;
                    border-radius: 20px 20px 0 0;
                    padding: 24px 16px;
                    margin-top: -16px;
                    position: relative;
                    z-index: 5;
                    box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
                }

                .header-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .title-row h1 {
                    font-size: 1.35rem;
                    font-weight: 800;
                    margin: 0;
                    color: var(--primary);
                    flex: 1;
                    padding-right: 12px;
                }

                .title-row .price {
                    font-size: 1.35rem;
                    font-weight: 800;
                    color: var(--accent);
                }

                .location {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                    margin: 4px 0 0 0;
                }

                .divider {
                    height: 1px;
                    background: var(--border);
                    margin: 20px 0;
                }

                .section-title {
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: var(--primary);
                    margin: 0 0 16px 0;
                }

                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }

                .spec-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    background: var(--bg-subtle);
                    padding: 12px;
                    border-radius: 12px;
                    text-align: center;
                }

                .spec-item div {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .spec-item span { font-size: 0.75rem; color: var(--text-secondary); }
                .spec-item strong { font-size: 0.85rem; color: var(--text-main); font-weight: 700; }

                .desc-text {
                    font-size: 0.95rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                    margin: 0;
                }

                .seller-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--bg-subtle);
                    padding: 12px;
                    border-radius: 12px;
                }

                .s-avatar {
                    width: 48px;
                    height: 48px;
                    background: var(--accent);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                .s-info { display: flex; flex-direction: column; }
                .s-info strong { font-size: 1rem; color: var(--primary); }
                .s-info span { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

                .sticky-action-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    max-width: 480px;
                    margin: 0 auto;
                    background: white;
                    padding: 12px 16px;
                    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
                    box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
                    display: flex;
                    gap: 12px;
                    z-index: 100;
                }

                .action-btn {
                    flex: 1;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    border: none;
                }

                .call-btn {
                    background: var(--bg-subtle);
                    color: var(--primary);
                }

                .wa-btn {
                    background: #25D366; /* WhatsApp Green */
                    color: white;
                }
            `}</style>
        </div>
    );
}
