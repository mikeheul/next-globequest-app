// Import necessary modules
import { db } from '@/lib/db'; // Importing the 'db' module from '@/lib/db'
import { NextResponse } from 'next/server'; // Importing 'NextResponse' from 'next/server'

// Define a GET function that handles incoming requests
export async function GET(
    req: Request // Declare 'req' as a parameter of type Request
) {
    try {
        // Fetch itineraries from the database
        const itineraries = await db.itinerary.findMany({
            orderBy: {
                createdAt: 'desc' // Order itineraries by createdAt in descending order
            },
            include: {
                itineraryPois: true, // Include itineraryPois (points of interest associated with each itinerary)
            }
        });

        // Return JSON response with the fetched itineraries
        return NextResponse.json(itineraries);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[ITINERARIES]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
