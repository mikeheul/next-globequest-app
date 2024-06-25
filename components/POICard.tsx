// POICard.tsx or POICard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { MinusIcon } from 'lucide-react'; // Adjust import according to your setup

interface POICardProps {
    id: string;
    imageUrl: string;
    slug: string;
    category: {
        name: string;
    };
    name: string;
}

const POICard: React.FC<POICardProps> = ({ id, imageUrl, category, name, slug }) => {
    return (
        <Link href={`/poi/${slug}`}>
        <div className='rounded-md overflow-hidden group cursor-pointer relative flex flex-col justify-center items-center h-[250px] w-full'>
            {/* Image for the POI */}
            <Image 
                layout='fill' 
                objectFit='cover' 
                objectPosition='bottom' 
                className='rounded-md group-hover:scale-105 group-hover:grayscale transition-all duration-1000 ease-in-out' 
                src={imageUrl} 
                alt={name} 
            />
            {/* Overlay with POI details shown on hover */}
            <div className='rounded-md opacity-0 absolute group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex flex-col justify-center items-center text-center left-0 top-0 w-full h-full bg-[#61BEC4]/70 text-white p-10'>
                <p className='text-xl mb-2'>{category.name}</p>
                <MinusIcon className='my-2' width={20} />
                <p className='uppercase font-bold'>{name}</p>
            </div>
        </div>
        </Link>
    );
};

export default POICard;
