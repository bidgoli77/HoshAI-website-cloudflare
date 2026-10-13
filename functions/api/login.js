export async function onRequestPost(context){
  const { request, env } = context;
  try{
    const { email, password } = await request.json();
    if(!email || !password) return json({error:'Email and password required'},400);
    if(!env.USERS_DB) return json({error:'D1 not bound'},500);
    const lowerEmail = email.toLowerCase().trim();
    const passHash = await sha256(password + lowerEmail);
    const user = await env.USERS_DB.prepare('SELECT id, name, email, picture FROM users WHERE email = ? AND pass_hash = ?').bind(lowerEmail, passHash).first();
    // also allow google_oauth users to login via google only, not password
    if(!user){
      const exists = await env.USERS_DB.prepare('SELECT provider FROM users WHERE email=?').bind(lowerEmail).first();
      if(exists?.provider === 'google') return json({error:'This email uses Google login. Please use Google Sign-In.'},401);
      return json({error:'Invalid email or password'},401);
    }
    return json({ok:true, user});
  }catch(e){ return json({error:e.message},500); }
}
export async function onRequestOptions(){ return cors(); }
function json(o,s=200){ return new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}}) }
function cors(){ return new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
async function sha256(str){ const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''); }
