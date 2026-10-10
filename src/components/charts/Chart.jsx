import {useState} from 'react'
import useWidth from './useWidth'
import {clamp,niceScale} from './scale'

const GRID='#e7e5e4',AXIS='#737373',SURFACE='#ffffff'
const M={l:48,r:14,t:14,b:28}

// Kerangka bersama: sumbu, grid hairline, crosshair/hover, tooltip, dan navigasi keyboard.
// data: [{label, tip, value, sub}]   mode: 'area' | 'columns'
export default function Chart({data,mode='area',color='#2a78d6',height=240,fmtTick=String,fmtValue=String,name='Nilai',integer=false,emptyText='Belum ada data pada periode ini'}){
  const [ref,w]=useWidth(),[hi,setHi]=useState(null)
  const n=data.length,iw=Math.max(10,w-M.l-M.r),ih=height-M.t-M.b
  const max=Math.max(0,...data.map(d=>d.value)),empty=max===0
  const sc=niceScale(max,4,integer),ym=sc.max
  const band=iw/Math.max(1,n)
  const x=i=>mode==='columns'?M.l+band*i+band/2:M.l+(n<=1?iw/2:i*iw/(n-1))
  const y=v=>M.t+ih-(ym?v/ym*ih:0)
  const step=Math.max(1,Math.ceil(n/Math.max(2,Math.floor(iw/78))))
  const xl=data.map((d,i)=>({i,d})).filter(o=>(n-1-o.i)%step===0)
  const pick=e=>{const r=e.currentTarget.getBoundingClientRect(),px=e.clientX-r.left
    const i=mode==='columns'?Math.floor((px-M.l)/band):Math.round((px-M.l)/iw*(n-1));setHi(clamp(i,0,n-1))}
  const key=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setHi(h=>clamp((h==null?n-1:h)+(e.key==='ArrowLeft'?-1:1),0,n-1))}else if(e.key==='Escape')setHi(null)}
  const cur=hi!=null?data[hi]:null
  const line=data.map((d,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join('')
  const bw=Math.max(2,Math.min(24,band-2)),r=Math.min(4,bw/2)
  const bar=(i,v)=>{const h=Math.max(0,ih-(y(v)-M.t)),X=x(i)-bw/2,Y=y(v),rr=Math.min(r,h);return h<=0?'':`M${X.toFixed(1)},${(Y+h).toFixed(1)}V${(Y+rr).toFixed(1)}a${rr},${rr} 0 0 1 ${rr},${-rr}H${(X+bw-rr).toFixed(1)}a${rr},${rr} 0 0 1 ${rr},${rr}V${(Y+h).toFixed(1)}Z`}
  const tipLeft=cur?clamp(x(hi),84,w-84):0
  return(<div ref={ref} className="relative" style={{height}}>
    <svg width={w} height={height} role="img" aria-label={`Grafik ${name}. Gunakan panah kiri dan kanan untuk membaca nilai.`} tabIndex={0}
      onPointerMove={pick} onPointerDown={pick} onPointerLeave={()=>setHi(null)} onKeyDown={key} onFocus={()=>setHi(h=>h==null?n-1:h)} onBlur={()=>setHi(null)}
      className="block touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30">
      {sc.ticks.map(t=><g key={t}><line x1={M.l} x2={w-M.r} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1"/>
        <text x={M.l-8} y={y(t)+4} textAnchor="end" fontSize="11" fill={AXIS}>{empty&&t>0?'':fmtTick(t)}</text></g>)}
      {xl.map(({i,d})=><text key={i} x={x(i)} y={height-8} textAnchor={i===0?'start':i===n-1?'end':'middle'} fontSize="11" fill={AXIS}>{d.label}</text>)}
      {mode==='area'&&!empty&&<><path d={`${line}L${x(n-1)},${y(0)}L${x(0)},${y(0)}Z`} fill={color} fillOpacity="0.1"/>
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></>}
      {mode==='area'&&empty&&<line x1={M.l} x2={w-M.r} y1={y(0)} y2={y(0)} stroke={color} strokeWidth="2"/>}
      {mode==='columns'&&data.map((d,i)=>d.value>0&&<path key={i} d={bar(i,d.value)} fill={color} fillOpacity={hi==null||hi===i?1:0.45}/>)}
      {mode==='area'&&!empty&&<circle cx={x(n-1)} cy={y(data[n-1].value)} r="4" fill={color} stroke={SURFACE} strokeWidth="2"/>}
      {cur&&mode==='area'&&<><line x1={x(hi)} x2={x(hi)} y1={M.t} y2={y(0)} stroke="#a3a3a3" strokeWidth="1"/><circle cx={x(hi)} cy={y(cur.value)} r="5" fill={color} stroke={SURFACE} strokeWidth="2"/></>}
      {cur&&mode==='columns'&&<rect x={x(hi)-band/2} y={M.t} width={band} height={ih} fill="#000" fillOpacity="0.04"/>}
    </svg>
    {empty&&<p className="pointer-events-none absolute inset-x-0 text-center text-sm text-neutral-500" style={{top:M.t+ih/2-10}}>{emptyText}</p>}
    {cur&&<div className="pointer-events-none absolute z-10 w-max max-w-[11rem] -translate-x-1/2 rounded-lg border bg-white px-3 py-2 shadow-lg" style={{left:tipLeft,top:0}}>
      <p className="text-[11px] text-neutral-500">{cur.tip||cur.label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold tabular-nums text-neutral-900"><i className="inline-block h-0.5 w-3 rounded" style={{background:color}}/>{fmtValue(cur.value)}</p>
      {cur.sub&&<p className="text-[11px] text-neutral-500">{cur.sub}</p>}</div>}
  </div>)
}
