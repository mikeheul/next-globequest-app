// Import necessary libraries and components
import { db } from '@/lib/db'; // Import the database connection
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React from 'react'; // Import React

// Define the CitiesPage component as an async function
const CitiesPage = async () => {

    // Fetch the list of cities from the database
    const cities = await db.city.findMany({});

    return (
        // Container div with padding
        <div className='p-10'>
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
