import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request
) {
    try {

        const cities = await db.city.findMany({});

        return NextResponse.json(cities);

    } catch (error) {
        console.log("[CITIES]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}