import {useEffect,useState} from 'react'
import {Link,Navigate,useNavigate,useSearchParams} from 'react-router-dom'
import {sb} from '../../lib/supabase'
import {useAccount} from '../../lib/account'
import AuthShell,{btn,inp} from './AuthShell'
import GoogleBtn from './GoogleBtn'
import UsernameField from './UsernameField'
import {siteUrl} from '../../lib/site'
const OK=/^[a-z0-9][a-z0-9-]{2,29}$/
export default function SignUp(){
  const nav=useNavigate(),[q]=useSearchParams(),plan=q.get('plan'),{user,loading}=useAccount()
  const [f,setF]=useState({name:'',username:'',email:'',password:''}),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[done,setDone]=useState(false),[av,setAv]=useState(null)
  const next=plan?`/app/billing?plan=${encodeURIComponent(plan)}`:'/app'
  const set=(k,v)=>setF(s=>({...s,[k]:k==='username'?v.toLowerCase().replace(/[^a-z0-9-]/g,''):v}))
  useEffect(()=>{setAv(null);if(!OK.test(f.username))return;const t=setTimeout(async()=>{const {data}=await sb.rpc('username_available',{p:f.username});setAv(!!data)},400);return()=>clearTimeout(t)},[f.username])
  if(!loading&&user)return <Navigate to={next} replace/>
  const go=async e=>{e.preventDefault();setErr('')
    if(!OK.test(f.username))return setErr('Username 3-30 karakter: huruf kecil, angka, dan tanda minus')
    if(av===false)return setErr('Username sudah dipakai, coba yang lain')
    if(f.password.length<8)return setErr('Password minimal 8 karakter')
    setBusy(true)
    const {data,error}=await sb.auth.signUp({email:f.email.trim(),password:f.password,options:{data:{full_name:f.name.trim(),username:f.username},emailRedirectTo:siteUrl()+next}})
    setBusy(false)
    if(error)return setErr(/registered|already/i.test(error.message)?'Email ini sudah terdaftar. Silakan masuk.':error.message)
    if(data.session)nav(next);else setDone(true)}
  if(done)return <AuthShell title="Cek email kamu" sub={`Kami mengirim tautan konfirmasi ke ${f.email}. Klik tautan itu untuk mengaktifkan akun. Tidak ada di kotak masuk? Periksa folder spam.`}><Link to={plan?`/masuk?plan=${plan}`:'/masuk'} className={btn+' block text-center'}>Ke halaman masuk</Link></AuthShell>
  return(<AuthShell title="Buat akun" sub="Daftar gratis, pilih paket setelahnya." foot={<>Sudah punya akun? <Link to={plan?`/masuk?plan=${plan}`:'/masuk'} className="font-semibold text-[#111] underline">Masuk</Link></>}>
    <form onSubmit={go} className="space-y-3.5">
      <input className={inp} placeholder="Nama lengkap" required value={f.name} onChange={e=>set('name',e.target.value)} autoComplete="name"/>
      <div><UsernameField value={f.username} onChange={e=>set('username',e.target.value)}/>
        <p className={`mt-1.5 text-xs ${av===true?'text-emerald-600':av===false?'text-red-600':'text-black/45'}`}>{av===true?'Username tersedia':av===false?'Username sudah dipakai':'Ini akan menjadi alamat portofoliomu.'}</p></div>
      <input className={inp} type="email" placeholder="Email" required value={f.email} onChange={e=>set('email',e.target.value)} autoComplete="email"/>
      <input className={inp} type="password" placeholder="Password (minimal 8 karakter)" required minLength={8} value={f.password} onChange={e=>set('password',e.target.value)} autoComplete="new-password"/>
      {err&&<p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} className={btn}>{busy?'Membuat akun…':'Daftar'}</button>
      <GoogleBtn next={next}/>
      <p className="text-xs text-black/45">Dengan mendaftar, kamu menyetujui <Link to="/syarat" className="underline">Syarat & Kebijakan</Link> dan <Link to="/privasi" className="underline">Privasi</Link>.</p>
    </form></AuthShell>)
}
