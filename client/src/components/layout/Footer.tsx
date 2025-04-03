// Route: /src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl">StyleSense AI</span>
            </Link>
            <p className="mt-2 text-sm text-gray">
              Democratizing professional styling advice through AI technology.
            </p>
          </div>
          
          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-white">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features/face-analysis" className="hover:text-secondary transition-colors">
                  Face Analysis
                </Link>
              </li>
              <li>
                <Link to="/features/haircut-recommendations" className="hover:text-secondary transition-colors">
                  Haircut Recommendations
                </Link>
              </li>
              <li>
                <Link to="/premium" className="hover:text-secondary transition-colors">
                  Premium Features
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-secondary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-secondary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-secondary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-secondary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-primary-light text-center text-sm text-gray">
          <p>© {year} StyleSense AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;