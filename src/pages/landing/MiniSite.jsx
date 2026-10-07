// Pratinjau portofolio mini (murni CSS) untuk landing page
export default function MiniSite({ac='#e2561b',bg='#e9e8e4',name='Nadia Putri',role='UI/UX Designer',url='folioku.app/u/nadia',scale=1}){
  return(<div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl shadow-black/15" style={{fontSize:13*scale}}>
    <div className="flex items-center gap-2 border-b border-black/5 bg-neutral-50 px-3 py-2"><i className="h-2.5 w-2.5 rounded-full bg-red-400"/><i className="h-2.5 w-2.5 rounded-full bg-amber-400"/><i className="h-2.5 w-2.5 rounded-full bg-emerald-400"/>
      <span className="mx-auto max-w-[70%] truncate rounded-md bg-white px-3 py-0.5 text-[10px] text-black/45 ring-1 ring-black/5">{url}</span></div>
    <div className="p-4" style={{background:bg}}>
      <div className="flex items-center justify-between"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#111] text-[9px] font-bold text-white">{name.split(' ').map(w=>w[0]).join('').slice(0,2)}</span>
        <div className="flex gap-1">{['Home','About','Projects'].map(x=><span key={x} className="rounded-full bg-white/70 px-2 py-0.5 text-[8px] font-medium">{x}</span>)}</div></div>
      <div className="mt-5 grid grid-cols-5 items-center gap-3">
        <div className="col-span-3"><span className="inline-block rounded-full bg-white/70 px-2 py-0.5 text-[8px] font-medium"><i className="mr-1 inline-block h-1 w-1 rounded-full align-middle" style={{background:ac}}/>{role}</span>
          <p className="font-display mt-2 text-[17px] font-semibold leading-[1.1] tracking-tight">Merancang pengalaman yang terasa mudah.</p>
          <div className="mt-2 space-y-1"><i className="block h-1 w-full rounded bg-black/10"/><i className="block h-1 w-4/5 rounded bg-black/10"/></div>
          <div className="mt-3 flex gap-1.5"><span className="rounded-full bg-[#111] px-2.5 py-1 text-[8px] font-medium text-white">Lihat karya</span><span className="rounded-full border border-black/20 px-2.5 py-1 text-[8px] font-medium">Kontak</span></div></div>
        <div className="relative col-span-2"><div className="absolute -bottom-1 -right-1 h-full w-full rounded-2xl" style={{background:ac}}/><div className="font-display relative grid aspect-[4/5] place-items-center rounded-2xl bg-white text-3xl font-semibold text-black/10">{name[0]}</div></div></div>
      <div className="mt-5 grid grid-cols-3 gap-2">{[0,1,2].map(i=><div key={i} className="overflow-hidden rounded-xl bg-white"><div className="aspect-[16/10]" style={{background:i===0?ac:i===1?'#111':'#d8d6cf',opacity:i===0?.9:1}}/><div className="space-y-1 p-2"><i className="block h-1 w-3/4 rounded bg-black/20"/><i className="block h-1 w-1/2 rounded bg-black/10"/></div></div>)}</div>
    </div></div>)
}
