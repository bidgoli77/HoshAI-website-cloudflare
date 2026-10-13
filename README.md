# HoshAI Platform - Idea to Live Product

## Project Architecture & Features:
1. **Frontend:** Vanilla JS Single Page Application (`index.html`).
2. **Backend:** Cloudflare Pages Functions (Serverless).
3. **Database:** Cloudflare D1 (SQLite).
4. **Authentication:** Secure Email/Password (SHA-256 salted) & Google OAuth 2.0.
5. **AI Engine:** DeepSeek API integrated via secure server-side fetching.
6. **Chat System:** Features user isolation, chat history management, file attachment UI, and Web Speech API voice typing.
7. **Clean Codebase:** 100% English code, logs, and comments.
8. **UI Bugfix:** Fixed mobile chat scroll height hiding the input `.bar`.

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

9. **Critical Bugfix:** Fixed a JavaScript syntax error (escaping quotes) that caused the login buttons to become unresponsive.
10. **Critical Bugfix:** Fixed SSE chunk parsing (newline split bug) causing chat to hang indefinitely on 'thinking...'.
11. **UI Bugfix:** Added dynamic IDs for chat streams to support multiple continuous questions without refreshing.
12. **AI & Streaming Bugfix:** Fixed SSE buffer slicing that broke JSON parsing mid-stream (causing corrupted text/dropped words). Updated System Prompt to dynamically match the user's language instead of forcing English, and gracefully handle conversational queries in Build mode.
13. **UI Bugfix:** Fixed CSS layout where the input bar was pushed out of the viewport on desktop by setting `.lab-body` to a viewport-relative height (`70vh`) and adjusting flex properties. Also added `direction: auto; text-align: start;` to chat bubbles to correctly align Persian text.
14. **CSS Flexbox Bugfix:** Added `min-height: 0;` to `.msgs` and `overflow: hidden;` to its parent to prevent flex child blowout, ensuring the input bar always remains visible at the bottom of the chat.
15. **Multimodal Model Update:** Changed DeepSeek model in `chat.js` from `deepseek-chat` to `deepseek-flash` to support multimodal inputs (images, documents) based on the latest DeepSeek V4.1 API specs.
16. **Full File Parsing Implementation:** Integrated `pdf.js` for local PDF text extraction. Added logic to parse attached images to Base64 (for native Multimodal processing) and text documents (TXT/CSV/JSON) directly into the API payload, allowing users to send files with prompts effectively.
17. **Critical Bugfix (File Upload):** Fixed `ReferenceError: Can't find variable histTitle` during chat submission. The `send()` function logic has been completely rewritten to appropriately handle variable scopes, process `pendingFile` objects (converting PDFs/images), and send combined payloads to the API.