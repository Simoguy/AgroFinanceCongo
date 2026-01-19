# Agro Finance Congo

## Overview

A mobile-first financial management application for field agents in Congo. The app enables agents to manage agricultural credits, savings accounts (épargne), and client performance tracking. Built as a Progressive Web App with offline-first capabilities, it uses React on the frontend with an Express backend and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query with persistence for offline support
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with Material Design 3 principles
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints under `/api/*`
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Connection**: Neon serverless PostgreSQL with WebSocket support

### Data Models
The application manages three primary entity types:
1. **Credits** - Agricultural loans with guarantees, payment terms, and status tracking
2. **Compte Courants** - Current/checking accounts for clients
3. **Carte Pointages** - Savings cards with point-based tracking and amounts

Each entity includes soft-delete functionality (`isDeleted`, `deletedAt` fields) and status-based filtering (actif, soldé, contentieux).

### Design System
- Material Design 3 optimized for mobile-first data management
- Inter font family for typography
- Green primary color scheme (HSL 142)
- Fixed bottom navigation with 3 items: Home, Add, Profile
- Category buttons in 2-column grid layout on home page

### Offline-First Strategy
- TanStack Query with sync storage persister for caching
- Query data persisted to localStorage for offline access
- Automatic refetch disabled to preserve offline data

## External Dependencies

### Database
- **PostgreSQL** via Neon serverless (`@neondatabase/serverless`)
- Connection requires `DATABASE_URL` environment variable
- Drizzle Kit for migrations (`drizzle-kit push`)

### UI Libraries
- **Radix UI** - Full suite of accessible primitives (dialog, select, tabs, etc.)
- **shadcn/ui** - Pre-built component library (new-york style variant)
- **Lucide React** - Icon library
- **React Hook Form** with Zod validation

### Build & Development
- Vite with React plugin
- Replit-specific plugins for development banner and error overlay
- esbuild for server bundling in production