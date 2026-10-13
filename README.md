# HoshAI - Pages + D1 Database - Save users & emails

SETUP IN 2 MINUTES:

1. Create D1:
dash.cloudflare.com > D1 > Create database > Name: hoshai_users

2. Create table:
Click hoshai_users > Console > paste this and Run:

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  pass_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

3. Bind D1 to Pages:
Pages > hoshai-website > Settings > Functions > D1 bindings > Add binding
Variable: USERS_DB
Database: hoshai_users
Save

4. Add Secrets:
Settings > Variables and Secrets > Add:
- DEEPSEEK_API_KEY = your DeepSeek key (Secret, Production+Preview)
- ADMIN_SECRET = choose strong like HoshAI2026Secret! (Secret)

5. Deploy:
Push this code to GitHub -> auto deploy

6. Test:
hoshai.com/api/health
Signup on site
hoshai.com/api/users?admin_secret=YOUR_ADMIN_SECRET -> see all emails

Marketing:
Export that JSON and import to Mailchimp/Resend/ConvertKit for campaigns.
We can add automatic welcome email via Resend later..
