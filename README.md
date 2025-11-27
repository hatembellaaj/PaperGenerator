# Paper Assistant App

A full-stack web application to help users draft scientific papers about LLMs with assistance from an OpenAI-powered backend. The project includes a React + Vite frontend with Tailwind CSS and a Node.js + Express backend written in TypeScript.

## Project Structure

```
paper-assistant-app/
├─ client/   # React + Vite frontend
└─ server/   # Express + OpenAI backend
```

## Prerequisites
- Node.js 18+
- npm
- An OpenAI API key and an Assistant ID (if using the Assistants API approach)

## Setup

Install dependencies for both frontend and backend:

```bash
cd server
npm install
cd ../client
npm install
```

### Environment Variables
Create `server/.env` based on the example:

```
OPENAI_API_KEY=your_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here
PORT=3000
```

- `OPENAI_API_KEY` is required for API calls.
- `OPENAI_ASSISTANT_ID` is required for the Assistants API flow.

## Running the App

Start the backend server (default http://localhost:3000):

```bash
cd server
npm run dev
```

Start the frontend (default http://localhost:5173):

```bash
cd client
npm run dev
```

The frontend proxies `/api` requests to the backend.

## Running with Docker

Build and run both services with Docker Compose (frontend on port **9550**, backend on port **9551**):

```bash
docker compose build
OPENAI_API_KEY=your_key_here OPENAI_ASSISTANT_ID=your_assistant_id_here docker compose up
```

- The frontend is available at http://localhost:9550
- The API is available at http://localhost:9551/api
- Override ports by editing `docker-compose.yml` (keep them between 9550 and 9560).

## API Endpoint

`POST /api/assist-section`

Request body:
```json
{
  "sectionId": "introduction",
  "sectionContent": "string",
  "paperTitle": "string",
  "allSections": [
    { "id": "abstract", "label": "Abstract", "content": "..." }
  ],
  "mode": "draft" | "improve" | "summarize"
}
```

Response body:
```json
{
  "assistantMessage": {
    "content": "string"
  }
}
```

The server uses the Assistants API; set both `OPENAI_API_KEY` and `OPENAI_ASSISTANT_ID` in your environment.
