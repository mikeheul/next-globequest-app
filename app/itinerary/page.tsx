"use client";

import { Poi } from '@prisma/client';
// Import necessary libraries and components
import { ArrowRightIcon, HeartIcon, HeartPulseIcon, LoaderCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React, { useEffect, useState } from 'react'; // Import React and useState, useEffect hooks
import travel from '@/public/travel_3.svg';
import { useRouter } from 'next/navigation';

interface ItineraryWithPois {
    id: string;
    name: string;
    userId: string;
    description: string;
    createdAt: any;
    itineraryPois: Poi[]
}

// Define the ItinerariesPage component
const ItinerariesPage = () => {
    const [itineraries, setItineraries] = useState<ItineraryWithPois[]>([]); // State to store the list of itineraries
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state

    // Fetch the list of itineraries from the API when the component mounts
    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const response = await fetch('/api/itineraries'); // Make a GET request to the API route
                if (!response.ok) {
                    throw new Error('Failed to fetch itineraries'); // Handle non-200 responses
                }
                const data = await response.json(); // Parse the JSON response
                setItineraries(data); // Update the Itineraries state
            } catch (error: any) {
                setError(error.message); // Update the error state
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };
        fetchItineraries();
    }, []); // Empty dependency array to run the effect only once on mount

    const router = useRouter();

    const handleReadMoreClick = (id: string) => {
        router.push(`/itinerary/${id}`);
    };

    const handleHeartClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        // Handle heart icon click logic here
    };

    // Render the component
    return (
        <div className='px-8 md:px-16 xl:px-40 py-10'>
        <h1 className='text-4xl font-semibold mt-10'>Itineraries</h1>
        {/* Container div with padding */}
        <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
            {loading && <LoaderCircleIcon className='animate-spin' />} {/* Display loading state */}
            {error && <p>Error: {error}</p>} {/* Display error state */}
            {/* Check if itineraries are fetched and map over the itineraries array to display each itinerary */}
            {itineraries && itineraries.map((itinerary) => (
                // Each itinerary is wrapped in a div with a unique key (itinerary id)
                <Link 
                    href={`/itinerary/${itinerary.id}`}
                    key={itinerary.id}
                >
                    <div className='group bg-white/50 dark:bg-slate-900/50 overflow-hidden relative border border-slate-700 p-7 rounded-md h-full dark:hover:bg-slate-900/80' key={itinerary.id}>
                        {/* Link to the itinerary page using the itinerary id */}
                        <div className='h-full flex flex-col justify-between'>
                            <div>
                                <p className='text-3xl font-semibold'>{itinerary.name}</p>
                                <p className='text-sm'>User : {itinerary.userId}</p>
                                <p className='text-sm text-slate-500 dark:text-white'>{new Date(itinerary.createdAt).toLocaleString('en-US')}</p>
                                <div className='inline-flex mt-5 items-center justify-center text-white text-sm right-0 top-0  h-[25px] bg-[#F7775E] rounded-tr-md rounded-bl-md px-3 group-hover:scale-125 origin-left duration-500'>{itinerary.itineraryPois.length} POIs</div>
                            </div>
                            <div className='mt-5 translate-y-[100%] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition duration-1000 text-[0.8rem] text-slate-500 dark:text-white'>
                                <p className='line-clamp-4'>{itinerary.description}</p>
                                <span className='font-bold inline-flex items-center gap-2 cursor-pointer' onClick={() => handleReadMoreClick(itinerary.id)}>Read more <ArrowRightIcon className='' /></span>
                            </div>
                            <div className='absolute bottom-4 right-4 translate-x-[100%] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition duration-500'>
                                <span className='cursor-pointer' onClick={handleHeartClick}><HeartIcon className='text-slate-500 hover:text-red-500 transition duration-500' /></span>
                            </div>
                            <Image 
                                alt='img' 
                                src={travel}
                                priority
                                fill
                                sizes='100%'
                                style={{objectFit: "cover", objectPosition: "bottom"}} 
                                className='rotate-180 grayscale absolute opacity-10 -z-[10] dark:invert dark:opacity-20' 
                            />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        </div>
    );
};

// Export the ItinerariesPage component as the default export
export default ItinerariesPage;