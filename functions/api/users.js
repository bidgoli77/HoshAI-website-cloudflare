
export async function onRequestGet(context){
  const { request, env } = context;
  const url = new URL(request.url);
  const secret = url.searchParams.get('admin_secret');
  if(secret !== env.ADMIN_SECRET){
    return new Response(JSON.stringify({error:'Unauthorized - set ADMIN_SECRET in env and pass ?admin_secret=...'}),{status:401,headers:{'Content-Type':'application/json'}});
  }
  if(!env.USERS_DB) return new Response(JSON.stringify({error:'D1 not bound'}),{status:500,headers:{'Content-Type':'application/json'}});
  const { results } = await env.USERS_DB.prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 1000').all();
  return new Response(JSON.stringify({count:results.length, users:results}),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
}
