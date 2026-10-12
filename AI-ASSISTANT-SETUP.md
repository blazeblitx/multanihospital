# AI Doctor setup

The floating chat uses a small Node server so the OpenAI API key stays on the server. It is an informational site assistant, not a medical professional; it does not diagnose or recommend personal treatment.

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` to an API key created for your OpenAI API project. Keep `.env.local` private and out of source control.
3. Optionally set `OPENAI_MODEL` to a model available to your API project.
4. Run `npm start`, then open the URL printed by the server. The server serves the `outputs/` site and `/api/ai-chat` endpoint together.

Deployments must run this Node server (or provide an equivalent same-origin serverless endpoint) and set `OPENAI_API_KEY` as a private server environment variable. A static-only host cannot run the chat API. No chat history is saved by this site; each page visit starts a fresh chat.

## Automatic Facebook and Instagram highlights

The Social page links to the clinic profiles and can show recent public posts. The home page highlights the newest post and refreshes periodically. For automatic updates, run the site through the Node server and configure a Facebook Page access token in the server environment. The Page must be linked to a professional Instagram account. Create a Meta app and grant it the Page and Instagram read permissions required for your accounts (`pages_read_engagement` and `instagram_basic`; `pages_show_list` is useful when looking up the Page and token). Then set `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN`, and (optionally) `META_IG_USER_ID`; `META_GRAPH_API_VERSION` defaults to `v26.0`. Meta’s official Instagram API collection describes the linked professional-account requirement and media endpoint. Keep all tokens private and never put them in browser files. Without these settings, the profile links remain available and the home highlight stays hidden.
