import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {AlertTriangle,BarChart3,Clock,Table2} from 'lucide-react'
import {sb} from '../../lib/supabase'
import Chart from '../../components/charts/Chart'
import Bars from '../../components/charts/Bars'
import {Delta,Tile} from '../../components/charts/Stat'
import {dayLabel,daysLeft,dt,monthLabel,parseDay,rp,rpShort} from '../../lib/format'

const RANGES=[[7,'7 hari'],[30,'30 hari'],[90,'90 hari'],[365,'12 bulan']]
const BLUE='#2a78d6',ORANGE='#eb6834',FUNNEL=['#86b6ef','#3987e5','#1c5cab']
const STATUS=[['review','Perlu dicek','bg-blue-500'],['pending','Belum bayar','bg-amber-500'],['paid','Lunas','bg-emerald-600'],['rejected','Ditolak','bg-red-600'],['cancelled','Dibatalkan','bg-neutral-400']]
const nf=n=>new Intl.NumberFormat('id-ID').format(Math.round(Number(n)||0))
const pct=(a,b)=>b>0?Math.round(a/b*1000)/10:0
const Tag=({s})=>{const m={paid:'bg-emerald-50 text-emerald-700',pending:'bg-amber-50 text-amber-700',review:'bg-blue-50 text-blue-700',rejected:'bg-red-50 text-red-700'};return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m[s]||'bg-neutral-100 text-neutral-600'}`}>{s}</span>}

function Card({title,sub,children,className='',action}){
  return(<section className={`min-w-0 rounded-xl border bg-white p-5 ${className}`}><div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="font-semibold text-neutral-900">{title}</h2>{sub&&<p className="mt-0.5 text-xs text-neutral-500">{sub}</p>}</div>{action}</div>{children}</section>)
}
// Tombol beralih Grafik <-> Tabel (tampilan tabel = alternatif non-visual untuk grafik)
function ViewToggle({table,setTable}){
  return <button onClick={()=>setTable(!table)} className="inline-flex flex-none items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50">{table?<><BarChart3 size={13}/>Grafik</>:<><Table2 size={13}/>Tabel</>}</button>
}
function DataTable({cols,rows}){
  return(<div className="max-h-64 overflow-auto rounded-lg border"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-neutral-50 text-xs text-neutral-500"><tr>{cols.map((c,i)=><th key={c} className={`px-3 py-2 font-medium ${i?'text-right':''}`}>{c}</th>)}</tr></thead>
    <tbody className="divide-y">{rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j} className={`px-3 py-1.5 tabular-nums ${j?'text-right':''}`}>{v}</td>)}</tr>)}</tbody></table></div>)
}

export default function Overview(){
  const [days,setDays]=useState(30),[d,setD]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState(true)
  const [orders,setOrders]=useState([]),[mail,setMail]=useState({}),[tRev,setTRev]=useState(false),[tSig,setTSig]=useState(false)
  useEffect(()=>{let off=false;setBusy(true)
    sb.rpc('admin_overview',{p_days:days}).then(({data,error})=>{if(off)return;setBusy(false);if(error){setErr(error.message);return}setErr('');setD(data)})
    return()=>{off=true}},[days])
  useEffect(()=>{
    sb.from('orders').select('id,created_at,plan_name,amount,base_amount,status,user_id').order('created_at',{ascending:false}).limit(6).then(r=>setOrders(r.data||[]))
    sb.rpc('admin_list_users').then(({data})=>setMail(Object.fromEntries((data||[]).map(u=>[u.id,u.email]))))
  },[])

  if(err&&!d)return(<div><h1 className="font-display mb-6 text-2xl font-semibold">Ringkasan</h1><div className="max-w-xl rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900"><p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16}/>Data ringkasan belum bisa dimuat</p>
    <p className="mt-2">{err}</p><p className="mt-2">Jika pesannya menyebut <code>admin_overview</code>, jalankan file <b>update-5-balas-pesan-dan-ringkasan.sql</b> di Supabase (SQL Editor), lalu muat ulang halaman ini.</p></div></div>)
  if(!d)return <div><h1 className="font-display mb-6 text-2xl font-semibold">Ringkasan</h1><p className="text-sm text-neutral-500">Memuat…</p></div>

  const k=d.kpi,S=d.series,monthly=d.monthly
  const lab=b=>monthly?monthLabel(b):dayLabel(b)
  const full=b=>parseDay(b).toLocaleDateString('id-ID',monthly?{month:'long',year:'numeric'}:{weekday:'long',day:'numeric',month:'long',year:'numeric'})
  const rev=S.map(s=>({label:lab(s.bucket),tip:full(s.bucket),value:Number(s.revenue),sub:`${s.orders} pesanan lunas`}))
  const sig=S.map(s=>({label:lab(s.bucket),tip:full(s.bucket),value:Number(s.signups),sub:Number(s.customers)?`${s.customers} jadi pelanggan berbayar`:undefined}))
  const per=RANGES.find(r=>r[0]===d.days)?.[1]||`${d.days} hari`
  const aov=k.orders?k.revenue/k.orders:0,aovPrev=k.orders_prev?k.revenue_prev/k.orders_prev:0
  const conv=pct(k.customers_total,k.users)
  const f=d.funnel
  const funnel=[{label:'Terdaftar',value:f.users},{label:'Pernah membuat pesanan',value:f.ordered,note:`${pct(f.ordered,f.users)}%`},{label:'Pelanggan berbayar',value:f.paid,note:`${pct(f.paid,f.users)}%`}]
  const planRows=(d.plans||[]).map(p=>({label:p.name,value:Number(p.revenue),note:`${p.active} aktif · ${p.orders} pesanan`}))
  const methRows=(d.methods||[]).map(m=>({label:m.name,value:Number(m.revenue),note:`${m.orders} pesanan`}))
  const st=d.status||{}

  return(<div className={busy?'opacity-60 transition-opacity':'transition-opacity'}>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-display text-2xl font-semibold">Ringkasan</h1><p className="mt-1 text-sm text-neutral-500">Periode {dt(d.from)} – {dt(d.to)}</p></div>
      <div className="flex gap-1 rounded-full border bg-white p-1 text-sm" role="group" aria-label="Pilih periode">{RANGES.map(([v,l])=><button key={v} aria-pressed={days===v} onClick={()=>setDays(v)} className={`rounded-full px-3.5 py-1.5 font-medium ${days===v?'bg-neutral-900 text-white':'text-neutral-600 hover:bg-neutral-100'}`}>{l}</button>)}</div></div>

    {k.to_review>0&&<div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"><span className="flex items-center gap-2"><Clock size={16}/><b>{k.to_review} pesanan</b> menunggu verifikasi pembayaranmu.</span><Link to="/owner/orders" className="rounded-lg bg-blue-900 px-3 py-1.5 font-medium text-white">Periksa sekarang</Link></div>}

    <div className="mb-6 grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2" title="Pendapatan" sub={monthly?'Per bulan, 12 bulan terakhir':`Per hari, ${d.days} hari terakhir`} action={<ViewToggle table={tRev} setTable={setTRev}/>}>
        <div className="mb-4 flex flex-wrap items-end gap-x-4 gap-y-1"><p className="font-display text-5xl font-semibold tracking-tight text-neutral-900">{rp(k.revenue)}</p><div className="pb-2"><Delta cur={k.revenue} prev={k.revenue_prev}/></div></div>
        <p className="mb-4 text-xs text-neutral-500">Total sejak awal: <b className="font-semibold text-neutral-700">{rp(k.revenue_total)}</b> · tanpa kode unik</p>
        {tRev?<DataTable cols={[monthly?'Bulan':'Tanggal','Pendapatan','Pesanan']} rows={S.map(s=>[full(s.bucket),rp(s.revenue),s.orders])}/>:<Chart data={rev} color={BLUE} name="pendapatan" fmtTick={rpShort} fmtValue={rp}/>}
      </Card>
      <div className="flex flex-col gap-4">
      <Card title="Dari pendaftar ke pelanggan" sub="Seluruh waktu">
        <Bars rows={funnel} colors={FUNNEL} fmt={nf} empty="Belum ada pengguna."/>
        <p className="mt-4 border-t pt-3 text-xs text-neutral-500">Konversi pendaftar → berbayar: <b className="text-neutral-800">{conv}%</b></p>
      </Card>
      <Card title="Status pesanan" sub="Seluruh waktu" action={<Link to="/owner/orders" className="text-xs font-medium text-neutral-600 underline">Kelola</Link>}>
        <ul className="divide-y text-sm">{STATUS.map(([key,l,dot])=><li key={key} className="flex items-center justify-between py-2"><span className="flex items-center gap-2 text-neutral-700"><i className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden/>{l}</span><span className="font-semibold tabular-nums">{nf(st[key]||0)}</span></li>)}</ul></Card>
      </div>
    </div>

    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Tile label={`Pelanggan baru (${per})`} value={nf(k.customers_new)} delta={<Delta cur={k.customers_new} prev={k.customers_new_prev}/>} spark={S.map(s=>Number(s.customers))} sparkColor={ORANGE}/>
      <Tile label={`Pendaftar baru (${per})`} value={nf(k.signups)} delta={<Delta cur={k.signups} prev={k.signups_prev}/>} spark={S.map(s=>Number(s.signups))} sparkColor={ORANGE}/>
      <Tile label={`Pesanan lunas (${per})`} value={nf(k.orders)} delta={<Delta cur={k.orders} prev={k.orders_prev}/>} spark={S.map(s=>Number(s.orders))} sparkColor={BLUE}/>
      <Tile label="Rata-rata nilai pesanan" value={rp(aov)} delta={<Delta cur={aov} prev={aovPrev}/>}/>
      <Tile label="Total pengguna" value={nf(k.users)} sub={`${nf(k.customers_total)} di antaranya pernah membayar`}/>
      <Tile label="Langganan aktif" value={nf(k.active)} sub={`${nf(k.lifetime)} Lifetime · ${nf(k.active-k.lifetime)} berjangka`}/>
      <Tile label="Estimasi pendapatan bulanan" value={rp(k.mrr)} sub="Dari langganan berjangka yang aktif, tidak termasuk Lifetime"/>
      <Tile label="Langganan berakhir" value={nf(k.expired)} sub={k.expiring?`${nf(k.expiring)} lagi akan berakhir ≤ 14 hari`:'Tidak ada yang berakhir dalam 14 hari'}/>
    </div>

    <div className="mb-6 grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2" title="Pendaftar baru" sub={monthly?'Per bulan':'Per hari'} action={<ViewToggle table={tSig} setTable={setTSig}/>}>
        {tSig?<DataTable cols={[monthly?'Bulan':'Tanggal','Pendaftar','Jadi pelanggan']} rows={S.map(s=>[full(s.bucket),s.signups,s.customers])}/>:<Chart data={sig} mode="columns" color={ORANGE} name="pendaftar baru" integer fmtValue={v=>`${nf(v)} pendaftar`}/>}
      </Card>
      <Card title="Pendapatan per paket" sub="Seluruh waktu"><Bars rows={planRows} fmt={rp} empty="Belum ada pesanan lunas."/></Card>
    </div>

    <div className="mb-6 grid gap-4 lg:grid-cols-3">
      <Card title="Metode pembayaran" sub={`Pendapatan, ${per} terakhir`}><Bars rows={methRows} fmt={rp} empty="Belum ada pembayaran pada periode ini."/></Card>
      <Card className="lg:col-span-2" title="Segera berakhir" sub="Langganan ≤ 14 hari lagi" action={<Link to="/owner/users" className="text-xs font-medium text-neutral-600 underline">Pelanggan</Link>}>
        {(d.expiring_list||[]).length===0?<p className="text-sm text-neutral-500">Tidak ada langganan yang akan berakhir dalam 14 hari.</p>:
        <ul className="divide-y text-sm">{d.expiring_list.map(e=><li key={e.email} className="flex items-center justify-between gap-3 py-2"><span className="min-w-0"><span className="block truncate font-medium">{e.email}</span><span className="text-xs text-neutral-500">{e.plan_name}</span></span><span className="flex-none rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{daysLeft(e.expires_at)} hari lagi</span></li>)}</ul>}</Card>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Pesanan terbaru" action={<Link to="/owner/orders" className="text-xs font-medium text-neutral-600 underline">Semua pesanan</Link>}>
        {orders.length===0?<p className="text-sm text-neutral-500">Belum ada pesanan.</p>:<ul className="divide-y text-sm">{orders.map(o=><li key={o.id} className="flex items-center justify-between gap-3 py-2.5"><span className="min-w-0"><span className="block truncate font-medium">{mail[o.user_id]||'Pelanggan'} · {o.plan_name}</span><span className="text-xs text-neutral-500">{rp(o.base_amount||o.amount)} · {dt(o.created_at)}</span></span><Tag s={o.status}/></li>)}</ul>}</Card>
      <Card title="Pendaftar terbaru" action={<Link to="/owner/users" className="text-xs font-medium text-neutral-600 underline">Semua pelanggan</Link>}>
        {(d.recent_users||[]).length===0?<p className="text-sm text-neutral-500">Belum ada pengguna.</p>:<ul className="divide-y text-sm">{d.recent_users.map(u=><li key={u.email} className="flex items-center justify-between gap-3 py-2.5"><span className="min-w-0"><span className="block truncate font-medium">{u.email}</span><span className="text-xs text-neutral-500">{u.username?`/u/${u.username} · `:''}{dt(u.created_at)}</span></span>
          <span className={`flex-none rounded-full px-2.5 py-1 text-xs font-semibold ${u.active?'bg-emerald-50 text-emerald-700':'bg-neutral-100 text-neutral-600'}`}>{u.active?(u.plan_name||'Aktif'):'Belum berlangganan'}</span></li>)}</ul>}</Card>
    </div>
  </div>)
}
