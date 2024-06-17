import { db } from '@/lib/db'
import Link from 'next/link'
import React from 'react'

const CitiesPage = async () => {

    const cities = await db.city.findMany({})

    return (
        <div className='p-10'>
            {cities && cities.map((city) => (
                <div key={city.id}>
                    <Link href={`/city/${city.id}`}>{city.name}</Link>
                </div>
            ))}
        </div>
    )
}

export default CitiesPage