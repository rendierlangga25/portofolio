export const rp=n=>'Rp\u00a0'+new Intl.NumberFormat('id-ID').format(Math.round(Number(n)||0))
export const dur=p=>p.duration_months==null?'Selamanya':p.duration_months%12===0?`${p.duration_months/12} tahun`:`${p.duration_months} bulan`
export const perMonth=p=>p.duration_months?Math.round(p.price/p.duration_months):null
export const disc=p=>p.original_price&&p.original_price>p.price?Math.round((1-p.price/p.original_price)*100):0
export const dt=d=>d?new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'-'
export const daysLeft=d=>Math.max(0,Math.ceil((new Date(d)-new Date())/864e5))
export const waLink=(n,t='Halo, saya mau tanya soal langganan')=>n?`https://wa.me/${String(n).replace(/\D/g,'')}?text=${encodeURIComponent(t)}`:''
