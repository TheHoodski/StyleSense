// Route: /src/components/recommendation/RecommendationList.tsx
import React, { useState } from 'react';
import HaircutCard from './HaircutCard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Recommendation } from '../../models/types';

interface RecommendationListProps {
  recommendations: Recommendation[];
  onRecommendationClick?: (recommendation: Recommendation) => void;
}

const RecommendationList: React.FC<RecommendationListProps> = ({ 
  recommendations, 
  onRecommendationClick 
}) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'maintenance' | 'length'>('relevance');
  
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    if (sortBy === 'relevance') {
      return b.relevanceScore - a.relevanceScore;
    } else if (sortBy === 'maintenance') {
      return a.style.maintenanceLevel - b.style.maintenanceLevel;
    } else if (sortBy === 'length') {
      const lengthOrder: Record<string, number> = { 'short': 0, 'medium': 1, 'long': 2 };
      return lengthOrder[a.style.lengthCategory] - lengthOrder[b.style.lengthCategory];
    }
    return 0;
  });
  
  const freeRecommendations = sortedRecommendations.slice(0, 3);
  const premiumRecommendations = sortedRecommendations.slice(3);
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Your Recommended Haircuts</h2>
          <p className="text-charcoal">
            Based on your face shape analysis, we've selected these styles that will complement your features.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <label className="text-sm text-charcoal block mb-2">Sort by:</label>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'relevance' 
                  ? 'bg-accent text-white' 
                  : 'bg-silver text-charcoal hover:bg-accent/20'
              }`}
              onClick={() => setSortBy('relevance')}
            >
              Best Match
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'maintenance' 
                  ? 'bg-accent text-white' 
                  : 'bg-silver text-charcoal hover:bg-accent/20'
              }`}
              onClick={() => setSortBy('maintenance')}
            >
              Maintenance
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'length' 
                  ? 'bg-accent text-white' 
                  : 'bg-silver text-charcoal hover:bg-accent/20'
              }`}
              onClick={() => setSortBy('length')}
            >
              Length
            </button>
          </div>
        </div>
      </div>
      
      {/* Free Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {freeRecommendations.map((recommendation) => (
          <HaircutCard
            key={recommendation.id}
            recommendation={recommendation}
            onClick={onRecommendationClick}
          />
        ))}
      </div>
      
      {/* Premium Recommendations Section */}
      {premiumRecommendations.length > 0 && (
        <div className="mb-6">
          <Card className="p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-premium-gradient opacity-10" />
            
            <div className="relative flex items-center mb-4">
              <Badge variant="premium" className="mr-3">Premium</Badge>
              <h3 className="text-xl font-bold">Unlock More Options</h3>
            </div>
            
            <p className="text-charcoal mb-6">
              Upgrade to Premium to access {premiumRecommendations.length} more tailored recommendations and unlock exclusive features like virtual try-on.
            </p>
            
            <div className="flex justify-center">
              <Button variant="tertiary">
                Upgrade to Premium
              </Button>
            </div>
          </Card>
          
          {/* Premium Recommendation Previews (Blurred) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {premiumRecommendations.slice(0, 3).map((recommendation) => (
              <div key={recommendation.id} className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Badge variant="premium" className="mb-2">Premium</Badge>
                    <p className="font-medium">Unlock Premium</p>
                  </div>
                </div>
                <HaircutCard
                  recommendation={recommendation}
                  onClick={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationList;