// Import necessary libraries and components
import MapCities from '@/components/MapCities';
import POICard from '@/components/POICard';
import { db } from '@/lib/db'; // Import the database connection
import { LandmarkIcon } from 'lucide-react'; // Import icons from lucide-react
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import { redirect } from 'next/navigation';
import React from 'react'; // Import React

// Define the CityPage component as an async function
const CityPage = async ({ params }: { params: { citySlug: string }}) => {

    // Fetch the city data from the database including its POIs (Points of Interest) and their categories
    const city = await db.city.findUnique({
        where: {
            slug: params.citySlug as string,
        },
        include: {
            pois: {
                include: {
                    category: true
                }
            }
        }
    });

    if(!city) {
        redirect('/home')
    }

    const poisMap = city.pois.map((poi: any) => ({
        posix: [poi.latitude, poi.longitude] as [number, number],
        cityName: poi.name,
    })) || [];

    return (
        // Container div with padding and margin for the page
        <div className='px-8 md:px-16 xl:px-40 py-16'>
            <div className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-[50%]'>
                    {/* Check if city data is fetched and display city details */}
                    { city && (
                        <>
                            <h1 className='text-4xl uppercase font-bold text-[#F7775E] font-permanent'>{ city.name }</h1>
                            <h2 className='text-lg font-normal uppercase mt-2'>What can I expect from { city.name } ?</h2>
                            <p className='my-9'>
                                {city.description}
                            </p>
                        </>
                    )}

                    {/* Section for things to see and do in the city */}
                    <h2 className='text-lg font-normal uppercase'>Things to see and do in { city!.name } ?</h2>
                    <div className='my-5'>
                        {/* Check if city has POIs and map over them to display each POI */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                        { city && city.pois.length > 0 ? (
                            city.pois.map((poi: any) => (
                                <div key={poi.id} className='flex text-sm gap-2'>
                                    <LandmarkIcon className='text-[#F7775E] flex-shrink-0 w-[30px] h-[30px]' /> 
                                    <Link href={`/poi/${poi.slug}`}>{poi.name}</Link>
                                </div>
                            ))
                        ) : (
                            <div className='italic text-slate-500'>No POIs available</div>
                        )}
                        </div>
                    </div>
                </div>
                <div className='w-full lg:w-[50%]'>
                    <MapCities cities={poisMap} />
                </div>
            </div>

            {/* Section for the most popular places */}
            <h2 className='text-lg font-normal uppercase mt-10 mb-5'>Most Popular Places</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {/* Check if city has POIs and map over them to display each POI with an image */}
                { city && city.pois.length > 0 ? (
                    city.pois.map((poi: any) => (
                        <POICard 
                            key={poi.id} 
                            id={poi.id}
                            slug={poi.slug}
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