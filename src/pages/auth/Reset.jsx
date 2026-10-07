import {useEffect,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {sb} from '../../lib/supabase'
import AuthShell,{btn,inp} from './AuthShell'
export default function Reset(){
  const nav=useNavigate(),[ready,setReady]=useState(false),[err,setErr]=useState(''),[busy,setBusy]=useState(false)
  useEffect(()=>{sb.auth.getSession().then(({data})=>data.session&&setReady(true));const {data:{subscription}}=sb.auth.onAuthStateChange(ev=>{if(ev==='PASSWORD_RECOVERY'||ev==='SIGNED_IN')setReady(true)});return()=>subscription.unsubscribe()},[])
  const go=async e=>{e.preventDefault();const p=e.target.elements.password.value;if(p.length<8)return setErr('Password minimal 8 karakter');setBusy(true)
    const {error}=await sb.auth.updateUser({password:p});setBusy(false);if(error)return setErr(error.message);nav('/app')}
  return(<AuthShell title="Atur password baru" sub={ready?'Masukkan password baru untuk akunmu.':'Memeriksa tautan… Jika tidak berlanjut, minta tautan baru dari halaman masuk.'} foot={<Link to="/masuk" className="underline">Kembali ke halaman masuk</Link>}>
    {ready&&<form onSubmit={go} className="space-y-3.5"><input name="password" type="password" required minLength={8} placeholder="Password baru (minimal 8 karakter)" autoComplete="new-password" className={inp}/>{err&&<p className="text-sm text-red-600">{err}</p>}<button disabled={busy} className={btn}>{busy?'Menyimpan…':'Simpan password'}</button></form>}</AuthShell>)
}
