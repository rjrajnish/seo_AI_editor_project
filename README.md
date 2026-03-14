# SEO AI Editor Project

A full-stack SEO content workspace for teams that want to plan, generate, manage, and review search-focused content from one application.

This project combines a React frontend with a Go + Fiber backend and MongoDB storage. It is designed around common editorial and SEO workflows such as user authentication, article management, AI-assisted writing, keyword analysis, settings management, and dashboard-style reporting.

## Project Overview

The platform is structured as two main applications:

- `frontend/`: React + Vite interface for content, SEO, AI, analytics, and settings workflows
- `cms-backend/`: Go + Fiber API with MongoDB integration, JWT authentication, article storage, SEO analysis, and AI endpoints

## Core Functionalities

### 1. Authentication and Access Control

The project supports user registration and login using JWT-based authentication.

**What it does**
- Registers users with name, email, password, and role
- Authenticates users and issues a signed JWT token
- Protects application routes and API endpoints
- Automatically logs users out in the frontend when a token becomes invalid

**Why it is useful**
- Secures editorial workflows
- Enables role-aware team usage
- Keeps protected CMS and AI operations behind authenticated access

### 2. Content Management

The content module works like a lightweight article CMS for SEO teams.

**What it does**
- Create articles
- View article details
- Update article title, body, and status
- Delete articles
- Search articles by keyword
- Filter articles by status such as `draft`, `in_progress`, and `published`
- Paginate article records for easier browsing
- Calculate and return a basic SEO score from article content

**Why it is useful**
- Helps editors organize content production
- Tracks article lifecycle from draft to publication
- Gives a quick SEO quality signal for each article

### 3. AI Studio

The AI Studio is the main productivity area for AI-assisted SEO writing.

**What it does**
- Generate blog title ideas
- Generate article outlines
- Generate SEO meta descriptions
- Generate keyword suggestions
- Generate full article drafts
- Save reusable prompt templates
- View and reuse previously saved prompts

**Why it is useful**
- Speeds up research and ideation
- Reduces manual drafting effort
- Standardizes prompt usage across the team
- Supports repeatable content generation workflows

### 4. SEO Intelligence

The SEO Intelligence module focuses on keyword-level insight generation.

**What it does**
- Accepts a keyword or phrase
- Generates estimated search volume and competition insight
- Returns related keywords
- Suggests industry categories
- Provides ranking recommendations
- Simulates likely SERP result patterns
- Stores generated SEO insights in MongoDB

**Why it is useful**
- Helps content teams understand keyword opportunity before writing
- Supports better topic selection and planning
- Gives an SEO-oriented framework for article creation

### 5. Analytics Dashboard

The analytics section presents a reporting-style SEO performance workspace.

**What it does**
- Shows traffic trend charts
- Displays ranking trend charts
- Summarizes sessions, CTR, and ranking metrics
- Lists top-performing pages
- Supports filtering and sorting top page data
- Visualizes search intent mix

**Why it is useful**
- Gives teams a central place to review performance
- Helps identify high-value pages and trends
- Makes SEO reporting easier to understand for non-technical users

### 6. Workspace Settings

The settings module manages default values used across the editorial workflow.

**What it does**
- Stores a default category
- Stores a default SEO score baseline
- Allows update and retrieval of workspace defaults

**Why it is useful**
- Keeps content operations consistent
- Reduces repetitive manual configuration
- Provides a starting point for future workspace customization

## Technology Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Chart.js

### Backend
- Go
- Fiber
- MongoDB
- JWT
- Google Gemini API integration

## Professional Use Cases

This project is well suited for:

- SEO agencies managing multiple content ideas and drafts
- Content marketing teams producing search-optimized articles
- Startups building an internal SEO writing and analysis dashboard
- Educational/demo use for full-stack AI + SEO product workflows
- Teams that want a foundation for a larger AI-enabled CMS

## Application Flow

1. A user registers or logs in.
2. The frontend stores the JWT token for authenticated requests.
3. The user can create and manage articles from the content module.
4. The user can generate AI content assets from AI Studio.
5. The user can analyze a target keyword from SEO Intelligence.
6. The user can review simulated performance data in Analytics.
7. The user can maintain default workspace values in Settings.

## API Overview

Main backend route groups:

- `/health`
- `/api/v1/auth`
- `/api/v1/articles`
- `/api/v1/settings`
- `/api/v1/seo/intelligence`
- `/api/v1/ai`

### Key API Functions

- `POST /api/v1/auth/register`: create a new user account
- `POST /api/v1/auth/login`: authenticate and receive JWT token
- `POST /api/v1/articles`: create article
- `GET /api/v1/articles`: list articles with search, status filter, and pagination
- `GET /api/v1/articles/:id`: fetch one article
- `PUT /api/v1/articles/:id`: update article
- `DELETE /api/v1/articles/:id`: remove article
- `PATCH /api/v1/articles/:id/status`: update content status
- `GET /api/v1/articles/:id/seo`: fetch calculated SEO score
- `GET /api/v1/settings`: fetch workspace defaults
- `PUT /api/v1/settings`: update workspace defaults
- `POST /api/v1/seo/intelligence`: generate keyword insight
- `POST /api/v1/ai/title`: generate SEO titles
- `POST /api/v1/ai/outline`: generate article outline
- `POST /api/v1/ai/meta`: generate meta description
- `POST /api/v1/ai/keywords`: generate keyword ideas
- `POST /api/v1/ai/article`: generate full article draft
- `POST /api/v1/ai/prompts`: save prompt template
- `GET /api/v1/ai/prompts`: list saved prompts

## Folder Structure

```text
seo_AI_editor_project/
|-- frontend/
|   |-- src/
|   |   |-- apis/
|   |   |-- components/
|   |   |-- pages/
|   |   `-- utils/
|   `-- package.json
|-- cms-backend/
|   |-- cmd/server/
|   |-- internal/
|   |   |-- api/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- repositories/
|   |   `-- services/
|   |-- Dockerfile
|   |-- docker-compose.yml
|   `-- go.mod
`-- README.md
```

## Local Setup

### Prerequisites

- Node.js
- npm
- Go
- MongoDB

### Backend Setup

```bash
cd cms-backend
go mod download
go run ./cmd/server
```

The backend runs on `http://localhost:8080`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Docker Setup

```bash
cd cms-backend
docker compose up --build
```

## Environment Notes

The backend configuration currently reads values such as:

- `PORT`
- `MONGO_URI`
- `DB_NAME`
- `JWT_SECRET`
- `LOG_LEVEL`
- `GEMINI_API_KEY` or equivalent Gemini API configuration target in code

For production readiness, environment-based secrets should be used consistently for database credentials, JWT signing, and AI provider keys.

## Current Implementation Notes

This repository already provides a strong working foundation, with a few areas that are clearly positioned for further enhancement:

- AI and SEO generation depend on Gemini configuration being available
- Analytics data is currently presented as simulated/demo data in the frontend
- Settings are stored in memory in the current backend implementation
- The project includes placeholder/stub areas for future vector or worker integrations

## Why This Project Looks Professional

This codebase demonstrates a practical product direction rather than a basic demo. It combines:

- clear module separation between frontend and backend
- secure JWT-based authentication
- SEO-oriented content operations
- AI-assisted generation workflows
- dashboard-style reporting
- extensible service and repository structure for future scale

## Future Improvement Ideas

- add role-based permission enforcement beyond basic authentication
- persist workspace settings in MongoDB
- connect analytics to real SEO or search console data
- add article categories, tags, and media handling
- introduce prompt versioning and collaboration features
- add tests, CI pipelines, and deployment documentation

## Summary

`SEO AI Editor Project` is a full-stack SEO content management platform built for modern digital publishing workflows. It helps users create articles, generate AI-assisted content, analyze keywords, track SEO-related insights, and manage defaults from a single unified interface.
