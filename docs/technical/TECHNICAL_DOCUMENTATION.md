# Technical Documentation

## Authentication System (`src/shared/auth/`)

### Overview
Unified authentication system supporting multiple user roles and secure session management.

### Components
- `auth-config.ts` - Configuration and constants
- `use-auth.ts` - React hook for authentication state
- `auth-guard.tsx` - Protected route component

### Usage
```typescript
import { useAuth } from '@/shared/hooks/use-auth';
import { AuthGuard } from '@/shared/components/auth-guard';

function Dashboard() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <AuthGuard roles={['admin', 'vendor']}>
      <div>Protected Dashboard Content</div>
    </AuthGuard>
  );
}
```

### Roles
- `admin` - Full system access
- `vendor` - Store management access
- `customer` - Customer portal access
- `supervisor` - Construction project oversight
- `expert` - Consultation and advisory access

---

## Security Configuration (`src/shared/security/`)

### Overview
Comprehensive security layer with CSP, CORS, and rate limiting.

### Features
- Content Security Policy (CSP) configuration
- Cross-Origin Resource Sharing (CORS) settings
- Rate limiting for API endpoints
- Input validation and sanitization
- Security headers configuration

### Implementation
```typescript
import { SecurityConfig } from '@/shared/security/security-config';

// Apply security middleware
app.use(SecurityConfig.corsOptions);
app.use(SecurityConfig.rateLimiter);
```

---

## Error Handling (`src/shared/error/`)

### Overview
Centralized error handling with user-friendly error boundaries and logging.

### Components
- Error boundaries for React components
- API error handling middleware
- User-friendly error messages
- Error logging and monitoring

### Usage
```typescript
import { ErrorHandler } from '@/shared/error/error-handling';

function App() {
  return (
    <ErrorHandler>
      <YourApp />
    </ErrorHandler>
  );
}
```

---

## Testing Framework (`jest.config.platform.js`)

### Overview
Comprehensive testing setup with Jest and React Testing Library.

### Features
- Unit testing for components and utilities
- Integration testing for API endpoints
- E2E testing configuration
- Test utilities and mocks

### Commands
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:e2e        # End-to-end tests
```

---

## CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

### Overview
Automated deployment pipeline with GitHub Actions.

### Features
- Automated testing on PR and push
- Code quality checks (ESLint, TypeScript)
- Automated deployment to staging/production
- Security scanning and vulnerability checks

### Workflow
1. Code push triggers pipeline
2. Run tests and quality checks
3. Build application
4. Deploy to appropriate environment
5. Run post-deployment tests

---

## Standalone Products (`src/standalone/`)

### BinnaPOS (`src/standalone/pos/`)
Independent Point of Sale system with dedicated deployment configuration.

**Features:**
- Sales processing
- Payment integration
- Inventory tracking
- Customer management
- Reporting and analytics

**Deployment:**
```bash
cd src/standalone/pos
npm install
npm run build
npm run start
```

### BinnaStock (`src/standalone/inventory/`)
Independent inventory management system.

**Features:**
- Stock tracking
- Supplier management
- Purchase orders
- Stock alerts
- Reporting

### BinnaBooks (`src/standalone/accounting/`)
Independent accounting and financial management system.

**Features:**
- Financial reporting
- Invoice management
- Expense tracking
- Tax calculations
- Bank reconciliation

---

## Shared Components (`src/shared/components/`)

### Overview
Reusable UI components used across all platform modules.

### Key Components
- `auth-guard.tsx` - Route protection
- `loading.tsx` - Loading states
- Form components
- Navigation components
- Data display components

### Usage
```typescript
import { AuthGuard } from '@/shared/components/auth-guard';
import { LoadingSpinner } from '@/shared/components/ui/loading';
```

---

## API Architecture (`src/api/`)

### Overview
Unified API layer with middleware and route handling.

### Structure
- `main-api.ts` - Main API configuration
- Route handlers for each domain
- Middleware for authentication and validation
- Error handling middleware

### Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/store/*` - Store management
- `/api/inventory/*` - Inventory operations
- `/api/accounting/*` - Financial operations
- `/api/projects/*` - Construction projects

---

## Database Schema (`database/main_schema.sql`)

### Overview
Complete database schema for all platform modules.

### Tables
- User management tables
- Store and product tables
- Inventory tracking tables
- Financial transaction tables
- Project management tables
- Audit and logging tables

### Relationships
- Foreign key constraints
- Junction tables for many-to-many relationships
- Indexes for performance optimization

---

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint and Prettier configuration
- Consistent naming conventions
- Comprehensive error handling

### Testing Requirements
- Unit tests for all business logic
- Integration tests for API endpoints
- Component tests for UI components
- E2E tests for critical user flows

### Security Guidelines
- Input validation and sanitization
- Authentication required for protected routes
- Role-based access control
- Secure session management
- Regular security audits

---

## Deployment Configuration

### Environment Variables
```env
# Database
DATABASE_URL=your_database_url
DATABASE_PASSWORD=your_password

# Authentication
AUTH_SECRET=your_auth_secret
JWT_SECRET=your_jwt_secret

# External Services
PAYMENT_GATEWAY_KEY=your_payment_key
EMAIL_SERVICE_KEY=your_email_key
```

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test
```

### Deployment Targets
- Main platform: Full integrated deployment
- Standalone products: Independent deployment
- Development: Local development server
- Staging: Pre-production testing
- Production: Live deployment

---

## Monitoring and Maintenance

### Performance Monitoring
- Application performance metrics
- Database query performance
- API response times
- Error rates and patterns

### Maintenance Tasks
- Regular database backups
- Security updates
- Performance optimization
- Code refactoring
- Documentation updates

### Support and Troubleshooting
- Error logging and monitoring
- Performance profiling
- Database optimization
- Security audits
- User feedback integration
