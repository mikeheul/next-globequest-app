import MapMulti from '@/components/MapMulti';
import MapRoute from '@/components/MapRoute';
import { db } from '@/lib/db'
import React from 'react'

const ItineraryPage = async ({ params }: { params: { itineraryId: string }}) => {
    
    const itinerary = await db.itinerary.findUnique({
        where: {
            id: params.itineraryId
            // id: '6670ab28d52b5888eae0d8b6'
            // id: '6671dc9e13ebbe99c49b006d'
            // id: '6671f6a813ebbe99c49b008f'
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
        <>
            <div className='p-10'>
                <h1 className='text-3xl font-medium mb-5'>{ itinerary?.name }</h1>

                <div className='flex flex-col gap-2 mb-3'>
                    {pois.map((poi, index) => (
                        <p key={index} className='flex items-center gap-4'><span className='flex justify-center items-center p-4 bg-[#F7775E] text-white text-sm h-[10px] w-[10px] rounded-full'>{index+1}</span> {poi.poiName}</p>
                    ))}
                </div>
            </div>

            <div className='w-full h-screen'>
                {/* <MapMulti pois={pois} /> */}
                <MapRoute pois={pois} />
            </div>
        </>
    )
}

export default ItineraryPage;