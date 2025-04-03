# StyleSense AI

StyleSense AI is an intelligent web application that uses AI to analyze users' face shapes and provide tailored haircut recommendations.

## Features

- Face shape analysis with AI
- Personalized haircut recommendations
- Virtual try-on (Premium)
- Style saving and history (Premium)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express (coming soon)
- **Database**: PostgreSQL (coming soon)
- **AI**: TensorFlow.js (coming soon)

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/stylesense-ai.git
   cd stylesense-ai
   ```

2. Install dependencies
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or with yarn
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
stylesense-ai/
├── public/                  # Static files
├── src/
│   ├── components/          # React components
│   │   ├── analysis/        # Face analysis components
│   │   ├── common/          # Common UI components
│   │   ├── home/            # Home page components
│   │   ├── layout/          # Layout components
│   │   └── recommendation/  # Recommendation components
│   ├── models/              # TypeScript types and interfaces
│   ├── pages/               # Page components
│   ├── styles/              # Global styles and Tailwind config
│   ├── App.tsx              # Main App component and routing
│   └── index.tsx            # Entry point
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Color Palette

The application uses a custom color palette defined in `tailwind.config.js`:

- **Primary**: Deep Indigo `#2D3047`
- **Accent**: Teal Accent `#1E91D6`
- **Secondary**: Soft Coral `#FF8370`
- **Background**: Off-White `#F8F9FC`
- **Additional colors**: See `tailwind.config.js` and `globals.css` for details

## Future Development

- Backend API implementation
- Face detection and analysis with ML models
- User account system
- Premium subscription features
- Mobile applications

## License

This project is licensed under the MIT License - see the LICENSE file for details.