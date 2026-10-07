import {createContext,useCallback,useContext,useEffect,useState} from 'react'
import {sb} from './supabase'
const Ctx=createContext(null)
export const useAccount=()=>useContext(Ctx)
const live=s=>!!s&&(s.is_lifetime||(s.expires_at&&new Date(s.expires_at)>new Date()))
export function AccountProvider({children}){
  const [st,setSt]=useState({loading:true,user:null,isAdmin:false,profile:null,sub:null,access:false})
  const load=useCallback(async()=>{
    const {data:{session}}=await sb.auth.getSession()
    const user=session?.user||null
    if(!user)return setSt({loading:false,user:null,isAdmin:false,profile:null,sub:null,access:false})
    const [a,p,s]=await Promise.all([
      sb.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle(),
      sb.from('profiles').select('id,name,username,owner_id').eq('owner_id',user.id).maybeSingle(),
      sb.from('subscriptions').select('*').eq('user_id',user.id).maybeSingle()])
    const isAdmin=!!a.data,sub=s.data||null
    setSt({loading:false,user,isAdmin,profile:p.data||null,sub,access:isAdmin||live(sub)})
  },[])
  useEffect(()=>{
    load()
    const {data:{subscription}}=sb.auth.onAuthStateChange((ev)=>{if(ev==='SIGNED_IN'||ev==='SIGNED_OUT'||ev==='USER_UPDATED')setTimeout(load,0)})
    return()=>subscription.unsubscribe()
  },[load])
  const signOut=async()=>{await sb.auth.signOut();setSt({loading:false,user:null,isAdmin:false,profile:null,sub:null,access:false})}
  return <Ctx.Provider value={{...st,refresh:load,signOut}}>{children}</Ctx.Provider>
}
