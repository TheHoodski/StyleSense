// Route: /src/pages/RecommendationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RecommendationList from '../components/recommendation/RecommendationList';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { FaceAnalysis, Recommendation, HaircutStyle, FaceShape } from '../models/types';

interface RouteParams {
  analysisId: string;
}

const RecommendationsPage: React.FC = () => {
  const { analysisId } = useParams<keyof RouteParams>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch the analysis and recommendations from the API
    // For demo purposes, we'll simulate an API call with a timeout and mock data
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock face analysis
      const mockAnalysis: FaceAnalysis = {
        id: analysisId || 'analysis-123',
        faceShape: 'oval',
        confidenceScore: 92,
        createdAt: new Date(),
      };
      
      // Mock hairstyle data
      const mockHairstyles: HaircutStyle[] = [
        {
          id: 'style-1',
          name: 'Textured Crop',
          description: 'A modern, textured crop with short sides and a longer top that can be styled in various ways. Great for adding volume and definition.',
          suitableFaceShapes: ['oval', 'round', 'square'],
          suitableHairTypes: ['straight', 'wavy'],
          suitableGenders: ['male'],
          lengthCategory: 'short',
          maintenanceLevel: 2,
          imageUrl: 'https://example.com/textured-crop.jpg',
        },
        {
          id: 'style-2',
          name: 'Classic Bob',
          description: 'A timeless bob cut that hits at chin length with a straight, clean line. Versatile and frames the face beautifully.',
          suitableFaceShapes: ['oval', 'heart', 'square'],
          suitableHairTypes: ['straight', 'wavy'],
          suitableGenders: ['female'],
          lengthCategory: 'medium',
          maintenanceLevel: 3,
          imageUrl: 'https://example.com/classic-bob.jpg',
        },
        {
          id: 'style-3',
          name: 'Layered Mid-Length',
          description: 'A shoulder-length cut with layers throughout to add movement and volume. Flattering on most face shapes and versatile for styling.',
          suitableFaceShapes: ['oval', 'round', 'heart'],
          suitableHairTypes: ['straight', 'wavy', 'curly'],
          suitableGenders: ['female'],
          lengthCategory: 'medium',
          maintenanceLevel: 3,
          imageUrl: 'https://example.com/layered-mid.jpg',
        },
        {
          id: 'style-4',
          name: 'Undercut Fade',
          description: 'A bold, modern style with short faded sides and a longer top. Can be styled slick or textured for different looks.',
          suitableFaceShapes: ['oval', 'diamond', 'triangle'],
          suitableHairTypes: ['straight', 'wavy'],
          suitableGenders: ['male'],
          lengthCategory: 'short',
          maintenanceLevel: 4,
          imageUrl: 'https://example.com/undercut-fade.jpg',
        },
        {
          id: 'style-5',
          name: 'Long Layers',
          description: 'Long hair with strategically placed layers to add movement and reduce bulk. Frames the face and adds softness.',
          suitableFaceShapes: ['oval', 'square', 'rectangle'],
          suitableHairTypes: ['straight', 'wavy', 'curly'],
          suitableGenders: ['female'],
          lengthCategory: 'long',
          maintenanceLevel: 2,
          imageUrl: 'https://example.com/long-layers.jpg',
        },
        {
          id: 'style-6',
          name: 'Side-Swept Pixie',
          description: 'A short, feminine cut with longer layers on top that can be swept to the side. Low maintenance and chic.',
          suitableFaceShapes: ['oval', 'heart', 'diamond'],
          suitableHairTypes: ['straight', 'wavy'],
          suitableGenders: ['female'],
          lengthCategory: 'short',
          maintenanceLevel: 3,
          imageUrl: 'https://example.com/side-swept-pixie.jpg',
        },
      ];
      
      // Mock recommendations
      const mockRecommendations: Recommendation[] = mockHairstyles.map((style, index) => ({
        id: `rec-${index}`,
        analysisId: mockAnalysis.id,
        styleId: style.id,
        relevanceScore: 95 - (index * 5), // First has highest score, decreasing after
        position: index + 1,
        explanation: `This ${style.name} works well with your ${mockAnalysis.faceShape} face shape because it ${
          index % 2 === 0 
            ? 'balances your proportions and enhances your features.' 
            : 'adds definition and complements your facial structure.'
        }`,
        style: style,
      }));
      
      setAnalysis(mockAnalysis);
      setRecommendations(mockRecommendations);
      setLoading(false);
    };
    
    fetchData();
  }, [analysisId]);
  
  const handleRecommendationClick = (recommendation: Recommendation) => {
    // In a real app, this would navigate to a detailed view of the recommendation
    console.log('Recommendation clicked:', recommendation);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mb-4"></div>
              <p className="text-charcoal">Loading recommendations...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!analysis) {
    return (
      <Layout>
        <div className="py-16">
          <div className="container mx-auto px-4">
            <Card className="p-8 text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Analysis Not Found</h2>
              <p className="text-charcoal mb-6">
                The analysis you're looking for doesn't exist or has expired.
              </p>
              <Button 
                variant="primary"
                onClick={() => navigate('/analyze')}
              >
                Start New Analysis
              </Button>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-12 bg-silver">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Card className="p-4 flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center">
                <div className="mr-4">
                  <Badge variant="primary">{analysis.faceShape.charAt(0).toUpperCase() + analysis.faceShape.slice(1)} Face</Badge>
                </div>
                <p className="text-charcoal">
                  Confidence: <span className="font-medium">{analysis.confidenceScore}%</span>
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/analyze')}
              >
                New Analysis
              </Button>
            </Card>
          </div>
          
          <RecommendationList 
            recommendations={recommendations}
            onRecommendationClick={handleRecommendationClick}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RecommendationsPage;