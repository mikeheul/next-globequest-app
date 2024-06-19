import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request
) {
    try {

        const itineraries = await db.itinerary.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });
        return NextResponse.json(itineraries);

    } catch (error) {
        console.log("[ITINERARIES]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}