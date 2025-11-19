
# CMS Backend - Starter

This is a starter Go (Fiber) backend wired to MongoDB. It includes:
- Basic project structure
- User register/login (JWT)
- Article CRUD endpoints
- Stubs for LLM and Qdrant integration
- Dockerfile and docker-compose for local development

## Quick start

1. Build and run with Docker Compose:
   ```bash
   docker compose up --build
   ```
2. API:
   - Health: GET http://localhost:8080/health
   - Register: POST /api/v1/auth/register  (json: name,email,password)
   - Login: POST /api/v1/auth/login  (json: email,password)
   - Articles CRUD: /api/v1/articles

## Notes
- Replace LLM and Qdrant stubs with real implementations.
- Set JWT_SECRET in env for production.
