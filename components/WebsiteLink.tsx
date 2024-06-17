import { Globe2Icon } from 'lucide-react';
import React from 'react';

interface Props {
    poi: {
        name: string;
        website: string;
    };
}

const WebsiteLink: React.FC<Props> = ({ poi }) => {
    return (
        <div className='inline-flex gap-2 px-3 py-2 my-3 text-white rounded-sm bg-[#F7775E]'>
            <Globe2Icon className='h-5 w-5' />
            <a className='no-underline' target='_blank' rel='noopener noreferrer' href={poi.website}>
                {poi.name} website
            </a>
        </div>
    );
};

export default WebsiteLink;
