import {createClient} from '@supabase/supabase-js'
export const sb=createClient(import.meta.env.VITE_SUPABASE_URL||'http://localhost',import.meta.env.VITE_SUPABASE_ANON_KEY||'missing')
export async function upload(file,folder='misc'){
  const {data:{session}}=await sb.auth.getSession()
  if(!session)throw new Error('Sesi berakhir, silakan masuk lagi')
  const path=`${session.user.id}/${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g,'_')}`
  const {error}=await sb.storage.from('media').upload(path,file,{cacheControl:'3600'})
  if(error)throw error
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl
}
