import {useEffect,useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {CheckCircle2,Clock,Copy,Hourglass,MessageCircle,X,XCircle} from 'lucide-react'
import {sb} from '../../lib/supabase'
import {useAccount} from '../../lib/account'
import {usePlans} from '../../lib/plans'
import {useToast} from '../../components/admin/Toast'
import PlanCard from '../../components/shared/PlanCard'
import {daysLeft,dt,rp,waLink} from '../../lib/format'
const ST={paid:['Lunas','text-emerald-700 bg-emerald-50',CheckCircle2],pending:['Menunggu pembayaran','text-amber-700 bg-amber-50',Clock],review:['Menunggu verifikasi','text-blue-700 bg-blue-50',Hourglass],rejected:['Ditolak','text-red-700 bg-red-50',XCircle],cancelled:['Dibatalkan','text-neutral-600 bg-neutral-100',XCircle]}
const TL={qris:'QRIS',ewallet:'E-Wallet',bank:'Transfer Bank'}

function PayDialog({order,methods,app,onClose,onDone}){
  const toast=useToast(),{user}=useAccount()
  const [mid,setMid]=useState(order.method_id&&methods.some(m=>m.id===order.method_id)?order.method_id:methods[0]?.id||''),[file,setFile]=useState(null),[busy,setBusy]=useState(false)
  const m=methods.find(x=>x.id===mid),copy=t=>{navigator.clipboard?.writeText(String(t));toast('Tersalin')}
  const submit=async()=>{
    if(!file)return toast('Pilih file bukti pembayaran dulu','err')
    if(file.size>5e6)return toast('Ukuran bukti maksimal 5 MB','err')
    setBusy(true)
    try{
      const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')
      const path=`${user.id}/${order.order_id}-${Date.now()}.${ext}`
      const up=await sb.storage.from('proofs').upload(path,file,{contentType:file.type||undefined});if(up.error)throw up.error
      const {error}=await sb.rpc('submit_proof',{p_order:order.order_id,p_method:mid||null,p_path:path});if(error)throw error
      toast('Bukti terkirim. Kami akan memverifikasi ('+app.verify_time+').');onDone()
    }catch(e){toast(e.message||'Gagal mengirim bukti','err')}finally{setBusy(false)}}
  const groups=['qris','ewallet','bank'].map(k=>[k,methods.filter(x=>x.type===k)]).filter(([,l])=>l.length)
  const wa=waLink(app.support_whatsapp,`Halo, saya sudah membayar ${order.order_id} sebesar ${rp(order.amount)}.`)
  return(<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
    <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl" onClick={e=>e.stopPropagation()}>
      <div className="flex items-start justify-between"><div><p className="text-xs text-neutral-500">{order.order_id}</p><h2 className="font-display text-xl font-semibold">Paket {order.plan_name}</h2></div><button onClick={onClose} aria-label="Tutup"><X/></button></div>
      {order.status==='rejected'&&<p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">Pembayaran ditolak{order.note?': '+order.note:'.'} Silakan upload bukti yang benar.</p>}
      {order.status==='review'&&<p className="mt-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">Bukti sudah dikirim dan sedang diverifikasi. Kamu bisa mengunggah ulang jika perlu.</p>}
      <div className="mt-4 rounded-2xl bg-neutral-900 p-5 text-white"><p className="text-xs text-white/60">Total yang harus dibayar (sampai digit terakhir)</p>
        <div className="mt-1 flex items-center justify-between gap-3"><p className="font-display text-3xl font-semibold">{rp(order.amount)}</p><button onClick={()=>copy(order.amount)} className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs"><Copy size={13}/>Salin</button></div>
        <p className="mt-2 text-xs text-white/60">Harga paket {rp(order.base_amount||order.amount)} + kode unik {order.unique_code||0}. Kode unik membantu kami mencocokkan pembayaranmu, jadi transfer harus tepat.</p></div>
      <h3 className="mt-6 text-sm font-semibold">1. Pilih metode & bayar</h3>
      {methods.length===0?<p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Metode pembayaran belum diatur. Hubungi admin{wa&&<> lewat <a className="underline" href={wa}>WhatsApp</a></>}.</p>:<>
        <div className="mt-2 space-y-3">{groups.map(([k,l])=><div key={k}><p className="mb-1.5 text-xs font-medium text-neutral-500">{TL[k]}</p><div className="flex flex-wrap gap-2">{l.map(x=><button key={x.id} onClick={()=>setMid(x.id)} className={`rounded-full border px-4 py-1.5 text-sm font-medium ${mid===x.id?'border-neutral-900 bg-neutral-900 text-white':'bg-white'}`}>{x.label}</button>)}</div></div>)}</div>
        {m&&<div className="mt-4 rounded-2xl border p-4 text-sm">
          {m.image_url&&<img src={m.image_url} alt={m.label} className="mx-auto mb-3 max-h-72 rounded-xl border object-contain"/>}
          {m.account_number&&<div className="flex items-center justify-between gap-3"><div><p className="text-xs text-neutral-500">{m.type==='bank'?'Nomor rekening':'Nomor'} {m.label}</p><p className="font-mono text-lg font-semibold">{m.account_number}</p></div><button onClick={()=>copy(m.account_number)} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"><Copy size={13}/>Salin</button></div>}
          {m.account_name&&<p className="mt-2 text-neutral-600">a.n. <b>{m.account_name}</b></p>}
          {m.instructions&&<p className="mt-2 whitespace-pre-line text-neutral-500">{m.instructions}</p>}</div>}
        <h3 className="mt-6 text-sm font-semibold">2. Upload bukti pembayaran</h3>
        <label className="mt-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed p-4 text-sm"><span className="min-w-0 truncate">{file?file.name:'Pilih foto/screenshot bukti (JPG, PNG, PDF, maks 5 MB)'}</span><span className="flex-none rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium">Pilih file</span><input type="file" accept="image/*,application/pdf" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
        <button onClick={submit} disabled={busy||!file} className="mt-4 w-full rounded-full bg-neutral-900 py-3.5 text-sm font-semibold text-white disabled:opacity-40">{busy?'Mengirim…':'Kirim bukti pembayaran'}</button>
        <p className="mt-3 text-center text-xs text-neutral-500">Langganan aktif setelah diverifikasi ({app.verify_time}).</p></>}
      {wa&&<a href={wa} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 text-sm text-neutral-600 underline"><MessageCircle size={15}/>Konfirmasi lewat WhatsApp</a>}
    </div></div>)
}

export default function Billing(){
  const {user,sub,access,isAdmin,refresh}=useAccount(),{plans,live,loading,methods,app}=usePlans(),toast=useToast(),[q]=useSearchParams()
  const [orders,setOrders]=useState(null),[busy,setBusy]=useState(''),[dlg,setDlg]=useState(null)
  const loadOrders=async()=>{const {data}=await sb.from('orders').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(20);setOrders(data||[]);return data||[]}
  useEffect(()=>{loadOrders()},[])
  const buy=async p=>{
    if(!live)return toast('Paket belum dikonfigurasi di database. Jalankan update-3-saas.sql.','err')
    setBusy(p.id)
    const {data,error}=await sb.rpc('create_order',{p_plan_id:p.id});setBusy('')
    if(error)return toast(error.message,'err')
    await loadOrders();setDlg(data)}
  const done=async()=>{setDlg(null);await Promise.all([loadOrders(),refresh()])}
  const cancel=async o=>{if(!confirm('Batalkan pesanan ini?'))return;const {error}=await sb.rpc('cancel_order',{p_order:o.order_id});if(error)return toast(error.message,'err');loadOrders()}
  const wanted=q.get('plan'),chosen=plans.find(p=>p.code===wanted||p.id===wanted)
  const open=o=>setDlg(o)
  return(<div className="max-w-6xl"><h1 className="font-display mb-2 text-2xl font-semibold">Langganan</h1>
    <div className="mb-8 rounded-xl border bg-white p-5"><p className="text-sm text-neutral-500">Status saat ini</p>
      <p className={`mt-1 text-lg font-semibold ${access?'text-emerald-700':'text-red-700'}`}>{isAdmin&&!sub?'Akses owner (tanpa batas)':sub?.is_lifetime?`Lifetime${sub.plan_name?' · '+sub.plan_name:''}`:access&&sub?`Aktif sampai ${dt(sub.expires_at)}`:sub?`Berakhir pada ${dt(sub.expires_at)}`:'Belum berlangganan'}</p>
      {access&&sub&&!sub.is_lifetime&&<p className="text-sm text-neutral-500">{daysLeft(sub.expires_at)} hari tersisa. Membeli paket lagi menambah masa aktif.</p>}</div>
    {sub?.is_lifetime?<p className="mb-8 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Kamu sudah memiliki paket Lifetime. Tidak perlu membeli lagi 🎉</p>:<>
      <h2 className="mb-4 font-semibold">{access?'Perpanjang atau ganti paket':'Pilih paket'}</h2>
      {chosen&&<p className="mb-4 rounded-xl bg-orange-50 p-4 text-sm text-orange-900">Kamu memilih paket <b>{chosen.name}</b>. Klik <b>Bayar sekarang</b> pada paket tersebut untuk melanjutkan.</p>}
      {loading?<p className="text-sm text-neutral-500">Memuat paket…</p>:<div className="grid items-stretch gap-5 md:grid-cols-3">{plans.map(p=><PlanCard key={p.id} plan={p} onSelect={buy} busy={busy===p.id} cta="Bayar sekarang" note="QRIS, e-wallet, transfer bank"/>)}</div>}</>}
    <h2 className="mb-3 mt-10 font-semibold">Riwayat pembayaran</h2>
    {!orders?<p className="text-sm text-neutral-500">Memuat…</p>:orders.length===0?<div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm text-neutral-500">Belum ada transaksi.</div>:
    <div className="divide-y rounded-xl border bg-white">{orders.map(o=>{const [l,c,I]=ST[o.status]||ST.pending;return <div key={o.id} className="flex flex-wrap items-center gap-3 p-4 text-sm"><div className="min-w-0 flex-1"><p className="font-medium">Paket {o.plan_name} · {rp(o.amount)}</p><p className="text-xs text-neutral-500">{o.order_id} · {dt(o.created_at)}{o.method_label?' · '+o.method_label:''}</p>{o.status==='rejected'&&o.note&&<p className="mt-1 text-xs text-red-700">Alasan: {o.note}</p>}</div>
      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${c}`}><I size={13}/>{l}</span>
      {['pending','review','rejected'].includes(o.status)&&<button onClick={()=>open(o)} className="font-medium underline">{o.status==='review'?'Lihat':'Bayar / upload bukti'}</button>}
      {o.status==='pending'&&<button onClick={()=>cancel(o)} className="text-neutral-500 underline">Batalkan</button>}</div>})}</div>}
    {dlg&&<PayDialog order={dlg} methods={methods} app={app} onClose={()=>{setDlg(null);loadOrders()}} onDone={done}/>}
  </div>)
}
