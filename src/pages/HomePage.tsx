import { useState, useEffect } from 'react';
import ImageSlider from '../components/ImageSlider';
import ProductCard from '../components/ProductCard';
import Stats from '../components/Stats';
import { apiService } from '../services/api';
import './HomePage.css';

const HomePage = () => {
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [instruments, setInstruments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [specializationsData, instrumentsData] = await Promise.all([
                    apiService.getSpecializations(),
                    apiService.getInstruments(),
                ]);


                if (Array.isArray(specializationsData)) {
                    setSpecializations(specializationsData.map((item: any) => item.title));
                } else {
                    throw new Error('Specializations data is not an array');
                }

                if (Array.isArray(instrumentsData)) {
                    setInstruments(instrumentsData);
                } else {
                    throw new Error('Instruments data is not an array');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Fallback to default data
                setSpecializations([
                    'Surgical Scissors & Forceps',
                    'Scalpels & Replacement Blades',
                    'Retractors & Surgical Spreaders',
                    'Needle Holders & Suture Materials',
                    'Clamps & Hemostatic Forceps',
                    'Orthopedic Surgical Instruments',
                    'Diagnostic & Examination Tools',
                    'Dental Surgery Instruments',
                    'Ophthalmic Surgical Instruments',
                ]);
                setInstruments([
                    {
                        id: 1,
                        name: 'Surgical Scissors & Forceps',
                        description: 'Precision surgical scissors and forceps for delicate surgical procedures. Premium stainless steel construction.',
                        icon: '✂️',
                    },
                    {
                        id: 2,
                        name: 'Scalpels & Blades',
                        description: 'High-grade surgical scalpels and replacement blades. Superior sharpness and control.',
                        icon: '🔪',
                    },
                    {
                        id: 3,
                        name: 'Retractors & Spreaders',
                        description: 'Self-retaining and handheld retractors for optimal surgical exposure and access.',
                        icon: '🔧',
                    },
                    {
                        id: 4,
                        name: 'Needle Holders & Sutures',
                        description: 'Precision needle holders and surgical suture materials for secure wound closure.',
                        icon: '📌',
                    },
                    {
                        id: 5,
                        name: 'Clamps & Hemostats',
                        description: 'Surgical clamps and hemostatic forceps for controlling bleeding and tissue manipulation.',
                        icon: '🔒',
                    },
                    {
                        id: 6,
                        name: 'Orthopedic Instruments',
                        description: 'Specialized instruments for orthopedic surgery including bone saws, drills, and fixation tools.',
                        icon: '🦴',
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section id="home">
                <ImageSlider />
            </section>

            {/* Specializations Section */}
            <section id="specializations" className="specializations-section">
                <div className="container">
                    <div className="specializations-content">
                        <h2 className="section-title">We Specialize In</h2>
                        <div className="specializations-grid">
                            {specializations.map((item, index) => (
                                <div key={index} className="specialization-item fade-in">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                    </svg>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="products-section bg-gray-50">
                <div className="container">
                    <h2 className="section-title">Our Surgical Instruments</h2>
                    <p className="section-subtitle">
                        Premium quality surgical instruments for medical professionals worldwide
                    </p>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--primary)' }}>
                            Loading instruments...
                        </div>
                    ) : (
                        <div className="products-grid">
                            {instruments.map((product) => (
                                <ProductCard key={product.id} product={{ ...product, title: product.name, category: '' }} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <Stats />
        </div>
    );
};

export default HomePage;
