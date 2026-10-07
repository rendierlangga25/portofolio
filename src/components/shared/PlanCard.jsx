import {Check,Infinity as Inf} from 'lucide-react'
import {disc,dur,perMonth,rp} from '../../lib/format'
export default function PlanCard({plan:p,onSelect,cta='Pilih paket',busy,note}){
  const pop=!!p.is_popular,d=disc(p),pm=perMonth(p),life=p.duration_months==null
  const feats=(p.features||'').split('\n').map(x=>x.trim()).filter(Boolean)
  return(<div className={`relative flex h-full flex-col rounded-[2rem] p-7 ${pop?'bg-[#111] text-white shadow-2xl shadow-black/20 md:-my-4 md:py-11':'border border-black/10 bg-white'}`}>
    {pop&&<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e2561b] px-4 py-1 text-xs font-semibold text-white">Paling populer</span>}
    <div className="flex items-center justify-between"><h3 className="font-display text-xl font-semibold">{p.name}</h3>{d>0&&<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pop?'bg-white/15':'bg-[#e2561b]/10 text-[#e2561b]'}`}>Hemat {d}%</span>}</div>
    <p className={`mt-2 min-h-[2.5rem] text-sm ${pop?'text-white/65':'text-black/55'}`}>{p.description}</p>
    <div className="mt-6">{p.original_price>p.price&&<p className={`text-sm line-through ${pop?'text-white/40':'text-black/35'}`}>{rp(p.original_price)}</p>}
      <p className="font-display text-4xl font-semibold tracking-tight">{rp(p.price)}</p>
      <p className={`mt-1 flex items-center gap-1.5 text-sm ${pop?'text-white/60':'text-black/50'}`}>{life?<><Inf size={15}/>sekali bayar, selamanya</>:<>/ {dur(p)}{pm?` · setara ${rp(pm)}/bulan`:''}</>}</p></div>
    <button onClick={()=>onSelect?.(p)} disabled={busy} className={`mt-7 w-full rounded-full py-3.5 text-sm font-semibold transition disabled:opacity-50 ${pop?'bg-white text-[#111] hover:bg-[#e2561b] hover:text-white':'bg-[#111] text-white hover:bg-[#e2561b]'}`}>{busy?'Memproses…':cta}</button>
    {note&&<p className={`mt-3 text-center text-xs ${pop?'text-white/50':'text-black/45'}`}>{note}</p>}
    <ul className="mt-7 space-y-3 text-sm">{feats.map(f=><li key={f} className="flex gap-2.5"><Check size={17} className={`mt-0.5 flex-none ${pop?'text-[#ff8a5c]':'text-[#e2561b]'}`}/><span className={pop?'text-white/85':'text-black/75'}>{f}</span></li>)}</ul>
  </div>)
}
