export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { name, email, pass } = await request.json();
    if (!name || !email || !pass) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }
    const emailNorm = email.trim().toLowerCase();
    const existing = await env.D1_USERS_DB.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).bind(emailNorm).first();
    if (existing) {
      return Response.json({ error: 'Email already exists' }, { status: 400 });
    }
    await env.D1_USERS_DB.prepare(
      "INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, datetime('now'))"
    ).bind(emailNorm, name, pass).run();
    return Response.json({ ok: true, name, email: emailNorm });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
