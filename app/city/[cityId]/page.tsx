import { db } from '@/lib/db'
import { LandmarkIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CityPage = async ({ params }: { params: { cityId: string }}) => {

    const city = await db.city.findUnique({
        where: {
            id: params.cityId,
        },
        include: {
            pois: true
        }
    })

    return (
        <div className='p-10'>
            { city && (
                <>
                    <h1 className='text-4xl uppercase font-semibold text-[#F7775E]'>{ city.name }</h1>
                    <h2 className='text-md font-semibold uppercase'>What can I expect from { city.name } ?</h2>
                    <p className='my-9'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius eveniet ipsum a totam hic fuga, reprehenderit quas deserunt? Ipsa omnis velit deserunt voluptas voluptatibus sunt! Fugiat laborum voluptatibus accusamus voluptas!
                    Fugit vitae dolorem et ut est praesentium officiis cupiditate ad facere error eius non odit amet molestiae, dolore aliquam blanditiis unde voluptate accusantium suscipit molestias. Quos provident atque laborum culpa.
                    Sequi, laboriosam quibusdam? Dignissimos officia aspernatur illum similique, aliquam aut totam dolor quae sunt mollitia ducimus alias blanditiis accusantium perspiciatis, error consectetur consequuntur debitis saepe, consequatur repudiandae? Nam, assumenda quas.
                    Optio suscipit, est dignissimos voluptatibus atque ex vel blanditiis harum ullam perferendis modi recusandae numquam tempore exercitationem pariatur dicta, expedita cumque? Deserunt libero maxime, quos corrupti id sequi officia nisi.
                    Neque aperiam laudantium labore fuga dicta cum, nesciunt dignissimos hic omnis dolor velit repudiandae, consectetur tenetur praesentium pariatur molestiae ipsa similique! Sint accusamus quas autem atque error. Tempore, distinctio a.</p>
                </>
            )}

            <h2 className='text-md font-semibold uppercase'>Things to see and do in { city!.name } ?</h2>
            <div className='my-5'>
                { city && city.pois.length > 0 ? (
                    city.pois.map((poi: any) => (
                        <div key={poi.id} className='flex gap-2'>
                            <LandmarkIcon className='text-[#F7775E]' /> <Link href={`/poi/${poi.id}`}>{poi.name}</Link>
                        </div>
                    ))
                ) : (
                    <div className='italic text-slate-500'>No POIs available</div>
                )}
            </div>
        </div>
    )
}

export default CityPage