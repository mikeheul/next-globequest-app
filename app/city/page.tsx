"use client";

import MapPoints from '@/components/MapPoints'; // Importing MapPoints component from '@/components/MapPoints'
import { ChevronLeft, ChevronRight, LoaderCircleIcon } from 'lucide-react'; // Importing icons from lucide-react
import Link from 'next/link'; // Importing Link component from next/link
import React, { useState } from 'react'; // Importing React hooks and components
import ReactPaginate from 'react-paginate'; // Importing ReactPaginate component
import Image from 'next/image'; // Importing Image component from next/image
import { useFetchCities } from '../hooks/useFetchCities';
import { useLazyImage } from '../hooks/useLazyImage';

// Lazy loaded image component that uses IntersectionObserver
const LazyImage = ({ src, alt, placeholder }: any) => {
    const { ref, inView } = useLazyImage({ src, alt, placeholder });

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
            {inView ? (
                <Image
                    alt={alt}
                    src={src}
                    placeholder="blur"
                    blurDataURL={placeholder}
                    fill
                    sizes='100%'
                    style={{objectFit: "cover"}}
                    className='transition-transform duration-500 ease-in-out group-hover:scale-105'
                    />
                    ) : (
                <Image
                    alt={alt}
                    src={placeholder}
                    fill
                    sizes='100%'
                    style={{objectFit: "cover"}}
                    className=''
                />
            )}
        </div>
    );
};

// Functional component for rendering the Cities page
const CitiesPage = () => {
    const { cities, loading, error } = useFetchCities(); // Use the custom hook to fetch cities
    const [currentPage, setCurrentPage] = useState(0);
    const [fadeIn, setFadeIn] = useState(false);
    const citiesPerPage = 6; // Number of cities per page

    // Calculate indices for paginating cities array
    const indexOfLastCity = (currentPage + 1) * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;
    const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

    // Handler function for page change in pagination
    const handlePageClick = (data: { selected: number }) => {
        setFadeIn(false); // Set fadeIn state to false for animation effect
        setTimeout(() => {
            setCurrentPage(data.selected); // Update currentPage state after animation delay
            setFadeIn(true); // Set fadeIn state to true to trigger animation
        }, 300); // Animation delay duration in milliseconds
    };

    // Mapping cities to MapPoints component props for displaying on map
    const citiesMap = cities.map((city: any) => ({
        posix: [city.latitude, city.longitude] as [number, number], // Position coordinates for each city
        pointName: city.name, // Name of the city
    })) || [];

    // JSX structure for rendering the Cities page
    return (
        <>
            {/* Render MapPoints component with citiesMap data */}
            <MapPoints points={citiesMap} />

            {/* Page title */}
            <h1 className='flex flex-wrap justify-center gap-3 font-semibold text-center mt-10'>
                <span className='text-[#F7775E] font-permanent text-responsive'>EXPLORE</span>
                <span className='font-normal text-responsive'>our Cities</span>
            </h1>

            {/* Main content section */}
            <div className='p-8'>
                {/* Loading spinner */}
                {loading && <LoaderCircleIcon className='animate-spin' />}
                {/* Error message */}
                {error && <p>Error: {error}</p>}
                
                {/* Grid layout for displaying cities */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 px-0 lg:grid-cols-3 gap-4 xl:px-28 ${fadeIn ? 'fade-in' : ''}`}>
                    {/* Map each city to a clickable link */}
                    {currentCities.map((city, index) => {
                        const cityImage = city.pictures && city.pictures.length > 0 ? city.pictures[0] : 'https://img.lovepik.com/photo/40011/2105.jpg_wh860.jpg'; // City image URL
                        const placeholderImage = 'https://img.lovepik.com/photo/40011/2105.jpg_wh860.jpg'; // Placeholder image URL

                        return (
                            <Link href={`/city/${city.slug}`} key={city.slug}>
                                {/* City card component */}
                                <div 
                                    key={city.id} 
                                    className='group relative overflow-hidden flex w-full flex-col items-center justify-center h-[300px] rounded-md border bg-slate-100 fade-in-card'
                                    style={{ animationDelay: `${index * 0.2}s` }} // Animation delay based on index
                                >
                                    {/* Lazy loaded image component */}
                                    <LazyImage 
                                        src={cityImage} 
                                        alt={city.name} 
                                        placeholder={placeholderImage} // Placeholder image
                                    />
                                    {/* Overlay for image */}
                                    <div className='absolute bg-gradient-to-t from-slate-700 to-transparent w-full h-full opacity-100 bottom-0 left-0 z-10 group-hover:opacity-0 transition duration-1000'></div>
                                    {/* City name */}
                                    <h2 className='text-xl absolute text-white font-bold uppercase z-20'>{city.name}</h2>
                                    <img src={`/api/flags?countryName=${encodeURIComponent(city.country.name)}`} alt={`${city.country.name} flag`} className="absolute top-4 left-4 inline-block rounded-full border-[3px] border-white ml-2 w-8 h-8 object-cover" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Pagination component */}
                <ReactPaginate
                    previousLabel={<ChevronLeft size={16} />} // Previous page button label and icon
                    nextLabel={<ChevronRight size={16} />} // Next page button label and icon
                    breakLabel={'...'} // Break label for ellipsis
                    breakClassName={'break-me'} // CSS class for break element
                    pageCount={Math.ceil(cities.length / citiesPerPage)} // Total number of pages
                    marginPagesDisplayed={2} // Number of pages to display on the edges
                    pageRangeDisplayed={5} // Number of pages to display in the middle
                    onPageChange={handlePageClick} // Callback function for page change
                    containerClassName={'pagination flex justify-center items-center mt-8 space-x-2'} // CSS class for pagination container
                    pageClassName={'page-item'} // CSS class for each page item
                    pageLinkClassName={'page-link flex items-center justify-center text-center w-[35px] h-[35px] rounded-full border-2 border-gray-300 hover:bg-gray-700 hover:text-white'} // CSS class for page link
                    previousClassName={'page-item'} // CSS class for previous button
                    previousLinkClassName={'page-link py-2 px-3'} // CSS class for previous button link
                    nextClassName={'page-item'} // CSS class for next button
                    nextLinkClassName={'page-link py-2 px-3'} // CSS class for next button link
                    activeClassName={'active'} // CSS class for active page
                    activeLinkClassName={'bg-[#F7775E] text-white border-none'} // CSS class for active page link
                />
            </div>
        </>
    );
};

export default CitiesPage; // Export CitiesPage component as default