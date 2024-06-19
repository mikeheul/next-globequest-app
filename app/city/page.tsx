"use client";

import MapCities from '@/components/MapCities';
// Import necessary libraries and components
import { Poi } from '@prisma/client';
import { LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React, { useEffect, useState } from 'react'; // Import React and useState, useEffect hooks
import ReactPaginate from 'react-paginate';

interface CityWithPois {
    id: string;
    name: string
    pois: Poi[]
}

// Define the CitiesPage component
const CitiesPage = () => {
    const [cities, setCities] = useState<CityWithPois[]>([]); // State to store the list of cities
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state
    const [currentPage, setCurrentPage] = useState(0);
    const [fadeIn, setFadeIn] = useState(false);
    const citiesPerPage = 6;

    // Fetch the list of cities from the API when the component mounts
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('/api/cities'); // Make a GET request to the API route
                if (!response.ok) {
                    throw new Error('Failed to fetch cities'); // Handle non-200 responses
                }
                const data = await response.json(); // Parse the JSON response
                setCities(data); // Update the cities state
            } catch (error: any) {
                setError(error.message); // Update the error state
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };
        fetchCities();
    }, []); // Empty dependency array to run the effect only once on mount

    // Get current cities for pagination
    const indexOfLastCity = (currentPage + 1) * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;
    const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

    // Handle page change
    const handlePageClick = (data: { selected: number }) => {
        setFadeIn(false); // Trigger the fade-out effect
        setTimeout(() => {
            setCurrentPage(data.selected);
            setFadeIn(true); // Trigger the fade-in effect after changing the page
        }, 300); // Duration of the fade-out effect
    };

    const citiesMap = cities.map((city: any) => ({
        posix: [city.latitude, city.longitude] as [number, number],
        cityName: city.name,
    })) || [];

    // Render the component
    return (
        <>
        <MapCities cities={citiesMap} />
        {/* Container div with padding */}
        <h1 className='text-xl font-semibold text-center mt-10 ml-10'><span className='text-[#F7775E]'>EXPLORE</span> our Cities</h1>
        <div className='p-8'>
            {loading && <LoaderCircleIcon className='animate-spin' />} {/* Display loading state */}
            {error && <p>Error: {error}</p>} {/* Display error state */}
            {/* Check if cities are fetched and map over the cities array to display each city */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:px-28 ${fadeIn ? 'fade-in' : ''}`}>
            {currentCities.map((city, index) => (
                        <div 
                            key={city.id} 
                            className='flex w-full flex-col items-center justify-center h-[200px] rounded-md border border-slate-200 fade-in-card'
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <h2 className='text-xl font-bold uppercase'>{city.name}</h2>
                            <Link href={`/city/${city.id}`} className='uppercase bg-slate-300 text-white text-sm px-3 py-1'>Explore</Link>
                        </div>
                    ))}
            </div>

            {/* Pagination */}
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(cities.length / citiesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination flex justify-center mt-8 space-x-2'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link py-2 px-3 rounded border border-gray-300 hover:bg-gray-200'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link py-2 px-3 rounded border border-gray-300 hover:bg-gray-200'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link py-2 px-3 rounded border border-gray-300 hover:bg-gray-200'}
                activeClassName={'active'}
                activeLinkClassName={'bg-[#F7775E] text-white'}
            />
        </div>
        </>
    );
};

// Export the CitiesPage component as the default export
export default CitiesPage;