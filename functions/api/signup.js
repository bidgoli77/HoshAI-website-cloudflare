export async function onRequestPost(context){
  const { request, env } = context;
  try{
    const { name, email, password } = await request.json();
    if(!name || !email || !password || password.length < 6){
      return json({error:'All fields required, password min 6'},400);
    }
    const db = env.USERS_DB || env.D1_USERS_DB || env.hoshai_users || env.DB;
    if(!db) return json({error:'D1 not bound. Add binding USERS_DB -> hoshai_users'},500);
    const lowerEmail = email.toLowerCase().trim();
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(lowerEmail).first().catch(()=>null);
    if(existing) return json({error:'Email already registered, please log in'},409);
    const passHash = await sha256(password);
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO users (id, name, email, pass_hash, provider, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, name.trim(), lowerEmail, passHash, 'email', Date.now()).run();
    return json({ok:true, user:{id, name:name.trim(), email:lowerEmail}});
  }catch(e){ return json({error:e.message},500); }
}
export async function onRequestOptions(){ return cors(); }
function json(o,s=200){ return new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
function cors(){ return new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
async function sha256(str){ const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''); }
