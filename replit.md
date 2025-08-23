# HyprFit - Fitness Tracking Dashboard

## Overview

HyprFit is a modern fitness tracking web application built with React and Express. The application provides users with a comprehensive dashboard to log workouts, track fitness progress, manage workout plans, and visualize their fitness journey through interactive charts and statistics. The system features a clean, modern UI with a glass-morphism design aesthetic and focuses on user engagement through streak tracking and progress visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

- **Fixed critical app startup issues**: Resolved missing `use-toast` hook and React import errors
- **Spring Boot Backend Preparation**: Created comprehensive API documentation for user's planned Spring Boot backend migration
- **Complete API Documentation**: Generated detailed endpoint specifications, data models, and integration guides
- **Frontend API Structure**: Documented all existing API calls and integration patterns for seamless backend transition

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and better development experience
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui for consistent, accessible component library
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Charts**: Recharts for data visualization and workout analytics

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API architecture with structured route handling
- **Validation**: Zod schemas for runtime type validation and data integrity
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Development**: Hot reload and middleware-based request logging

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for schema management
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Schema Management**: Drizzle migrations with type-safe schema definitions
- **Fallback Storage**: In-memory storage implementation for development/testing

### Database Schema Design
- **Workouts Table**: Stores individual workout records with type, duration, intensity, and notes
- **Workout Plans Table**: Manages weekly workout schedules with focus areas and status tracking
- **User Stats Table**: Tracks user progress metrics including streaks and total workout counts
- **Data Types**: UUID primary keys, timestamp tracking, and array fields for flexible data storage

### Authentication and Authorization
- **Current State**: No authentication system implemented (single-user application)
- **Session Management**: Basic Express session handling infrastructure in place
- **Future Considerations**: Ready for user authentication integration with session store

### API Architecture
- **Structure**: Modular route registration with centralized error handling
- **Endpoints**: CRUD operations for workouts, workout plans, and user statistics
- **Validation**: Request/response validation using Zod schemas
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Request/response logging with duration tracking for API monitoring

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Drizzle Kit**: Database migration and schema management tools

### UI and Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library built on top of Radix UI
- **Lucide React**: Modern icon library for consistent iconography
- **Recharts**: Chart library for workout analytics and data visualization

### Development and Build Tools
- **Vite**: Fast build tool with HMR for development
- **TypeScript**: Type checking and enhanced development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **PostCSS**: CSS processing for Tailwind and autoprefixer

### Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **date-fns**: Date manipulation and formatting utilities

### Development Environment
- **Replit Integration**: Development environment plugins for Replit platform
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server