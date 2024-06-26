import React from 'react'

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <div className='flex flex-col justify-center items-center min-h-[150px] w-full bg-[#1D1D1D] text-slate-300 dark:bg-slate-900'>
            &copy;{currentYear} GlobeQuest
            <div><a className='hover:underline font-semibold text-marker' href='/upload'>Upload file on Cloudinary</a></div>
        </div>
    )
}

export default Footer