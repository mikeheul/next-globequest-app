"use client";

import MapCountry from '@/components/MapCountry';
// Import necessary libraries and components
import { Country } from '@prisma/client';
import { LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React, { useEffect, useState } from 'react'; // Import React and useState, useEffect hooks

// Define the CountriesPage component
const CountriesPage = () => {
    const [countries, setCountries] = useState<Country[]>([]); // State to store the list of countries
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState<string | null>(null); // State to manage error state

    // Fetch the list of countries from the API when the component mounts
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('/api/countries'); // Make a GET request to the API route
                if (!response.ok) {
                    throw new Error('Failed to fetch countries'); // Handle non-200 responses
                }
                const data = await response.json(); // Parse the JSON response
                setCountries(data); // Update the countries state
            } catch (error: any) {
                setError(error.message); // Update the error state
            } finally {
                setLoading(false); // Set loading to false once the fetch is complete
            }
        };
        fetchCountries();
    }, []); // Empty dependency array to run the effect only once on mount

    const getRandomColor = () => {
        // Define color range for shades of orange
        const orangeRange = [
            '#FFA94D', '#FF963B', '#FF7C27', '#FF6313', '#FF4C00',
            '#FFB366', '#FFAB59', '#FFA24D', '#FF9959', '#FF8C42',
            '#FF8F4C', '#FF8533', '#FF7F50', '#FF7526', '#FF6B1C'
        ];
        
        // Select a random color from the orange range
        return orangeRange[Math.floor(Math.random() * orangeRange.length)];
    };

    const countriesMap = countries
        .filter(country => country.geoJson) // Filter countries that have geoJson data
        .map((country) => ({
            name: country.name,
            geojsonPath: country.geoJson,
            color: getRandomColor(), // Generate a random color within blue or orange hues
        }));
    
    const columns = 3;

    // Render the component
    return (
        <>
        <MapCountry countries={countriesMap} />
        <div className='px-8 md:px-16 xl:px-40 py-10'>
            <h1 className='text-4xl font-semibold mb-10'>Countries</h1>

            {/* Container div with padding */}
            <div className=''>
                {loading && <LoaderCircleIcon className='animate-spin' />} {/* Display loading state */}
                {error && <p>Error: {error}</p>} {/* Display error state */}
                {/* Check if countries are fetched and map over the countries array to display each city */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-10'>
                {countries && countries.map((country, index) => {

                    // const col = Math.floor(index / columns) + 1;
                    // const row = index % columns + 1;

                    // Each country is wrapped in a div with a unique key (country id)
                    return (
                        // <div key={country.id} style={{ gridColumn: col, gridRow: row }}>
                        <div key={country.id}>
                            {/* Link to the country page using the country id */}
                            <div className='flex items-center gap-4'>
                                <img src={`/api/flags?countryName=${encodeURIComponent(country.name)}`} alt={`${country.name} flag`} className="inline-block rounded-full w-8 h-8 object-cover" />                    
                                <Link href={`/country/${country.id}`}>{country.name}</Link>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
        </>
    );
};

// Export the CountriesPage component as the default export
export default CountriesPage;