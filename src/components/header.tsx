'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
        mobileMenuButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileMenuButtonRef.current?.contains(event.target as Node)
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Focus first link in mobile menu when opened
      setTimeout(() => {
        const firstLink = mobileMenuRef.current?.querySelector('a');
        firstLink?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Navigation items array for consistent structure
  const navigationItems = [
    { href: '/blogs', label: 'Articles' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const authItems = [
    { href: '/auth/login', label: 'Login', isPrimary: false },
    { href: '/auth/sign-up', label: 'Sign Up', isPrimary: true },
  ];

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-[60] bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all"
      >
        Skip to main content
      </a>

      <div className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4">
        <header className="relative" role="banner">
          <div className="mx-auto max-w-[960px] px-3 sm:px-6">
            <div className="backdrop-blur-xl border border-white/20 rounded-2xl bg-white/10 shadow-2xl dark:bg-black/20 dark:border-white/10">
              <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">
                {/* Logo and Brand */}
                <Link
                  href="/"
                  className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-lg"
                  aria-label="Froste Blog - Go to homepage"
                >
                  <Image src="/images/icon.png" alt="" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" role="img" />
                  <span className="text-foreground font-semibold text-base sm:text-lg tracking-tight drop-shadow-sm">froste-blog</span>
                </Link>

                {/* Desktop Navigation */}
                <nav
                  className="hidden lg:flex items-center gap-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-6 py-2 absolute left-1/2 transform -translate-x-1/2 dark:bg-black/30 dark:border-white/20 shadow-lg"
                  role="navigation"
                  aria-label="Main navigation"
                >
                  <ul className="flex items-center gap-8" role="list">
                    {navigationItems.map((item) => (
                      <li key={item.href} role="listitem">
                        <Link
                          href={item.href}
                          className="text-foreground hover:text-primary transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-2 py-1 drop-shadow-sm"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden lg:flex items-center gap-3" role="group" aria-label="Authentication">
                  {authItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        item.isPrimary
                          ? 'bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors border border-primary/20 shadow-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent'
                          : 'text-foreground hover:text-primary transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-2 py-1 border border-white/30 hover:border-primary/50 backdrop-blur-sm bg-white/10 dark:bg-black/10 dark:border-white/20 drop-shadow-sm'
                      }
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                  ref={mobileMenuButtonRef}
                  onClick={toggleMobileMenu}
                  className="lg:hidden text-foreground hover:text-primary transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-md drop-shadow-sm"
                  aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-haspopup="true"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                <div
                  ref={mobileMenuRef}
                  id="mobile-menu"
                  className="lg:hidden border-t border-white/20 bg-white/20 backdrop-blur-xl rounded-b-2xl shadow-2xl dark:bg-black/30 dark:border-white/10"
                  role="region"
                  aria-label="Mobile navigation menu"
                >
                  <nav className="px-3 sm:px-6 py-4" role="navigation" aria-label="Mobile navigation">
                    <ul className="space-y-1" role="list">
                      {navigationItems.map((item) => (
                        <li key={item.href} role="listitem">
                          <Link
                            href={item.href}
                            className="block text-foreground hover:text-primary transition-colors text-sm font-medium py-3 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent drop-shadow-sm"
                            onClick={closeMobileMenu}
                            tabIndex={isMobileMenuOpen ? 0 : -1}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <hr className="border-white/20 dark:border-white/10 my-4" role="separator" />

                    <ul className="space-y-1" role="list" aria-label="Authentication options">
                      {authItems.map((item) => (
                        <li key={item.href} role="listitem">
                          <Link
                            href={item.href}
                            className={
                              item.isPrimary
                                ? 'block bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors border border-primary/20 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent shadow-lg backdrop-blur-sm'
                                : 'block text-foreground hover:text-primary transition-colors text-sm font-medium py-3 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent border border-white/30 hover:border-primary/50 backdrop-blur-sm bg-white/10 dark:bg-black/10 dark:border-white/20 drop-shadow-sm'
                            }
                            onClick={closeMobileMenu}
                            tabIndex={isMobileMenuOpen ? 0 : -1}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
