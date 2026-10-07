import {useEffect,useState} from 'react'
import {sb} from '../lib/supabase'
export default function useSite(username){
  const [d,setD]=useState(null)
  useEffect(()=>{let off=false;setD(null);(async()=>{
    const {data:p}=await sb.from('profiles').select('*').eq('username',username).maybeSingle()
    if(!p)return !off&&setD({notfound:true})
    const o=p.owner_id,q=t=>sb.from(t).select('*').eq('owner_id',o).order('sort_order')
    const [s,ex,pr,im,cat,sk,ed,so,ce]=await Promise.all([sb.from('site_settings').select('*').eq('owner_id',o).limit(1).maybeSingle(),q('experiences'),q('projects'),q('project_images'),q('skill_categories'),q('skills'),q('education'),q('social_links'),q('certificates')])
    if(off)return
    setD({profile:p,settings:s.data||{},experiences:ex.data||[],projects:(pr.data||[]).map(x=>({...x,images:(im.data||[]).filter(i=>i.project_id===x.id)})),categories:cat.data||[],skills:sk.data||[],education:ed.data||[],certificates:ce.data||[],socials:(so.data||[]).filter(x=>x.url)})
  })();return()=>{off=true}},[username])
  return d
}
