import OpeningHours from '@/components/OpeningHours';
import WebsiteLink from '@/components/WebsiteLink';
import { db } from '@/lib/db'
import { Clock10Icon, Globe2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useMemo } from 'react'

const HomePage = async () => {
    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <h1>Home</h1>
        </div>
    )
}

export default HomePage