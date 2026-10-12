# HoshAI - Cloudflare Pages

## Deploy Steps
1. Push this repo to GitHub
2. Go to https://dash.cloudflare.com > Workers & Pages > Create > Pages > Connect to Git
3. Select this repo
4. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Output directory: /
5. Before first deploy, go to Settings > Variables and Secrets > Add:
   - Variable name: DEEPSEEK_API_KEY
   - Value: your DeepSeek API key (get from https://platform.deepseek.com/api-keys)
   - Type: Secret (encrypted)
   - Environment: Production + Preview

6. Save and Deploy
7. After deploy: Pages > Custom domains > Add hoshai.com + www.hoshai.com

## Endpoints
- /api/chat -> functions/api/chat.js (DeepSeek proxy, branded as HoshAI)

## Security
- API key is server-side only (env.DEEPSEEK_API_KEY), never exposed to client
- Users stored in localStorage as SHA-256 hash (hoshai_users_v2)
- CORS enabled for streaming

## Fix for Signup issue
If signup doesn't work on old browser, clear localStorage:
DevTools (F12) > Application > Local Storage > hoshai.com > Clear
