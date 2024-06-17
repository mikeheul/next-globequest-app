"use client"; // Indicate that this component should be rendered on the client side

// Import necessary libraries and components
import { MenuIcon, XIcon } from 'lucide-react'; // Import icons from lucide-react
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import React from 'react'; // Import React

// Define the Navbar component
const Navbar = () => {
    // Define state to manage the menu's open/close status
    const [isOpen, setIsOpen] = React.useState(false);

    // Define an array of link objects to manage navigation links
    const links = [
        { href: '/home', label: 'Home' },
        { href: '/country', label: 'Countries' },
        { href: '/city', label: 'Cities' },
    ];

    return (
        // Navigation bar container with fixed positioning, background color, and shadow
        <nav className="bg-white shadow-lg fixed w-full z-[1000]">
            {/* Container for the navigation content with maximum width and padding */}
            <div className="max-w-7xl mx-auto px-10">
                {/* Flex container to align and distribute navigation items */}
                <div className="flex justify-between items-center h-16">
                    {/* Left side of the navigation bar */}
                    <div className="flex">
                        {/* Brand/logo link */}
                        <div className="flex justify-center items-center">
                            <a href="/home" className="text-xl font-bold text-gray-800">GLOBE QUEST</a>
                        </div>
                        {/* Desktop navigation links */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {links.map((link) => (
                                <Link key={link.href} href={link.href} className='text-gray-500 px-3 py-2 rounded-md text-sm font-medium'>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
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
            {isOpen && (
                <div className="sm:hidden">
                    <div className="px-8 pt-2 pb-3 space-y-1">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className='text-gray-500 block px-3 py-2 rounded-md text-base font-medium'>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

// Export the Navbar component as the default export
export default Navbar;