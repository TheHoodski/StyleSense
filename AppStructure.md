# StyleSense AI Application Structure

## Project Architecture Overview

StyleSense AI follows a modern, scalable architecture with clear separation of concerns. This document outlines the high-level structure, component organization, and development workflow.

## Technology Stack

### Frontend
- **Framework**: React.js (Create React App for simplicity)
- **State Management**: React Context API (simpler than Redux for MVP)
- **Styling**: Tailwind CSS
- **UI Components**: Minimal component library
- **API Communication**: Axios
- **Analytics**: Simple Mixpanel integration

### Backend
- **API Framework**: Node.js with Express
- **Database**: PostgreSQL with basic ORM
- **File Storage**: AWS S3
- **Machine Learning**: TensorFlow.js (browser-based when possible)
- **Face Detection**: MediaPipe or similar pre-trained model

### DevOps
- **Hosting**: Netlify (frontend) and Heroku (backend)
- **CI/CD**: GitHub Actions (basic pipeline)
- **Monitoring**: Basic error logging
- **Environment**: Development and Production

## Directory Structure

```
stylesense-ai/
├── client/                  # Frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Base components (Button, Card, etc.)
│   │   │   ├── layout/      # Layout components
│   │   │   ├── features/    # Feature-specific components
│   │   │   └── modals/      # Modal components
│   │   ├── config/          # Configuration files
│   │   ├── hooks/           # Custom React hooks
│   │   ├── models/          # TypeScript interfaces & types
│   │   ├── pages/           # Page components / routes
│   │   ├── services/        # API and external services
│   │   ├── store/           # Redux store configuration
│   │   │   ├── slices/      # Redux slices
│   │   │   └── index.ts     # Store configuration
│   │   ├── styles/          # Global styles and theme
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Root component
│   ├── .env.example         # Environment variables example
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript configuration
│
├── server/                  # Backend application
│   ├── src/
│   │   ├── config/          # Server configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Data models and schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── app.ts           # Main application file
│   ├── .env.example         # Environment variables example
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript configuration
│
├── ml/                      # Machine learning services
│   ├── face-analysis/       # Face shape detection model
│   ├── style-matching/      # Style recommendation engine
│   ├── datasets/            # Training datasets
│   └── notebooks/           # Jupyter notebooks for experimentation
│
├── infrastructure/          # Infrastructure as code
│   ├── terraform/           # Terraform configurations
│   ├── docker/              # Docker configurations
│   └── kubernetes/          # Kubernetes configurations
│
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
└── README.md                # Project overview
```

## Component Structure

### Frontend Component Architecture

1. **Atomic Design Methodology**
   - **Atoms**: Basic building blocks (Button, Input, Typography)
   - **Molecules**: Groups of atoms (Form fields, Search bar)
   - **Organisms**: Groups of molecules (Navigation, Photo Upload)
   - **Templates**: Page layouts
   - **Pages**: Specific instances of templates

2. **Core Components**
   - `PhotoCapture`: Handles photo uploading and camera integration
   - `FaceAnalysisResult`: Displays face shape analysis results
   - `HaircutCard`: Individual haircut recommendation display
   - `RecommendationList`: Collection of haircut recommendations
   - `StyleFilters`: Filtering options for recommendations
   - `StylePreview`: Visualization of hairstyles on user (premium)
   - `UserProfile`: User account information and history
   - `PremiumUpgrade`: Premium subscription promotion

### Backend Service Architecture

1. **API Gateway Layer**
   - Request validation
   - Authentication/Authorization
   - Rate limiting
   - Request logging

2. **Service Layer**
   - `UserService`: User management and authentication
   - `AnalysisService`: Photo processing and face shape detection
   - `RecommendationService`: Haircut style matching
   - `SubscriptionService`: Premium subscription management
   - `StyleCatalogService`: Haircut style database management

3. **Data Access Layer**
   - Database repositories
   - External API integrations
   - Cache management

## Key Workflows

### Face Analysis Workflow

1. User uploads photo via `PhotoCapture` component
2. Frontend pre-processes image (resize, orientation)
3. Image sent to `/api/analysis/face` endpoint
4. `AnalysisService` processes image with ML model
5. Face shape detected and confidence score calculated
6. Results returned to frontend
7. `FaceAnalysisResult` displays face shape with explanation
8. Analysis result saved to database

### Recommendation Workflow

1. After face analysis, frontend requests recommendations
2. `RecommendationService` queries style database based on face shape
3. Styles filtered by relevance and user preferences
4. Recommendations returned with explanation for each
5. `RecommendationList` displays results with sorting/filtering
6. User can save favorites or proceed to virtual try-on

### Premium Upgrade Workflow

1. User encounters premium feature limitation
2. `PremiumUpgrade` component displays benefits
3. User initiates subscription process
4. Payment processed via Stripe integration
5. `SubscriptionService` creates subscription record
6. User gains immediate access to premium features

## Page Structure

### Core Pages
- **Landing Page**: Clear value proposition with immediate call to action
- **Analysis Tool**: Main app interface with photo upload and processing
- **Results Page**: Face shape results and haircut recommendations
- **Shared Results**: Public page for shared analysis results

### Secondary Pages
- **How It Works**: Simple process explanation
- **Premium Features**: Premium tier description and sign-up
- **Privacy Policy**: Simplified explanation of data handling

### Future Pages (Post-MVP)
- **User Dashboard**: For premium users to access saved analyses
- **Subscription Management**: For premium account management

## Responsive Design Strategy

1. **Mobile-First Approach**
   - Core functionality optimized for mobile devices
   - Progressive enhancement for larger screens

2. **Breakpoints**
   - `sm`: 640px (small mobile)
   - `md`: 768px (large mobile/small tablet)
   - `lg`: 1024px (tablet/small desktop)
   - `xl`: 1280px (desktop)
   - `2xl`: 1536px (large desktop)

3. **Component Adaptations**
   - Photo capture interface optimized for mobile
   - Recommendation grid adjusts columns by breakpoint
   - Navigation collapses to drawer on mobile

## State Management

1. **Global State** (Redux)
   - User authentication state
   - Current analysis data
   - Application preferences

2. **Local Component State** (React State)
   - UI interaction states
   - Form inputs
   - Component-specific data

3. **Server State** (React Query)
   - API data fetching and caching
   - Synchronization with backend

## Performance Optimization

1. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Dynamic imports for heavy libraries

2. **Image Optimization**
   - Responsive images with srcset
   - Next.js Image component
   - WebP format with fallbacks

3. **Caching Strategy**
   - Browser caching for static assets
   - Redis caching for API responses
   - Service worker for offline support

## Security Considerations

1. **Frontend Security**
   - CSRF protection
   - Content Security Policy
   - Sanitized user inputs
   - Secure HTTP headers

2. **API Security**
   - JWT authentication with short expiry
   - Rate limiting
   - Input validation
   - Parameterized queries

3. **Data Security**
   - Encryption at rest and in transit
   - Secure handling of user photos
   - Privacy