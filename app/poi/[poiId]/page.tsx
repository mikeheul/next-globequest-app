import OpeningHours from '@/components/OpeningHours';
import WebsiteLink from '@/components/WebsiteLink';
import { db } from '@/lib/db'
import { Clock10Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useMemo } from 'react'

const PoiPage = async ({ params }: { params: { poiId: string }}) => {
    const Map = useMemo(() => dynamic(
        () => import('../../../components/Map'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const poi = await db.poi.findUnique({
        where: {
            // id: '666f6f6c866be74a3648c516'
            // id: '666ef46d6264123e0f9e7163'
            id: params.poiId
        },
        include: {
            category: true,
            tags: {
                include: {
                    tag: true
                }
            },
            city: true
        }
    }) as any;

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-3 h-[600px] md:h-[300px]'>
                <div className='relative aspect-w-1 aspect-h-1'>
                    <Image 
                        src='https://picfiles.alphacoders.com/293/thumb-1920-293301.jpg' 
                        alt='Strasbourg Photo 1' 
                        layout='fill'
                        objectFit='cover' 
                    />
                </div>
                <div className='relative aspect-w-1 aspect-h-1'>
                    <Image 
                        src='https://a.cdn-hotels.com/gdcs/production161/d1782/80519747-a26d-49fd-9218-019576d91376.jpg' 
                        alt='Strasbourg Photo 2' 
                        layout='fill'
                        objectFit='cover' 
                    />
                </div>
                <div className='relative aspect-w-1 aspect-h-1'>
                    <Image 
                        src='https://cdn.bonsplansvoyage.fr/wp-content/uploads/2021/08/que-faire-a-strasbourg-quand-il-pleut-3072x2048.jpg'
                        alt='Strasbourg Photo 3' 
                        layout='fill'
                        objectFit='cover' 
                    />
                </div>
            </div>
            <div className='px-8 md:px-16 xl:px-40 py-16'>
                { poi && (
                    <>
                        <div className='flex flex-col md:flex-row gap-10'>
                            {/* POI infos */}
                            <div className='w-full md:w-[50%]'>
                                <h1 className='uppercase text-3xl sm:text-4xl font-semibold'><span className='text-[#F7775E]'>{ poi.city.name }</span> { poi.name }</h1>
                                <h2 className='text-2xl'>{ poi.category.name }</h2>
                                <p className='text-slate-500 text-sm mb-3'>{ poi.address }</p>
                                <p className='font-light'>{ poi.description }</p>
                                {/* Website */}
                                <WebsiteLink poi={poi} />
                                {/* Tags */}
                                <div className='flex flex-col sm:flex-row flex-wrap gap-2 my-8'>
                                    {poi.tags.map((tag: any) => (
                                        <span className='inline-block text-xs uppercase text-white border bg-[#61BEC4] rounded-sm px-3 py-1' key={tag.id}>{tag.tag.name}</span>
                                        ))}
                                </div>
                            </div>
                            {/* Map */}
                            <div className='relative w-full h-[400px] md:w-[50%] md:h-auto'>
                                <Map posix={[poi.latitude, poi.longitude]} poiName={poi.name} />
                                <div className="z-[1000] absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                        {/* Opening Hours */}
                        <h2 className='flex gap-2 text-md font-semibold uppercase my-3'><Clock10Icon /> Opening hours</h2>
                        <OpeningHours opening_hours={poi.opening_hours} />
                    </>
                )}
            </div>
        </>
    )
}

export default PoiPage