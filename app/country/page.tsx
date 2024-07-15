"use client";

import MapCountry from '@/components/MapCountry';
// Import necessary libraries and components
import { LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React from 'react'; // Import React
import { useFetchCountries } from '../hooks/useFetchCountries';
import { useRandomColor } from '../hooks/useRandomColor';
import Image from 'next/image';

// Define the CountriesPage component
const CountriesPage = () => {
    const { countries, loading, error } = useFetchCountries(); // Use the custom hook to fetch countries
    const getRandomColor = useRandomColor(); // Use the custom hook to get a random color

    const countriesMap = countries
        .filter(country => country.geoJson) // Filter countries that have geoJson data
        .map((country) => ({
            name: country.name,
            geojsonPath: country.geoJson,
            color: getRandomColor(), // Generate a random color
        }));

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
                    {/* Check if countries are fetched and map over the countries array to display each country */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-y-1 gap-x-3 mb-10'>
                        {countries && countries.map((country) => (
                            // Each country is wrapped in a div with a unique key (country id)
                            <Link href={`/country/${country.id}`} key={country.id} className='hover:bg-slate-900 p-3 rounded-lg'>
                                {/* Link to the country page using the country id */}
                                <div className='flex items-center gap-4'>
                                    <img src={`/api/flags?countryName=${encodeURIComponent(country.name)}`} alt={`${country.name} flag`} className="inline-block rounded-full w-8 h-8 object-cover" />
                                    <p>{country.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

// Export the CountriesPage component as the default export
export default CountriesPage;