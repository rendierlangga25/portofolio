import {siteHost} from '../../lib/site'
// Kolom username dengan awalan alamat: namadomain.com/u/[username]
export default function UsernameField({value,onChange,autoFocus=false}){
  return(<div className="flex items-center overflow-hidden rounded-xl border border-black/15 bg-white focus-within:border-[#111]">
    <span className="max-w-[62%] shrink-0 select-none truncate whitespace-nowrap py-3 pl-4 text-sm text-black/40" title={`${siteHost()}/u/`}>{siteHost()}/u/</span>
    <input className="min-w-0 flex-1 bg-transparent py-3 pl-0.5 pr-4 text-sm outline-none" placeholder="username" required maxLength={30} value={value} onChange={onChange} autoComplete="off" autoCapitalize="none" spellCheck={false} autoFocus={autoFocus} aria-label="Username"/>
  </div>)
}
