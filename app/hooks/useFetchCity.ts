import { useState, useEffect } from 'react';
import { db } from '@/lib/db'; // Import the database connection

interface CityWithPois {
    id: string;
    name: string;
    slug: string;
    description: string;
    latitude: number;
    longitude: number;
    country: {
        id: string;
        name: string;
        geoJson: string | null;
    };
    pois: Array<{
        id: string;
        name: string;
        slug: string;
        description: string;
        latitude: number;
        longitude: number;
        category: {
            id: string;
            name: string;
        };
        imageUrl: string;
        createdAt: Date;
    }>;
}

export const useFetchCity = (citySlug: string) => {
    const [city, setCity] = useState<CityWithPois | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCity = async () => {
            try {
                const cityData = await db.city.findUnique({
                    where: {
                        slug: citySlug,
                    },
                    include: {
                        pois: {
                            include: {
                                category: true,
                            },
                        },
                        country: true,
                    },
                });

                if (!cityData) {
                    throw new Error('City not found');
                }

                setCity(cityData as CityWithPois);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCity();
    }, [citySlug]);

    return { city, loading, error };
};