import {useEffect,useState} from 'react'
import {sb} from './supabase'
export const DEFAULT_APP={brand_name:'FolioKu',tagline:'Portofolio online profesional',hero_title:'Portofolio online yang bikin kamu dilirik, jadi dalam 10 menit.',hero_subtitle:'Tanpa coding. Isi data, upload karya, dapatkan link portofolio yang rapi dan siap dibagikan ke HRD, klien, atau dosen.',support_whatsapp:'',support_email:'',sample_username:'',verify_time:'maksimal 1x24 jam'}
export const DEFAULT_PLANS=[
 {id:'d1',code:'3-bulan',name:'3 Bulan',description:'Pas untuk melamar kerja atau magang dalam waktu dekat.',duration_months:3,price:99000,original_price:149000,features:'Link portofolio pribadi\nProyek, sertifikat & skill tanpa batas\nUpload foto, galeri & CV\nPesan pengunjung masuk ke dashboard\nUbah warna & tampilan'},
 {id:'d2',code:'1-tahun',name:'1 Tahun',description:'Paling banyak dipilih. Hemat dan tenang sepanjang tahun.',duration_months:12,price:249000,original_price:396000,is_popular:true,features:'Semua fitur paket 3 Bulan\nHemat lebih dari 35%\nPerpanjang kapan saja\nPrioritas bantuan WhatsApp'},
 {id:'d3',code:'lifetime',name:'Lifetime',description:'Bayar sekali, aktif selamanya.',duration_months:null,price:499000,original_price:899000,features:'Semua fitur paket 1 Tahun\nTanpa biaya perpanjangan\nSemua pembaruan fitur\nPrioritas bantuan WhatsApp'}]
export function usePlans(){
  const [plans,setP]=useState(null),[app,setA]=useState(DEFAULT_APP),[live,setLive]=useState(false),[methods,setM]=useState([])
  useEffect(()=>{(async()=>{
    try{
      const [p,a,m]=await Promise.all([sb.from('plans').select('*').eq('active',true).order('sort_order'),sb.from('app_settings').select('*').limit(1).maybeSingle(),sb.from('payment_methods').select('*').eq('active',true).order('sort_order')])
      setM(m.data||[])
      if(p.data?.length){setP(p.data);setLive(true)}else setP(DEFAULT_PLANS)
      if(a.data)setA({...DEFAULT_APP,...Object.fromEntries(Object.entries(a.data).filter(([,v])=>v!=null&&v!==''))})
    }catch{setP(DEFAULT_PLANS)}
  })()},[])
  return {plans:plans||[],app,live,methods,loading:!plans}
}
