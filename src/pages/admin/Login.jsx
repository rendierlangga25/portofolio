import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {sb} from '../../lib/supabase'
export default function Login(){
  const nav=useNavigate(),[err,setErr]=useState(''),[busy,setBusy]=useState(false)
  const go=async e=>{e.preventDefault();setBusy(true);setErr('');const f=e.target.elements
    const {error}=await sb.auth.signInWithPassword({email:f.email.value.trim(),password:f.password.value})
    setBusy(false);if(error)setErr(/invalid/i.test(error.message)?'Email atau password salah':error.message);else nav('/admin')}
  const c='w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900'
  return(<div className="grid min-h-screen place-items-center bg-neutral-100 p-5"><form onSubmit={go} className="w-full max-w-sm space-y-3 rounded-2xl border bg-white p-7">
    <h1 className="font-display text-xl font-semibold">Admin Login</h1><p className="text-sm text-neutral-500">Masuk untuk mengelola konten portfolio.</p>
    <input name="email" type="email" required placeholder="Email" autoComplete="username" className={c}/>
    <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className={c}/>
    {err&&<p className="text-sm text-red-600">{err}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white disabled:opacity-50">{busy?'Masuk…':'Masuk'}</button></form></div>)
}
