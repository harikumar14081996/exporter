import { useEffect, useState, useRef } from 'react';
import { apiService } from '../services/api';
import './Stats.css';

interface Stat {
    id: number;
    value: number;
    label: string;
    suffix: string;
    icon: string;
}

const Stats = () => {
    const [counts, setCounts] = useState<Record<number, number>>({});
    const [hasAnimated, setHasAnimated] = useState(false);
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiService.getStats();
                if (Array.isArray(data)) {
                    setStats(data);
                } else {
                    throw new Error('Stats data is not an array');
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                // Fallback to default stats
                setStats([
                    { id: 1, value: 70, label: 'Countries Served', suffix: '+', icon: '🌍' },
                    { id: 2, value: 5000, label: 'Products', suffix: '+', icon: '⚕️' },
                    { id: 3, value: 100, label: 'Quality Assurance', suffix: '%', icon: '✓' },
                    { id: 4, value: 25, label: 'Years Experience', suffix: '+', icon: '⭐' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        if (stats.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateCounters();
                }
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated, stats]);

    const animateCounters = () => {
        stats.forEach((stat) => {
            const duration = 2000;
            const steps = 60;
            const increment = stat.value / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                current += increment;
                step++;

                if (step >= steps) {
                    current = stat.value;
                    clearInterval(timer);
                }

                setCounts((prev) => ({
                    ...prev,
                    [stat.id]: Math.floor(current),
                }));
            }, duration / steps);
        });
    };

    if (loading) {
        return (
            <section className="stats-section">
                <div className="stats-overlay">
                    <div className="container">
                        <div style={{ textAlign: 'center', color: 'white', padding: '3rem 0' }}>Loading...</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="stats-section" ref={statsRef}>
            <div className="stats-overlay">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat) => (
                            <div key={stat.id} className="stat-item" style={{ animationDelay: `${stat.id * 0.1}s` }}>
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-value">
                                    {counts[stat.id] || 0}
                                    <span className="stat-suffix">{stat.suffix}</span>
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
