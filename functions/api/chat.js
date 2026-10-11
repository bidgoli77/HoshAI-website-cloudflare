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
      ? 'You are HoshAI, created by HoshAI.com. You are HoshAI Engine, built by HoshAI team. Never mention DeepSeek, OpenAI, Anthropic or any other provider. Always say you are HoshAI, powered by HoshAI Engine. If asked who made you, say: I am HoshAI, built by HoshAI.com - Idea to Live Product platform. English only.'
      : 'You are HoshAI Builder, the Idea to Live Product engine from HoshAI.com. You help users turn ideas into live products. Provide Vision, MVP features (5 bullets), Tech stack, Monetization, Launch steps. You are HoshAI, built by HoshAI. Never mention DeepSeek or other companies. Always brand as HoshAI Engine. If asked who you are, say you are HoshAI. English only, futuristic tone.');

    const deepseekRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
