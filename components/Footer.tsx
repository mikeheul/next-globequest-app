import React from 'react'

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <div className='flex flex-col justify-center items-center min-h-[150px] w-full bg-[#1D1D1D] text-white'>
            &copy;{currentYear} GlobeQuest
        </div>
    )
}

export default Footer