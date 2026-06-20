# SkillLink

A student-to-student academic resource sharing platform where university and college students upload study materials, discover resources, connect with peers, and collaborate through topic-based channels.

**Live:** [https://energetic-analysis-production-6afe.up.railway.app](https://energetic-analysis-production-6afe.up.railway.app)

## What It Does

- **Upload & Share** — Students upload PDFs, PowerPoints, Word docs, spreadsheets, images, and other study materials to a permanent cloud store (Cloudinary)
- **Discover Resources** — Browse, search, filter by subject/type, sort by newest/most downloaded/most liked, switch between grid and list views
- **Study Channels** — Create and join topic-based discussion channels (like Slack/Discord), post messages, attach resources, like posts
- **Student Network** — Follow/unfollow students, view profiles with Instagram-style layouts, browse uploaded and saved resources
- **Notifications** — Real-time bell icon with unread badge for follows, likes, and downloads on your resources
- **Email System** — Welcome email on signup, email verification, password reset via Resend

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **File Storage** | Cloudinary (cloud-based, permanent) |
| **Authentication** | JWT (7-day expiry) + bcryptjs password hashing |
| **Email** | Resend (transactional emails) |
| **Security** | Helmet (CSP, HSTS), express-rate-limit, express-validator |
| **Frontend** | Vanilla HTML/CSS/JS (single-page app, no framework) |
| **Hosting** | Railway (backend + frontend), Vercel (static frontend mirror) |

## Project Structure

```
Skill-Link/
├── server.js                 # Express app entry point, middleware, route mounting
├── models/
│   ├── User.js               # User schema (profile, followers, saved resources, verification)
│   ├── Resource.js            # Resource schema (file metadata, Cloudinary refs, likes, downloads)
│   ├── Channel.js             # Channel + Post schemas (members, messages, likes)
│   └── Notification.js        # Notification schema (follow, like, download events)
├── routes/
│   ├── auth.js                # Signup, login, email verification, forgot/reset password
│   ├── users.js               # Profile CRUD, follow/unfollow, save resources, public profiles
│   ├── resources.js           # Upload (Cloudinary), list, edit, delete, download, like
│   ├── channels.js            # Channel CRUD, join/leave, posts CRUD, post likes
│   └── notifications.js       # List, unread count, mark read, mark all read
├── middleware/
│   ├── auth.js                # JWT verification middleware
│   └── validation.js          # express-validator rules for signup, login, profile update
├── utils/
│   └── email.js               # Resend client — welcome, verification, password reset emails
├── public/
│   └── index.html             # Entire frontend SPA (HTML + CSS + JS in one file)
├── package.json
├── .env                       # Environment variables (not committed)
├── .gitignore
└── eslint.config.js
```

## Data Models

### User
```
name, email, password (hashed), bio, university, year, subject
verified, verificationToken, resetToken, resetTokenExpiry
followers[], following[], savedResources[]
```

### Resource
```
title, description, subject (category), tags[]
fileUrl (Cloudinary), cloudinaryId, cloudinaryResourceType
fileName, fileType, fileSize
downloads, likes[], likesCount
user (owner ref)
```

### Channel & Post
```
Channel: name, description, subject, icon, creator, members[], isPrivate
Post: channel, user, content, resource (optional attachment), likes[]
```

### Notification
```
user (recipient), type (follow|like|download|channel_post)
from (sender), resource?, channel?, read, message
```

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Create account (sends welcome + verification email) |
| POST | `/login` | No | Sign in, receive JWT |
| GET | `/verify-email/:token` | No | Verify email address |
| POST | `/resend-verification` | Yes | Resend verification email |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password/:token` | No | Set new password |

### Resources — `/api/resources`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List resources (search, filter by subject/fileType, sort, paginate) |
| POST | `/` | Yes | Upload resource (multipart form, file → Cloudinary) |
| GET | `/:id` | No | Get single resource with author info |
| PUT | `/:id` | Yes | Edit resource metadata (owner only) |
| DELETE | `/:id` | Yes | Delete resource + Cloudinary file (owner only) |
| GET | `/:id/download` | Yes | Get download URL (increments counter, notifies owner) |
| POST | `/:id/like` | Yes | Toggle like (notifies owner) |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List users (search by name, paginate) |
| GET | `/me/profile` | Yes | Own profile with resources, saved, followers |
| PUT | `/me/profile` | Yes | Update profile fields |
| PUT | `/me/password` | Yes | Change password |
| POST | `/me/save/:resourceId` | Yes | Toggle save/unsave resource |
| GET | `/:id` | No | Public profile with resources |
| POST | `/:id/follow` | Yes | Toggle follow/unfollow (notifies target) |

### Channels — `/api/channels`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List public channels |
| POST | `/` | Yes | Create channel (creator auto-joins) |
| GET | `/:id` | No | Channel detail |
| POST | `/:id/join` | Yes | Join channel |
| POST | `/:id/leave` | Yes | Leave channel |
| DELETE | `/:id` | Yes | Delete channel + posts (creator only) |
| GET | `/:id/posts` | No | List posts (paginated, newest first) |
| POST | `/:id/posts` | Yes | Create post (must be member) |
| DELETE | `/:id/posts/:postId` | Yes | Delete post (author or channel creator) |
| POST | `/:id/posts/:postId/like` | Yes | Toggle like on post |

### Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List notifications (paginated) |
| GET | `/unread-count` | Yes | Get unread count (polled every 30s) |
| PUT | `/read-all` | Yes | Mark all as read |
| PUT | `/:id/read` | Yes | Mark one as read |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Platform stats (total resources, users, downloads, channels) |
| GET | `/api/health` | Health check |

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (free tier)
- Resend account (free tier, optional — emails skipped if not configured)

### 1. Install

```bash
git clone https://github.com/JoelEli/Skill-Link.git
cd Skill-Link
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skilllink?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_string_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5000

# Cloudinary (required for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend (optional — emails skipped if not set)
RESEND_API_KEY=re_your_api_key
BASE_URL=http://localhost:5000
```

### 3. Run

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`.

## Deployment

### Railway (Backend + Frontend)

SkillLink is deployed on Railway. Railway does **not** auto-deploy from GitHub — every deployment requires:

```bash
railway up --service energetic-analysis --detach
```

Required Railway environment variables:
- `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`
- `CORS_ORIGIN` (comma-separated allowed origins)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`, `BASE_URL`

### File Storage

All uploaded files are stored on **Cloudinary** (not Railway's ephemeral filesystem):
- Upload: `multer.memoryStorage()` → `cloudinary.uploader.upload_stream()`
- Download: Cloudinary URL with `fl_attachment` flag (forces browser download)
- Delete: `cloudinary.uploader.destroy()` + database cleanup
- Folder: `skilllink/resources/`

### Allowed File Types

Documents: PDF, PPT/PPTX, DOC/DOCX, XLS/XLSX, TXT, CSV, JSON, MD, ZIP/RAR/7Z
Images: PNG, JPG/JPEG, GIF
Max size: 50MB

No video or audio files are accepted.

## Security

- **Helmet** — CSP, HSTS, X-Frame-Options, and other security headers
- **Rate Limiting** — 200 req/15min general, 15 req/15min auth, 20 uploads/hour
- **Password Hashing** — bcryptjs with 12 salt rounds
- **JWT** — 7-day expiry, verified on every protected route
- **Input Validation** — express-validator on all user inputs
- **CSP** — Allows `res.cloudinary.com` for images and downloads
- **CORS** — Configurable allowed origins

## Frontend

The entire frontend is a single `public/index.html` file — a vanilla JS single-page application with no build step. Key UI features:

- **Auth** — Cream/brown/black themed login/signup with 2-step registration, forgot password flow
- **Home** — Welcome hero, quick action cards, trending resources
- **Discover** — Hero search bar, type filter pills, subject chips, grid/list toggle, pagination
- **Upload** — Drag-and-drop dropzone, 5-category visual picker, tags input
- **Channels** — Discord-style split layout (channel list + message feed), real-time-feel posting
- **Students** — Card grid with avatar, university, subject, follow/profile buttons
- **Profile** — Instagram-style layout with gradient avatar ring, horizontal stats, 3-column post grid with hover overlays, toggle edit form
- **Notifications** — Topbar bell icon with unread badge, dropdown panel
- **B&W Mode** — Optional black-and-white theme toggle

## License

ISC
