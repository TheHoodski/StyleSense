# StyleSense AI

StyleSense AI is an intelligent web application that analyzes users' face shapes and provides personalized haircut recommendations.

## Project Structure

The project consists of two main parts:
- **Client**: React application with TypeScript and Tailwind CSS
- **Server**: Node.js/Express backend with PostgreSQL database

## Modified Implementation

This version of the project has been modified to:
1. Use client-side face shape detection using MediaPipe instead of TensorFlow.js on the server
2. Provide a local file storage option instead of requiring AWS S3

## Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL (installed and running)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/stylesense-ai.git
cd stylesense-ai
```

### 2. Set up the server

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # If .env.example exists
# Or create .env manually with appropriate settings
```

Edit the `.env` file to configure your environment:

```
# Server environment
NODE_ENV=development
PORT=5000

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stylesense
DB_USER=postgres
DB_PASSWORD=your_password

# JWT configuration
JWT_SECRET=your-secret-key-should-be-long-and-secure
JWT_EXPIRES_IN=24h

# Local file storage configuration
LOCAL_FILE_SERVER_URL=http://localhost:5000

# Logging
LOG_LEVEL=debug

# CORS configuration
CORS_ORIGIN=http://localhost:3000
```

If you want to use the local file storage system instead of AWS S3:
1. Replace `server/src/utils/s3Utils.ts` with the provided `simplified-s3-utils` file
2. Add the provided `fileRoutes.ts` to `server/src/routes/`
3. Update `app.ts` to include the file routes

### 3. Set up the database

Create a PostgreSQL database for the application:

```sql
CREATE DATABASE stylesense;
```

The tables will be automatically created when you start the server.

### 4. Build and start the server

```bash
# Build the TypeScript code
npm run build

# Start the server
npm start

# For development with auto-reload
npm run dev
```

### 5. Set up the client

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" > .env
```

### 6. Start the client

```bash
npm start
```

The application should now be running at http://localhost:3000.

## Features

- Face shape analysis using MediaPipe face detection
- Personalized haircut recommendations based on face shape
- User profiles with saved recommendations (premium feature)
- Sharing analysis results via unique links

## Modified Components

The following components have been modified to use client-side face analysis:

1. `client/src/components/analysis/PhotoUpload.tsx`: Uses MediaPipe for face detection
2. `server/src/services/faceAnalysisService.ts`: Simplified version without TensorFlow
3. `server/src/controllers/analysisController.ts`: Updated to accept client-side analysis
4. `server/src/utils/s3Utils.ts`: Optional local file storage version

## Troubleshooting

### Face Detection Issues

If the client-side face detection isn't working properly:
- Make sure you have a clear, well-lit front-facing photo
- Ensure the face is clearly visible and not obscured
- Try a different photo if the analysis fails

### Server Connection Issues

If the client can't connect to the server:
- Check that the server is running on the correct port
- Verify that the `REACT_APP_API_BASE_URL` in the client `.env` file matches your server URL
- Make sure CORS is properly configured

### Database Connection Issues

If the server can't connect to the database:
- Verify your PostgreSQL service is running
- Check the database credentials in the server `.env` file
- Make sure the database has been created

## Next Steps for Development

1. Improve face shape detection accuracy
2. Add more haircut styles to the database
3. Implement virtual try-on feature
4. Add support for different hair types and textures
5. Enhance recommendation algorithm based on user feedback

## License

This project is available under the MIT License.