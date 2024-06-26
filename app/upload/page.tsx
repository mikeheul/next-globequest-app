"use client"

import { useState } from 'react';
import { NextPage } from 'next';
import { CldUploadWidget } from 'next-cloudinary';
import toast, { Toaster } from 'react-hot-toast';

const UploadPage: NextPage = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleSuccess = (result: any) => {
        console.log('Upload success:', result.info.secure_url);
        setImageUrl(result.info.secure_url);
    };

    const handleCopyUrl = () => {
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

    return (
        <div className="px-8 md:px-16 xl:px-40 py-10">
            <h1 className="text-3xl font-bold mb-4">Upload File</h1>
            <CldUploadWidget 
                uploadPreset="n3cz7u0t" // Include transformation for WebP conversion
                onSuccess={handleSuccess}
                options={
                    {
                        "clientAllowedFormats": ['jpg', 'png', 'webp', 'geojson'],
                        "maxFileSize": 500000 // 500ko
                    }
                }
            >
                {({ open }) => (
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => open()}
                    >
                        Upload a file
                    </button>
                )}
            </CldUploadWidget>
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
                        onClick={handleCopyUrl}
                    >
                        Copy
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;