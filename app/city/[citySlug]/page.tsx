// Import necessary libraries and components
import MapPoints from '@/components/MapPoints';
import POICard from '@/components/POICard';
import { db } from '@/lib/db'; // Import the database connection
import { ChevronRightIcon, MessageCircleHeartIcon, HomeIcon } from 'lucide-react'; // Import icons from lucide-react
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
                    category: true,
                }
            },
            country: true,
        }
    });

    if(!city) {
        redirect('/home')
    }

    const points = city?.pois.length
    ? city.pois.map((poi) => ({
        posix: [poi.latitude, poi.longitude] as [number, number],
        pointName: poi.name,
    }))
    : [
        {
            posix: [city?.latitude, city?.longitude] as [number, number],
            pointName: city?.name,
        }
    ];

    const defaults = {
        zoomWithoutPOIs: 5,
        zoomWithPOIs: 15,
    }

    return (
        // Container div with padding and margin for the page
        <div className='px-8 md:px-16 xl:px-40 py-16'>
            <div className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-[50%]'>
                    {/* Check if city data is fetched and display city details */}
                    { city && (
                        <>
                            {/* Breadcrumb */}
                            <div className='flex flex-col sm:flex-row gap-2 mb-6'>
                                <a className='inline-block text-slate-400' href={`/home`}><HomeIcon className='flex-shrink-0' width={18} /></a>
                                <ChevronRightIcon className='hidden sm:block text-slate-400 flex-shrink-0' width={12} />
                                <a className='inline-block text-slate-400' href={`/city`}>Cities</a>
                                <ChevronRightIcon className='hidden sm:block text-slate-400 flex-shrink-0' width={12} />
                                <span className='font-semibold'>{city.name}</span>
                            </div>
                            <h1 className='text-4xl uppercase font-bold text-[#F7775E] font-permanent'>{ city.name }</h1>
                            <p><img src={`/api/flags?countryName=${encodeURIComponent(city.country.name)}`} alt={`${city.country.name} flag`} className="inline-block rounded-full w-8 h-8 object-cover my-3 mr-2" /> {city.country.name}</p>
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
                                <Link href={`/poi/${poi.slug}`} className='p-2 flex hover:bg-gray-100 rounded-lg'>
                                <div key={poi.id} className='group flex items-center text-sm gap-2'>
                                    <MessageCircleHeartIcon className='text-[#F7775E] group-hover:text-[#cc634e] flex-shrink-0 w-[30px] h-[30px]' /> 
                                    {poi.name}
                                </div>
                                </Link>
                            ))
                        ) : (
                            <div className='italic text-slate-500'>No POIs available</div>
                        )}
                        </div>
                    </div>
                </div>
                <div className='w-full lg:w-[50%]'>
                    <MapPoints points={points} zoom={points.length > 1 ? defaults.zoomWithPOIs : defaults.zoomWithoutPOIs} />
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