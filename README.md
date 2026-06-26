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
- **Vite** - Build tooling

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

### `npm start` / `npm run dev`
Runs the app in development mode via Vite dev server.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run lint`
Checks code for linting errors.

### `npm run format`
Formats code using Prettier.

## Project Structure

```
dukaDesk/
├── index.html          # Main HTML file (Vite entry)
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── theme.js        # Design tokens & theme
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier configuration
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | http://localhost:3001 |

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

A `Dockerfile` is included. Build and run:

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
