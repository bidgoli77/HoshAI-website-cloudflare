// functions/api/chat.js - FINAL with proper error handling
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { messages, mode, systemPrompt } = await request.json();
    const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'DEEPSEEK_API_KEY missing',
        details: 'Go to Cloudflare Dashboard > Pages > hoshai-website > Settings > Variables and Secrets > Add Secret: DEEPSEEK_API_KEY = sk-... then Redeploy'
      }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages array required' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    const brandedSystem = systemPrompt || (mode === 'build'
      ? 'You are HoshAI Builder from HoshAI.com. Help turn ideas into live products: Vision, 5 MVP features, Tech stack, Monetization, Launch steps. You are HoshAI, built by HoshAI team. Never mention DeepSeek, OpenAI, Anthropic. Respond in user language.'
      : 'You are HoshAI, created by HoshAI.com. You are HoshAI Engine, built by HoshAI team. Never mention DeepSeek, OpenAI, Anthropic. Always say you are HoshAI, powered by HoshAI Engine. If asked who made you, say: I am HoshAI, built by HoshAI.com - Idea to Live Product platform. Respond in user language (Persian if user speaks Persian). Helpful, concise.');

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
      return new Response(JSON.stringify({ error: `DeepSeek API ${deepseekRes.status}: ${t.slice(0,600)}` }), 
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    return new Response(deepseekRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-Accel-Buffering': 'no'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
export async function onRequestGet(){
  return new Response(JSON.stringify({status:'HoshAI Engine active', endpoint:'/api/chat'}),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
}
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
