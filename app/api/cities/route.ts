import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request
) {
    try {

        const cities = await db.city.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                pois: true
            }
        });

        cities.sort((a, b) => b.pois.length - a.pois.length);

        return NextResponse.json(cities);

    } catch (error) {
        console.log("[CITIES]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}