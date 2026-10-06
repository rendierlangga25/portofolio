import {createContext,useCallback,useContext,useState} from 'react'
const C=createContext(()=>{})
export const useToast=()=>useContext(C)
export function ToastProvider({children}){
  const [t,setT]=useState([])
  const push=useCallback((m,type='ok')=>{const id=Math.random();setT(x=>[...x,{id,m,type}]);setTimeout(()=>setT(x=>x.filter(i=>i.id!==id)),3500)},[])
  return <C.Provider value={push}>{children}<div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">{t.map(i=><div key={i.id} className={`rounded-lg px-4 py-2.5 text-sm text-white shadow-lg ${i.type==='err'?'bg-red-600':'bg-neutral-900'}`}>{i.m}</div>)}</div></C.Provider>
}
