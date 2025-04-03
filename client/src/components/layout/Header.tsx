// Route: /src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">StyleSense AI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/how-it-works" className="hover:text-secondary transition-colors">
              How It Works
            </Link>
            <Link to="/premium" className="hover:text-secondary transition-colors">
              Premium Features
            </Link>
            <Button variant="secondary" size="sm">
              Try Now
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
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
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-2 border-t border-primary-light">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/how-it-works" 
                  className="block py-2 hover:text-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  to="/premium" 
                  className="block py-2 hover:text-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Premium Features
                </Link>
              </li>
              <li className="pt-2">
                <Button variant="secondary" size="sm" fullWidth>
                  Try Now
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;