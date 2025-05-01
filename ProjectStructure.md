# StyleSense AI - Merged Project Structure

## Project Overview
StyleSense AI is an intelligent web application that uses AI to analyze users' face shapes and provide tailored haircut recommendations. The application combines a beautiful, intuitive UI with robust backend functionality.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router
- **API Communication**: Axios
- **Face Detection**: MediaPipe (client-side analysis)

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL with Sequelize ORM
- **File Storage**: AWS S3
- **Authentication**: JWT
- **Machine Learning**: TensorFlow.js (server-side backup analysis)

## Project Directory Structure

```
stylesense-ai/
├── client/                  # Frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # UI components
│   │   │   ├── analysis/    # Face analysis components
│   │   │   ├── common/      # Reusable UI elements
│   │   │   ├── home/        # Home page components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── recommendation/ # Recommendation components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── models/          # TypeScript interfaces
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and external services
│   │   ├── styles/          # Global styles
│   │   ├── App.tsx          # Root component
│   │   └── index.tsx        # Entry point
│   ├── tailwind.config.ts   # Tailwind configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Dependencies
│
├── server/                  # Backend application
│   ├── src/
│   │   ├── config/          # Server configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Database models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── app.ts           # Main application file
│   ├── uploads/             # Temporary file storage
│   ├── models/              # ML models
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Dependencies
│
├── .env.example             # Environment variables example
├── .gitignore               # Git ignore configuration
├── docker-compose.yml       # Docker configuration
├── package.json             # Root package.json for scripts
└── README.md                # Project documentation
```

## Key Features

### Face Analysis
- Upload photo or take with camera
- Client-side face shape detection with MediaPipe
- Server-side backup analysis with TensorFlow
- Identifies 7 face shapes (oval, round, square, heart, diamond, rectangle, triangle)
- Explains face shape characteristics

### Haircut Recommendations
- Personalized recommendations based on face shape
- Filter by hair type, length preference, and maintenance level
- Detailed explanation of why styles complement face shape
- Visual examples of recommended styles
- Gallery of hairstyle inspirations

### User Experience
- Modern, clean UI with beautiful gradients and typography
- Intuitive user flow
- Mobile-responsive design
- Fast face analysis with visual feedback

### Account Features
- Anonymous sessions for basic analysis
- User accounts for saving results
- Premium subscription model for advanced features
- Share results via link

## Data Flow

1. **Face Analysis Flow**
   - User uploads/captures photo
   - Client-side MediaPipe analysis processes the image
   - If successful, results are sent to server with the image
   - If client-side analysis fails, server performs backup analysis
   - Results are stored and linked to user/session

2. **Recommendation Flow**
   - Analysis results determine face shape
   - Server queries database for suitable styles
   - Styles are filtered and ranked by relevance
   - Free users see limited recommendations
   - Premium users see all recommendations

3. **User Session Flow**
   - Anonymous users get session ID stored in localStorage
   - Results linked to session for temporary access
   - Registered users can save results permanently
   - Premium users unlock additional features

## API Endpoints

### Authentication
- POST `/api/users/register`: Register new user
- POST `/api/users/login`: Login user
- GET `/api/users/profile`: Get user profile

### Face Analysis
- POST `/api/analysis/face`: Upload and analyze photo
- POST `/api/analysis/face-with-analysis`: Upload pre-analyzed photo
- GET `/api/analysis/:analysisId`: Get analysis by ID
- GET `/api/analysis/share/:shareToken`: Get shared analysis
- DELETE `/api/analysis/:analysisId`: Delete analysis

### Recommendations
- GET `/api/recommendations/analysis/:analysisId`: Get recommendations
- GET `/api/recommendations/shared/:shareToken`: Get shared recommendations
- POST `/api/recommendations/save/:recommendationId`: Save recommendation
- GET `/api/recommendations/saved`: Get saved recommendations
- DELETE `/api/recommendations/saved/:savedId`: Delete saved recommendation
- GET `/api/recommendations/premium/analysis/:analysisId`: Get premium recommendations

### Styles
- GET `/api/styles`: Get all styles (with filtering)
- GET `/api/styles/:styleId`: Get style by ID
- GET `/api/styles/face-shape/:faceShape`: Get styles for face shape
- POST `/api/styles/filter`: Complex style filtering

### Subscription
- POST `/api/users/subscription`: Create subscription
- GET `/api/users/subscription`: Get subscription details
- DELETE `/api/users/subscription`: Cancel subscription