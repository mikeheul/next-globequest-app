import { Globe2Icon } from 'lucide-react'; // Import the Globe2Icon from lucide-react
import React from 'react'; // Import React

// Define the Props interface for the component
interface Props {
    poi: {
        name: string;    // Name of the point of interest (POI)
        website: string; // Website URL of the POI
    };
}

// Define the WebsiteLink functional component
const WebsiteLink: React.FC<Props> = ({ poi }) => {
    return (
        // Container for the website link with styling
        <div className='inline-flex gap-2 px-3 py-2 mb-3 mt-8 text-white rounded-sm bg-[#F7775E] hover:bg-[#ec6b54]'>
            {/* Icon to be displayed next to the link */}
            <Globe2Icon className='h-5 w-5' />
            {/* Anchor tag for the POI's website */}
            <a className='no-underline' target='_blank' rel='noopener noreferrer' href={poi.website}>
                {poi.name} website
            </a>
        </div>
    );
};

// Export the WebsiteLink component as the default export
export default WebsiteLink;
