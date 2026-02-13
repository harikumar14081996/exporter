import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './ImageSlider.css';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    cta_text: string;
    image_url: string;
}

const ImageSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const data = await apiService.getSliders();
                if (Array.isArray(data)) {
                    setSlides(data);
                } else {
                    console.error('Sliders data is not an array:', data);
                    // Fallback logic will handle empty state, or stay empty
                    setSlides([]);
                    throw new Error('Invalid data format'); // Trigger catch block for fallback
                }
            } catch (error) {
                console.error('Error fetching sliders:', error);
                // Use default fallback slides on error
                setSlides([
                    {
                        id: 1,
                        title: 'Excellence in Surgical Instruments',
                        subtitle: 'Shahraj Exporter',
                        description: 'Your trusted partner for premium quality surgical instruments worldwide',
                        cta_text: 'Explore Products',
                        image_url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccf?w=1920&q=80',
                    },
                    {
                        id: 2,
                        title: 'Precision Engineering for Medical Excellence',
                        subtitle: 'Medical Grade Quality',
                        description: 'ISO certified surgical instruments manufactured to the highest international standards',
                        cta_text: 'Learn More',
                        image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80',
                    },
                    {
                        id: 3,
                        title: 'Global Trust, Local Service',
                        subtitle: 'Exporting to 70+ Countries',
                        description: 'Delivering premium surgical instruments to healthcare professionals worldwide',
                        cta_text: 'Contact Us',
                        image_url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1920&q=80',
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (loading) {
        return (
            <div className="slider-container" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--primary)', fontSize: '18px' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="slider-container">
            <div className="slider-wrapper">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            background: `linear-gradient(135deg, rgba(0, 102, 204, 0.4) 0%, rgba(0, 73, 153, 0.5) 100%), url(${slide.image_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="slide-overlay">
                            <svg className="slide-pattern" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
                                        <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect x="0" y="0" width="100%" height="100%" fill="url(#hexagons)" />
                            </svg>
                        </div>

                        <div className="container">
                            <div className="slide-content">
                                <span className="slide-subtitle fade-in">{slide.subtitle}</span>
                                <h1 className="slide-title fade-in">{slide.title}</h1>
                                <p className="slide-description fade-in">{slide.description}</p>
                                <a href="#products" className="btn btn-primary slide-cta fade-in">
                                    {slide.cta_text}
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button className="slider-arrow slider-arrow-left" onClick={prevSlide} aria-label="Previous slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <button className="slider-arrow slider-arrow-right" onClick={nextSlide} aria-label="Next slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
