import {useEffect,useState} from 'react'
import {Trash2} from 'lucide-react'
import {sb} from '../../lib/supabase'
import {useToast} from '../../components/admin/Toast'
import {useAccount} from '../../lib/account'
export default function Messages(){
  const toast=useToast(),{user}=useAccount(),[rows,setRows]=useState(null)
  const load=async()=>{const {data,error}=await sb.from('contact_messages').select('*').eq('owner_id',user.id).order('created_at',{ascending:false});if(error)toast(error.message,'err');setRows(data||[])}
  useEffect(()=>{load()},[])
  const read=async r=>{await sb.from('contact_messages').update({is_read:!r.is_read}).eq('id',r.id);load()}
  const del=async r=>{if(!confirm('Hapus pesan ini?'))return;await sb.from('contact_messages').delete().eq('id',r.id);load()}
  return(<div><h1 className="font-display mb-6 text-2xl font-semibold">Messages</h1>
    {!rows?<p className="text-sm text-neutral-500">Memuat…</p>:rows.length===0?<div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm text-neutral-500">Belum ada pesan.</div>:
    <div className="space-y-3">{rows.map(r=><div key={r.id} className={`rounded-xl border bg-white p-4 ${r.is_read?'opacity-60':''}`}>
      <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{r.name} <a className="font-normal text-neutral-500 underline" href={'mailto:'+r.email}>{r.email}</a></p><p className="text-xs text-neutral-400">{new Date(r.created_at).toLocaleString('id-ID')}</p></div>
        <div className="flex flex-none gap-2 text-sm"><button onClick={()=>read(r)} className="underline">{r.is_read?'Tandai belum dibaca':'Tandai dibaca'}</button><button onClick={()=>del(r)} className="text-red-600"><Trash2 size={16}/></button></div></div>
      <p className="mt-2 whitespace-pre-line text-sm">{r.message}</p></div>)}</div>}</div>)
}
