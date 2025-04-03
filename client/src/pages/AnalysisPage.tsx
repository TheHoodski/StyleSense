// Route: /src/pages/AnalysisPage.tsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PhotoUpload from '../components/analysis/PhotoUpload';
import FaceAnalysisResult from '../components/analysis/FaceAnalysisResult';
import Card from '../components/common/Card';
import { FaceAnalysis, FaceShape } from '../models/types';

const AnalysisPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  
  const handlePhotoSelected = (file: File | null, previewUrl: string | null) => {
    setPhotoFile(file);
    setPhotoUrl(previewUrl);
  };
  
  const handleAnalyzePhoto = async () => {
    if (!photoFile) return;
    
    setCurrentStep('analyzing');
    
    // In a real app, we would upload the photo to the server and get the analysis back
    // For demo purposes, we'll simulate an API call with a timeout
    setTimeout(() => {
      // Mock analysis result
      const mockAnalysis: FaceAnalysis = {
        id: 'analysis-' + Date.now(),
        faceShape: 'oval', // This would come from the backend
        confidenceScore: 92,
        createdAt: new Date(),
      };
      
      setAnalysis(mockAnalysis);
      setCurrentStep('result');
    }, 2000); // Simulate 2 second API call
  };
  
  const handleReset = () => {
    setCurrentStep('upload');
    setPhotoFile(null);
    setPhotoUrl(null);
    setAnalysis(null);
  };
  
  return (
    <Layout>
      <div className="py-12 bg-silver">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Face Shape Analysis</h1>
            <p className="text-charcoal text-center mb-8 max-w-xl mx-auto">
              Upload a photo to discover your face shape and get personalized haircut recommendations.
            </p>
            
            {currentStep === 'upload' && (
              <div>
                <PhotoUpload 
                  onPhotoSelected={handlePhotoSelected} 
                />
                
                <div className="mt-6 text-center">
                  <button
                    className={`btn-primary ${!photoFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!photoFile}
                    onClick={handleAnalyzePhoto}
                  >
                    Analyze Photo
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 'analyzing' && (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mb-4"></div>
                  <h2 className="text-xl font-bold mb-2">Analyzing Your Photo</h2>
                  <p className="text-charcoal">
                    Our AI is processing your image and detecting your face shape.
                    This will take just a moment...
                  </p>
                </div>
              </Card>
            )}
            
            {currentStep === 'result' && analysis && (
              <div>
                <FaceAnalysisResult
                  analysis={analysis}
                  photoUrl={photoUrl || undefined}
                />
                
                <div className="mt-8 text-center">
                  <button
                    className="btn-secondary"
                    onClick={handleReset}
                  >
                    Analyze Another Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalysisPage;