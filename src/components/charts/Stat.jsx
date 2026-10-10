import {ArrowDownRight,ArrowUpRight,Minus} from 'lucide-react'
const f1=n=>(Math.round(n*10)/10).toString().replace('.',',')
// Perubahan terhadap periode sebelumnya. Arah + ikon + teks, tidak mengandalkan warna saja.
export function Delta({cur,prev,upIsGood=true,label='vs periode sebelumnya'}){
  cur=Number(cur)||0;prev=Number(prev)||0
  let txt,dir
  if(cur===prev){txt='Tetap';dir=0}
  else if(prev===0){txt='Baru';dir=1}
  else{const p=(cur-prev)/prev*100;txt=`${p>0?'+':''}${f1(p)}%`;dir=p>0?1:-1}
  const good=dir===0?null:(dir>0)===upIsGood
  const cls=good===null?'text-neutral-500':good?'text-emerald-700':'text-red-700'
  const I=dir>0?ArrowUpRight:dir<0?ArrowDownRight:Minus
  return <span className={`inline-flex items-center gap-1 text-xs font-medium ${cls}`}><I size={14} aria-hidden/><span>{txt}</span><span className="sr-only">{dir>0?'naik':dir<0?'turun':'tidak berubah'}</span><span className="font-normal text-neutral-400">{label}</span></span>
}
export function Spark({values,color='#2a78d6',w=96,h=28}){
  const v=values.slice(-14),max=Math.max(...v,0)
  if(v.length<2||max===0)return null
  const x=i=>i*(w-6)/(v.length-1)+3,y=n=>h-3-(n/max)*(h-6)
  return <svg width={w} height={h} aria-hidden className="flex-none"><path d={v.map((n,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(n).toFixed(1)}`).join('')} fill="none" stroke="#a3a3a3" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx={x(v.length-1)} cy={y(v[v.length-1])} r="3" fill={color} stroke="#fff" strokeWidth="1.5"/></svg>
}
export function Tile({label,value,delta,sub,spark,sparkColor}){
  return(<div className="flex flex-col justify-between rounded-xl border bg-white p-5">
    <p className="text-sm text-neutral-500">{label}</p>
    <div className="mt-2 flex items-end justify-between gap-3"><p className="font-display text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>{spark&&<Spark values={spark} color={sparkColor}/>}</div>
    <div className="mt-2 min-h-[1.25rem]">{delta||(sub&&<p className="text-xs text-neutral-500">{sub}</p>)}</div></div>)
}
