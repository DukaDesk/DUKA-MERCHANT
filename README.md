# DukaDesk Merchant Portal

A modern, production-ready React dashboard for e-commerce merchants to manage products, orders, analytics, and integrations.

## Features

- 🔐 **Authentication** - Secure login and account management
- 📊 **Analytics Dashboard** - Real-time sales and performance metrics
- 📦 **Product Management** - Add, edit, and manage inventory
- 🛒 **Order Management** - Track and manage customer orders
- 💬 **Messaging** - Built-in messaging system
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔌 **Integrations** - Connect with external services
- 💳 **Billing** - Manage payments and subscriptions

## Tech Stack

- **React** 18.2.0 - UI Framework
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Scripts** - Build tooling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the project directory:
```bash
cd dukaDesk
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update environment variables in `.env` as needed.

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for best performance.

### `npm test`
Launches the test runner.

### `npm run lint`
Checks code for linting errors.

### `npm run format`
Formats code using Prettier.

## Project Structure

```
dukaDesk/
├── public/              # Static assets
│   ├── index.html      # Main HTML file
│   ├── manifest.json   # PWA manifest
│   └── robots.txt      # SEO robots file
├── src/
│   ├── components/     # React components
│   │   ├── Analytics.jsx
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── Products.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Root component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── .eslintrc.json      # ESLint configuration
├── .gitignore          # Git ignore rules
├── .prettierrc          # Prettier configuration
└── package.json        # Dependencies and scripts
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | http://localhost:3001 |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | 10000 |
| `REACT_APP_ENV` | Environment (development/production) | development |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics | true |
| `REACT_APP_ENABLE_CHAT` | Enable chat feature | true |

## Deployment

### Production Build

```bash
npm run build
```

The build folder is ready to be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Azure Static Web Apps

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

Build and run:
```bash
docker build -t dukadesk-merchant .
docker run -p 3000:3000 dukadesk-merchant
```

## Code Style

This project uses:
- **ESLint** - Code linting
- **Prettier** - Code formatting

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## Performance Optimization

- Code splitting with React lazy loading
- Image optimization
- CSS minification
- Production build optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Format code: `npm run format`
5. Commit with clear messages
6. Push and create a pull request

## Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## Security

- Keep dependencies updated: `npm update`
- Check for vulnerabilities: `npm audit`
- Use environment variables for sensitive data
- Never commit `.env` files

## License

Copyright © 2024 DukaDesk. All rights reserved.

## Support

For issues and questions, please contact the development team or open an issue in the repository.
