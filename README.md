# HoshAI v2 - Final with Logo

## چی تغییر کرد نسبت به ورژن قبلی شما:
1. لوگوی اصلی (مغز + چیپ قرمز) به nav و favicon و auth اضافه شد
2. signup.js و login.js با bcrypt-like hardening و rate limit ذهنی
3. google.js: GOOGLE_CLIENT_ID از env خوانده میشه (نه هاردکد)
4. schema.sql: ستون picture و provider اضافه شد
5. index.html: دیزاین جدید با لوگو، انیمیشن تایپ، responsive بهتر
6. امنیت: HttpOnly نیست چون Cloudflare Pages، ولی localStorage handling بهتر

## نصب:
1. D1: hoshai_users بساز و schema.sql رو اجرا کن
2. Binding: USERS_DB -> hoshai_users
3. Secrets:
   DEEPSEEK_API_KEY
   ADMIN_SECRET
   GOOGLE_CLIENT_ID = 558707911564-7rij1tf1lqkk1ofujj... (از کنسول گوگل)
4. Deploy
.
لوگو در /logo.png
