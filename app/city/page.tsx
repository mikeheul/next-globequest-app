"use client";

// Import necessary libraries and components
import { City } from '@prisma/client';
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React, { useEffect, useState } from 'react'; // Import React and useState, useEffect hooks

// Define the CitiesPage component
const CitiesPage = () => {
    const [cities, setCities] = useState<City[]>([]); // State to store the list of cities
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state

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

    // Render the component
    return (
        // Container div with padding
        <div className='p-10'>
            {loading && <p>Loading...</p>} {/* Display loading state */}
            {error && <p>Error: {error}</p>} {/* Display error state */}
            {/* Check if cities are fetched and map over the cities array to display each city */}
            {cities && cities.map((city) => (
                // Each city is wrapped in a div with a unique key (city id)
                <div key={city.id}>
                    {/* Link to the city page using the city id */}
                    <Link href={`/city/${city.id}`}>{city.name}</Link>
                </div>
            ))}
        </div>
    );
};

// Export the CitiesPage component as the default export
export default CitiesPage;