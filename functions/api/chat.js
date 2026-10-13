// functions/api/chat.js - Cloudflare Pages Function - Secure HoshAI
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { messages, mode, systemPrompt } = await request.json();
    const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY not set in Cloudflare dashboard > Settings > Variables' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const brandedSystem = systemPrompt || (mode === 'chat'
      ? 'You are HoshAI, created by HoshAI.com. Never mention DeepSeek or other providers. Respond in the exact same language the user uses.'
      : 'You are HoshAI Builder from HoshAI.com. If the user describes a product idea, provide Vision, MVP, Tech stack, Launch steps. If they ask a general question, explain your capabilities. Respond in the exact same language the user uses.');

    const deepseekRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-flash',
        stream: true,
        messages: [{ role: 'system', content: brandedSystem }, ...messages]
      })
    });

    if (!deepseekRes.ok) {
      const t = await deepseekRes.text();
      return new Response(t, { status: deepseekRes.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(deepseekRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
