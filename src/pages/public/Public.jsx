import {useEffect} from 'react'
import useSite from '../../hooks/useSite'
import {applySettings} from '../../lib/head'
import Navbar from '../../components/public/Navbar'
import {Hero,About,Experience,Projects,Certificates,Skills,Contact} from '../../components/public/Sections'
export default function Public(){
  const d=useSite()
  useEffect(()=>{d&&applySettings(d.settings)},[d])
  if(!d)return <div className="grid min-h-screen place-items-center text-sm text-[var(--tx)]/40">Loading…</div>
  const {profile:p,settings:s}=d
  return(<>
    <Navbar logo={s.logo_text||'RE'}/>
    <main><Hero p={p}/><About p={p}/><Experience items={d.experiences} education={d.education}/><Projects items={d.projects}/><Certificates items={d.certificates}/><Skills categories={d.categories} skills={d.skills}/><Contact p={p} socials={d.socials}/></main>
    <footer className="px-5 pb-10 text-center text-xs text-[var(--tx)]/45">{s.footer_text||`© ${new Date().getFullYear()} ${p.name||''}`}</footer>
  </>)
}
