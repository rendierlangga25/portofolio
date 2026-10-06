import {useEffect,useState} from 'react'
import {Navigate} from 'react-router-dom'
import {sb} from '../../lib/supabase'
export default function Guard({children}){
  const [s,setS]=useState('load')
  useEffect(()=>{(async()=>{
    const {data:{session}}=await sb.auth.getSession()
    if(!session)return setS('out')
    const {data}=await sb.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle()
    setS(data?'ok':'deny')})()},[])
  if(s==='load')return <div className="grid min-h-screen place-items-center text-sm text-neutral-500">Memuat…</div>
  if(s==='out')return <Navigate to="/admin/login" replace/>
  if(s==='deny')return <div className="grid min-h-screen place-items-center p-6 text-center text-sm"><div><p>Akun ini belum terdaftar sebagai admin.</p><button className="mt-3 underline" onClick={()=>sb.auth.signOut().then(()=>location.assign('/admin/login'))}>Keluar</button></div></div>
  return children
}
