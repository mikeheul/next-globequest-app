// OpeningHours.tsx

import React from 'react';

type OpeningHoursType = {
    [day: string]: {
        morning?: {
            open: string;
            close: string;
        };
        afternoon?: {
            open: string;
            close: string;
        };
    };
};

type OpeningHoursProps = {
    opening_hours: {
        opening_hours: OpeningHoursType;
    };
};

const OpeningHours: React.FC<OpeningHoursProps> = ({ opening_hours }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {opening_hours.opening_hours ? (
                Object.keys(opening_hours.opening_hours).map(day => (
                    <div className='border p-3 text-xs rounded-md' key={day}>
                        <p className='text-[0.9rem] font-semibold text-[#F7775E] mb-2'>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </p>
                        <p>
                            {opening_hours.opening_hours[day]?.morning?.open} - {opening_hours.opening_hours[day]?.morning?.close}
                        </p>
                        <p>
                            {opening_hours.opening_hours[day]?.afternoon?.open} - {opening_hours.opening_hours[day]?.afternoon?.close}
                        </p>
                    </div>
                ))
            ) : (
                <div className='italic text-slate-500'>No opening hours</div>
            )}
        </div>
    );
};

export default OpeningHours;
