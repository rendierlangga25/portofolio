import {useRef} from 'react'
import {Trash2,Upload} from 'lucide-react'
export default function UploadBtn({accept='image/*',label='file',hasValue,onFile,onRemove,multiple=false}){
  const r=useRef()
  return(<div className="flex flex-wrap items-center gap-2">
    <input ref={r} type="file" accept={accept} multiple={multiple} className="hidden" onChange={e=>{const f=[...e.target.files];e.target.value='';if(f.length)onFile(f)}}/>
    <button type="button" onClick={()=>r.current.click()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"><Upload size={15}/>{hasValue?'Ganti':'Upload'} {label}</button>
    {hasValue&&onRemove&&<button type="button" onClick={onRemove} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"><Trash2 size={15}/>Hapus</button>}
  </div>)
}
