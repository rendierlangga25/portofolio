import {Link} from 'react-router-dom'
import {Check} from 'lucide-react'
import {usePlans} from '../../lib/plans'
import MiniSite from '../landing/MiniSite'
export const inp='w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-[#111]'
export const btn='w-full rounded-full bg-[#111] py-3.5 text-sm font-semibold text-white transition hover:bg-[#e2561b] disabled:opacity-50'
export default function AuthShell({title,sub,children,foot}){
  const {app}=usePlans()
  return(<div className="grid min-h-screen bg-[#f3f1ec] text-[#111] lg:grid-cols-2">
    <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
      <Link to="/" className="font-display mb-10 flex w-fit items-center gap-2 text-lg font-semibold"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#111] text-xs text-white">{app.brand_name.slice(0,2)}</span>{app.brand_name}</Link>
      <div className="w-full max-w-md"><h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm text-black/60">{sub}</p><div className="mt-8">{children}</div><div className="mt-6 text-sm text-black/60">{foot}</div></div></div>
    <div className="relative hidden overflow-hidden bg-[#111] p-14 text-white lg:flex lg:flex-col lg:justify-center">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#e2561b]/30 blur-3xl"/>
      <div className="relative mx-auto w-full max-w-md"><MiniSite url={`${location.host}/u/namakamu`}/><ul className="mt-10 space-y-3 text-sm text-white/80">{['Portofolio online siap dalam 10 menit','Bayar via QRIS, e-wallet, atau transfer bank','Link pribadi yang rapi untuk CV & LinkedIn'].map(t=><li key={t} className="flex items-center gap-2.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#e2561b]"><Check size={12}/></span>{t}</li>)}</ul></div></div></div>)
}
