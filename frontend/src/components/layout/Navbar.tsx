import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SuiWalletConnect } from '../auth/SuiWalletConnect';

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick: _onLoginClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">🌲</span>
            </div>
            <span className="text-2xl font-bold text-primary-dark">Forest</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Pricing
            </button>
          </div>

          {/* Login Button - Desktop */}
          <div className="hidden md:block">
            <SuiWalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-dark text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-primary font-medium transition-colors text-left py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-primary font-medium transition-colors text-left py-2"
              >
                Pricing
              </button>
              <div className="pt-2">
                <SuiWalletConnect />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

