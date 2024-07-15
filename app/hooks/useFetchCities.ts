import { useState, useEffect } from 'react';
import { Country, Poi } from '@prisma/client';

interface CityWithPois {
    id: string;
    name: string;
    slug: string;
    pictures: Array<string>;
    pois: Poi[];
    country: Country;
}

export const getStaticProps = () => {
    const [cities, setCities] = useState<CityWithPois[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('/api/cities');
                if (!response.ok) {
                    throw new Error('Failed to fetch cities');
                }
                const data = await response.json();
                setCities(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    return { cities, loading, error };
};