# HoshAI Platform - Idea to Live Product

## Project Architecture & Features:
1. **Frontend:** Vanilla JS Single Page Application (`index.html`).
2. **Backend:** Cloudflare Pages Functions (Serverless).
3. **Database:** Cloudflare D1 (SQLite).
4. **Authentication:** Secure Email/Password (SHA-256 salted) & Google OAuth 2.0.
5. **AI Engine:** DeepSeek API integrated via secure server-side fetching.
6. **Chat System:** Features user isolation, chat history management, file attachment UI, and Web Speech API voice typing.
7. **Clean Codebase:** 100% English code, logs, and comments.

## Deployment Instructions:
1. **Database Setup:** 
   - Create a D1 database named `hoshai_users`.
   - Run the `schema.sql` file to create the tables.
2. **Bindings:** 
   - Go to Cloudflare Pages > Settings > Functions > D1 bindings.
   - Add binding: Variable `USERS_DB` -> select your D1 database.
3. **Environment Variables (Secrets):**
   - `DEEPSEEK_API_KEY`: Your DeepSeek API key.
   - `ADMIN_SECRET`: Custom secret for the `/api/users` endpoint.
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
4. **Deploy:** Push your repository to Cloudflare Pages.
