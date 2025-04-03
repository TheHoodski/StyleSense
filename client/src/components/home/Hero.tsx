// Route: /src/components/home/Hero.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Hero: React.FC = () => {
  return (
    <section className="bg-premium-gradient text-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Find Your Perfect Haircut with AI
            </h1>
            <p className="text-lg lg:text-xl mb-8 max-w-lg">
              StyleSense AI analyzes your unique face shape to recommend the most flattering hairstyles for you. Professional styling advice, accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/analyze" 
                className="variant-tertiary size-lg"
              >
                Try It Now
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-white hover:bg-primary-light"
                style={{ fontSize: 'lg' }}
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              {/* Placeholder for face analysis visualization */}
              <div className="w-full max-w-md aspect-square bg-silver rounded-md flex items-center justify-center">
                <div className="text-center p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto mb-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-midnight text-lg font-medium">
                    Face shape analysis
                  </p>
                  <p className="text-charcoal mt-2">
                    Upload a photo to discover your perfect haircut
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;