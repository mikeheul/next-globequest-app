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
    const citiesPerPage = 3;

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
        setCurrentPage(data.selected);
    };

    const citiesMap = cities.map((city: any) => ({
        posix: [city.latitude, city.longitude] as [number, number],
        cityName: city.name,
    })) || [];

    // Render the component
    return (
        <>
        {/* <h1 className='text-4xl font-semibold mt-10 ml-10'>Cities</h1> */}
        <MapCities cities={citiesMap} />
        {/* Container div with padding */}
        <div className='p-10'>
            {loading && <LoaderCircleIcon className='animate-spin' />} {/* Display loading state */}
            {error && <p>Error: {error}</p>} {/* Display error state */}
            {/* Check if cities are fetched and map over the cities array to display each city */}
            <div className='grid grid-cols-3 gap-4 px-28'>
            {currentCities.map((city) => (
                        <div key={city.id} className='flex flex-col items-center justify-center h-[200px] rounded-md border border-slate-200'>
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