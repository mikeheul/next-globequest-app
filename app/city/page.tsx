"use client";

import MapCities from '@/components/MapCities';
import { Poi } from '@prisma/client';
import { ChevronLeft, ChevronRight, LoaderCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useInView } from 'react-intersection-observer';

interface CityWithPois {
    id: string;
    name: string;
    slug: string;    
    pictures: Array<string>;
    pois: Poi[];
}

const LazyImage = ({ src, alt, placeholder }:any) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '100px',
    });

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
            {inView ? (
                <Image
                    alt={alt}
                    src={src}
                    placeholder="blur"
                    blurDataURL={placeholder}
                    layout="fill"
                    objectFit="cover"
                    className='transition duration-1000'
                />
            ) : (
                <Image
                    alt={alt}
                    src={placeholder}
                    layout="fill"
                    objectFit="cover"
                    className=''
                />
            )}
        </div>
    );
};

const CitiesPage = () => {
    const [cities, setCities] = useState<CityWithPois[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [fadeIn, setFadeIn] = useState(false);
    const citiesPerPage = 9;

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('/api/cities');
                if (!response.ok) {
                    throw new Error('Failed to fetch cities');
                }
                const data = await response.json();
                setCities(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    const indexOfLastCity = (currentPage + 1) * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;
    const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

    const handlePageClick = (data: { selected: number }) => {
        setFadeIn(false);
        setTimeout(() => {
            setCurrentPage(data.selected);
            setFadeIn(true);
        }, 300);
    };

    const citiesMap = cities.map((city: any) => ({
        posix: [city.latitude, city.longitude] as [number, number],
        cityName: city.name,
    })) || [];

    return (
        <>
        <MapCities cities={citiesMap} />
        <h1 className='flex justify-center gap-2 text-xl font-semibold text-center mt-10 ml-10'>
            <span className='text-[#F7775E] font-permanent text-2xl'>EXPLORE</span>
            <span className='font-normal'>our Cities</span>
        </h1>
        <div className='p-8'>
            {loading && <LoaderCircleIcon className='animate-spin' />}
            {error && <p>Error: {error}</p>}
            <div className={`grid grid-cols-1 sm:grid-cols-2 px-0 lg:grid-cols-3 gap-4 xl:px-28 ${fadeIn ? 'fade-in' : ''}`}>
            {currentCities.map((city, index) => {
                const cityImage = city.pictures && city.pictures.length > 0 ? city.pictures[0] : 'https://img.lovepik.com/photo/40011/2105.jpg_wh860.jpg';
                const placeholderImage = 'https://img.lovepik.com/photo/40011/2105.jpg_wh860.jpg'; // Placeholder image

                console.log(cityImage);
                return (
                    <Link href={`/city/${city.slug}`} key={city.slug}>
                    <div 
                        key={city.id} 
                        className='group relative overflow-hidden flex w-full flex-col items-center justify-center h-[300px] rounded-md border border-slate-200 bg-slate-100 fade-in-card'
                        style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        <LazyImage 
                            src={cityImage} 
                            alt={city.name} 
                            placeholder={placeholderImage}
                        />
                        <div className='absolute bg-gradient-to-t from-slate-700 to-transparent w-full h-full opacity-100 bottom-0 left-0 z-10 group-hover:opacity-0 transition duration-1000'></div>
                        <h2 className='text-xl absolute text-white font-bold uppercase z-20'>{city.name}</h2>
                    </div>
                    </Link>
                );
            })}
            </div>
            <ReactPaginate
                previousLabel={<ChevronLeft size={16} />}
                nextLabel={<ChevronRight size={16} />}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(cities.length / citiesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination flex justify-center items-center mt-8 space-x-2'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link px-4 py-2 w-[20px] h-[20px] rounded-full border border-gray-300 hover:bg-gray-200'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link py-2 px-3'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link py-2 px-3'}
                activeClassName={'active'}
                activeLinkClassName={'bg-[#F7775E] text-white'}
            />
        </div>
        </>
    );
};

export default CitiesPage;
