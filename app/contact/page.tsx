import Image from 'next/image'
import React from 'react'
import bg from '@/public/bg.webp'
import { MinusIcon } from 'lucide-react'

const ContactPage = () => {
    return (
        <div className='relative h-screen flex flex-col justify-center items-center bg-slate-800'>
            <Image src={bg} alt='' className='w-full h-full object-cover' />
            <div className='absolute h-full w-full bg-gradient-to-t from-[#1D1D1D] via-slate-900/50 to-[#1D1D1D] dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900'></div>
            <div className='absolute flex flex-col gap-8 justify-center items-center max-w-[80%] md:max-w-[50%] text-white text-center'>
                <h1 className='text-3xl md:text-7xl font-light uppercase'>Contact</h1>
                <MinusIcon />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi corrupti inventore maiores. Excepturi esse quidem sit ipsam! Officia cupiditate atque laborum ipsam aliquam, perferendis tempora, iure reiciendis delectus doloribus explicabo!</p>
            </div>
        </div>
    )
}

export default ContactPage