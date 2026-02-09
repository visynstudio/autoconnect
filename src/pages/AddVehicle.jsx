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
        <div className="add-vehicle-page">
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                <div className="header-section">
                    <button onClick={() => navigate(-1)} className="back-btn"><X size={20} /> Cancel</button>
                    <h1 className="page-title">Sell Your Vehicle</h1>
                </div>

                <form onSubmit={handleSubmit} className="form-card">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Vehicle Type *</label>
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

                        <div className="form-group">
                            <label>Brand *</label>
                            <input type="text" name="brand" placeholder="e.g. Maruti, Honda" required className="input-field" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Model *</label>
                            <input type="text" name="model" placeholder="e.g. Swift, City" required className="input-field" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Year *</label>
                            <input type="number" name="year" min="1990" max={new Date().getFullYear() + 1} defaultValue={new Date().getFullYear()} required className="input-field" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Distance Driven (km) *</label>
                            <input type="number" name="km_driven" placeholder="e.g. 50000" required className="input-field" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Fuel Type *</label>
                            <select name="fuel_type" className="input-field" value={formData.fuel_type} onChange={handleChange}>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="cng">CNG</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Price (₹) *</label>
                            <input type="number" name="price" placeholder="e.g. 500000" required className="input-field" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Location *</label>
                            <input type="text" name="location" placeholder="e.g. Mumbai, Maharashtra" required className="input-field" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group full-width" style={{ marginTop: '1.5rem' }}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            className="input-field"
                            placeholder="Describe the condition, features, history, or any modifications..."
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="upload-section">
                        <label>Photos (Min 2, Max 5) *</label>
                        <div
                            className="upload-box"
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <Upload size={32} className="upload-icon" />
                            <p className="upload-text">Click to upload vehicle images</p>
                            <p className="upload-subtext">Supported formats: JPG, PNG</p>
                            <input id="file-upload" type="file" multiple accept="image/*" className="hidden-input" onChange={handleImageChange} />
                        </div>

                        {previews.length > 0 && (
                            <div className="preview-grid">
                                {previews.map((src, i) => (
                                    <div key={i} className="preview-card">
                                        <img src={src} alt="Preview" />
                                        <button type="button" onClick={() => removeImage(i)} className="remove-btn">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Publishing Listing...' : 'List Vehicle Now'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .add-vehicle-page {
                    background-color: #f8fafc;
                    min-height: 100vh;
                    padding-bottom: 4rem;
                }
                
                .header-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                }
                .page-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0; }
                .back-btn {
                    display: flex; align-items: center; gap: 0.5rem;
                    background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer;
                    padding: 0.5rem 0;
                }
                .back-btn:hover { color: #0f172a; }

                .form-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 1rem;
                    padding: 2.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-size: 0.9rem; font-weight: 600; color: #334155; }
                
                .input-field {
                    padding: 0.75rem 1rem;
                    border: 1px solid #cbd5e1;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    color: #0f172a;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-field:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                textarea.input-field { resize: vertical; min-height: 100px; }

                .upload-section { margin-top: 2rem; }
                .upload-box {
                    border: 2px dashed #cbd5e1;
                    border-radius: 1rem;
                    padding: 3rem 1rem;
                    text-align: center;
                    cursor: pointer;
                    background: #f8fafc;
                    transition: all 0.2s;
                }
                .upload-box:hover {
                    background: #eff6ff;
                    border-color: #3b82f6;
                }
                .upload-icon { color: #64748b; margin-bottom: 1rem; }
                .upload-text { font-weight: 600; color: #0f172a; margin-bottom: 0.25rem; }
                .upload-subtext { font-size: 0.85rem; color: #64748b; }
                .hidden-input { display: none; }

                .preview-grid {
                    display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;
                }
                .preview-card {
                    position: relative; width: 100px; height: 100px; flex-shrink: 0;
                }
                .preview-card img {
                    width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                }
                .remove-btn {
                    position: absolute; top: -8px; right: -8px;
                    width: 24px; height: 24px; border-radius: 50%;
                    background: #ef4444; color: white; border: 2px solid white;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .form-actions { margin-top: 2.5rem; }
                .submit-btn {
                    width: 100%;
                    background: #2563eb;
                    color: white;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .submit-btn:hover { background: #1d4ed8; }
                .submit-btn:disabled { background: #94a3b8; cursor: not-allowed; }

                /* Responsive */
                @media (max-width: 768px) {
                    .container { padding: 1.5rem 1rem; }
                    .form-card { padding: 1.5rem; }
                    .form-grid { grid-template-columns: 1fr; gap: 1rem; }
                    .page-title { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
