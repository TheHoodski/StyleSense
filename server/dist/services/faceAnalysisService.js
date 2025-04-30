"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineShapeFromLandmarks = exports.getFaceShapeInfo = exports.analyzePhoto = exports.processClientAnalysis = void 0;
const processClientAnalysis = (faceShape, confidenceScore) => {
    return {
        success: true,
        faceShape,
        confidenceScore,
        features: {
            faceWidth: 0,
            faceHeight: 0,
            jawWidth: 0,
            jawAngle: 0,
            cheekboneWidth: 0,
            foreheadWidth: 0,
            chinShape: 'rounded'
        }
    };
};
exports.processClientAnalysis = processClientAnalysis;
const analyzePhoto = async (_photoPath, faceShape, confidenceScore) => {
    try {
        if (faceShape && confidenceScore) {
            return (0, exports.processClientAnalysis)(faceShape, confidenceScore);
        }
        return {
            success: true,
            faceShape: 'oval',
            confidenceScore: 70,
            features: {
                faceWidth: 0,
                faceHeight: 0,
                jawWidth: 0,
                jawAngle: 0,
                cheekboneWidth: 0,
                foreheadWidth: 0,
                chinShape: 'rounded'
            }
        };
    }
    catch (error) {
        console.error('Error analyzing photo:', error);
        return {
            success: false,
            error: 'Failed to analyze photo'
        };
    }
};
exports.analyzePhoto = analyzePhoto;
const getFaceShapeInfo = (faceShape) => {
    const faceShapeInfo = {
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
    return faceShapeInfo[faceShape];
};
exports.getFaceShapeInfo = getFaceShapeInfo;
const determineShapeFromLandmarks = (landmarks) => {
    try {
        const jawLeftPoint = landmarks[134];
        const jawRightPoint = landmarks[365];
        const jawWidth = calculateDistance(jawLeftPoint, jawRightPoint);
        const foreheadLeftPoint = landmarks[71];
        const foreheadRightPoint = landmarks[301];
        const foreheadWidth = calculateDistance(foreheadLeftPoint, foreheadRightPoint);
        const foreheadTopPoint = landmarks[10];
        const chinBottomPoint = landmarks[152];
        const faceHeight = calculateDistance(foreheadTopPoint, chinBottomPoint);
        const cheekboneLeftPoint = landmarks[116];
        const cheekboneRightPoint = landmarks[345];
        const cheekboneWidth = calculateDistance(cheekboneLeftPoint, cheekboneRightPoint);
        const faceWidthToHeightRatio = Math.max(jawWidth, foreheadWidth, cheekboneWidth) / faceHeight;
        const jawToForeheadRatio = jawWidth / foreheadWidth;
        const cheekboneToJawRatio = cheekboneWidth / jawWidth;
        let faceShape = 'oval';
        let confidence = 75;
        if (faceWidthToHeightRatio > 0.8) {
            if (jawToForeheadRatio > 1.1) {
                faceShape = 'triangle';
                confidence = 70 + 10 * (jawToForeheadRatio - 1.1);
            }
            else if (jawToForeheadRatio < 0.9) {
                faceShape = 'heart';
                confidence = 70 + 10 * (0.9 - jawToForeheadRatio);
            }
            else if (cheekboneToJawRatio > 1.1) {
                faceShape = 'diamond';
                confidence = 70 + 10 * (cheekboneToJawRatio - 1.1);
            }
            else {
                faceShape = 'round';
                confidence = 70;
            }
        }
        else if (faceWidthToHeightRatio < 0.7) {
            if (jawToForeheadRatio > 0.95 && jawToForeheadRatio < 1.05) {
                faceShape = 'rectangle';
                confidence = 70 + 10 * (1 - Math.abs(jawToForeheadRatio - 1));
            }
            else {
                faceShape = 'oval';
                confidence = 75;
            }
        }
        else {
            if (jawToForeheadRatio > 0.95 && jawToForeheadRatio < 1.05) {
                faceShape = 'square';
                confidence = 70 + 10 * (1 - Math.abs(jawToForeheadRatio - 1));
            }
            else {
                faceShape = 'oval';
                confidence = 75;
            }
        }
        return {
            faceShape,
            confidenceScore: Math.min(Math.round(confidence), 95)
        };
    }
    catch (error) {
        console.error('Error determining face shape from landmarks:', error);
        return {
            faceShape: 'oval',
            confidenceScore: 70
        };
    }
};
exports.determineShapeFromLandmarks = determineShapeFromLandmarks;
const calculateDistance = (point1, point2) => {
    return Math.sqrt(Math.pow(point2[0] - point1[0], 2) +
        Math.pow(point2[1] - point1[1], 2));
};
//# sourceMappingURL=faceAnalysisService.js.map