"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedHaircutStyles = void 0;
const uuid_1 = require("uuid");
const HaircutStyle_1 = require("../models/HaircutStyle");
const database_1 = __importDefault(require("../config/database"));
const haircutStylesData = [
    {
        name: 'Textured Crop',
        description: 'A modern, textured crop with short sides and a longer top that can be styled in various ways. Great for adding volume and definition.',
        suitable_face_shapes: ['oval', 'round', 'square'],
        suitable_hair_types: ['straight', 'wavy'],
        suitable_genders: ['male'],
        length_category: 'short',
        maintenance_level: 2,
        image_url: 'https://example.com/images/textured-crop.jpg',
        style_attributes: {
            volume: 'medium',
            texture: 'high',
            formality: 'casual'
        }
    },
    {
        name: 'Classic Bob',
        description: 'A timeless bob cut that hits at chin length with a straight, clean line. Versatile and frames the face beautifully.',
        suitable_face_shapes: ['oval', 'heart', 'square'],
        suitable_hair_types: ['straight', 'wavy'],
        suitable_genders: ['female'],
        length_category: 'medium',
        maintenance_level: 3,
        image_url: 'https://example.com/images/classic-bob.jpg',
        style_attributes: {
            volume: 'low',
            texture: 'low',
            formality: 'versatile'
        }
    },
    {
        name: 'Layered Mid-Length',
        description: 'A shoulder-length cut with layers throughout to add movement and volume. Flattering on most face shapes and versatile for styling.',
        suitable_face_shapes: ['oval', 'round', 'heart'],
        suitable_hair_types: ['straight', 'wavy', 'curly'],
        suitable_genders: ['female'],
        length_category: 'medium',
        maintenance_level: 3,
        image_url: 'https://example.com/images/layered-mid.jpg',
        style_attributes: {
            volume: 'medium',
            texture: 'medium',
            formality: 'versatile'
        }
    },
    {
        name: 'Undercut Fade',
        description: 'A bold, modern style with short faded sides and a longer top. Can be styled slick or textured for different looks.',
        suitable_face_shapes: ['oval', 'diamond', 'triangle'],
        suitable_hair_types: ['straight', 'wavy'],
        suitable_genders: ['male'],
        length_category: 'short',
        maintenance_level: 4,
        image_url: 'https://example.com/images/undercut-fade.jpg',
        style_attributes: {
            volume: 'high',
            texture: 'medium',
            formality: 'trendy'
        }
    },
    {
        name: 'Long Layers',
        description: 'Long hair with strategically placed layers to add movement and reduce bulk. Frames the face and adds softness.',
        suitable_face_shapes: ['oval', 'square', 'rectangle'],
        suitable_hair_types: ['straight', 'wavy', 'curly'],
        suitable_genders: ['female'],
        length_category: 'long',
        maintenance_level: 2,
        image_url: 'https://example.com/images/long-layers.jpg',
        style_attributes: {
            volume: 'medium',
            texture: 'medium',
            formality: 'versatile'
        }
    },
    {
        name: 'Side-Swept Pixie',
        description: 'A short, feminine cut with longer layers on top that can be swept to the side. Low maintenance and chic.',
        suitable_face_shapes: ['oval', 'heart', 'diamond'],
        suitable_hair_types: ['straight', 'wavy'],
        suitable_genders: ['female'],
        length_category: 'short',
        maintenance_level: 3,
        image_url: 'https://example.com/images/side-swept-pixie.jpg',
        style_attributes: {
            volume: 'low',
            texture: 'medium',
            formality: 'chic'
        }
    },
    {
        name: 'Buzz Cut',
        description: 'A very short, uniform length all over the head. Extremely low maintenance and bold.',
        suitable_face_shapes: ['oval', 'square', 'diamond'],
        suitable_hair_types: ['straight', 'wavy', 'curly', 'coily'],
        suitable_genders: ['male'],
        length_category: 'short',
        maintenance_level: 1,
        image_url: 'https://example.com/images/buzz-cut.jpg',
        style_attributes: {
            volume: 'none',
            texture: 'none',
            formality: 'casual'
        }
    },
    {
        name: 'Soft Waves',
        description: 'Medium to long hair styled in soft, flowing waves. Adds movement and volume to hair.',
        suitable_face_shapes: ['oval', 'square', 'rectangle', 'triangle'],
        suitable_hair_types: ['straight', 'wavy'],
        suitable_genders: ['female'],
        length_category: 'medium',
        maintenance_level: 4,
        image_url: 'https://example.com/images/soft-waves.jpg',
        style_attributes: {
            volume: 'high',
            texture: 'medium',
            formality: 'elegant'
        }
    },
    {
        name: 'Pompadour',
        description: 'A classic style with volume on top and shorter sides. Can be styled with various levels of height and texture.',
        suitable_face_shapes: ['oval', 'round', 'triangle'],
        suitable_hair_types: ['straight', 'wavy'],
        suitable_genders: ['male'],
        length_category: 'medium',
        maintenance_level: 4,
        image_url: 'https://example.com/images/pompadour.jpg',
        style_attributes: {
            volume: 'high',
            texture: 'medium',
            formality: 'dressy'
        }
    },
    {
        name: 'Asymmetrical Bob',
        description: 'A bob haircut with one side longer than the other. Modern and edgy with a bold statement.',
        suitable_face_shapes: ['oval', 'heart', 'square'],
        suitable_hair_types: ['straight', 'wavy'],
        suitable_genders: ['female'],
        length_category: 'medium',
        maintenance_level: 4,
        image_url: 'https://example.com/images/asymmetrical-bob.jpg',
        style_attributes: {
            volume: 'medium',
            texture: 'low',
            formality: 'trendy'
        }
    }
];
const seedHaircutStyles = async () => {
    try {
        await database_1.default.authenticate();
        const existingCount = await HaircutStyle_1.HaircutStyle.count();
        if (existingCount > 0) {
            console.log(`Database already has ${existingCount} haircut styles. Skipping seed.`);
            return;
        }
        for (const styleData of haircutStylesData) {
            await HaircutStyle_1.HaircutStyle.create({
                style_id: (0, uuid_1.v4)(),
                ...styleData
            });
        }
        console.log(`Successfully seeded ${haircutStylesData.length} haircut styles.`);
    }
    catch (error) {
        console.error('Error seeding haircut styles:', error);
        throw error;
    }
};
exports.seedHaircutStyles = seedHaircutStyles;
if (require.main === module) {
    (0, exports.seedHaircutStyles)()
        .then(() => {
        console.log('Seeding complete!');
        process.exit(0);
    })
        .catch(error => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=haircutStylesSeeder.js.map