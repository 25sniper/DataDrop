# ShareSpace - Anonymous File Sharing Platform

## Overview

ShareSpace is a modern web application for anonymous file sharing built with React and Express. Users can create temporary rooms with unique 6-digit codes to share text, links, and files (images, PDFs, documents) without requiring registration. The application features a clean, intuitive interface with real-time content management and secure file uploads.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with three main routes (Home, Room, Not Found)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **File Uploads**: Multer middleware for handling multipart/form-data with file type validation and size limits
- **Storage Strategy**: Pluggable storage interface with in-memory implementation for development (IStorage interface)
- **API Design**: RESTful endpoints for room and content management with proper HTTP status codes

### Data Layer
- **Database**: PostgreSQL with Drizzle ORM for type-safe database interactions
- **Schema**: Two main entities - rooms (with unique codes) and content (with room relationships)
- **Migration System**: Drizzle Kit for database schema migrations and version control
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting

### Development Tools
- **Package Management**: NPM with lockfile for dependency consistency
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Code Quality**: ESLint and Prettier integration through Vite plugins
- **Development Server**: Vite dev server with HMR and Express middleware integration

### Key Design Decisions

**Monorepo Structure**: Client, server, and shared code in a single repository for easier development and deployment. The shared folder contains TypeScript schemas and types used by both frontend and backend.

**Type-Safe Database**: Drizzle ORM with Zod validation schemas ensure type safety from database to API to frontend. This prevents runtime errors and provides excellent developer experience.

**Component-Based UI**: Shadcn/ui provides a consistent design system while maintaining flexibility. Components are customizable and accessible out of the box.

**File Upload Strategy**: Local file storage with configurable upload directory, file type validation, and size limits. Files are served through Express static middleware.

**Anonymous Rooms**: 6-digit alphanumeric codes provide a balance between usability and collision avoidance. Rooms have no authentication but rely on code secrecy.

**Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints ensures usability across devices.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern features
- **Express.js**: Backend web application framework
- **TypeScript**: Static type checking for both frontend and backend

### Database and ORM
- **Drizzle ORM**: Type-safe SQL toolkit and query builder
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **Drizzle Kit**: CLI tools for database migrations and schema management

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **Shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

### State Management and HTTP
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight React router

### File Handling
- **Multer**: Middleware for handling multipart/form-data uploads
- **React Dropzone**: Drag-and-drop file upload component

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Component variant management
- **clsx**: Conditional className utility