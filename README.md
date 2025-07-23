# SkillLink Backend

A Node.js + Express.js backend for the SkillLink Community Skill Exchange PWA, built with MongoDB Atlas and JWT authentication.

## Features

- **User Authentication**: Secure signup/login with password hashing and JWT tokens
- **Skill Management**: Create, read, update, and delete skills with user ownership
- **User Profiles**: View user profiles with their posted skills and ratings
- **Rating System**: Rate other users (1-5 stars)
- **Search & Filter**: Search skills by title/description and filter by category
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Proper error handling and status codes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
├── models/
│   ├── User.js          # User model with skills and ratings
│   └── Skill.js         # Skill model with user reference
├── routes/
│   ├── auth.js          # Authentication routes (signup/login)
│   ├── skills.js        # Skill CRUD operations
│   └── users.js         # User profile and rating routes
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── validation.js    # Input validation middleware
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── env.example          # Environment variables template
└── README.md           # This file
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the environment template:

   ```bash
   cp env.example .env
   ```

2. Update `.env` with your actual values:

   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/skilllink?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

### 3. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://mongodb.com)
2. Create a new cluster
3. Get your connection string from the cluster
4. Replace the `MONGODB_URI` in your `.env` file

### 4. Run the Server

**Development mode (with auto-restart):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env`).

## API Endpoints

### Authentication

#### POST `/api/auth/signup`

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "skills": [],
    "ratings": [],
    "averageRating": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`

Authenticate user and get token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as signup response.

### Skills

#### GET `/api/skills`

Get all skills with optional filtering.

**Query Parameters:**

- `category`: Filter by category (Technology, Design, etc.)
- `search`: Search in title and description
- `sort`: Sort field (createdAt, price, title)
- `order`: Sort order (asc, desc)

**Response:**

```json
{
  "count": 10,
  "skills": [
    {
      "_id": "skill_id",
      "title": "Web Development",
      "description": "Full-stack web development",
      "category": "Technology",
      "price": 50,
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "averageRating": 4.5
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/skills` (Protected)

Create a new skill.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "title": "Web Development",
  "description": "Full-stack web development services",
  "category": "Technology",
  "price": 50
}
```

#### GET `/api/skills/:id`

Get a specific skill by ID.

#### PUT `/api/skills/:id` (Protected)

Update a skill (only by owner).

#### DELETE `/api/skills/:id` (Protected)

Delete a skill (only by owner).

### Users

#### GET `/api/users/:id`

Get user profile with posted skills.

**Response:**

```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "averageRating": 4.5,
    "skillsCount": 3,
    "skills": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/users/me/profile` (Protected)

Get current user's profile.

#### PUT `/api/users/me/profile` (Protected)

Update current user's profile.

#### POST `/api/users/:id/rate` (Protected)

Rate a user (1-5 stars).

**Request Body:**

```json
{
  "rating": 5
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": [] // For validation errors
}
```

**Common Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Available Scripts

- `npm start`: Start the server in production mode
- `npm run dev`: Start the server in development mode with auto-restart
- `npm test`: Run tests (not implemented yet)
- `npm run lint`: Check code with ESLint
- `npm run lint:fix`: Fix ESLint issues automatically
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting

### Health Check

Visit `http://localhost:5000/api/health` to check if the API is running.

## Code Quality

This project uses several tools to maintain code quality:

- **ESLint**: JavaScript/Node.js linting
- **Prettier**: Code formatting
- **Markdownlint**: Markdown file linting
- **Pre-commit hooks**: Automatic checks before commits

### Setting up Pre-commit Hooks

1. Install pre-commit:
   ```bash
   pip install pre-commit
   ```

2. Install the git hooks:
   ```bash
   pre-commit install
   ```

3. Run against all files (optional):
   ```bash
   pre-commit run --all-files
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting:
   ```bash
   npm run lint:fix
   npm run format
   ```
5. Test thoroughly
6. Submit a pull request

## License

This project is licensed under the ISC License.
