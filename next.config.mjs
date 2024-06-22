/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "res.cloudinary.com",
            "img.lovepik.com"
        ]
        //unoptimized: true,
    }
};

export default nextConfig;
