"use client";

// Import necessary components and libraries
import OpeningHours from '@/components/OpeningHours';
import WebsiteLink from '@/components/WebsiteLink';
import { Clock10Icon, MessageSquareMoreIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

// Define the PoiPage component
const PoiPage = ({ params }: { params: { poiId: string } }) => {
    const [poi, setPoi] = useState<any>(null); // State to store the POI data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState<string | null>(null); // State to manage error state

    // Dynamically import the Map component with a loading fallback
    const Map = useMemo(
        () =>
            dynamic(() => import('../../../components/Map'), {
                loading: () => <p>A map is loading</p>,
                ssr: false
            }),
        []
    );

    // Fetch the POI data from the API when the component mounts
    useEffect(() => {
        const fetchPoi = async () => {
            try {
                const response = await fetch(`/api/pois/${params.poiId}`); // Make a GET request to the API route
                if (!response.ok) {
                    throw new Error('Failed to fetch POI'); // Handle non-200 responses
                }
                const data = await response.json(); // Parse the JSON response
                setPoi(data); // Update the POI state
            } catch (error: any) {
                setError(error.message); // Update the error state
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };
        fetchPoi();
    }, [params.poiId]); // Dependency array to run the effect when params.poiId changes

    // Render the component
    return (
        <>
            {loading && <p className='p-10'>Loading...</p>} {/* Display loading state */}
            {error && <p>Error: {error}</p>} {/* Display error state */}
            {poi && (
                <>
                    {/* Images section */}
                    <div className='grid grid-cols-1 md:grid-cols-3 h-[200px] md:h-[300px]'>
                        {poi.pictures && poi.pictures.length > 0 ? (
                            poi.pictures.map((picture: string, index: number) => (
                                <div key={index} className='relative md:aspect-w-1 md:aspect-h-1'>
                                    <Image
                                        src={picture}
                                        alt={`Photo ${index + 1}`}
                                        layout='fill'
                                        objectFit='cover'
                                        objectPosition='top'
                                    />
                                </div>
                            ))
                        ) : (
                            <>
                                <div className='relative md:aspect-w-1 md:block md:aspect-h-1'>
                                    <Image
                                        src='https://miro.medium.com/v2/resize:fit:1400/1*KuGlXZjyTw7q38uzY_aZRA.png'
                                        alt='Photo 1'
                                        layout='fill'
                                        objectFit='cover'
                                        objectPosition='top'
                                    />
                                </div>
                                <div className='relative hidden md:block md:aspect-w-1 md:aspect-h-1'>
                                    <Image
                                        src='https://miro.medium.com/v2/resize:fit:1400/1*KuGlXZjyTw7q38uzY_aZRA.png'
                                        alt='Photo 2'
                                        layout='fill'
                                        objectFit='cover'
                                    />
                                </div>
                                <div className='relative hidden md:block md:aspect-w-1 md:aspect-h-1'>
                                    <Image
                                        src='https://miro.medium.com/v2/resize:fit:1400/1*KuGlXZjyTw7q38uzY_aZRA.png'
                                        alt='Photo 3'
                                        layout='fill'
                                        objectFit='cover'
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* POI details section */}
                    <div className='px-8 md:px-16 xl:px-36 py-16'>
                        <div className='flex flex-col md:flex-row gap-10'>
                            {/* POI information */}
                            <div className='w-full md:w-[50%]'>
                                <h1 className='uppercase text-3xl sm:text-4xl font-medium'>
                                    <span className='text-[#F7775E] font-extrabold'>{poi.city.name} | </span>
                                    {poi.name}
                                </h1>
                                <h2 className='text-2xl'>{poi.category.name}</h2>
                                <h3>{poi.city.country.name}</h3>
                                <p className='text-slate-500 text-sm mb-3'>{poi.address}</p>
                                <p className='font-light'>{poi.description}</p>

                                {/* Website link */}
                                <WebsiteLink poi={poi} />

                                {/* Tags */}
                                <div className='flex flex-col sm:flex-row flex-wrap gap-2 my-8'>
                                    {poi.tags.map((tag: any) => (
                                        <span
                                            className='inline-block text-xs uppercase text-white border bg-[#61BEC4] rounded-sm px-3 py-1'
                                            key={tag.id}
                                        >
                                            {tag.tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Map section */}
                            <div className='relative w-full h-[400px] md:w-[50%] md:h-auto'>
                                <Map posix={[poi.latitude, poi.longitude]} poiName={poi.name} address={poi.address} />
                                <div className="z-[900] absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Opening hours */}
                        <h2 className='flex gap-2 text-md font-semibold uppercase my-3'>
                            <Clock10Icon /> Opening hours
                        </h2>
                        <OpeningHours opening_hours={poi.opening_hours} />

                        <h2 className='flex gap-2 text-md font-semibold uppercase mt-10 mb-3'>
                            <MessageSquareMoreIcon /> Reviews
                        </h2>
                        {poi.reviews && poi.reviews.length > 0 ? (
                            <>
                            {poi.reviews.map((review: any) => (
                                <div>
                                { review.comment } { new Date(review.createdAt).toLocaleString('en-US') }
                                </div>
                            ))}
                            </>
                        ): (
                            <p className='italic text-slate-500'>No reviews</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default PoiPage;