import {useState} from 'react'
import {NavLink,Outlet,useNavigate} from 'react-router-dom'
import {Briefcase,FileText,FolderKanban,GraduationCap,LayoutDashboard,Link2,LogOut,Mail,Menu,Phone,Settings,User,Wrench,X,ExternalLink} from 'lucide-react'
import {sb} from '../lib/supabase'
const items=[['/admin','Dashboard',LayoutDashboard],['/admin/profile','Profile',User],['/admin/about','About',FileText],['/admin/experience','Experience',Briefcase],['/admin/projects','Projects',FolderKanban],['/admin/skills','Skills',Wrench],['/admin/education','Education',GraduationCap],['/admin/contact','Contact',Phone],['/admin/social','Social Links',Link2],['/admin/settings','Site Settings',Settings],['/admin/messages','Messages',Mail]]
export default function AdminLayout(){
  const [open,setOpen]=useState(false),nav=useNavigate()
  const out=async()=>{await sb.auth.signOut();nav('/admin/login')}
  return(<div className="min-h-screen bg-neutral-100 text-neutral-900">
    <aside className={`fixed inset-y-0 left-0 z-30 w-60 border-r bg-white p-4 transition-transform md:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="font-display mb-6 flex items-center gap-2 px-2 text-lg font-semibold"><span className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs text-white">RE</span>Admin</div>
      <nav className="space-y-0.5">{items.map(([to,l,I])=><NavLink key={to} to={to} end={to==='/admin'} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive?'bg-neutral-900 text-white':'text-neutral-600 hover:bg-neutral-100'}`}><I size={17}/>{l}</NavLink>)}</nav></aside>
    {open&&<div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={()=>setOpen(false)}/>}
    <div className="md:pl-60"><header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white/90 px-4 backdrop-blur">
      <button className="md:hidden" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button><span className="hidden md:block"/>
      <div className="flex items-center gap-4 text-sm"><a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-neutral-600"><ExternalLink size={15}/>Lihat website</a><button onClick={out} className="flex items-center gap-1.5 text-neutral-600"><LogOut size={15}/>Keluar</button></div></header>
      <main className="p-4 md:p-8"><Outlet/></main></div></div>)
}
