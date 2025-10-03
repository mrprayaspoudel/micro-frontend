# NPM Scripts Documentation

This document explains all available npm scripts for the micro frontend platform, organized by development workflow.

## 📝 Development Workflow

### 1. Initial Development Setup

```bash
npm run dev
```
**Purpose**: Comprehensive development startup script  
**What it does**:
- Checks and installs dependencies if missing
- Validates port availability (3000-3004)
- Bootstraps lerna packages
- Builds shared packages first
- Starts all micro frontends and host app

**Use when**: First time setup or after major changes

---

### 2. Daily Development

```bash
npm start
```
**Purpose**: Quick parallel startup for daily development  
**What it does**:
- Starts host app on port 3000 (development mode)
- Starts all 4 micro frontends on ports 3001-3004 (preview mode)
- Runs all services concurrently

**Servers started**:
- Host App: http://localhost:3000
- CRM Module: http://localhost:3001/crm
- Inventory Module: http://localhost:3002/inventory  
- HR Module: http://localhost:3003/hr
- Finance Module: http://localhost:3004/finance

**Use when**: Daily development after initial setup

---

## 🔧 Individual Module Commands

### Host Application
```bash
npm run start:host
```
**Purpose**: Start only the host application  
**Port**: 3000 (development mode with HMR)  
**Use when**: Developing host-specific features

### Micro Frontend Modules

```bash
npm run start:crm        # CRM module only (port 3001)
npm run start:inventory  # Inventory module only (port 3002)
npm run start:hr         # HR module only (port 3003)
npm run start:finance    # Finance module only (port 3004)
```

**Purpose**: Start individual modules for focused development  
**Mode**: Preview mode (built assets, no HMR)  
**Use when**: Developing specific module features

---

## 🏗️ Build Commands

### Build All Packages
```bash
npm run build
```
**Purpose**: Build all packages for production  
**What it builds**:
- Shared utilities (`@shared/utils`)
- Shared UI components (`@shared/ui-components`)
- Shared state (`@shared/state`)
- Host application
- All 4 micro frontend modules

**Use when**: Preparing for production deployment

### Build Shared Packages Only
```bash
npm run build:shared
```
**Purpose**: Build only shared packages  
**What it builds**:
- `@shared/utils`
- `@shared/ui-components`  
- `@shared/state`

**Use when**: Shared package changes need to be built before micro frontends

---

## 🧪 Testing & Code Quality

### Run Tests
```bash
npm test
```
**Purpose**: Run tests across all packages using Lerna  
**What it tests**: All packages that have test scripts defined  
**Use when**: Before commits, CI/CD pipeline

### Run Linting
```bash
npm run lint
```
**Purpose**: Run ESLint across all packages  
**What it lints**: TypeScript and JavaScript files in all packages  
**Use when**: Before commits, code quality checks

---

## 🛠️ Utility Commands

### Health Check
```bash
npm run health-check
```
**Purpose**: Verify all micro frontend remote entries are accessible  
**What it checks**:
- `http://localhost:3001/assets/remoteEntry.js`
- `http://localhost:3002/assets/remoteEntry.js`
- `http://localhost:3003/assets/remoteEntry.js`
- `http://localhost:3004/assets/remoteEntry.js`

**Outputs**:
- ✅ All micro frontends are healthy
- ❌ Some micro frontends are not responding

**Use when**: Debugging module federation issues

### Check Port Availability
```bash
npm run check-ports
```
**Purpose**: Check if required ports (3000-3004) are available  
**What it shows**: Which processes are using the required ports  
**Use when**: Before starting development, troubleshooting port conflicts

### Stop Development Servers
```bash
npm run kill-servers
```
**Purpose**: Stop all running micro frontend development servers  
**What it kills**: All Vite processes running on ports 3000-3004  
**Use when**: Cleaning up stuck processes, starting fresh

### Clean Dependencies
```bash
npm run clean
```
**Purpose**: Remove node_modules from all packages  
**What it removes**: All node_modules directories in the monorepo  
**Use when**: Dependency conflicts, starting completely fresh

---

## 🔄 Typical Development Workflow

### First Time Setup
1. `npm install` - Install root dependencies
2. `npm run dev` - Comprehensive setup and startup
3. Open http://localhost:3000 and test

### Daily Development  
1. `npm start` - Quick startup
2. Develop and test
3. `npm run kill-servers` - Clean shutdown

### Before Commit
1. `npm run lint` - Check code quality
2. `npm test` - Run tests
3. `npm run build` - Ensure production build works

### Troubleshooting
1. `npm run check-ports` - Check port conflicts
2. `npm run kill-servers` - Clean up processes
3. `npm run health-check` - Verify module federation
4. `npm run clean` - Nuclear option for dependency issues

---

## 🚨 Important Notes

### Why Preview Mode for Micro Frontends?
- **Development Mode Issue**: `@originjs/vite-plugin-federation` has limitations in dev mode
- **Remote Entry Path**: Preview mode serves `remoteEntry.js` at `/assets/remoteEntry.js`
- **Stability**: Preview mode is more stable for module federation
- **Trade-off**: No HMR for micro frontends, but reliable federation

### Port Usage Strategy
- **3000**: Host app (development mode, HMR enabled)
- **3001-3004**: Micro frontends (preview mode, built assets)
- **Rationale**: Host needs HMR for rapid development, modules need stable federation

### Module Federation Requirements
- All micro frontends must be running for host to work properly
- Remote entry files must be accessible at expected paths
- Host handles all routing when modules are embedded
- Modules have conditional routing for standalone vs embedded modes

---

## 🔍 Debugging Commands

```bash
# Check if all servers are running
lsof -i :3000,3001,3002,3003,3004

# Test remote entry accessibility
curl -I http://localhost:3001/assets/remoteEntry.js
curl -I http://localhost:3002/assets/remoteEntry.js  
curl -I http://localhost:3003/assets/remoteEntry.js
curl -I http://localhost:3004/assets/remoteEntry.js

# Kill specific process by port
lsof -ti:3001 | xargs kill -9

# View running processes
ps aux | grep vite
```

---

This documentation should be updated whenever new scripts are added or existing ones are modified.
