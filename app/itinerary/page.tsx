import MapMulti from '@/components/MapMulti';
import { db } from '@/lib/db'
import React from 'react'

const ItinerariesPage = async () => {
    
    const itinerary = await db.itinerary.findUnique({
        where: {
            id: '66713656fd5c3ba1c85c627a'
        },
        include: {
            itineraryPois: {
                include: {
                    poi: true
                },
                orderBy: {
                    visitOrder: 'asc' // Ensure proper ordering by visitOrder
                }
            },
        },
        
    });

    const pois = itinerary?.itineraryPois.map((itineraryPoi: any) => ({
        posix: [itineraryPoi.poi.latitude, itineraryPoi.poi.longitude] as [number, number],
        poiName: itineraryPoi.poi.name,
        address: itineraryPoi.poi.address,
        website: itineraryPoi.poi.website,
    })) || [];
                
    return (
        <div className=''>
            <h1 className='text-3xl font-medium p-5'>{ itinerary?.name }</h1>
            <div className='w-full h-screen'>
                <MapMulti pois={pois} />
            </div>
        </div>
    )
}

export default ItinerariesPage;