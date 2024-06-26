/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "res.cloudinary.com",
            "img.lovepik.com",
            "miro.medium.com"
        ]
        //unoptimized: true,
    },
};

export default nextConfig;
