import {useEffect,useState} from 'react'
import {sb} from '../lib/supabase'
export default function useSite(){
  const [d,setD]=useState(null)
  useEffect(()=>{(async()=>{
    const q=t=>sb.from(t).select('*').order('sort_order')
    const [p,s,ex,pr,im,cat,sk,ed,so]=await Promise.all([sb.from('profiles').select('*').limit(1).maybeSingle(),sb.from('site_settings').select('*').limit(1).maybeSingle(),q('experiences'),q('projects'),q('project_images'),q('skill_categories'),q('skills'),q('education'),q('social_links')])
    setD({profile:p.data||{},settings:s.data||{},experiences:ex.data||[],projects:(pr.data||[]).map(x=>({...x,images:(im.data||[]).filter(i=>i.project_id===x.id)})),categories:cat.data||[],skills:sk.data||[],education:ed.data||[],socials:(so.data||[]).filter(x=>x.url)})
  })()},[])
  return d
}
