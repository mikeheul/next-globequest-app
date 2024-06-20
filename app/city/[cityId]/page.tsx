// Import necessary libraries and components
import POICard from '@/components/POICard';
import { db } from '@/lib/db'; // Import the database connection
import { LandmarkIcon, MinusIcon } from 'lucide-react'; // Import icons from lucide-react
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React from 'react'; // Import React

// Define the CityPage component as an async function
const CityPage = async ({ params }: { params: { cityId: string }}) => {

    // Fetch the city data from the database including its POIs (Points of Interest) and their categories
    const city = await db.city.findUnique({
        where: {
            id: params.cityId,
        },
        include: {
            pois: {
                include: {
                    category: true
                }
            }
        }
    });

    return (
        // Container div with padding and margin for the page
        <div className='px-8 md:px-16 xl:px-40 py-16'>
            {/* Check if city data is fetched and display city details */}
            { city && (
                <>
                    <h1 className='text-4xl uppercase font-bold text-[#F7775E]'>{ city.name }</h1>
                    <h2 className='text-md font-semibold uppercase'>What can I expect from { city.name } ?</h2>
                    <p className='my-9'>
                        {city.description}
                    </p>
                </>
            )}

            {/* Section for things to see and do in the city */}
            <h2 className='text-md font-semibold uppercase'>Things to see and do in { city!.name } ?</h2>
            <div className='my-5'>
                {/* Check if city has POIs and map over them to display each POI */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                { city && city.pois.length > 0 ? (
                    city.pois.map((poi: any) => (
                        <div key={poi.id} className='flex gap-2'>
                            <LandmarkIcon className='text-[#F7775E]' /> 
                            <Link href={`/poi/${poi.id}`}>{poi.name}</Link>
                        </div>
                    ))
                ) : (
                    <div className='italic text-slate-500'>No POIs available</div>
                )}
                </div>
            </div>

            {/* Section for the most popular places */}
            <h2 className='text-md font-semibold uppercase mt-10 mb-5'>Most Popular Places</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {/* Check if city has POIs and map over them to display each POI with an image */}
                { city && city.pois.length > 0 ? (
                    city.pois.map((poi: any) => (
                        <POICard 
                            key={poi.id} 
                            id={poi.id} 
                            imageUrl={poi.imageUrl} 
                            category={poi.category} 
                            name={poi.name} 
                        />
                    ))
                ) : (
                    <div className='italic text-slate-500'>No POIs available</div>
                )}
            </div>
            
        </div>
    );
}

// Export the CityPage component as the default export
export default CityPage;