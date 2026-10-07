import {useState} from 'react'
import {Link,Navigate,useNavigate,useSearchParams} from 'react-router-dom'
import {sb} from '../../lib/supabase'
import {useAccount} from '../../lib/account'
import AuthShell,{btn,inp} from './AuthShell'
import GoogleBtn from './GoogleBtn'
export default function SignIn(){
  const nav=useNavigate(),[q]=useSearchParams(),plan=q.get('plan'),{user,loading}=useAccount()
  const next=q.get('next')||(plan?`/app/billing?plan=${encodeURIComponent(plan)}`:'/app')
  const [mode,setMode]=useState('in'),[err,setErr]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false)
  if(!loading&&user)return <Navigate to={next} replace/>
  const go=async e=>{e.preventDefault();setBusy(true);setErr('');setMsg('');const f=e.target.elements,email=f.email.value.trim()
    if(mode==='forgot'){const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/reset'});setBusy(false);return error?setErr(error.message):setMsg('Jika email terdaftar, tautan untuk mengatur ulang password sudah dikirim.')}
    const {error}=await sb.auth.signInWithPassword({email,password:f.password.value});setBusy(false)
    if(error)return setErr(/invalid/i.test(error.message)?'Email atau password salah':/confirm/i.test(error.message)?'Email belum dikonfirmasi. Cek kotak masuk kamu.':error.message)
    nav(next)}
  return(<AuthShell title={mode==='in'?'Selamat datang kembali':'Lupa password'} sub={mode==='in'?'Masuk untuk mengelola portofolio dan langgananmu.':'Masukkan email, kami kirim tautan untuk mengatur ulang password.'}
    foot={<>Belum punya akun? <Link to={plan?`/daftar?plan=${plan}`:'/daftar'} className="font-semibold text-[#111] underline">Daftar</Link></>}>
    <form onSubmit={go} className="space-y-3.5">
      <input name="email" type="email" required placeholder="Email" autoComplete="username" className={inp}/>
      {mode==='in'&&<input name="password" type="password" required placeholder="Password" autoComplete="current-password" className={inp}/>}
      {err&&<p className="text-sm text-red-600">{err}</p>}{msg&&<p className="text-sm text-emerald-700">{msg}</p>}
      <button disabled={busy} className={btn}>{busy?'Memproses…':mode==='in'?'Masuk':'Kirim tautan'}</button>
      {mode==='in'&&<><GoogleBtn next={next}/><button type="button" onClick={()=>{setMode('forgot');setErr('')}} className="block w-full text-center text-sm text-black/55 underline">Lupa password?</button></>}
      {mode==='forgot'&&<button type="button" onClick={()=>{setMode('in');setMsg('')}} className="block w-full text-center text-sm text-black/55 underline">Kembali ke halaman masuk</button>}
    </form></AuthShell>)
}
