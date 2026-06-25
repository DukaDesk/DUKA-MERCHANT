# DukaDesk Merchant Portal - Development Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd dukaDesk
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open browser:**
   Navigate to http://localhost:3000

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server |
| `npm run build` | Create production build |
| `npm test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run format` | Format code with Prettier |

## File Organization

```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
├── App.jsx           # Root component
├── index.js          # Entry point
└── index.css         # Global styles
```

## Component Structure

Each component follows this pattern:
```jsx
import { useState } from "react";

export default function ComponentName() {
  const [state, setState] = useState(null);

  return (
    <div className="component">
      {/* Component content */}
    </div>
  );
}
```

## Adding New Features

1. **Create component:**
   ```bash
   touch src/components/FeatureName.jsx
   ```

2. **Import in App.jsx:**
   ```jsx
   import FeatureName from "./components/FeatureName";
   ```

3. **Add routing:**
   Add case to the page state switch in App.jsx

## Styling

- Use inline styles or CSS classes
- Global styles in `src/index.css`
- Follow BEM naming convention for classes

## Best Practices

- ✅ Use functional components
- ✅ Use React hooks (useState, useEffect, useContext)
- ✅ Keep components small and focused
- ✅ Extract reusable logic into custom hooks
- ✅ Use PropTypes or TypeScript for type checking
- ✅ Write meaningful comments
- ✅ Avoid prop drilling, use context when needed

## Debugging

### Browser DevTools
- React DevTools extension
- Redux DevTools (if using Redux)

### Console Logging
```javascript
console.log("Debug info:", variable);
console.error("Error:", error);
```

## Performance Tips

- Use React.memo for component memoization
- Implement code splitting with React.lazy
- Optimize re-renders with useCallback
- Use useMemo for expensive calculations
- Lazy load images

## Testing

Create test files alongside components:
```
src/components/
├── Button.jsx
└── Button.test.jsx
```

Run tests:
```bash
npm test
```

## Troubleshooting

### Hot reload not working
- Clear cache: `npm start -- --reset-cache`
- Restart dev server

### Module not found errors
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

### Port 3000 in use
- Kill process on port 3000
- Or use different port: `PORT=3001 npm start`

## Git Workflow

1. Create feature branch
2. Make changes
3. Format code: `npm run format`
4. Lint code: `npm run lint`
5. Commit with clear message
6. Push and create PR

## Resources

- [React Documentation](https://react.dev)
- [Create React App Docs](https://create-react-app.dev)
- [Recharts Documentation](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

## Support

For help or questions, contact the development team.
