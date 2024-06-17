"use client";

// Import necessary libraries and components
import { Country } from '@prisma/client';
import { LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React, { useEffect, useState } from 'react'; // Import React and useState, useEffect hooks

// Define the CountriesPage component
const CountriesPage = () => {
    const [countries, setCountries] = useState<Country[]>([]); // State to store the list of countries
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state

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

    // Render the component
    return (
        // Container div with padding
        <div className='p-10'>
            {loading && <LoaderCircleIcon className='animate-spin' />} {/* Display loading state */}
            {error && <p>Error: {error}</p>} {/* Display error state */}
            {/* Check if countries are fetched and map over the countries array to display each city */}
            {countries && countries.map((country) => (
                // Each country is wrapped in a div with a unique key (country id)
                <div key={country.id}>
                    {/* Link to the country page using the country id */}
                    <Link href={`/country/${country.id}`}>{country.name}</Link>
                </div>
            ))}
        </div>
    );
};

// Export the CountriesPage component as the default export
export default CountriesPage;