export async function onRequestPost(context){
  const { request, env } = context;
  try{
    const { id_token } = await request.json();
    if(!id_token) return json({error:'Missing id_token'},400);
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    const payload = await verifyRes.json();
    const clientId = env.GOOGLE_CLIENT_ID || '558707911564-7rij1tf1lqkk1ofujti43plj66akcmka.apps.googleusercontent.com';
    if(!verifyRes.ok || payload.aud !== clientId) {
      return json({error:'Invalid Google token: '+ (payload.error_description||'aud mismatch')},401);
    }
    const email = payload.email?.toLowerCase();
    const name = payload.name || payload.email.split('@')[0];
    const picture = payload.picture || '';
    if(!env.USERS_DB) return json({error:'D1 not bound'},500);
    let user = await env.USERS_DB.prepare('SELECT id, name, email, picture FROM users WHERE email=?').bind(email).first();
    if(!user){
      const id = crypto.randomUUID();
      await env.USERS_DB.prepare('INSERT INTO users (id, name, email, pass_hash, picture, provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, name, email, 'google_oauth', picture, 'google', Date.now()).run();
      user = {id, name, email, picture};
    } else {
      if(picture) await env.USERS_DB.prepare('UPDATE users SET picture=? WHERE id=?').bind(picture, user.id).run();
      user = {...user, picture};
    }
    return json({ok:true, user});
  }catch(e){
    return json({error:e.message},500);
  }
}
export async function onRequestOptions(){ return cors(); }
function json(o,s=200){ return new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
function cors(){ return new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
