import {useEffect,useMemo,useState} from 'react'
import {Check,Copy,ExternalLink,Mail,Reply,Trash2} from 'lucide-react'
import {sb} from '../../lib/supabase'
import {useToast} from '../../components/admin/Toast'
import {useAccount} from '../../lib/account'
import {dtTime} from '../../lib/format'

const enc=encodeURIComponent
const cut=(t,n)=>t.length>n?t.slice(0,n)+'…':t
// Isi email lengkap: balasan + kutipan pesan asli di bagian bawah
const fullBody=(r,body)=>`${body.trim()}\n\n--- Pesan dari ${r.name} (${dtTime(r.created_at)}) ---\n${cut(r.message,700)}`
const gmailUrl=(r,d)=>`https://mail.google.com/mail/?view=cm&fs=1&to=${enc(r.email)}&su=${enc(d.subject)}&body=${enc(fullBody(r,d.body))}`
const mailtoUrl=(r,d)=>`mailto:${r.email}?subject=${enc(d.subject)}&body=${enc(fullBody(r,d.body).replace(/\n/g,'\r\n'))}`
const FILTERS=[['all','Semua'],['unread','Belum dibaca'],['unreplied','Belum dibalas']]

export default function Messages(){
  const toast=useToast(),{user,profile}=useAccount()
  const [rows,setRows]=useState(null),[f,setF]=useState('all'),[openId,setOpenId]=useState(null),[draft,setDraft]=useState({subject:'',body:''}),[showReply,setShowReply]=useState({}),[busy,setBusy]=useState(false)
  const load=async()=>{const {data,error}=await sb.from('contact_messages').select('*').eq('owner_id',user.id).order('created_at',{ascending:false});if(error)toast(error.message,'err');setRows(data||[])}
  useEffect(()=>{load()},[])
  const counts=useMemo(()=>({all:(rows||[]).length,unread:(rows||[]).filter(r=>!r.is_read).length,unreplied:(rows||[]).filter(r=>!r.replied_at).length}),[rows])
  const list=(rows||[]).filter(r=>f==='all'||(f==='unread'&&!r.is_read)||(f==='unreplied'&&!r.replied_at))
  const read=async r=>{const {error}=await sb.from('contact_messages').update({is_read:!r.is_read}).eq('id',r.id).eq('owner_id',user.id);if(error)toast(error.message,'err');load()}
  const del=async r=>{if(!confirm('Hapus pesan ini? Riwayat balasannya ikut terhapus.'))return;const {error}=await sb.from('contact_messages').delete().eq('id',r.id).eq('owner_id',user.id);if(error)return toast(error.message,'err');if(openId===r.id)setOpenId(null);load()}
  const me=profile?.name||''
  const openReply=r=>{
    if(openId===r.id){setOpenId(null);return}
    setOpenId(r.id)
    setDraft({subject:`Re: Pesan dari portofolio${me?' '+me:''}`,body:`Halo ${r.name},\n\nTerima kasih sudah menghubungi saya lewat portofolio.\n\n\n\nSalam,\n${me}`.trimEnd()})
    if(!r.is_read)sb.from('contact_messages').update({is_read:true}).eq('id',r.id).eq('owner_id',user.id).then(load)
  }
  const send=async(r,kind)=>{
    const body=draft.body.trim()
    if(!body)return toast('Tulis isi balasan dulu','err')
    // Buka aplikasi email SEBELUM proses async apa pun, supaya tidak diblokir pop-up blocker
    if(kind==='gmail')window.open(gmailUrl(r,draft),'_blank','noopener')
    else if(kind==='mail')window.location.href=mailtoUrl(r,draft)
    else{
      try{await navigator.clipboard.writeText(`Kepada: ${r.email}\nSubjek: ${draft.subject}\n\n${fullBody(r,body)}`);toast('Balasan disalin')}
      catch{return toast('Gagal menyalin. Salin manual dari kotak balasan.','err')}
      return
    }
    setBusy(true)
    const {error}=await sb.from('contact_messages').update({replied_at:new Date().toISOString(),reply_text:body,is_read:true}).eq('id',r.id).eq('owner_id',user.id)
    setBusy(false)
    if(error)toast(/replied_at|reply_text/.test(error.message)?'Email dibuka, tetapi riwayat balasan belum bisa disimpan. Jalankan update-5-balas-pesan-dan-ringkasan.sql di Supabase.':error.message,'err')
    else{toast('Email balasan dibuka. Tekan Kirim di aplikasi emailmu.');setOpenId(null)}
    load()
  }
  const ring='focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30'
  return(<div><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-display text-2xl font-semibold">Messages</h1><p className="mt-1 text-sm text-neutral-500">Pesan dari pengunjung portofoliomu. Balasan dikirim lewat emailmu sendiri.</p></div>
    <div className="flex flex-wrap gap-2 text-sm" role="tablist" aria-label="Filter pesan">{FILTERS.map(([k,l])=><button key={k} role="tab" aria-selected={f===k} onClick={()=>setF(k)} className={`rounded-full px-3.5 py-1.5 ${ring} ${f===k?'bg-neutral-900 text-white':'border bg-white hover:bg-neutral-50'}`}>{l}{rows?` (${counts[k]})`:''}</button>)}</div></div>
    {!rows?<p className="text-sm text-neutral-500">Memuat…</p>:list.length===0?<div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm text-neutral-500">{rows.length===0?'Belum ada pesan.':'Tidak ada pesan pada filter ini.'}</div>:
    <div className="space-y-3">{list.map(r=>{const open=openId===r.id
      return(<article key={r.id} className={`rounded-xl border bg-white p-4 ${r.is_read&&r.replied_at?'opacity-80':''}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3"><span aria-hidden className="grid h-9 w-9 flex-none place-items-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">{(r.name||'?').trim()[0]?.toUpperCase()}</span>
            <div className="min-w-0"><p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">{r.name}
              {!r.is_read&&<span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">BARU</span>}
              {r.replied_at&&<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"><Check size={11}/>DIBALAS</span>}</p>
              <a className="break-all text-sm text-neutral-500 underline" href={'mailto:'+r.email}>{r.email}</a>
              <p className="text-xs text-neutral-400">{dtTime(r.created_at)}</p></div></div>
          <div className="flex flex-none flex-wrap items-center gap-2 text-sm">
            <button onClick={()=>openReply(r)} aria-expanded={open} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium ${ring} ${open?'bg-neutral-100':'bg-neutral-900 text-white hover:bg-neutral-700'}`}><Reply size={15}/>{open?'Tutup':r.replied_at?'Balas lagi':'Balas'}</button>
            <button onClick={()=>read(r)} className={`rounded-lg px-2 py-1.5 text-neutral-600 underline ${ring}`}>{r.is_read?'Tandai belum dibaca':'Tandai dibaca'}</button>
            <button onClick={()=>del(r)} aria-label="Hapus pesan" title="Hapus pesan" className={`rounded-lg p-1.5 text-red-600 hover:bg-red-50 ${ring}`}><Trash2 size={16}/></button></div></div>
        <p className="mt-3 whitespace-pre-line break-words text-sm">{r.message}</p>
        {r.replied_at&&r.reply_text&&<div className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm"><button onClick={()=>setShowReply(s=>({...s,[r.id]:!s[r.id]}))} aria-expanded={!!showReply[r.id]} className={`text-xs font-semibold text-neutral-600 underline ${ring}`}>Balasanmu · {dtTime(r.replied_at)} {showReply[r.id]?'(sembunyikan)':'(lihat)'}</button>
          {showReply[r.id]&&<p className="mt-2 whitespace-pre-line break-words text-neutral-700">{r.reply_text}</p>}</div>}
        {open&&<div className="mt-4 space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div><label htmlFor={'to-'+r.id} className="mb-1 block text-xs font-medium text-neutral-500">Kepada</label><input id={'to-'+r.id} readOnly value={r.email} className="w-full rounded-lg border bg-neutral-100 px-3 py-2 text-sm text-neutral-600"/></div>
          <div><label htmlFor={'su-'+r.id} className="mb-1 block text-xs font-medium text-neutral-500">Subjek</label><input id={'su-'+r.id} value={draft.subject} onChange={e=>setDraft(d=>({...d,subject:e.target.value}))} maxLength={150} className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"/></div>
          <div><label htmlFor={'bd-'+r.id} className="mb-1 block text-xs font-medium text-neutral-500">Isi balasan</label><textarea id={'bd-'+r.id} rows={8} value={draft.body} onChange={e=>setDraft(d=>({...d,body:e.target.value}))} maxLength={2000} className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"/>
            <p className="mt-1 text-xs text-neutral-500">Pesan asli {r.name} otomatis disertakan di bagian bawah email.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <button disabled={busy} onClick={()=>send(r,'gmail')} className={`inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 ${ring}`}><ExternalLink size={15}/>Kirim lewat Gmail</button>
            <button disabled={busy} onClick={()=>send(r,'mail')} className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50 ${ring}`}><Mail size={15}/>Aplikasi email</button>
            <button disabled={busy} onClick={()=>send(r,'copy')} className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50 ${ring}`}><Copy size={15}/>Salin</button></div>
          <p className="text-xs text-neutral-500">Email dibuka dengan isi yang sudah terisi, lalu kamu menekan tombol Kirim di Gmail atau aplikasi emailmu.</p></div>}
      </article>)})}</div>}</div>)
}
