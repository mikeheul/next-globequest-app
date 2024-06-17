"use client";

import { MenuIcon, XIcon } from 'lucide-react';
import React from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-10">
                <div className="flex justify-between items-center h-16">
                    <div className="flex">
                        <div className="flex justify-center items-center">
                            <a href="/" className="text-xl font-bold text-gray-800">GLOBE QUEST</a>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="/home" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                            <a href="/city" className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium">Cities</a>
                            <a href="#" className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                        </div>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="sm:hidden">
                    <div className="px-8 pt-2 pb-3 space-y-1">
                        <a href="#" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Home</a>
                        <a href="#" className="text-gray-500 block px-3 py-2 rounded-md text-base font-medium">About</a>
                        <a href="#" className="text-gray-500 block px-3 py-2 rounded-md text-base font-medium">Contact</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
