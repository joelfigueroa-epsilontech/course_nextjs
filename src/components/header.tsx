'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4">
      <header className="relative">
        <div className="mx-auto max-w-[960px] px-3 sm:px-6">
          <div className="backdrop-blur-sm border border-white/10 rounded-2xl bg-transparent">
            <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">
              {/* Logo and Brand */}
              <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <Image src="/images/icon.png" alt="Froste Blog" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="text-white font-semibold text-base sm:text-lg tracking-tight">froste-blog</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8 bg-black/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-2 absolute left-1/2 transform -translate-x-1/2">
                <Link href="/articles" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
                  Articles
                </Link>
                <Link href="/about" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
                  Contact
                </Link>
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/login" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors border border-white/30 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-white/90 hover:text-white transition-colors p-1"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t border-white/10 bg-black/30 backdrop-blur-md rounded-b-2xl">
                <nav className="px-3 sm:px-6 py-4 space-y-3">
                  <Link
                    href="/articles"
                    className="block text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Articles
                  </Link>
                  <Link
                    href="/about"
                    className="block text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <hr className="border-white/20 my-3" />
                  <Link
                    href="/login"
                    className="block text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors border border-white/30 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
