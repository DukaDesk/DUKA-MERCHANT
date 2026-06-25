# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Environment variables configured
- [ ] Dependencies up to date (`npm audit`)
- [ ] Code formatted (`npm run format`)
- [ ] Git history clean
- [ ] Documentation updated

## Building for Production

```bash
cd dukaDesk
npm run build
```

This creates an optimized production build in the `build/` directory.

## Deployment Options

### 1. Vercel (Recommended for Next.js-style apps)

```bash
npm i -g vercel
vercel
```

### 2. Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### 3. Docker & Docker Compose

```bash
# Build image
docker build -t dukadesk-merchant:latest .

# Run container
docker run -p 3000:3000 dukadesk-merchant:latest

# Or use docker-compose
docker-compose up -d
```

### 4. AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### 5. Azure Static Web Apps

```bash
# Install Azure CLI
# Create static web app and deploy
az staticwebapp create --name dukadesk-merchant \
  --resource-group my-resource-group \
  --source ./build
```

### 6. GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/repo-name",

# Deploy
npm run build
gh-pages -d build
```

## Environment Configuration

Production `.env` file:
```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
REACT_APP_ENABLE_ANALYTICS=true
```

## Performance Optimization

### Build Analysis
```bash
npm install -g source-map-explorer
npm run build
source-map-explorer 'build/static/js/*.js'
```

### Optimize Images
- Use WebP format
- Compress images before uploading
- Use CDN for static assets

### Enable GZIP Compression
Most hosting providers handle this automatically.

### Caching Strategy
```html
<!-- index.html -->
<!-- Cache busting for static assets -->
<link rel="stylesheet" href="/static/css/main.[hash].css">
<script src="/static/js/main.[hash].js"></script>
```

## Security

1. **HTTPS Only** - Always use HTTPS in production
2. **Security Headers:**
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   Content-Security-Policy: default-src 'self'
   ```

3. **Environment Variables** - Never commit sensitive data
4. **Dependencies** - Regular security audits
   ```bash
   npm audit
   npm audit fix
   ```

5. **CORS Configuration** - Restrict API endpoints

## Monitoring & Analytics

### Add Analytics
```javascript
// In App.jsx or index.js
import { useEffect } from "react";

useEffect(() => {
  // Add your analytics script
  window.gtag?.("config", "GA_ID");
}, []);
```

### Error Tracking
Consider services like:
- Sentry
- Rollbar
- LogRocket
- Bugsnag

## Database & API Setup

Update `REACT_APP_API_URL` to point to your backend:
```env
REACT_APP_API_URL=https://api.production.example.com
```

## Continuous Deployment (CI/CD)

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: build
          path: build/
```

## Rollback Procedure

1. Revert to previous deployment
2. Verify functionality
3. Check logs for errors
4. Notify team

## Troubleshooting

### White screen of death
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check network tab for failed requests
4. Review server logs

### Performance issues
1. Enable caching headers
2. Optimize images
3. Use CDN for static assets
4. Implement code splitting

### API connection errors
1. Verify CORS is configured
2. Check API endpoint URL
3. Verify API server is running
4. Check network connectivity

## Post-Deployment

1. Test all features
2. Verify analytics are working
3. Check error tracking
4. Monitor performance metrics
5. Get user feedback

## Support & Maintenance

- Monitor uptime and performance
- Regular security updates
- Backup important data
- Keep documentation current
- Plan regular maintenance windows

---

For more help, see [README.md](./README.md) or [DEVELOPMENT.md](./DEVELOPMENT.md)
