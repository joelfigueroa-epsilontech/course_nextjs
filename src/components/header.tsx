import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <header className="relative">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="backdrop-blur-sm border border-white/10 rounded-2xl bg-transparent">
            <div className="flex items-center justify-between h-16 px-6">
              {/* Logo and Brand - on glass background */}
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Image src="/images/icon.png" alt="Froste Blog" width={32} height={32} className="w-8 h-8" />
                <span className="text-white font-semibold text-lg tracking-tight">froste-blog</span>
              </Link>

              <nav className="hidden md:flex items-center gap-8 bg-black/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-2 absolute left-1/2 transform -translate-x-1/2">
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

              <div className="hidden md:flex items-center gap-3">
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

              <button className="md:hidden text-white/90 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
