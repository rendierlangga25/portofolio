import {useEffect,useState} from 'react'
import {Link,useParams,useSearchParams} from 'react-router-dom'
import useSite from '../../hooks/useSite'
import {applySettings} from '../../lib/head'
import Navbar from '../../components/public/Navbar'
import {Hero,About,Experience,Projects,Certificates,Skills,Contact} from '../../components/public/Sections'
import {DEMO,THEMES} from '../../lib/demo'
import {usePlans} from '../../lib/plans'
function useReset(){useEffect(()=>()=>{applySettings({});const m=document.querySelector('meta[name="description"]');m&&m.setAttribute('content','')},[])}
function Page({d,demo}){
  const {app}=usePlans()
  const [q]=useSearchParams(),[th,setTh]=useState(Math.min(3,Math.max(0,Number(q.get('warna'))||0)))
  const s=demo?{...d.settings,...THEMES[th][1],logo_text:'NP',site_title:'Nadia Putri | UI/UX Designer (Contoh Portofolio)'}:d.settings,p=d.profile
  useEffect(()=>{applySettings(s)},[s])
  useReset()
  return(<>
    {demo&&<div className="fixed inset-x-0 bottom-3 z-50 mx-auto flex w-fit max-w-[95vw] flex-wrap items-center justify-center gap-2 rounded-full bg-[#111] px-3 py-2 text-xs text-white shadow-2xl sm:text-sm"><span className="px-2 opacity-70">Contoh · coba warna:</span>{THEMES.map(([n],i)=><button key={n} onClick={()=>setTh(i)} className={`rounded-full px-3 py-1 font-medium ${i===th?'bg-white text-[#111]':'bg-white/10'}`}>{n}</button>)}<Link to="/#harga" className="rounded-full bg-[#e2561b] px-4 py-1.5 font-semibold">Buat punyamu</Link></div>}
    <Navbar logo={s.logo_text||'RE'}/>
    <main><Hero p={p}/><About p={p}/><Experience items={d.experiences} education={d.education}/><Projects items={d.projects}/><Certificates items={d.certificates}/><Skills categories={d.categories} skills={d.skills}/><Contact p={p} socials={d.socials}/></main>
    <footer className="px-5 pb-24 text-center text-xs text-[var(--tx)]/45"><p>{s.footer_text||`© ${new Date().getFullYear()} ${p.name||''}`}</p><p className="mt-2">Portofolio ini dibuat dengan <Link to="/" className="font-semibold underline">{app.brand_name}</Link></p></footer>
  </>)
}
export function Demo(){return <Page d={DEMO} demo/>}
export default function Public(){
  const {username}=useParams(),d=useSite(username)
  if(!d)return <div className="grid min-h-screen place-items-center text-sm text-neutral-500">Memuat…</div>
  if(d.notfound)return <div className="grid min-h-screen place-items-center bg-[#f3f1ec] p-6 text-center"><div><p className="font-display text-6xl font-semibold text-black/15">404</p><h1 className="font-display mt-2 text-2xl font-semibold">Portofolio tidak ditemukan</h1><p className="mt-2 max-w-sm text-sm text-black/60">Alamat ini belum dipakai, atau portofolionya sedang tidak aktif.</p><Link to="/" className="mt-6 inline-block rounded-full bg-[#111] px-6 py-3 text-sm font-semibold text-white">Buat portofoliomu sendiri</Link></div></div>
  return <Page d={d}/>
}
