import {useEffect,useRef,useState} from 'react'
// Mengukur lebar elemen supaya grafik SVG selalu pas dengan kartunya (termasuk saat layar diputar/diubah ukurannya)
export default function useWidth(initial=640){
  const ref=useRef(null),[w,setW]=useState(initial)
  useEffect(()=>{
    const el=ref.current;if(!el)return
    const set=()=>setW(Math.max(260,Math.floor(el.clientWidth)||initial))
    set()
    if(typeof ResizeObserver==='undefined'){addEventListener('resize',set);return()=>removeEventListener('resize',set)}
    const ro=new ResizeObserver(set);ro.observe(el);return()=>ro.disconnect()
  },[])
  return [ref,w]
}
