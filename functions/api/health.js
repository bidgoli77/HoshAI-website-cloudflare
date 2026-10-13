export async function onRequestGet(context){
  const { env } = context;
  const db = env.USERS_DB || env.D1_USERS_DB || env.hoshai_users || env.DB;
  let dbStatus = db ? 'bound' : 'NOT BOUND - Add D1 binding USERS_DB';
  let count = 0;
  let error = null;
  if(db){
    try{
      const r = await db.prepare('SELECT COUNT(*) as c FROM users').first();
      count = r.c;
      dbStatus = 'bound and working';
    }catch(e){
      try{
        const r = await db.prepare('SELECT COUNT(*) as c FROM users').first();
        count = r.c;
      }catch(e2){
        dbStatus = 'bound but table error: '+e.message;
        error = e.message;
      }
    }
  }
  const hasDeepseek = !!env.DEEPSEEK_API_KEY;
  return new Response(JSON.stringify({
    status:'ok', 
    service:'HoshAI', 
    db: dbStatus, 
    users: count, 
    deepseek_key: hasDeepseek ? 'set' : 'NOT SET - Add DEEPSEEK_API_KEY secret',
    admin_secret: env.ADMIN_SECRET ? 'set' : 'NOT SET',
    time: new Date().toISOString(),
    endpoints:['/api/chat','/api/signup','/api/login','/api/users?admin_secret=...','/api/health']
  }),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
}
export async function onRequestOptions(){ return new Response(null,{headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}); }
