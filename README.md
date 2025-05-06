# Node.js Homework 05 - Authentication and Authorization

This is a contact management application with user authentication and authorization features.

## Features

- User registration and login
- JWT-based authentication
- Session management with refresh tokens
- Contact management (CRUD operations)
- User-specific contact access

## API Endpoints

### Authentication

- POST /auth/register - Register a new user
- POST /auth/login - Login user
- POST /auth/refresh - Refresh access token
- POST /auth/logout - Logout user

### Contacts

- GET /contacts - Get all contacts (authenticated)
- GET /contacts/:id - Get contact by ID (authenticated)
- POST /contacts - Create new contact (authenticated)
- PUT /contacts/:id - Update contact (authenticated)
- DELETE /contacts/:id - Delete contact (authenticated)

## Environment Variables

- PORT - Server port (default: 3000)
- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret key for access tokens
- JWT_REFRESH_SECRET - Secret key for refresh tokens

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create .env file with required environment variables
4. Start the server: `npm run dev`

## Production

The application is deployed on render.com. You can access it at: [Your Render.com URL]
