import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenTrial: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrial, onOpenLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Brand Wordmark (Single clean element) */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#D84315] flex items-center justify-center shadow-md shadow-orange-950/40 group-hover:scale-105 transition-transform duration-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
              >
                {/* Stylized fox face / dynamic invoice chevron */}
                <path
                  d="M4 5L12 11L20 5L17 19L12 16L7 19L4 5Z"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
                <circle cx="9" cy="10" r="1.2" fill="#0F172A" />
                <circle cx="15" cy="10" r="1.2" fill="#0F172A" />
                <path
                  d="M12 13L10.5 15H13.5L12 13Z"
                  fill="#0F172A"
                />
              </svg>
            </div>
            <span className="font-extrabold tracking-tight text-lg text-white">
              dueFox<span className="text-[#FF5722]">.co</span>
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#features"
              className="hover:text-white transition-colors duration-150 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#FF5722] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors duration-150 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#FF5722] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              How it Works
            </a>
            <a
              href="#calculator"
              className="hover:text-white transition-colors duration-150 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#FF5722] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              ROI Calculator
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors duration-150 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#FF5722] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-white transition-colors duration-150 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#FF5722] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              FAQ
            </a>
            <Link
              to="/dashboard"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-150 relative py-1 flex items-center gap-1"
            >
              <span>Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse" />
            </Link>
          </nav>

          {/* Zone 3: CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors whitespace-nowrap"
            >
              Log In
            </button>
            <button
              onClick={onOpenTrial}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#FF5722] hover:bg-[#F4511E] rounded-lg transition-all shadow-md shadow-orange-900/30 hover:shadow-orange-900/50 hover:translate-y-[-1px] flex items-center gap-1.5 whitespace-nowrap glow-orange-sm cursor-pointer"
            >
              <span>Start Chasing Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A]/98 border-b border-slate-800 px-4 pt-3 pb-6 shadow-2xl">
          <nav className="flex flex-col gap-3 py-2 text-base font-medium text-slate-300">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
            >
              How it Works
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
            >
              ROI Calculator
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
            >
              FAQ
            </a>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-orange-500/10 text-orange-400 font-semibold hover:bg-orange-500/20"
            >
              Dashboard App →
            </Link>
          </nav>
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 text-center text-sm font-medium text-slate-300 bg-slate-800/80 rounded-lg hover:text-white"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#FF5722] hover:bg-[#F4511E] rounded-lg shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Start Chasing Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
