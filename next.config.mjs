/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "res.cloudinary.com",
            "img.lovepik.com",
            "miro.medium.com",
            "restcountries.com"
        ]
        //unoptimized: true,
    },
};

export default nextConfig;
