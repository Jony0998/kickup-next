import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">KickUp</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/fields"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Maydonlar
            </Link>
            <Link
              href="/games"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              O'yinlar
            </Link>
            <Link
              href="/create-game"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              O'yin yaratish
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Kirish
            </Link>
            <Link
              href="/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/fields"
              className="block text-gray-700 hover:text-primary-600"
            >
              Maydonlar
            </Link>
            <Link
              href="/games"
              className="block text-gray-700 hover:text-primary-600"
            >
              O'yinlar
            </Link>
            <Link
              href="/create-game"
              className="block text-gray-700 hover:text-primary-600"
            >
              O'yin yaratish
            </Link>
            <div className="pt-4 border-t space-y-2">
              <Link
                href="/login"
                className="block text-gray-700 hover:text-primary-600"
              >
                Kirish
              </Link>
              <Link
                href="/register"
                className="block bg-primary-600 text-white px-4 py-2 rounded-lg text-center hover:bg-primary-700"
              >
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

