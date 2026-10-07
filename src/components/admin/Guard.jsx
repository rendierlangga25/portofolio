import {useEffect,useRef,useState} from 'react'
import {Navigate,useLocation} from 'react-router-dom'
import {sb} from '../../lib/supabase'
import {useAccount} from '../../lib/account'
import AuthShell,{btn,inp} from '../../pages/auth/AuthShell'
const Spin=()=><div className="grid min-h-screen place-items-center text-sm text-neutral-500">Memuat…</div>

function Onboarding({user,refresh,signOut}){
  const meta=user.user_metadata||{},tried=useRef(false)
  const [name,setName]=useState(meta.full_name||meta.name||''),[un,setUn]=useState((meta.username||'').toLowerCase()),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[auto,setAuto]=useState(!!meta.username)
  const claim=async(u,n)=>{setBusy(true);setErr('');const {error}=await sb.rpc('claim_username',{p_username:u,p_name:n});setBusy(false);if(error){setErr(error.message);setAuto(false);return}await refresh()}
  useEffect(()=>{if(auto&&!tried.current){tried.current=true;claim(un,name)}},[])
  if(auto)return <Spin/>
  return(<AuthShell title="Pilih username portofolio" sub="Username menjadi alamat portofoliomu dan tidak bisa sering diganti." foot={<button onClick={signOut} className="underline">Keluar</button>}>
    <form onSubmit={e=>{e.preventDefault();claim(un,name)}} className="space-y-3.5">
      <input className={inp} placeholder="Nama lengkap" required value={name} onChange={e=>setName(e.target.value)}/>
      <div className="flex items-center overflow-hidden rounded-xl border border-black/15 bg-white focus-within:border-[#111]"><span className="select-none pl-4 text-sm text-black/40">{location.host}/u/</span><input className="w-full bg-transparent py-3 pr-4 text-sm outline-none" placeholder="username" required maxLength={30} value={un} onChange={e=>setUn(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))}/></div>
      {err&&<p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} className={btn}>{busy?'Menyimpan…':'Lanjut'}</button></form></AuthShell>)
}

export default function Guard({children}){
  const a=useAccount(),loc=useLocation()
  if(a.loading)return <Spin/>
  if(!a.user)return <Navigate to={'/masuk?next='+encodeURIComponent(loc.pathname+loc.search)} replace/>
  if(!a.profile)return <Onboarding user={a.user} refresh={a.refresh} signOut={a.signOut}/>
  return children
}
export function OwnerGuard({children}){
  const a=useAccount()
  if(a.loading)return <Spin/>
  if(!a.user)return <Navigate to="/masuk?next=/owner" replace/>
  if(!a.isAdmin)return <div className="grid min-h-screen place-items-center p-6 text-center text-sm"><div><p>Halaman ini khusus owner.</p><a className="mt-3 inline-block underline" href="/app">Ke dashboard</a></div></div>
  return children
}
