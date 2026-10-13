export async function onRequestGet(context){
  const { request, env } = context;
  const url = new URL(request.url);
  const secret = url.searchParams.get('admin_secret');
  if(!env.ADMIN_SECRET){
    return new Response(JSON.stringify({error:'ADMIN_SECRET not set in Cloudflare Pages > Settings > Variables and Secrets'}),{status:500,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  }
  if(secret !== env.ADMIN_SECRET){
    return new Response(JSON.stringify({error:'Unauthorized - wrong admin_secret'}),{status:401,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  }
  const db = env.USERS_DB || env.D1_USERS_DB || env.hoshai_users || env.DB;
  if(!db) return new Response(JSON.stringify({error:'D1 not bound'}),{status:500,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  try{
    const { results } = await db.prepare('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 2000').all().catch(async ()=>{
      // fallback for old schema
      return await db.prepare('SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 2000').all();
    });
    return new Response(JSON.stringify({count:results.length, users:results}),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  }catch(e){
    return new Response(JSON.stringify({error:e.message}),{status:500,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  }
}
export async function onRequestOptions(){ return new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}); }
