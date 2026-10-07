import {useEffect,useState} from 'react'
import {Trash2} from 'lucide-react'
import {sb,upload} from '../../lib/supabase'
import {useToast} from './Toast'
import UploadBtn from './UploadBtn'
export default function Gallery({projectId}){
  const toast=useToast(),[im,setIm]=useState([])
  const load=async()=>{const {data}=await sb.from('project_images').select('*').eq('project_id',projectId).order('sort_order');setIm(data||[])}
  useEffect(()=>{load()},[projectId])
  const add=async files=>{
    for(const [i,f] of files.entries()){try{const url=await upload(f,'projects');await sb.from('project_images').insert({project_id:projectId,url,sort_order:im.length+i+1})}catch(er){toast(er.message,'err')}}
    load()}
  const del=async id=>{if(confirm('Hapus foto ini?')){await sb.from('project_images').delete().eq('id',id);load()}}
  return(<div className="mt-6 border-t pt-5"><p className="mb-2 text-sm font-medium">Galeri foto</p>
    <div className="mb-3 grid grid-cols-3 gap-2">{im.map(i=><div key={i.id} className="relative"><img src={i.url} alt="" className="aspect-video w-full rounded-md object-cover"/><button type="button" onClick={()=>del(i.id)} className="absolute right-1 top-1 rounded bg-red-600 p-1 text-white"><Trash2 size={12}/></button></div>)}</div>
    <UploadBtn multiple label="foto galeri" onFile={add}/></div>)
}
