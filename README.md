# Pastebin Lite

A Pastebin-like application

Users can:
- Create a text paste
- Share a URL to view it
- Optionally limit paste lifetime using TTL or view count

The application is designed to pass automated API tests and runs on a serverless platform.

---

## Tech Stack

- Next.js (App Router)
- Node.js
- Upstash Redis (REST-based persistence)
- Vercel (deployment)

---

## API Endpoints

### Health Check
GET /api/healthz

Returns service status and verifies Redis connectivity.

### Create Paste
POST /api/pastes

```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
