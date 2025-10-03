# Enterprise Micro Frontend Platform - Complete Documentation

A comprehensive micro frontend platform built with React, Module Federation, and clean architecture principles. This platform provides a unified dashboard for managing multiple business modules including CRM, Inventory, HR, and Finance.

---

## 📑 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Quick Start Guide](#quick-start-guide)
3. [Features](#features)
4. [Development Guide](#development-guide)
5. [Troubleshooting](#troubleshooting)
6. [Router Configuration](#router-configuration)
7. [Deployment](#deployment)
8. [Contributing](#contributing)

---

## 🏗️ Architecture Overview

### Project Structure
```
micro-frontend/
├── backends/                    # Mock JSON data (acting as backend)
│   ├── companies.json
│   ├── users.json
│   ├── modules.json
│   ├── notifications.json
│   └── knowledge-base.json
├── shared/                      # Shared libraries and components
│   ├── ui-components/          # Reusable UI components with theming
│   ├── state/                  # Global state management (Zustand)
│   └── utils/                  # Utilities and API clients
├── host/                       # Main host application
│   └── src/
│       ├── components/         # Host-specific components
│       │   ├── Layout/
│       │   ├── Header/
│       │   ├── Sidebar/
│       │   └── ModuleMenu/
│       └── pages/              # Host pages (Dashboard, Login, etc.)
└── apps/                       # Micro frontend applications
    ├── crm-module/            # Customer Relationship Management
    ├── inventory-module/      # Inventory Management
    ├── hr-module/             # Human Resources
    └── finance-module/        # Financial Management
```

### Key Technologies
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and dev server
- **Module Federation**: Micro frontend architecture
- **Styled Components**: CSS-in-JS styling
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Heroicons**: Beautiful icons

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Quick Setup (Recommended)

```bash
# Clone or navigate to the project
cd micro-frontend

# Run the automated setup
chmod +x setup.sh
./setup.sh

# Start development
npm run start:dev
```

### Manual Setup

```bash
# Install root dependencies
npm install

# Install shared packages
cd shared/ui-components && npm install && cd ../..
cd shared/state && npm install && cd ../..  
cd shared/utils && npm install && cd ../..

# Install host app
cd host && npm install && cd ..

# Install micro frontend apps
cd apps/crm-module && npm install && cd ../..
cd apps/inventory-module && npm install && cd ../..
cd apps/hr-module && npm install && cd ../..
cd apps/finance-module && npm install && cd ../..

# Start all apps
npm run start:dev
```

### 🔐 Login Credentials

**Default Admin Account:**
- Email: `admin@techcorp.com`
- Password: `password123`

**Test Manager Account:**
- Email: `manager@techcorp.com`  
- Password: `password456`

### 🏃‍♂️ Running the Application

#### Development Mode
```bash
# Start all applications (recommended)
npm run start:dev

# Or start individually
npm run start:host        # Host app only
npm run start:modules     # All micro frontends only
```

#### Individual App Development
```bash
# Host App (Port 3000)
cd host && npm run dev

# CRM Module (Port 3001)
cd apps/crm-module && npm run dev

# Inventory Module (Port 3002) 
cd apps/inventory-module && npm run dev

# HR Module (Port 3003)
cd apps/hr-module && npm run dev

# Finance Module (Port 3004)
cd apps/finance-module && npm run dev
```

---

## ✨ Features

### Core Features
- **🔐 Authentication & Authorization**: Role-based access control
- **🔍 Global Search**: Search across companies with intelligent results
- **🔔 Real-time Notifications**: System alerts and notices
- **🎨 Dynamic Theming**: Global and module-specific themes
- **📱 Responsive Design**: Mobile-first approach
- **🔒 Security**: Industry-standard security practices

### Module Federation
- **Independent Development**: Each module can be developed independently
- **Runtime Integration**: Modules are loaded dynamically at runtime
- **Shared Dependencies**: Optimized bundle sharing
- **Hot Module Replacement**: Fast development experience

### Business Modules

#### CRM Module (Port 3001)
- Customer management and segmentation
- Lead tracking and conversion
- Sales opportunities pipeline
- Customer interaction history
- Reporting and analytics

#### Inventory Module (Port 3002)
- Product catalog management
- Stock level monitoring
- Supplier management
- Purchase order processing
- Inventory analytics

#### HR Module (Port 3003)
- Employee management
- Attendance tracking
- Payroll processing
- Leave management
- Performance reviews

#### Finance Module (Port 3004)
- Accounting and bookkeeping
- Invoice management
- Expense tracking
- Financial reporting
- Tax management

---

## 🛠️ Development Guide

### Available Scripts

```bash
# Start all applications in development mode
npm run start:dev

# Start only the host application
npm run start:host

# Start only micro frontend modules
npm run start:modules

# Build all applications
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

### 🧪 Testing the Platform

#### 1. Authentication Flow
1. Open http://localhost:3000
2. Login with admin credentials
3. Verify dashboard loads with company stats

#### 2. Global Search
1. Use the search bar in the header
2. Search for "TechCorp" or "Global"
3. Click on a search result to view company profile

#### 3. Module Navigation
1. From company profile, click on available modules
2. Verify each module loads with its own theme
3. Test module menus and navigation

#### 4. State Management
1. Select a company from search
2. Navigate between modules
3. Verify company selection persists

### 🎨 Theme Testing

Each module has its own color theme:
- **CRM**: Blue theme (#0ea5e9)
- **Inventory**: Green theme (#22c55e)  
- **HR**: Purple theme (#a855f7)
- **Finance**: Orange theme (#f97316)

### Adding New Modules

1. Create a new directory under `apps/`
2. Copy the structure from an existing module
3. Update `vite.config.ts` with unique port and module name
4. Add the module to the host app's federation config
5. Update the routing in the host app

### 🎨 Theming

#### Global Theme
The platform uses a centralized theming system with:
- Color palettes (primary, secondary, gray scales)
- Typography scales
- Spacing system
- Border radius and shadows
- Responsive breakpoints

#### Module-Specific Themes
Each module can override the global theme:
```typescript
const moduleTheme = {
  colors: {
    primary: {
      500: '#custom-color',
      // ... other overrides
    }
  }
};
```

### 🔧 State Management

#### Global State (Zustand)
- **Auth Store**: User authentication and session
- **App Store**: Application-wide state (selected company, notifications)
- **UI Store**: UI preferences and theme settings

#### Shared State Across Modules
State is shared across modules using:
- Zustand for reactive state management
- Context providers for theme and configuration
- Event-driven communication between modules

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. "Failed to fetch dynamically imported module" Error

**The Problem**: This is the most common issue when working with micro frontends. It occurs when micro frontend servers are not running or federation is not properly configured.

**The Solution**: Each module must run on its designated port:
- Host App: `http://localhost:3000` (development mode)
- CRM Module: `http://localhost:3001` (preview mode)
- Inventory Module: `http://localhost:3002` (preview mode)
- HR Module: `http://localhost:3003` (preview mode)
- Finance Module: `http://localhost:3004` (preview mode)

**Quick Fix**:
```bash
# Easy way - run the startup script
npm run start:dev

# Or check service health
lsof -i :3000,3001,3002,3003,3004

# Check if remoteEntry.js files are accessible
curl -I http://localhost:3001/remoteEntry.js
curl -I http://localhost:3002/remoteEntry.js
curl -I http://localhost:3003/remoteEntry.js
curl -I http://localhost:3004/remoteEntry.js
```

#### 2. Port Already in Use

```bash
# Find processes using the ports
lsof -i :3000,3001,3002,3003,3004

# Kill specific processes
kill -9 <PID>

# Or kill all node processes (nuclear option)
pkill -f node
```

#### 3. Module Not Found

1. Ensure all packages are installed:
```bash
npm install
lerna bootstrap
```

2. Build shared packages:
```bash
lerna run build --scope='@shared/*'
```

#### 4. CORS Issues

The vite configs are already set with `cors: true`, but if you encounter CORS issues:

1. Check that all servers are running on their designated ports
2. Verify the `remotes` configuration in `host/vite.config.ts`
3. Clear browser cache and hard refresh

#### 5. Wrong remoteEntry.js Path

**The Issue**: The `@originjs/vite-plugin-federation` plugin has limitations in development mode and doesn't serve `remoteEntry.js` correctly with `npm run dev`.

**The Solution**: We now use preview mode for micro frontends:

- **Host Application**: Runs in development mode (`npm run dev`)
- **Micro Frontends**: Run in preview mode (`npm run preview`) 

This ensures:
- `remoteEntry.js` is served at `/assets/remoteEntry.js`
- Module Federation works correctly
- Hot reloading is disabled but the apps are stable

**Manual Testing Paths**:
- CRM: `http://localhost:3001/assets/remoteEntry.js`
- Inventory: `http://localhost:3002/assets/remoteEntry.js`  
- HR: `http://localhost:3003/assets/remoteEntry.js`
- Finance: `http://localhost:3004/assets/remoteEntry.js`

### 🔧 Development Tips

#### Adding New Components
```bash
# Shared components
cd shared/ui-components/src/components
mkdir MyComponent
# Add MyComponent.tsx and export from index.ts
```

#### Adding New Pages
```bash
# In any module
cd apps/[module-name]/src/pages
# Add new page component
# Update App.tsx routes
```

#### Debugging Module Federation
1. Check browser Network tab for remote entry files
2. Verify federation config in vite.config.ts
3. Check console for federation errors

#### State Debugging
```bash
# In browser console
window.__REDUX_DEVTOOLS_EXTENSION__ || console.log('Install Redux DevTools')
```

### 🚀 Development Workflow

1. **Always start all services** - The host application needs all micro frontends running
2. **Wait for servers to start** - Don't navigate to routes until all servers show "ready"
3. **Check the developer console** - Error messages will guide you to the specific issue
4. **Use the development panel** - In development mode, a status panel shows module health

---

## 🛡️ Router Configuration Fix

### ❌ Problem: Nested Router Error

**Error**: "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."

**Root Cause**: Both the host application and each micro frontend had their own `BrowserRouter`, creating nested routers when micro frontends were loaded into the host.

### ✅ Solution: Conditional Router Usage

#### Strategy
Each micro frontend now conditionally uses a router based on whether it's running:
- **Standalone**: Uses `BrowserRouter` with appropriate basename
- **As Micro Frontend**: No router wrapper (host handles all routing)

#### Implementation

Each micro frontend now follows this pattern:

```tsx
interface AppProps {
  basename?: string;
}

const App: React.FC<AppProps> = ({ basename }) => {
  // Detect if running standalone (on its own port) vs embedded (on port 3000)
  const isStandalone = window.location.port === '3001'; // (or 3002, 3003, 3004)
  const isEmbedded = window.location.port === '3000' || basename !== undefined;
  
  const AppContent = () => (
    <ThemeProvider moduleTheme={theme}>
      <div className="module-app">
        <Routes>
          {/* Routes here */}
        </Routes>
      </div>
    </ThemeProvider>
  );

  // Only use BrowserRouter when running standalone on its own port
  if (isStandalone && !isEmbedded) {
    return (
      <BrowserRouter basename="/module-name">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host, no router wrapper needed
  return <AppContent />;
};
```

#### Key Changes Made

1. **Port-based Detection**: Uses window.location.port to detect standalone vs embedded mode
2. **Conditional Router**: Only wraps with `BrowserRouter` when standalone
3. **Content Separation**: Extracted app content from router wrapper
4. **Proper Integration**: Host application handles all routing when modules are embedded

#### Benefits

✅ **No More Nested Routers**: Eliminates the React Router error
✅ **Standalone Capability**: Each module can still run independently
✅ **Host Integration**: Seamless integration when loaded as micro frontend
✅ **Proper Routing**: Host application handles all routing when modules are embedded

#### How It Works

**When Running Standalone** (e.g., `http://localhost:3001`)
- Module detects standalone mode by checking port
- Wraps content with `BrowserRouter`
- Handles its own routing with basename

**When Running as Micro Frontend** (e.g., loaded in host at `/crm`)
- Module detects it's embedded (running on port 3000)
- No router wrapper used
- Host's `BrowserRouter` handles all routing
- Module's `<Routes>` work within host's routing context

---

## 📊 Mock Backend

The platform uses JSON files as mock backend data:
- `companies.json`: Company profiles and information
- `users.json`: User accounts and permissions
- `modules.json`: Module configurations and menus
- `notifications.json`: System notifications
- `knowledge-base.json`: Help and documentation

---

## 🔐 Security Features

### Authentication
- JWT-based authentication (mocked)
- Role-based access control
- Session management
- Secure route protection

### Authorization
- Permission-based UI rendering
- Module-level access control
- Company-specific data isolation
- Secure API endpoints (when integrated)

---

## 🧪 Testing

### Testing Stack
- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing (can be added)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 📦 Deployment

### Building for Production

```bash
# Build all applications
npm run build

# Build specific application
cd apps/crm-module && npm run build
```

### Deployment Strategy
1. **Independent Deployment**: Each module can be deployed separately
2. **CDN Distribution**: Static assets served from CDN
3. **Container Deployment**: Docker containers for each module
4. **CI/CD Pipeline**: Automated testing and deployment

---

## 🏗️ Architecture Deep Dive

### Performance Optimizations
- Code splitting at module level
- Lazy loading of micro frontends
- Optimized bundle sizes
- Tree shaking for unused code
- Image optimization
- Caching strategies

### Module Federation Architecture
The micro frontend system uses:
- **Vite Module Federation** - For loading remote modules
- **React.lazy** - For code splitting and lazy loading
- **Error Boundaries** - For graceful error handling
- **Health Checking** - For monitoring module availability

Each micro frontend is completely independent and can be:
- Developed separately
- Deployed independently  
- Started/stopped independently (for development)

---

## 🤝 Contributing

### Development Guidelines
1. Follow the established folder structure
2. Use TypeScript for type safety
3. Follow clean architecture principles
4. Write comprehensive tests
5. Document new features

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Conventional commits for git messages
- Component naming conventions

---

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic micro frontend setup
- ✅ Authentication system
- ✅ Core UI components
- ✅ Module federation
- ✅ Global search
- ✅ Dynamic theming
- ✅ Router fix implementation
- ✅ Full-page module navigation

### Phase 2 (Next)
- [ ] Real backend integration
- [ ] Advanced role management
- [ ] Real-time updates
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] API documentation

### Phase 3 (Future)
- [ ] Multi-tenancy
- [ ] Advanced reporting
- [ ] Workflow automation
- [ ] AI/ML integration
- [ ] Third-party integrations
- [ ] Performance monitoring

---

## 🆘 Getting Help

### Still Having Issues?

1. Run the diagnostic script: `npm run start:dev` and check all services start successfully
2. Verify network connectivity: `curl http://localhost:3001/assets/remoteEntry.js`
3. Check browser developer tools Network tab for failed requests
4. Look for error messages in both terminal and browser console
5. Try restarting all services: Stop everything, then run `npm run start:dev`

### Development Tips

1. **Start services in order**: Shared packages → Individual modules → Host
2. **Monitor the console**: Both terminal and browser console provide useful debugging info
3. **Use the startup script**: `npm run start:dev` handles the entire setup
4. **Check port availability**: Make sure no other services are using ports 3000-3004
5. **Clear caches**: When in doubt, clear browser cache and restart services

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Module Federation team for micro frontend capabilities
- Open source community for the tools and libraries

---

**For support or questions, please open an issue or contact the development team.**

**Happy coding! 🎉**
