import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Import the database connection

export async function GET(req: NextRequest, { params }: { params: { poiSlug: string } }) {
    const { poiSlug } = params; // Get the POI ID from the params

    try {
        // Fetch the POI data from the database
        const poi = await db.poi.findUnique({
            where: { slug: poiSlug },
            include: {
                category: true,
                tags: {
                    include: {
                        tag: true
                    }
                },
                city: {
                    include: {
                        country: true
                    }
                },
                reviews: true
            }
        });

        if (poi) {
            // Return the POI data as a JSON response
            return NextResponse.json(poi, { status: 200 });
        } else {
            // Handle case where POI is not found
            return NextResponse.json({ error: 'POI not found' }, { status: 404 });
        }
    } catch (error) {
        // Handle any errors that occur during the fetch
        return NextResponse.json({ error: 'Failed to fetch POI' }, { status: 500 });
    }
}