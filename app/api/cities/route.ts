// Import necessary modules
import { db } from '@/lib/db'; // Assuming db is a module path alias
import { NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET(
    req: Request // Specify req as a parameter of type Request
) {
    try {
        // Fetch cities from the database
        const cities = await db.city.findMany({
            orderBy: {
                name: 'asc' // Order cities by name in ascending order
            },
            include: {
                pois: true // Include points of interest (pois) associated with each city
            }
        });

        // Sort cities based on the number of points of interest (pois) in descending order
        cities.sort((a, b) => b.pois.length - a.pois.length);

        // Return JSON response with the sorted list of cities
        return NextResponse.json(cities);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[CITIES]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
