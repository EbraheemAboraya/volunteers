# Volunteer Coordination — Backend Platform 🤝

> An Express.js backend for managing volunteer-related workflows, data and real-time interactions.

**Stack:** Node.js · Express · MongoDB · Mongoose · Socket.IO · JWT · Jest · Supertest

## Overview
This application is organized into routes, controllers, repository modules, models and middleware. The layered structure separates HTTP request handling, database access and reusable application functionality.

**Companion frontend:** [React volunteer application](https://github.com/EbraheemAboraya/volunter_fronted).

## Engineering highlights
- Express-based routing and backend APIs.
- MongoDB persistence with Mongoose models.
- Authentication and authorization-related middleware and dependencies.
- Socket.IO infrastructure for real-time events.
- Automated-testing dependencies: Jest and Supertest.
- Separate configuration, utility and repository layers.

## Architecture
```text
React client (separate repository)
              |
          HTTP / WebSocket
              |
       Express + Socket.IO
              |
    Routers → Controllers
              |
       Models / Repository
              |
            MongoDB
```

## Repository structure
| Directory | Role |
| --- | --- |
| `router/` | HTTP routes |
| `controllers/` | Request processing |
| `middleware/` | Shared request/security middleware |
| `models/` | Mongoose models |
| `repository/` | Data access |
| `socket/` | Real-time functionality |
| `config/` | Configuration |
| `tests/` | Tests |

## Local development
```bash
npm install
npm run dev
```
Other scripts: `npm start` and `npm test`.

Set up a local MongoDB connection and all environment variables required by the application. **Never reuse values from the tracked `.env` file.** A committed environment file has contained credential-like values; rotate any active secrets and remove them from Git history before production usage.

## What this project demonstrates
Backend architecture, data modeling, request middleware, authentication integration and real-time application infrastructure.

---
*Part of a larger full-stack volunteer coordination project.*
