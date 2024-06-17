import MapMulti from '@/components/MapMulti';
import { db } from '@/lib/db'
import React from 'react'

const ItineraryPage = async () => {
    
    const itinerary = await db.itinerary.findUnique({
        where: {
            id: '6670ab28d52b5888eae0d8b6'
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
        address: itineraryPoi.poi.address
    })) || [];
                
    return (
        <div className='p-10'>
            <h1 className='text-3xl font-medium mb-10'>{ itinerary?.name }</h1>
            <div className='w-full h-[400px]'>
                <MapMulti pois={pois} />
            </div>
        </div>
    )
}

export default ItineraryPage;