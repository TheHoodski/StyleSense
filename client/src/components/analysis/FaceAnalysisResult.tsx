// Route: /src/components/analysis/FaceAnalysisResult.tsx
import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { FaceAnalysisResultProps, FaceShape } from '../../models/types';

// Face shape information with descriptions and recommendations
const faceShapeInfo: Record<FaceShape, {
  title: string;
  description: string;
  characteristics: string[];
  suitableStyles: string[];
}> = {
  oval: {
    title: 'Oval',
    description: 'Considered the ideal face shape with balanced proportions. The forehead is slightly wider than the chin, and the face length is about 1.5 times the width.',
    characteristics: [
      'Balanced facial features',
      'Forehead slightly wider than chin',
      'Softly rounded jawline',
      'Proportional face length to width'
    ],
    suitableStyles: [
      'Most hairstyles work well with oval faces',
      'Can experiment with various lengths and textures',
      'Both symmetrical and asymmetrical styles look good'
    ]
  },
  round: {
    title: 'Round',
    description: 'Characterized by soft angles and equal face width and length. Round faces have full cheeks and a rounded chin without defined angles.',
    characteristics: [
      'Equal face width and length',
      'Full cheeks',
      'Rounded chin without angles',
      'Soft jawline'
    ],
    suitableStyles: [
      'Layered cuts that add height',
      'Side-swept bangs',
      'Styles with volume on top',
      'Longer lengths to elongate the face'
    ]
  },
  square: {
    title: 'Square',
    description: 'Defined by a strong jawline and forehead with similar width. The face has angular features and appears to have similar width at the forehead and jaw.',
    characteristics: [
      'Strong, angular jawline',
      'Minimal curve at the chin',
      'Forehead and jawline similar in width',
      'Defined corners at the jaw'
    ],
    suitableStyles: [
      'Soft layers around the face',
      'Side-swept styles that soften angles',
      'Textured cuts with movement',
      'Wispy bangs or fringe'
    ]
  },
  heart: {
    title: 'Heart',
    description: 'Characterized by a wider forehead and cheekbones that narrow to a small, pointed chin. Often considered a very feminine face shape.',
    characteristics: [
      'Wider forehead and cheekbones',
      'Narrow, sometimes pointed chin',
      'High cheekbones',
      'Defined jawline tapering to chin'
    ],
    suitableStyles: [
      'Styles with volume at the chin',
      'Side-parts to offset wider forehead',
      'Layered cuts that add width at jaw level',
      'Chin-length bobs or lobs'
    ]
  },
  diamond: {
    title: 'Diamond',
    description: 'Characterized by narrow forehead and jawline with wider cheekbones. This dramatic face shape has high, dramatic cheekbones and a narrow chin.',
    characteristics: [
      'Narrow forehead',
      'High, dramatic cheekbones',
      'Narrow, sometimes pointed chin',
      'Angular features'
    ],
    suitableStyles: [
      'Styles with volume at the forehead',
      'Side-swept bangs',
      'Chin-length styles to highlight jawline',
      'Layered cuts with texture'
    ]
  },
  rectangle: {
    title: 'Rectangle',
    description: 'Similar to a square shape but longer. Rectangle faces have a longer forehead, straight cheeks, and a strong jawline with minimal curves.',
    characteristics: [
      'Face length greater than width',
      'Straight cheeks',
      'Strong, angular jawline',
      'Forehead, cheeks, and jawline similar in width'
    ],
    suitableStyles: [
      'Layered styles that add width',
      'Soft, rounded edges',
      'Bangs to shorten the appearance of the face',
      'Cuts with volume at the sides'
    ]
  },
  triangle: {
    title: 'Triangle',
    description: 'Characterized by a wider jawline that narrows at the forehead. The cheekbones align with the jawline rather than standing out.',
    characteristics: [
      'Wider jawline',
      'Narrower forehead',
      'Minimal cheekbone definition',
      'Jawline wider than cheekbones'
    ],
    suitableStyles: [
      'Volume at the crown and temples',
      'Shorter layers at the top',
      'Side-swept bangs',
      'Styles that add fullness to the upper face'
    ]
  }
};

const FaceAnalysisResult: React.FC<FaceAnalysisResultProps> = ({ analysis, photoUrl }) => {
  const shapeInfo = faceShapeInfo[analysis.faceShape];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Face Shape Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Photo Preview */}
        <div className="md:col-span-5">
          <Card className="p-4">
            <div className="aspect-square overflow-hidden rounded-md bg-silver-dark">
              {photoUrl ? (
                <img src={photoUrl} alt="Your photo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal">
                  <p>Photo not available</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col items-center">
              <Badge variant="accent" className="mb-2">
                Confidence: {analysis.confidenceScore.toFixed(0)}%
              </Badge>
              <p className="text-sm text-charcoal text-center">
                Our AI analyzed your facial proportions with {analysis.confidenceScore.toFixed(0)}% confidence
              </p>
            </div>
          </Card>
        </div>
        
        {/* Analysis Results */}
        <div className="md:col-span-7">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold mr-3">{shapeInfo.title} Face Shape</h3>
              <Badge variant="primary">{shapeInfo.title}</Badge>
            </div>
            
            <p className="text-charcoal mb-6">{shapeInfo.description}</p>
            
            <div className="mb-6">
              <h4 className="font-bold mb-2">Characteristics:</h4>
              <ul className="list-disc pl-5 text-charcoal space-y-1">
                {shapeInfo.characteristics.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2">Recommended Hairstyles:</h4>
              <ul className="list-disc pl-5 text-charcoal space-y-1">
                {shapeInfo.suitableStyles.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mb-6">
        <Button variant="primary">
          See Recommended Haircuts
        </Button>
        <Button variant="secondary">
          Share Results
        </Button>
      </div>
      
      <Card variant="alt" className="p-6 text-center">
        <h3 className="text-lg font-bold mb-2">Want More Detailed Recommendations?</h3>
        <p className="text-charcoal mb-4">
          Upgrade to Premium for personalized styling recommendations and virtual try-on features.
        </p>
        <Button variant="tertiary">
          Upgrade to Premium
        </Button>
      </Card>
    </div>
  );
};

export default FaceAnalysisResult;