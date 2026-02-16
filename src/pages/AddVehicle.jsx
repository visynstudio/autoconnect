import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';

export default function AddVehicle() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [formData, setFormData] = useState({
        vehicle_type: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        km_driven: '',
        fuel_type: 'petrol',
        price: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) {
                navigate('/seller-login');
                return;
            }
            setUser(user);

            // Proactive limit check
            const { count } = await supabase
                .from('vehicles')
                .select('*', { count: 'exact', head: true })
                .eq('seller_id', user.id)
                .eq('is_live', true);

            if (count >= 5) {
                alert('You have reached the limit of 5 live listings. Please deactivate or delete old listings.');
                navigate('/dashboard');
            }
        });
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (files.length + images.length > 5) {
                alert('Maximum 5 images allowed');
                return;
            }
            setImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length < 2) {
            alert('Please upload at least 2 images');
            return;
        }
        setLoading(true);

        try {
            // 0. Check Max 5 Listings
            const { count, error: countError } = await supabase
                .from('vehicles')
                .select('*', { count: 'exact', head: true })
                .eq('seller_id', user.id)
                .eq('is_live', true);

            if (countError) throw countError;
            if (count >= 5) {
                alert('You have reached the maximum limit of 5 live listings.');
                setLoading(false);
                return;
            }

            // 1. Insert vehicle
            const { data: vehicle, error: vehicleError } = await supabase
                .from('vehicles')
                .insert([{
                    seller_id: user.id,
                    vehicle_type: formData.vehicle_type,
                    brand: formData.brand,
                    model: formData.model,
                    year: parseInt(formData.year),
                    km_driven: parseInt(formData.km_driven),
                    fuel_type: formData.fuel_type,
                    price: parseFloat(formData.price),
                    location: formData.location,
                    description: formData.description,
                    is_live: true
                }])
                .select()
                .single();

            if (vehicleError) throw vehicleError;

            // 2. Upload images
            let firstImageUrl = null;

            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${vehicle.id}/${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('vehicle-images')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('vehicle-images')
                    .getPublicUrl(fileName);

                // Insert into vehicle_images
                await supabase.from('vehicle_images').insert({
                    vehicle_id: vehicle.id,
                    image_url: publicUrl
                });

                if (!firstImageUrl) firstImageUrl = publicUrl;
            }

            // 3. (Removed image_url update on vehicles table as per new schema)

            alert('Vehicle listed successfully!');
            navigate('/dashboard');

        } catch (error) {
            alert('Error listing vehicle: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Processing...</div>;

    return (
        <div className="add-vehicle-wrapper">
            <header className="page-header section-bg">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <button onClick={() => navigate(-1)} className="back-link-v2">
                            <X size={20} /> Cancel
                        </button>
                    </div>
                    <h1 className="page-title">List Your Vehicle</h1>
                    <p className="page-subtitle">Fill in the details to reach thousands of potential buyers</p>
                </div>
            </header>

            <div className="container section">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit} className="card animate-fade-in" style={{ padding: '3rem' }}>
                        <div className="form-grid-v2">
                            <div className="form-group-v2">
                                <label className="field-label">Vehicle Type *</label>
                                <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required className="input-field">
                                    <option value="" disabled>Select Category</option>
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                    <option value="cycle">Cycle</option>
                                    <option value="truck">Truck</option>
                                    <option value="tractor">Tractor</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group-v2">
                                <label className="field-label">Brand *</label>
                                <input type="text" name="brand" placeholder="e.g. Maruti, Honda" required className="input-field" onChange={handleChange} />
                            </div>

                            <div className="form-group-v2">
                                <label className="field-label">Model *</label>
                                <input type="text" name="model" placeholder="e.g. Swift, City" required className="input-field" onChange={handleChange} />
                            </div>

                            <div className="form-group-v2">
                                <label className="field-label">Manufacturing Year *</label>
                                <input type="number" name="year" min="1990" max={new Date().getFullYear() + 1} defaultValue={new Date().getFullYear()} required className="input-field" onChange={handleChange} />
                            </div>

                            <div className="form-group-v2">
                                <label className="field-label">KM Driven *</label>
                                <input type="number" name="km_driven" placeholder="e.g. 45000" required className="input-field" onChange={handleChange} />
                            </div>

                            <div className="form-group-v2">
                                <label className="field-label">Fuel Type *</label>
                                <select name="fuel_type" className="input-field" value={formData.fuel_type} onChange={handleChange}>
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Electric</option>
                                    <option value="cng">CNG</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div className="form-group-v2">
                                <label className="field-label">Asking Price (₹) *</label>
                                <input type="number" name="price" placeholder="e.g. 5,50,000" required className="input-field" onChange={handleChange} />
                            </div>

                            <div className="form-group-v2">
                                <label className="field-label">Current Location *</label>
                                <input type="text" name="location" placeholder="e.g. Mumbai, Maharashtra" required className="input-field" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group-v2" style={{ marginTop: '2rem' }}>
                            <label className="field-label">Detailed Description</label>
                            <textarea
                                name="description"
                                rows="5"
                                className="input-field"
                                style={{ height: 'auto' }}
                                placeholder="Share details about the vehicle's condition, service history, and extra features..."
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="upload-container-v2" style={{ marginTop: '2.5rem' }}>
                            <label className="field-label">Vehicle Photographs (2-5 Photos) *</label>
                            <div
                                className="dropzone-v2"
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <Upload size={32} strokeWidth={1.5} color="var(--accent)" />
                                <div style={{ marginTop: '1rem' }}>
                                    <p style={{ fontWeight: 700, margin: 0 }}>Click to upload images</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Supported: JPG, PNG, WEBP</p>
                                </div>
                                <input id="file-upload" type="file" multiple accept="image/*" className="hidden-input" onChange={handleImageChange} />
                            </div>

                            {previews.length > 0 && (
                                <div className="previews-strip">
                                    {previews.map((src, i) => (
                                        <div key={i} className="preview-thumb">
                                            <img src={src} alt="Thumbnail" />
                                            <button type="button" onClick={() => removeImage(i)} className="delete-thumb">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '3rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '56px', fontSize: '1.05rem' }} disabled={loading}>
                                {loading ? 'Processing Submission...' : 'Publish Listing Now'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .add-vehicle-wrapper {
                    background-color: var(--bg-subtle);
                    min-height: 100vh;
                    padding-bottom: 5rem;
                }

                .back-link-v2 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #fee2e2;
                    color: #dc2626;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .back-link-v2:hover { background: #fecaca; }

                .form-grid-v2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-group-v2 { display: flex; flex-direction: column; gap: 0.5rem; }
                .field-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .dropzone-v2 {
                    border: 2px dashed var(--border);
                    border-radius: 12px;
                    padding: 3rem 1.5rem;
                    text-align: center;
                    background: var(--bg-page);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .dropzone-v2:hover {
                    border-color: var(--accent);
                    background: #f0f7ff;
                }

                .previews-strip {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                }
                .preview-thumb {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid var(--border);
                }
                .preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .delete-thumb {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #ef4444;
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .hidden-input { display: none; }

                @media (max-width: 640px) {
                    .form-grid-v2 { grid-template-columns: 1fr; gap: 1rem; }
                    .card { padding: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}
