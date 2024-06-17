import React from 'react'; // Import React

// Define the type for the opening hours structure
type OpeningHoursType = {
    [day: string]: {
        morning?: {
            open: string;  // Morning opening time
            close: string; // Morning closing time
        };
        afternoon?: {
            open: string;  // Afternoon opening time
            close: string; // Afternoon closing time
        };
    };
};

// Define the props type for the OpeningHours component
type OpeningHoursProps = {
    opening_hours: {
        opening_hours: OpeningHoursType; // Opening hours structure
    };
};

// Define the OpeningHours functional component
const OpeningHours: React.FC<OpeningHoursProps> = ({ opening_hours }) => {
    return (
        // Grid container for displaying opening hours
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {opening_hours.opening_hours ? (
                // Map over each day in the opening_hours object
                Object.keys(opening_hours.opening_hours).map(day => (
                    <div className='border p-3 text-xs rounded-md' key={day}>
                        {/* Display the day with the first letter capitalized */}
                        <p className='text-[0.9rem] font-semibold text-[#F7775E] mb-2'>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </p>
                        {/* Display morning opening and closing times */}
                        <p>
                            {opening_hours.opening_hours[day]?.morning?.open} - {opening_hours.opening_hours[day]?.morning?.close}
                        </p>
                        {/* Display afternoon opening and closing times */}
                        <p>
                            {opening_hours.opening_hours[day]?.afternoon?.open} - {opening_hours.opening_hours[day]?.afternoon?.close}
                        </p>
                    </div>
                ))
            ) : (
                // Display a message if no opening hours are available
                <div className='italic text-slate-500'>No opening hours</div>
            )}
        </div>
    );
};

// Export the OpeningHours component as the default export
export default OpeningHours;