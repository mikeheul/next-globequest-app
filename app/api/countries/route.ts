// Import necessary modules
import { db } from '@/lib/db'; // Importing the 'db' module from '@/lib/db'
import { NextResponse } from 'next/server'; // Importing 'NextResponse' from 'next/server'

// Define a GET function that handles incoming requests
export async function GET(
    req: Request // Declare 'req' as a parameter of type Request
) {
    try {
        // Fetch countries from the database
        const countries = await db.country.findMany({
            orderBy: {
                name: 'asc' // Order countries by name in ascending order
            },
        });

        // Return JSON response with the fetched countries
        return NextResponse.json(countries);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[COUNTRIES]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
