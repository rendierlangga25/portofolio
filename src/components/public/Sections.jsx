import {useEffect,useState} from 'react'
import {AnimatePresence,motion,useScroll,useTransform} from 'framer-motion'
import {ArrowUpRight,Briefcase,Download,ExternalLink,Github,GraduationCap,Instagram,Linkedin,Mail,MapPin,MessageCircle,Target,X} from 'lucide-react'
import Reveal from './Reveal'
import {sb} from '../../lib/supabase'

export const Section=({id,kicker,title,children})=>(
  <section id={id} className="scroll-mt-16 py-24"><div className="mx-auto max-w-6xl px-5">
    <Reveal><p className="text-xs font-semibold uppercase tracking-[.22em] text-[var(--ac)]">{kicker}</p>
    <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2></Reveal>
    <div className="mt-12">{children}</div></div></section>)

export function Hero({p}){
  const {scrollY}=useScroll(),y=useTransform(scrollY,[0,600],[0,-50])
  const ini=(p.name||'R').split(' ').map(w=>w[0]).slice(0,2).join('')
  return(
  <section id="home" className="relative flex min-h-screen items-center pt-20">
    <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-12 md:grid-cols-12">
      <div className="md:col-span-7">
        <Reveal><span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-3.5 py-1.5 text-xs font-medium"><span className="h-1.5 w-1.5 rounded-full bg-[var(--ac)]"/>{p.headline}</span></Reveal>
        <Reveal delay={.08}><h1 className="font-display mt-6 text-[2.5rem] font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">{p.hero_title}</h1></Reveal>
        <Reveal delay={.16}><p className="mt-6 max-w-xl text-base leading-relaxed text-black/65 md:text-lg">{p.hero_subtitle}</p></Reveal>
        <Reveal delay={.24}><div className="mt-9 flex flex-wrap gap-3">
          <a href="#projects" className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all hover:gap-3">View My Work<ArrowUpRight size={16}/></a>
          <a href="#contact" className="rounded-full border border-black/20 px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white">Let's Connect</a>
          {p.cv_url&&<a href={p.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-black/60 hover:text-black"><Download size={16}/>CV</a>}
        </div></Reveal>
      </div>
      <motion.div style={{y}} className="relative md:col-span-5">
        <div className="absolute -bottom-3 -right-3 h-full w-full rounded-[2rem] bg-[var(--ac)]"/>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/10 bg-white">
          {p.avatar_url?<img src={p.avatar_url} alt={p.name} className="h-full w-full object-cover"/>:<div className="font-display grid h-full place-items-center text-8xl font-semibold text-black/10">{ini}</div>}
        </div>
        {p.location&&<div className="absolute -left-3 bottom-8 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium shadow-lg"><MapPin size={15}/>{p.location}</div>}
      </motion.div>
    </div>
    <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
      <span className="text-[10px] font-medium uppercase tracking-[.3em] text-black/40">Scroll</span>
      <motion.div className="h-10 w-px origin-top bg-black/40" animate={{scaleY:[0,1,1],opacity:[0,1,0]}} transition={{duration:2,repeat:Infinity}}/>
    </div>
  </section>)
}

export function About({p}){
  const info=[['Education',p.education_text,GraduationCap],['Focus',p.focus_text,Target],['Location',p.location,MapPin]].filter(x=>x[1])
  return(
  <Section id="about" kicker="About" title="A bit about me">
    <div className="grid gap-10 md:grid-cols-12">
      <Reveal className="md:col-span-7">{(p.bio||'').split('\n\n').map((t,i)=><p key={i} className="mb-5 text-lg leading-relaxed text-black/70">{t}</p>)}</Reveal>
      <div className="grid content-start gap-4 sm:grid-cols-2 md:col-span-5">{info.map(([l,v,I],i)=>
        <Reveal key={l} delay={i*.08} className="rounded-3xl border border-black/10 bg-white p-5"><I size={18} className="text-[var(--ac)]"/><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-black/45">{l}</p><p className="mt-1 text-sm font-medium leading-snug">{v}</p></Reveal>)}</div>
    </div>
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">{(p.stats||[]).map((s,i)=>
      <Reveal key={i} delay={i*.08} className="rounded-3xl bg-black p-7 text-white"><p className="font-display text-4xl font-semibold">{s.n}</p><p className="mt-1 text-sm text-white/60">{s.l}</p></Reveal>)}</div>
  </Section>)
}

export function Experience({items,education}){
  return(
  <Section id="experience" kicker="Experience" title="Where I've worked">
    <div className="relative space-y-6 border-l border-black/15 pl-8">{items.map((e,i)=>
      <Reveal key={e.id} delay={i*.05}><div className="relative rounded-3xl border border-black/10 bg-white p-6 md:p-8">
        <span className="absolute -left-[2.4rem] top-9 h-3 w-3 rounded-full bg-[var(--ac)] ring-4 ring-[var(--bg)]"/>
        <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-display text-xl font-semibold">{e.role}</h3><p className="mt-1 flex items-center gap-2 text-sm font-medium text-[var(--ac)]"><Briefcase size={14}/>{e.company}</p></div>{e.period&&<span className="rounded-full bg-[var(--bg)] px-3 py-1 text-xs font-medium">{e.period}</span>}</div>
        <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">{(e.bullets||'').split('\n').filter(Boolean).map((b,k)=><li key={k} className="flex gap-2.5 text-sm text-black/70"><span className="mt-2 h-1 w-1 flex-none rounded-full bg-black"/>{b}</li>)}</ul>
      </div></Reveal>)}</div>
    {education.length>0&&<div className="mt-14"><h3 className="font-display mb-5 text-xl font-semibold">Education</h3>
      <div className="grid gap-4 md:grid-cols-2">{education.map(e=><Reveal key={e.id} className="flex gap-4 rounded-3xl border border-black/10 bg-white p-6">
        {e.logo_url?<img src={e.logo_url} alt="" className="h-12 w-12 rounded-xl object-contain"/>:<div className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-[var(--bg)]"><GraduationCap size={20}/></div>}
        <div><p className="font-semibold">{e.institution}</p><p className="text-sm text-black/65">{[e.degree,e.field].filter(Boolean).join(' · ')}</p>{(e.start_year||e.end_year)&&<p className="mt-1 text-xs text-black/45">{[e.start_year,e.end_year].filter(Boolean).join(' – ')}</p>}{e.description&&<p className="mt-2 text-sm text-black/65">{e.description}</p>}</div>
      </Reveal>)}</div></div>}
  </Section>)
}

function Modal({p,onClose}){
  useEffect(()=>{const f=e=>e.key==='Escape'&&onClose();addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[])
  const imgs=[p.thumbnail_url,...p.images.map(i=>i.url)].filter(Boolean)
  return(
  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
    <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} onClick={e=>e.stopPropagation()} className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6 md:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--ac)]">{p.category}</p><h3 className="font-display mt-1 text-2xl font-semibold">{p.title}</h3></div><button onClick={onClose} aria-label="Close" className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[var(--bg)]"><X size={18}/></button></div>
      <p className="mt-4 text-black/70">{p.description}</p>
      {imgs.length>0&&<div className="mt-5 grid gap-3 sm:grid-cols-2">{imgs.map((u,i)=><img key={i} src={u} alt="" className="w-full rounded-2xl border border-black/10 object-cover"/>)}</div>}
      <div className="mt-6 flex flex-wrap gap-3">{p.project_url&&<a href={p.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"><ExternalLink size={15}/>Live project</a>}{p.github_url&&<a href={p.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-2.5 text-sm font-medium"><Github size={15}/>GitHub</a>}</div>
    </motion.div></motion.div>)
}

export function Projects({items}){
  const [open,setOpen]=useState(null)
  return(
  <Section id="projects" kicker="Projects" title="Selected work">
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((p,i)=>
      <Reveal key={p.id} delay={(i%3)*.07} className="h-full"><motion.article whileHover={{y:-6}} onClick={()=>setOpen(p)} className="group h-full cursor-pointer overflow-hidden rounded-3xl border border-black/10 bg-white transition-shadow hover:shadow-xl">
        <div className="aspect-[16/10] overflow-hidden bg-neutral-100">{p.thumbnail_url?<img src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>:<div className="font-display grid h-full place-items-center text-6xl font-semibold text-black/10">{(p.title||'P')[0]}</div>}</div>
        <div className="p-6">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--ac)]"><span>{p.category}</span>{p.featured&&<span className="rounded-full bg-black px-2 py-0.5 text-[10px] text-white">Featured</span>}</div>
          <h3 className="font-display mt-2 text-lg font-semibold leading-snug">{p.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-black/65">{p.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">{(p.technologies||'').split(',').map(t=>t.trim()).filter(Boolean).map(t=><span key={t} className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-xs font-medium">{t}</span>)}</div>
        </div></motion.article></Reveal>)}</div>
    <AnimatePresence>{open&&<Modal p={open} onClose={()=>setOpen(null)}/>}</AnimatePresence>
  </Section>)
}

export function Skills({categories,skills}){
  return(
  <Section id="skills" kicker="Skills" title="What I bring">
    <div className="grid gap-5 md:grid-cols-3">{categories.map((c,i)=>
      <Reveal key={c.id} delay={i*.08} className="rounded-3xl border border-black/10 bg-white p-7"><h3 className="font-display text-lg font-semibold">{c.name}</h3>
        <div className="mt-5 flex flex-wrap gap-2">{skills.filter(s=>s.category_id===c.id).map(s=><span key={s.id} className="rounded-full bg-[var(--bg)] px-3.5 py-1.5 text-sm font-medium">{s.name}</span>)}</div></Reveal>)}</div>
  </Section>)
}

const ICON={linkedin:Linkedin,github:Github,instagram:Instagram}
export function Contact({p,socials}){
  const [st,setSt]=useState('')
  const rows=[p.email&&['Email',p.email,'mailto:'+p.email,Mail],p.whatsapp&&['WhatsApp','+'+p.whatsapp.replace(/\D/g,''),'https://wa.me/'+p.whatsapp.replace(/\D/g,''),MessageCircle],...socials.map(s=>[s.platform,s.url.replace(/^https?:\/\/(www\.)?/,''),s.url,ICON[(s.platform||'').toLowerCase()]||ExternalLink])].filter(Boolean)
  const send=async e=>{e.preventDefault();const f=e.target,v=n=>f.elements[n].value.trim();if(v('hp'))return
    setSt('Sending…');const {error}=await sb.from('contact_messages').insert({name:v('name'),email:v('email'),message:v('message')})
    if(error)return setSt('Failed to send. Please try again later.');f.reset();setSt('Thank you! Your message has been sent.')}
  const inp="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/40 focus:border-white/50"
  return(
  <section id="contact" className="scroll-mt-16 px-5 py-24"><div className="mx-auto max-w-6xl rounded-[2.5rem] bg-black p-7 text-white md:p-14"><div className="grid gap-12 md:grid-cols-2">
    <Reveal><h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{p.contact_title}</h2>
      <div className="mt-10 divide-y divide-white/10 border-y border-white/10">{rows.map(([l,v,h,I],i)=><a key={i} href={h} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4"><I size={18} className="flex-none text-white/60"/><div className="min-w-0 flex-1"><p className="text-xs uppercase tracking-wider text-white/40">{l}</p><p className="truncate text-sm">{v}</p></div><ArrowUpRight size={16} className="text-white/40 transition group-hover:text-white"/></a>)}</div></Reveal>
    <Reveal delay={.1}><form onSubmit={send} className="space-y-3">
      <input name="name" required maxLength={100} placeholder="Your name" className={inp}/>
      <input name="email" type="email" required maxLength={200} placeholder="Your email" className={inp}/>
      <textarea name="message" required maxLength={2000} rows={5} placeholder="Your message" className={inp}/>
      <input name="hp" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]"/>
      <button className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-[var(--ac)] hover:text-white">Send Message</button>
      <p className="min-h-5 text-sm text-white/60">{st}</p></form></Reveal>
  </div></div></section>)
}
