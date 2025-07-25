# DevToolkit UI

React frontend for the Developer Utility Toolkit.

## 🚀 Features

- **Base64 Encoder/Decoder** - Convert text to/from Base64 encoding
- **Hash Generator** - Generate MD5, SHA-1, SHA-256, SHA-512 hashes
- **JWT Decoder/Verifier** - Decode and verify JSON Web Tokens
- **Jasypt Encrypt/Decrypt** - Encrypt and decrypt text using Jasypt
- **URL Encode/Decode** - Encode and decode URLs
- **UUID Generator** - Generate UUIDs (v1, v4, v5)
- **Unix Timestamp Converter** - Convert between timestamps and readable dates
- **Image Utilities** - Upload, preview, and convert images to Base64
- **Regex Tester** - Test and validate regular expressions
- **JSON/YAML/XML Converter** - Convert between different data formats
- **Text Diff Tool** - Compare and highlight differences between texts
- **cURL Command Generator** - Generate cURL commands from HTTP requests
- **CRON Expression Evaluator** - Evaluate and describe CRON expressions
- **Gitignore Generator** - Generate .gitignore files for various technologies
- **SQL Formatter** - Format and beautify SQL queries

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for API communication

## 📦 Installation & Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devtoolkit-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api` (requires backend to be running)

## 🏗️ Architecture

### Feature-Based Structure

The frontend follows a modern feature-based folder structure:

```
src/
├── features/                    # Feature components
│   ├── base64/                 # Base64 tool
│   ├── hash/                   # Hash generator
│   ├── jwt/                    # JWT tool
│   ├── jasypt/                 # Jasypt encryption
│   ├── cron/                   # CRON evaluator
│   └── utility/                # Utility tools
├── shared/                     # Shared components
│   ├── components/             # Reusable UI components
│   └── theme/                  # Material-UI theme
├── services/                   # API services
├── hooks/                      # Custom React hooks
├── utils/                      # Utility functions
├── types/                      # TypeScript types
└── constants/                  # Application constants
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
./deploy.sh

# Or manually
docker-compose up --build -d

# Stop service
docker-compose down
```

### Modern Cloud Deployment

#### Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables
vercel env add VITE_API_BASE_URL https://your-backend-api.com/api
```

#### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### AWS S3 + CloudFront
```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### GitHub Pages
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/devtoolkit-ui",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### Manual Docker Commands
```bash
# Build image
docker build -t devtoolkit-ui .

# Run container
docker run -p 3000:3000 devtoolkit-ui
```

## 🎨 UI Components

The application features a modern, responsive UI built with Material-UI:

- **Navigation Drawer** - Easy access to all tools
- **Card-based Layout** - Clean, organized interface
- **Real-time Validation** - Immediate feedback on inputs
- **Copy to Clipboard** - One-click copying of results
- **Error Handling** - Clear error messages and validation
- **Loading States** - Visual feedback during operations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Developer Utility Toolkit
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the feature-based structure for new features
4. Add tests if applicable
5. Submit a pull request

## 🔗 Related Repositories

- [DevToolkit Backend](https://github.com/your-org/devtoolkit) - Spring Boot API 