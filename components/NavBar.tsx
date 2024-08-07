"use client"; // Indicate that this component should be rendered on the client side

// Import necessary libraries and components
import { MenuIcon, Router, XIcon } from 'lucide-react'; // Import icons from lucide-react
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React, { useState, useEffect } from 'react'; // Import React
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image';
import logo from '@/public/logo-orange.png';

// Define the Navbar component
const Navbar = () => {
    // Define state to manage the menu's open/close status
    const [isOpen, setIsOpen] = React.useState(false);
    const [activePath, setActivePath] = useState('');
    const [previousPath, setPreviousPath] = useState('');
    const [theme, setTheme] = useState('dark');

    // Define an array of link objects to manage navigation links
    const links = [
        { href: '/home', label: 'Home' },
        { href: '/country', label: 'Countries' },
        { href: '/city', label: 'Cities' },
        { href: '/itinerary', label: 'Itineraries' },
        { href: '/contact', label: 'Contact' },
    ];

    useEffect(() => {
        setActivePath(window.location.pathname);
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.add(savedTheme);
    }, []);

    const handleLinkClick = (href: string) => {
        setPreviousPath(activePath); // Set the previous active path
        setActivePath(href); // Set the new active path
        setIsOpen(false); // Close the menu on mobile
    };

    // const pathname = usePathname()

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.remove(theme);
        document.documentElement.classList.add(newTheme);
        
        // if (pathname === '/country') {
        //     location.reload();
        // }
    };

    return (
        // Navigation bar container with fixed positioning, background color, and shadow
        <nav className="bg-white shadow-lg fixed w-full z-[2000] py-2 dark:bg-slate-900">
            {/* Container for the navigation content with maximum width and padding */}
            <div className="px-8 md:px-16 xl:px-40">
                {/* Flex container to align and distribute navigation items */}
                <div className="flex justify-between items-center h-16">
                    {/* Left side of the navigation bar */}
                    <div className="flex">
                        {/* Brand/logo link */}
                        <div className="flex justify-center items-center mr-5">
                            <a href="/home" className="flex items-center gap-2 text-sm sm:text-xl font-bold font-permanent text-gray-700 dark:text-white"><Image className='w-[50px]' src={logo} alt='logo' /> GLOBEQUEST</a>
                        </div>
                        {/* Desktop navigation links */}
                        <div className="uppercase hidden sm:ml-6 sm:flex sm:justify-between sm:items-center sm:space-x-12">
                            <>
                            {links.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href} 
                                    className={`text-gray-500 py-2 text-sm ${activePath === link.href ? 'border-b-2 border-marker text-marker dark:text-marker font-semibold' : ''} dark:text-white`}
                                    onClick={() => handleLinkClick(link.href)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            </>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={toggleTheme}
                            className="hidden text-2xl md:block cursor-pointer text-gray-500 dark:text-white"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)} // Toggle menu open/close state
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span> {/* Screen reader text */}
                            {isOpen ? (
                                <XIcon className="block h-6 w-6" aria-hidden="true" /> // Close icon
                            ) : (
                                <MenuIcon className="block h-6 w-6" aria-hidden="true" /> // Menu icon
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile navigation menu */}
            <div
                className={`sm:hidden overflow-hidden transition-max-height duration-1000 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
            >
                <div className="px-8 pt-2 pb-3 space-y-1">
                    {links.map((link) => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            onClick={() => handleLinkClick(link.href)}
                            className={`text-gray-500 block px-3 py-2 rounded-md text-base font-medium ${activePath === link.href ? 'text-white font-bold bg-slate-600 px-3' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={toggleTheme}
                        className="px-3 py-2 top-0 text-gray-500 dark:text-white mr-4"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

// Export the Navbar component as the default export
export default Navbar;