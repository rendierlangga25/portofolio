import {useEffect,useState} from 'react'
import {sb} from '../../lib/supabase'
const cnt=(t,f)=>{let q=sb.from(t).select('*',{count:'exact',head:true});if(f)q=q.eq(f[0],f[1]);return q.then(r=>r.count??0)}
export default function Dashboard(){
  const [c,setC]=useState(null)
  useEffect(()=>{Promise.all([cnt('projects'),cnt('projects',['published',true]),cnt('experiences'),cnt('skills'),cnt('contact_messages'),cnt('contact_messages',['is_read',false])]).then(setC)},[])
  const cards=c?[['Total proyek',c[0]],['Proyek terpublikasi',c[1]],['Proyek draft',c[0]-c[1]],['Pengalaman',c[2]],['Skill',c[3]],['Pesan masuk',c[4]],['Pesan belum dibaca',c[5]]]:[]
  return(<div><h1 className="font-display mb-6 text-2xl font-semibold">Dashboard</h1>
    {!c?<p className="text-sm text-neutral-500">Memuat…</p>:<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(([l,n])=><div key={l} className="rounded-xl border bg-white p-5"><p className="font-display text-3xl font-semibold">{n}</p><p className="mt-1 text-sm text-neutral-500">{l}</p></div>)}</div>}
    <p className="mt-8 text-sm text-neutral-500">Pilih menu di samping untuk mengubah konten. Perubahan langsung tampil di website publik.</p></div>)
}
