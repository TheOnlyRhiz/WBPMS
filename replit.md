# Park Management System

## Overview

This is a Nigerian motor park management system designed to enhance safety and transparency in public transportation. The application allows passengers to verify drivers and vehicles before boarding, submit feedback about their travel experience, and enables administrators to manage driver registrations, vehicle records, and passenger feedback through a comprehensive admin dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the stack
- **API Design**: RESTful API with JSON responses
- **Session Management**: Express sessions with memory store
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas shared between client and server

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations
- **Data Validation**: Zod schemas for runtime type safety

## Key Components

### User-Facing Features
1. **Vehicle Verification System**: Allows passengers to verify driver and vehicle information using plate numbers
2. **Feedback System**: Star-based rating system with categorized feedback types
3. **Public Information Pages**: Home page with system information and safety features

### Administrative Features
1. **Dashboard**: Overview statistics and recent activity monitoring
2. **Driver Management**: CRUD operations for driver records with license verification
3. **Vehicle Management**: Vehicle registration and driver assignment
4. **Feedback Management**: Review and respond to passenger feedback
5. **Settings**: Admin profile management and system configuration

### Authentication & Authorization
- Session-based authentication for admin users
- Protected routes with middleware
- Role-based access control (admin-only features)
- Secure password hashing with bcrypt

## Data Flow

1. **Public Verification Flow**:
   - User enters plate number → API validates → Database lookup → Return driver/vehicle info
   
2. **Feedback Submission Flow**:
   - User submits feedback form → Validation → Database storage → Admin notification
   
3. **Admin Management Flow**:
   - Admin authentication → Protected API routes → Database operations → Real-time updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token management
- **express-session**: Session management

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form state management
- **Zod**: Runtime schema validation

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js server code
- **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: Local development with hot reloading
- **Production**: Optimized builds with proper error handling
- **Database**: Environment-based connection strings

### Hosting
- **Platform**: Replit with autoscale deployment
- **Port Configuration**: Port 5000 mapped to external port 80
- **Build Process**: Automated build and deployment pipeline

## Recent Changes
- June 27, 2025: Implemented feedback system with vehicle registration validation - only registered vehicles can receive feedback
- June 27, 2025: Enhanced verification and feedback error messages to clearly indicate when plate numbers don't belong to the park
- June 27, 2025: Replaced admin dashboard Recent Activity section with Recent Feedback display showing passenger ratings and status
- June 25, 2025: Enhanced landing page with professional hero background and modern styling
- June 25, 2025: Fixed admin panel CRUD operations and authentication issues
- June 25, 2025: Switched to in-memory storage for stable functionality
- June 25, 2025: Updated driver management to match business requirements
- June 25, 2025: Removed driver deletion functionality and vehicle fields from driver forms
- June 25, 2025: Added comprehensive transportation vehicle types and status filtering

## Admin Panel Status
All admin routes fully functional:
- `/admin/dashboard` - Overview with real-time statistics
- `/admin/drivers` - Create and edit drivers (deletion disabled per business rules)
- `/admin/vehicles` - Complete CRUD operations for vehicle management  
- `/admin/feedback` - Feedback management with resolution tracking
- `/admin/settings` - Admin account and security settings

## Driver Management Rules
Driver data structure restricted to:
- Driver Name
- Phone Number
- License Number
- Status (Active/Inactive/Suspended)
- Additional Notes
- Create and Edit operations allowed
- Delete operations disabled per business requirements

## Vehicle Management Features
Enhanced vehicle types for Nigerian transportation:
- Commercial Buses (14-seater, 18-seater)
- Toyota Hiace Commuter Bus, Volkswagen Crafter Bus
- Taxi vehicles (Toyota Corolla, Honda Accord, etc.)
- SUVs, Tricycles (Keke NAPEP), Motorcycles (Okada)
- Delivery Vans, Cargo Trucks
- Vehicle status filtering: Active, Suspended, Under Maintenance, Retired

## Authentication
- Admin login: admin@example.com / admin123
- Session-based authentication working correctly
- All protected routes properly secured

## Changelog
- June 23, 2025. Initial setup
- June 25, 2025. Full admin panel functionality completed

## User Preferences

Preferred communication style: Simple, everyday language.