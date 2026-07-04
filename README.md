# Seesaw — Ephemeral HTTP Request Inspector

Seesaw is a lightweight, ephemeral HTTP request inspector built with Next.js. It allows developers to generate unique, temporary endpoints to capture and inspect incoming HTTP requests in real-time. All data is held in-memory and discarded when the session ends—no databases, storage, or external logs are used.

## Core Features

- 🔗 **Unique Endpoint Generation**: Instantly generate random or custom session URLs (`/api/inspect/{sessionId}`) accepting any HTTP method (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD).
- ⚡ **Real-time Request Capture**: Uses Server-Sent Events (SSE) to stream incoming HTTP requests to your browser in real-time.
- 🔍 **Detailed Inspection**: View color-coded HTTP methods, request path and query parameters, headers, client IP, timestamp, and a fully formatted/beautified JSON request body.
- 🗑️ **Ephemeral & Secure**: All captured requests are stored in-memory and completely destroyed once you close the browser window.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun / Node.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives & shadcn/ui
- **Real-time Engine**: SSE via In-Memory `EventEmitter`
- **Containerization**: Docker (optimized for Next.js standalone outputs)

## Getting Started

### Local Development

1. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

2. **Run the development server**:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Build

To run the application locally or in production via Docker:

```bash
docker build -t seesaw .
docker run -p 3000:3000 seesaw
```

## Attribution & Credits

- Created by [osiloke](https://github.com/osiloke).
- *Note: This project was originally built/bootstrapped using Firebase Studio.*
