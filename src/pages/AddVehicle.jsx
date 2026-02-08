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
        <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
            <h1 className="page-title" style={{ marginBottom: '2rem' }}>Sell Your Vehicle</h1>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Vehicle Type</label>
                        <select name="vehicle_type" className="input-field" value={formData.vehicle_type} onChange={handleChange} required>
                            <option value="" disabled>Select Vehicle Category</option>
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                            <option value="cycle">Cycle</option>
                            <option value="truck">Truck</option>
                            <option value="tractor">Tractor</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Brand</label>
                        <input type="text" name="brand" placeholder="e.g. Maruti, Honda" required className="input-field" onChange={handleChange} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Model</label>
                        <input type="text" name="model" placeholder="e.g. Swift, City" required className="input-field" onChange={handleChange} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Year</label>
                        <input type="number" name="year" min="1990" max={new Date().getFullYear() + 1} defaultValue={new Date().getFullYear()} required className="input-field" onChange={handleChange} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>KM Driven</label>
                        <input type="number" name="km_driven" placeholder="e.g. 50000" required className="input-field" onChange={handleChange} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Fuel Type</label>
                        <select name="fuel_type" className="input-field" value={formData.fuel_type} onChange={handleChange}>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                            <option value="cng">CNG</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Price (₹)</label>
                        <input type="number" name="price" placeholder="e.g. 500000" required className="input-field" onChange={handleChange} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
                        <input type="text" name="location" placeholder="e.g. Mumbai" required className="input-field" onChange={handleChange} />
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                    <textarea name="description" rows="4" className="input-field" placeholder="Describe the condition, features, etc." onChange={handleChange} style={{ resize: 'vertical' }}></textarea>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Photos (Min 2, Max 5)</label>
                    <div style={{ border: '2px dashed var(--border)', padding: '2rem', borderRadius: '1rem', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }} onClick={() => document.getElementById('file-upload').click()}>
                        <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Click to upload images</p>
                        <input id="file-upload" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </div>

                    {previews.length > 0 && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            {previews.map((src, i) => (
                                <div key={i} style={{ position: 'relative', width: '100px', height: '100px' }}>
                                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                    <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                    {loading ? 'Publishing Listing...' : 'List Vehicle Now'}
                </button>
            </form >
        </div >
    );
}
