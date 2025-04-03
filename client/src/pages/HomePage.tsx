// Route: /src/pages/HomePage.tsx
import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Hero />
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-charcoal max-w-xl mx-auto">
              StyleSense AI uses advanced technology to analyze your face shape and recommend perfect hairstyles in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card variant="white" className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-white rounded-full mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Your Photo</h3>
              <p className="text-charcoal">
                Take a selfie or upload a front-facing photo of yourself.
              </p>
            </Card>
            
            {/* Step 2 */}
            <Card variant="white" className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary text-white rounded-full mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Face Analysis</h3>
              <p className="text-charcoal">
                Our AI analyzes your unique face shape with advanced technology.
              </p>
            </Card>
            
            {/* Step 3 */}
            <Card variant="white" className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sage text-white rounded-full mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Recommendations</h3>
              <p className="text-charcoal">
                Receive personalized haircut recommendations that complement your face shape.
              </p>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button variant="primary" size="lg">
              Try It Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-silver">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-charcoal max-w-xl mx-auto">
              StyleSense AI brings professional styling expertise to everyone with powerful technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Feature 1 */}
            <Card variant="white" className="flex flex-col md:flex-row items-start md:items-center p-6">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Face Shape Analysis</h3>
                <p className="text-charcoal">
                  Advanced AI technology identifies your unique face shape with high accuracy, considering proportions and features.
                </p>
              </div>
            </Card>
            
            {/* Feature 2 */}
            <Card variant="white" className="flex flex-col md:flex-row items-start md:items-center p-6">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Style Catalog</h3>
                <p className="text-charcoal">
                  Extensive library of haircuts and styles categorized by face shape compatibility, length, and maintenance level.
                </p>
              </div>
            </Card>
            
            {/* Feature 3 */}
            <Card variant="white" className="flex flex-col md:flex-row items-start md:items-center p-6">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Detailed Explanations</h3>
                <p className="text-charcoal">
                  Learn why certain styles complement your features with clear, educational explanations from styling experts.
                </p>
              </div>
            </Card>
            
            {/* Feature 4 */}
            <Card variant="white" className="flex flex-col md:flex-row items-start md:items-center p-6">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Privacy Protection</h3>
                <p className="text-charcoal">
                  Your photos are processed securely and never shared. Optional automatic deletion after analysis.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Premium Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-premium-gradient text-white p-8 text-center">
              <Badge variant="secondary" className="mb-4">Premium</Badge>
              <h2 className="text-3xl font-bold mb-4">Upgrade Your Style Experience</h2>
              <p className="text-lg max-w-xl mx-auto">
                Get access to exclusive features and enhanced styling recommendations with StyleSense AI Premium.
              </p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-accent mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Virtual Try-On</h3>
                  <p className="text-charcoal">
                    Visualize recommended hairstyles on your photo
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-accent mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Extended Library</h3>
                  <p className="text-charcoal">
                    Access 10+ personalized style recommendations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-accent mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Style History</h3>
                  <p className="text-charcoal">
                    Save and review your past analyses and favorite styles
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button variant="primary" size="lg">
                  Upgrade to Premium
                </Button>
                <p className="mt-4 text-sm text-charcoal">
                  Starting at just $4.99/month. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-style-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Haircut?</h2>
          <p className="text-lg max-w-xl mx-auto mb-8">
            Join thousands of users who have discovered their ideal hairstyle with StyleSense AI.
          </p>
          <Button variant="tertiary" size="lg">
            Try StyleSense AI Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;