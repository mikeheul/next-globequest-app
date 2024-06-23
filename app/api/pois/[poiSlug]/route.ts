// Import necessary modules
import { NextRequest, NextResponse } from 'next/server'; // Importing NextRequest and NextResponse from 'next/server'
import { db } from '@/lib/db'; // Import the database connection from '@/lib/db'
import { redirect } from 'next/navigation'; // Importing redirect function from 'next/navigation'

// Define a GET function that handles incoming requests
export async function GET(req: NextRequest, { params }: { params: { poiSlug: string } }) {
    const { poiSlug } = params; // Extract the POI slug from the params

    try {
        // Fetch the POI data from the database
        const poi = await db.poi.findUnique({
            where: { slug: poiSlug }, // Query the POI based on its slug
            include: {
                category: true, // Include the category of the POI
                tags: {
                    include: {
                        tag: true // Include tags associated with the POI
                    }
                },
                city: {
                    include: {
                        country: true // Include the city and its country
                    }
                },
                reviews: true // Include reviews of the POI
            }
        });

        // Redirect to '/home' if the POI is not found
        if (!poi) {
            redirect('/home');
        }

        // Check if POI exists and return JSON response
        if (poi) {
            return NextResponse.json(poi, { status: 200 }); // Return POI data with status 200
        } else {
            return NextResponse.json({ error: 'POI not found' }, { status: 404 }); // Return error if POI is not found with status 404
        }
    } catch (error) {
        // Handle any errors that occur during the fetch
        return NextResponse.json({ error: 'Failed to fetch POI' }, { status: 500 }); // Return error message with status 500
    }
}