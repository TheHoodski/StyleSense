// File: client/src/pages/AnalysisPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PhotoUpload from '../components/analysis/PhotoUpload';
import FaceAnalysisResult from '../components/analysis/FaceAnalysisResult';
import Card from '../components/common/Card';
import { FaceAnalysis } from '../models/types';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId, setSessionId } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handlePhotoSelected = (file: File | null, previewUrl: string | null) => {
    setPhotoFile(file);
    setPhotoUrl(previewUrl);
  };
  
  const handleAnalysisComplete = (analysisResult: any) => {
    // Save the session ID if it's returned from the API
    if (analysisResult.sessionId) {
      setSessionId(analysisResult.sessionId);
    }
    
    // Convert API response to our FaceAnalysis type
    const faceAnalysis: FaceAnalysis = {
      id: analysisResult.id,
      faceShape: analysisResult.faceShape,
      confidenceScore: analysisResult.confidenceScore,
      photoUrl: analysisResult.photoUrl,
      shareToken: analysisResult.shareToken,
      createdAt: new Date(analysisResult.createdAt),
      expiresAt: analysisResult.expiresAt ? new Date(analysisResult.expiresAt) : undefined
    };
    
    setAnalysis(faceAnalysis);
    setCurrentStep('result');
  };
  
  const handleViewRecommendations = () => {
    if (analysis) {
      navigate(`/recommendations/${analysis.id}`);
    }
  };
  
  const handleShareResults = () => {
    if (analysis && analysis.shareToken) {
      // Create shareable link
      const shareUrl = `${window.location.origin}/shared/${analysis.shareToken}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Share link copied to clipboard!');
        })
        .catch(() => {
          alert('Share URL: ' + shareUrl);
        });
    }
  };
  
  const handleReset = () => {
    setCurrentStep('upload');
    setPhotoFile(null);
    setPhotoUrl(null);
    setAnalysis(null);
    setError(null);
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
            
            {error && (
              <Card className="p-4 mb-6 bg-error/10 border-error">
                <p className="text-error">{error}</p>
              </Card>
            )}
            
            {currentStep === 'upload' && (
              <PhotoUpload 
                onPhotoSelected={handlePhotoSelected}
                onAnalysisComplete={handleAnalysisComplete}
              />
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
                  photoUrl={photoUrl || analysis.photoUrl}
                  onViewRecommendations={handleViewRecommendations}
                  onShareResults={handleShareResults}
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