import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request
) {
    try {
        
        const countries = await db.country.findMany({});
        return NextResponse.json(countries);

    } catch (error) {
        console.log("[COUNTRIES]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}