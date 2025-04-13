// Route: /src/components/recommendation/HaircutCard.tsx
import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { HaircutCardProps } from '../../models/types';

const HaircutCard: React.FC<HaircutCardProps> = ({ recommendation, onClick }) => {
  const { style, relevanceScore, explanation } = recommendation;
  
  const handleClick = () => {
    if (onClick) {
      onClick(recommendation);
    }
  };
  
  // Get maintenance level text
  const getMaintenanceText = (level: number): string => {
    switch (level) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Medium';
    }
  };
  
  const maintenanceLevel = getMaintenanceText(style.maintenanceLevel);
  
  return (
    <Card 
      className="flex flex-col h-full"
      onClick={handleClick}
    >
      {/* Haircut Image */}
      <div className="relative aspect-square bg-silver-dark rounded-lg overflow-hidden mb-4">
        {style.imageUrl ? (
          <img 
            src={style.imageUrl} 
            alt={style.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal bg-silver-dark">
            <p>Image not available</p>
          </div>
        )}
        
        {/* Match score badge */}
        <Badge 
          variant="primary" 
          className="absolute top-2 right-2"
        >
          {relevanceScore.toFixed(0)}% Match
        </Badge>
      </div>
      
      {/* Haircut Info */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-1">{style.name}</h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="accent" className="text-xs">
            {style.lengthCategory.charAt(0).toUpperCase() + style.lengthCategory.slice(1)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {maintenanceLevel} Maintenance
          </Badge>
        </div>
        
        {/* Description */}
        <p className="text-sm text-charcoal mb-4 line-clamp-3 flex-grow">
          {style.description}
        </p>
        
        {/* Face Shape Compatibility */}
        <div className="mb-3">
          <p className="text-xs text-charcoal mb-1">
            <span className="font-medium">Best for face shapes:</span>
          </p>
          <div className="flex flex-wrap gap-1">
            {style.suitableFaceShapes.map((shape) => (
              <Badge key={shape} variant="warning" className="text-xs">
                {shape.charAt(0).toUpperCase() + shape.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Explanation */}
        <div className="border-t border-silver-dark pt-3 mt-auto">
          <p className="text-xs text-charcoal italic">
            {explanation}
          </p>
        </div>
        
        {/* See Details Button */}
        <Button 
          variant="secondary"
          size="sm"
          className="mt-3 w-full"
          onClick={handleClick}
        >
          See Details
        </Button>
      </div>
    </Card>
  );
};

export default HaircutCard;