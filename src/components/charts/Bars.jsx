// Batang horizontal (HTML) untuk perbandingan kategori: paket, metode bayar, tahapan.
export default function Bars({rows,fmt=String,color='#2a78d6',colors,empty='Belum ada data.'}){
  const max=Math.max(0,...rows.map(r=>r.value))
  if(!rows.length||max===0)return <p className="text-sm text-neutral-500">{empty}</p>
  return(<ul className="space-y-3.5">{rows.map((r,i)=><li key={r.label} title={`${r.label}: ${fmt(r.value)}${r.note?' · '+r.note:''}`}>
    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm"><span className="min-w-0 truncate text-neutral-700">{r.label}</span>
      <span className="flex-none font-semibold tabular-nums text-neutral-900">{fmt(r.value)}{r.note&&<span className="ml-2 text-xs font-normal text-neutral-500">{r.note}</span>}</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-neutral-100"><div className="h-2 rounded-full" style={{width:`${Math.max(2,r.value/max*100)}%`,background:colors?colors[i%colors.length]:color}}/></div></li>)}</ul>)
}
