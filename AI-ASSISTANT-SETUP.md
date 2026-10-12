# AI Doctor setup

The floating chat uses a small Node server so the OpenAI API key stays on the server. It is an informational site assistant, not a medical professional; it does not diagnose or recommend personal treatment.

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` to an API key created for your OpenAI API project. Keep `.env.local` private and out of source control.
3. Optionally set `OPENAI_MODEL` to a model available to your API project.
4. Run `npm start`, then open the URL printed by the server. The server serves the `outputs/` site and `/api/ai-chat` endpoint together.

Deployments must run this Node server (or provide an equivalent same-origin serverless endpoint) and set `OPENAI_API_KEY` as a private server environment variable. A static-only host cannot run the chat API. No chat history is saved by this site; each page visit starts a fresh chat.
