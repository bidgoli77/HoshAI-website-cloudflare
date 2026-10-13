// functions/api/google.js - Verify Google ID Token and create/login user
export async function onRequestPost(context){
  const { request, env } = context;
  try{
    const { credential, id_token } = await request.json();
    const token = credential || id_token;
    if(!token) return json({error:'No Google credential provided'},400);
    
    const db = env.USERS_DB || env.D1_USERS_DB || env.hoshai_users || env.DB;
    if(!db) return json({error:'D1 not bound - Add D1 binding USERS_DB'},500);

    // Verify token with Google
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if(!verifyRes.ok){
      const t = await verifyRes.text();
      return json({error:'Invalid Google token: '+t.slice(0,200)},401);
    }
    const payload = await verifyRes.json();
    // payload: email, name, picture, sub (google_id), email_verified
    if(!payload.email) return json({error:'Google token has no email'},401);
    
    const email = payload.email.toLowerCase().trim();
    const name = payload.name || email.split('@')[0];
    const picture = payload.picture || '';
    const googleId = payload.sub;
    
    // Check if user exists
    let user = await db.prepare('SELECT id, name, email, picture FROM users WHERE email = ?').bind(email).first().catch(()=>null);
    if(!user){
      // Create new user
      const id = crypto.randomUUID();
      const now = Date.now();
      await db.prepare('INSERT INTO users (id, name, email, provider, google_id, picture, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, name, email, 'google', googleId, picture, now).run();
      user = { id, name, email, picture };
    }else{
      // Update picture/google_id if missing
      if(!user.picture || !user.google_id){
        try{
          await db.prepare('UPDATE users SET picture = COALESCE(?, picture), google_id = COALESCE(?, google_id), provider = ? WHERE id = ?').bind(picture, googleId, 'google', user.id).run();
        }catch{}
      }
    }
    return json({ok:true, user});
  }catch(e){
    return json({error:e.message},500);
  }
}
export async function onRequestOptions(){ return cors(); }
function json(o,s=200){ return new Response(JSON.stringify(o),{status:s,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
function cors(){ return new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}) }
