'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">LoreTutor</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center">
            <Link href="/" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/matematica" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Matematica</Link>
            <Link href="/informatica" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Informatica</Link>
            <Link href="/fisica" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Fisica</Link>
            <Link href="/tutor" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">I Nostri Tutor</Link>
            <Link href="/prezzi" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Prezzi</Link>
            <Link href="/contatti" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Contatti</Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/matematica" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Matematica</Link>
            <Link href="/informatica" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Informatica</Link>
            <Link href="/fisica" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Fisica</Link>
            <Link href="/tutor" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">I Nostri Tutor</Link>
            <Link href="/prezzi" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Prezzi</Link>
            <Link href="/contatti" className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">Contatti</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
