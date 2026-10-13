
export async function onRequestPost(context){
  const { request, env } = context;
  try{
    const { name, email, password } = await request.json();
    if(!name || !email || !password || password.length < 6){
      return json({error:'All fields required, password min 6'},400);
    }
    if(!env.USERS_DB){
      return json({error:'D1 database not bound. Go to Pages > Settings > Functions > D1 bindings > Add binding: Variable USERS_DB -> your D1'},500);
    }
    const lowerEmail = email.toLowerCase().trim();
    const existing = await env.USERS_DB.prepare('SELECT id FROM users WHERE email = ?').bind(lowerEmail).first();
    if(existing){
      return json({error:'Email already registered, please log in'},409);
    }
    const passHash = await sha256(password);
    const id = crypto.randomUUID();
    await env.USERS_DB.prepare('INSERT INTO users (id, name, email, pass_hash, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, name.trim(), lowerEmail, passHash, Date.now()).run();
    return json({ok:true, user:{id, name:name.trim(), email:lowerEmail}});
  }catch(e){
    return json({error:e.message},500);
  }
}
export async function onRequestOptions(){ return cors(); }
function json(o,s=200){ return new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
function cors(){ return new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
async function sha256(str){ const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''); }
