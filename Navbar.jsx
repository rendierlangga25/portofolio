import {useEffect,useState} from 'react'
import {AnimatePresence,motion} from 'framer-motion'
import {Menu,X} from 'lucide-react'
const links=[['home','Home'],['about','About'],['experience','Experience'],['projects','Projects'],['certificates','Certificates'],['skills','Skills'],['contact','Contact']]
export default function Navbar({logo='RE'}){
  const [open,setOpen]=useState(false),[sc,setSc]=useState(false)
  useEffect(()=>{const f=()=>setSc(scrollY>20);f();addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[])
  return(
  <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${sc||open?'border-b border-[var(--tx)]/10 bg-[var(--bg)]/85 backdrop-blur-md':''}`}>
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
      <a href="#home" className="font-display grid h-10 w-10 place-items-center rounded-full bg-[var(--dk)] text-sm font-semibold text-[var(--dkt)]">{logo}</a>
      <nav className="hidden gap-1.5 md:flex">{links.map(([id,l])=><a key={id} href={'#'+id} className="rounded-full bg-[var(--nv)] px-4 py-2 text-sm font-medium text-[var(--nvt)] transition hover:opacity-70">{l}</a>)}</nav>
      <button className="grid h-10 w-10 place-items-center md:hidden" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X size={22}/>:<Menu size={22}/>}</button>
    </div>
    <AnimatePresence>{open&&<motion.nav initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="flex flex-col px-5 pb-6 md:hidden">
      {links.map(([id,l])=><a key={id} href={'#'+id} onClick={()=>setOpen(false)} className="font-display mb-2 rounded-2xl bg-[var(--nv)] px-5 py-3.5 text-lg font-medium text-[var(--nvt)]">{l}</a>)}
    </motion.nav>}</AnimatePresence>
  </header>)
}
