"use client"

import { useState } from 'react';
import { NextPage } from 'next';
import { CldUploadWidget } from 'next-cloudinary';
import toast, { Toaster } from 'react-hot-toast';

const UploadPage: NextPage = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [geoUrl, setGeoUrl] = useState<string | null>(null);

    const handleSuccessImage = (result: any) => {
        console.log('Upload success:', result.info.secure_url);
        setImageUrl(result.info.secure_url);
    };

    const handleSuccessJson = (result: any) => {
        console.log('Upload success:', result.info.secure_url);
        setGeoUrl(result.info.secure_url);
    };

    const handleCopyImageUrl = () => {
        if (imageUrl) {
            navigator.clipboard.writeText(imageUrl)
                .then(() => {
                    toast.success('URL copied to clipboard');
                })
                .catch((error) => {
                    console.error('Error copying URL to clipboard:', error);
                });
        }
    };
    
    const handleCopyGeoUrl = () => {
        if (geoUrl) {
            navigator.clipboard.writeText(geoUrl)
                .then(() => {
                    toast.success('URL copied to clipboard');
                })
                .catch((error) => {
                    console.error('Error copying URL to clipboard:', error);
                });
        }
    };

    return (
        <div className="px-8 md:px-16 xl:px-40 py-10">
            <div className='flex flex-col lg:flex-row h-[250px] pt-5 gap-5'>
                <div className='w-full lg:w-[50%] p-8 border rounded-md'>
                    <h1 className="text-2xl font-semibold mb-4">Upload Image</h1>
                    <CldUploadWidget
                        key={1}
                        uploadPreset="n3cz7u0t" // Include transformation for WebP conversion
                        onSuccess={handleSuccessImage}
                        options={
                            {
                                "clientAllowedFormats": ['jpg', 'png', 'webp', 'geojson'],
                                "maxFileSize": 500000, // 500ko
                                "showCompletedButton": true,
                            }
                        }
                    >
                        {({ open }) => (
                            <button 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => open()}
                            >
                                Upload an image
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
                <div className='w-full lg:w-[50%] p-8 border rounded-md'>
                    <h1 className="text-2xl font-semibold mb-4">Upload GeoJson file</h1>
                    <CldUploadWidget 
                        key={2}
                        uploadPreset="pmqgswly" // Include transformation for WebP conversion
                        onSuccess={handleSuccessJson}
                        options={
                            {
                                "clientAllowedFormats": ['geojson'],
                            }
                        }
                    >
                        {({ open }) => (
                            <button 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => open()}
                            >
                                Upload a geojson file
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>
            {geoUrl && (
                <div className="mt-8 flex flex-col md:flex-row">
                    <input 
                        type="text"
                        value={geoUrl}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-slate-800"
                        readOnly
                    />
                    <button 
                        className="ml-0 md:ml-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold py-2 px-4 rounded"
                        onClick={handleCopyGeoUrl}
                    >
                        Copy
                    </button>
                </div>
            )}
            {imageUrl && (
                <div className="mt-8 flex flex-col md:flex-row">
                    <input 
                        type="text"
                        value={imageUrl}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 text-slate-800"
                        readOnly
                    />
                    <button 
                        className="ml-0 md:ml-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold py-2 px-4 rounded"
                        onClick={handleCopyImageUrl}
                    >
                        Copy
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;