import {Building2,ShieldCheck,QrCode,Smartphone} from 'lucide-react'
const TYPES={qris:[QrCode,'QRIS','Scan dengan aplikasi apa pun: GoPay, OVO, DANA, ShopeePay, LinkAja, m-banking, dan lainnya.'],ewallet:[Smartphone,'E-Wallet','Kirim ke nomor e-wallet kami lewat aplikasi dompet digital kamu.'],bank:[Building2,'Transfer Bank','Transfer lewat ATM, m-banking, atau internet banking.']}
// methods: daftar metode aktif dari database (diatur owner). Jika kosong, tampil kartu umum.
export default function PayMethods({dark,methods=[],verify='maksimal 1x24 jam'}){
  const groups=Object.keys(TYPES).map(k=>[k,methods.filter(m=>m.type===k)]).filter(([,l])=>l.length)
  const list=groups.length?groups:Object.keys(TYPES).map(k=>[k,[]])
  const card=dark?'border border-white/10 bg-white/5':'border border-black/10 bg-white',mut=dark?'text-white/60':'text-black/55'
  return(<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {list.map(([k,items])=>{const [I,title,desc]=TYPES[k],hot=k==='qris';return <div key={k} className={`rounded-3xl p-6 ${card} ${hot?'ring-2 ring-[#e2561b]/70':''}`}>
      <div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-2xl ${hot?'bg-[#e2561b] text-white':dark?'bg-white/10':'bg-black/5'}`}><I size={20}/></span><h3 className="font-display font-semibold">{title}</h3></div>
      <p className={`mt-3 text-sm ${mut}`}>{desc}</p>
      {items.length>0&&<div className="mt-4 flex flex-wrap gap-1.5">{items.map(m=><span key={m.id} className={`rounded-full px-3 py-1 text-xs font-semibold ${dark?'bg-white/10':'bg-black/5'}`}>{m.label}</span>)}</div>}</div>})}
    <div className={`flex flex-col justify-center gap-3 rounded-3xl p-6 ${card}`}><span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600"><ShieldCheck size={22}/></span><p className={`text-sm ${mut}`}><b className={dark?'text-white':'text-black'}>Jelas & aman.</b> Bayar sesuai nominal, upload bukti, langganan aktif setelah diverifikasi ({verify}).</p></div>
  </div>)
}
