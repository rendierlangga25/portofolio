// Skala sumbu-Y yang "rapi" (kelipatan 1, 2, 2.5, 5, 10)
export function niceScale(max,n=4,integer=false){
  if(!(max>0))return {max:n,step:1,ticks:[0,1,2,3,4].slice(0,n+1)}
  const raw=max/n,p=Math.pow(10,Math.floor(Math.log10(raw))),f=raw/p
  let step=(f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p
  if(integer&&step<1)step=1
  const top=Math.max(step,Math.ceil(max/step-1e-9)*step)
  const ticks=[];for(let v=0;v<=top+step*1e-6;v+=step)ticks.push(Math.round(v*1e6)/1e6)
  return {max:top,step,ticks}
}
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v))
