import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ChevronRight, Camera, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AddVehicle() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [step, setStep] = useState(1); // 1: Basic, 2: Details, 3: Photos

    const [formData, setFormData] = useState({
        vehicle_type: 'car', brand: '', model: '', year: new Date().getFullYear(),
        km_driven: '', fuel_type: 'petrol', price: '', location: '', description: ''
    });

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) {
                navigate('/seller-login');
                return;
            }
            setUser(user);
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

    const nextStep = () => {
        if (step === 1 && (!formData.brand || !formData.model || !formData.year)) return alert('Fill required fields');
        if (step === 2 && (!formData.price || !formData.location || !formData.km_driven)) return alert('Fill required fields');
        setStep(step + 1);
    }

    const handleSubmit = async () => {
        if (images.length < 2) return alert('Please upload at least 2 images');
        setLoading(true);

        try {
            const { count } = await supabase.from('vehicles').select('*', { count: 'exact', head: true })
                .eq('seller_id', user.id).eq('is_live', true);
            if (count >= 5) { alert('Limit reached: 5 active listings max.'); return setLoading(false); }

            const { data: vehicle, error: vehicleError } = await supabase.from('vehicles').insert([{
                seller_id: user.id, vehicle_type: formData.vehicle_type, brand: formData.brand,
                model: formData.model, year: parseInt(formData.year), km_driven: parseInt(formData.km_driven),
                fuel_type: formData.fuel_type, price: parseFloat(formData.price), location: formData.location,
                description: formData.description, is_live: true
            }]).select().single();

            if (vehicleError) throw vehicleError;

            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${vehicle.id}/${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('vehicle-images').upload(fileName, file);
                if (uploadError) continue;
                const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(fileName);
                await supabase.from('vehicle_images').insert({ vehicle_id: vehicle.id, image_url: publicUrl });
            }

            // Dispatch notification for Seller
            await supabase.from('notifications').insert({
                user_id: user.id,
                title: 'Live & Published!',
                message: `Your ${formData.brand} ${formData.model} is now actively listed for buyers to see.`,
                type: 'system'
            });

            // Dispatch notification for Buyers in the same city
            try {
                const { data: locals } = await supabase.from('sellers').select('id').ilike('city', formData.location);
                if (locals && locals.length > 0) {
                    const buyerNotifs = locals.filter(s => s.id !== user.id).map(s => ({
                        user_id: s.id,
                        title: 'New Vehicle in Your City',
                        message: `A new ${formData.brand} ${formData.model} was just listed in ${formData.location}.`,
                        type: 'system'
                    }));
                    if (buyerNotifs.length > 0) {
                        await supabase.from('notifications').insert(buyerNotifs);
                    }
                }
            } catch (err) { /* ignore silently */ }

            navigate('/dashboard');
        } catch (error) {
            alert('Error listing vehicle: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="app-loader">Processing...</div>;

    return (
        <div className="app-sell-flow">
            <div className="sell-header">
                <button className="icon-btn-app" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
                    {step > 1 ? <ArrowLeft size={24} /> : <X size={24} />}
                </button>
                <h2>Step {step} of 3</h2>
                <div style={{ width: 24 }}></div>
            </div>

            <div className="progress-bar-app">
                <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>

            <div className="sell-content">
                {step === 1 && (
                    <div className="step-panel animate-slide">
                        <h1 className="step-title">What are you selling?</h1>
                        <p className="step-sub">Basic vehicle information</p>

                        <label className="app-label">Type</label>
                        <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="app-input">
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                            <option value="truck">Truck</option>
                            <option value="tractor">Tractor</option>
                            <option value="other">Other</option>
                        </select>

                        <label className="app-label">Brand</label>
                        <input type="text" name="brand" placeholder="e.g. Maruti Suzuki" value={formData.brand} onChange={handleChange} className="app-input" />

                        <label className="app-label">Model</label>
                        <input type="text" name="model" placeholder="e.g. Swift Dzire" value={formData.model} onChange={handleChange} className="app-input" />

                        <label className="app-label">Year of Manufacture</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} className="app-input" />
                    </div>
                )}

                {step === 2 && (
                    <div className="step-panel animate-slide">
                        <h1 className="step-title">Vehicle Details</h1>
                        <p className="step-sub">Pricing and specs</p>

                        <label className="app-label">Asking Price (₹)</label>
                        <input type="number" name="price" placeholder="e.g. 550000" value={formData.price} onChange={handleChange} className="app-input" />

                        <label className="app-label">KM Driven</label>
                        <input type="number" name="km_driven" placeholder="e.g. 45000" value={formData.km_driven} onChange={handleChange} className="app-input" />

                        <label className="app-label">Fuel Type</label>
                        <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="app-input">
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="cng">CNG</option>
                            <option value="electric">Electric</option>
                        </select>

                        <label className="app-label">Location (City)</label>
                        <input type="text" name="location" placeholder="e.g. Mumbai, MH" value={formData.location} onChange={handleChange} className="app-input" />

                        <label className="app-label">Description (Optional)</label>
                        <textarea name="description" rows="3" placeholder="Condition, features..." value={formData.description} onChange={handleChange} className="app-input"></textarea>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-panel animate-slide">
                        <h1 className="step-title">Upload Photos</h1>
                        <p className="step-sub">Add 2-5 high quality images</p>

                        <div className="app-upload-box" onClick={() => document.getElementById('camera-input').click()}>
                            <Camera size={40} color="var(--accent)" />
                            <span>Add Photos</span>
                            <input id="camera-input" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>

                        <div className="photo-grid">
                            {previews.map((src, i) => (
                                <div key={i} className="photo-thumb">
                                    <img src={src} alt="Preview" />
                                    <button onClick={() => removeImage(i)} className="remove-photo"><X size={16} color="white" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="sell-sticky-footer">
                {step < 3 ? (
                    <button className="app-btn-full" onClick={nextStep}>Next <ChevronRight size={20} /></button>
                ) : (
                    <button className="app-btn-full btn-success" onClick={handleSubmit}><CheckCircle2 size={20} /> Publish Listing</button>
                )}
            </div>

            <style>{`
                .app-sell-flow {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background: #ffffff;
                }
                .sell-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                }
                .icon-btn-app {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: none;
                    background: var(--bg-subtle);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sell-header h2 { font-size: 1rem; font-weight: 700; color: var(--text-main); margin: 0; }
                .progress-bar-app { height: 4px; background: var(--bg-subtle); width: 100%; }
                .progress-fill { height: 100%; background: var(--accent); transition: width 0.3s; }
                
                .sell-content { padding: 24px 16px; flex: 1; padding-bottom: 100px; }
                .step-title { font-size: 1.5rem; font-weight: 800; color: var(--primary); margin: 0 0 4px 0; }
                .step-sub { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 32px; }
                
                .app-label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px; margin-top: 20px; }
                .app-input {
                    width: 100%; height: 52px; background: var(--bg-subtle); border: 1px solid var(--border);
                    border-radius: 12px; padding: 0 16px; font-size: 1rem; color: var(--text-main); outline: none; transition: border 0.2s;
                }
                .app-input:focus { border-color: var(--accent); }
                textarea.app-input { height: auto; padding: 16px; resize: none; }
                
                .sell-sticky-footer {
                    position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto;
                    padding: 16px; background: white; border-top: 1px solid var(--border); z-index: 100;
                }
                .app-btn-full {
                    width: 100%; height: 56px; border-radius: 14px; background: var(--primary); color: white;
                    font-size: 1.05rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; border: none;
                }
                .btn-success { background: #16A34A; }

                .app-upload-box {
                    background: #eff6ff; border: 2px dashed #bfdbfe; border-radius: 16px; height: 140px;
                    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
                    color: var(--accent); font-weight: 700;
                }
                .hidden { display: none; }
                .photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
                .photo-thumb { aspect-ratio: 1; border-radius: 12px; overflow: hidden; position: relative; }
                .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
                .remove-photo { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.6); border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }

                .animate-slide { animation: slideInX 0.3s forwards; }
                @keyframes slideInX { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                .app-loader { display: flex; align-items: center; justify-content: center; height: 100vh; font-weight: 600; color: var(--text-muted); }
            `}</style>
        </div>
    );
}
