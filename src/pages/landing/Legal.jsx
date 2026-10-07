import {Link} from 'react-router-dom'
import {usePlans} from '../../lib/plans'
const T={
 syarat:['Syarat & Kebijakan',[
  ['Layanan','Layanan ini menyediakan alat untuk membuat dan menerbitkan portofolio online melalui langganan berbayar. Fitur dapat diperbarui dari waktu ke waktu.'],
  ['Akun & konten','Kamu bertanggung jawab atas keamanan akun dan seluruh konten yang diunggah. Dilarang mengunggah konten yang melanggar hukum, hak cipta, atau menyesatkan.'],
  ['Langganan & pembayaran','Pembayaran dilakukan manual lewat QRIS, e-wallet, atau transfer bank sesuai nominal pada pesanan, disertai bukti pembayaran. Langganan aktif setelah pembayaran diverifikasi. Membeli paket saat masih aktif akan menambah masa aktif. Paket Lifetime berlaku selama layanan beroperasi.'],
  ['Masa berakhir','Jika langganan berakhir, portofolio disembunyikan dan pengeditan dinonaktifkan. Data tetap tersimpan dan dapat diaktifkan kembali dengan memperpanjang.'],
  ['Pengembalian dana','Pengembalian dana dapat diajukan jika terjadi kendala teknis yang tidak dapat diselesaikan atau terjadi pembayaran ganda. Hubungi kontak bantuan dengan menyertakan Order ID. (Pemilik layanan: sesuaikan bagian ini dengan kebijakan Anda.)'],
  ['Perubahan','Syarat dapat diperbarui sewaktu-waktu. Penggunaan layanan setelah pembaruan berarti kamu menyetujuinya.']]],
 privasi:['Kebijakan Privasi',[
  ['Data yang kami simpan','Email, nama, username, konten portofolio yang kamu isi, serta riwayat pesanan. Bukti pembayaran yang kamu unggah disimpan secara privat dan hanya dapat dilihat oleh pemilik layanan.'],
  ['Penggunaan data','Untuk menjalankan akun, menampilkan portofolio, memproses langganan, dan memberi bantuan.'],
  ['Konten publik','Konten portofolio yang dipublikasikan dapat dilihat siapa saja yang memiliki linknya. Sembunyikan atau hapus data yang tidak ingin dipublikasikan.'],
  ['Keamanan','Akses data dibatasi per pengguna dengan kontrol keamanan basis data. Meski demikian, tidak ada sistem yang sepenuhnya bebas risiko.'],
  ['Hak kamu','Kamu dapat meminta penghapusan akun dan data dengan menghubungi kontak bantuan.']]]}
export default function Legal({kind}){
  const {app}=usePlans(),[title,secs]=T[kind]
  return(<div className="min-h-screen bg-[#f3f1ec] px-5 py-12 text-[#111]"><div className="mx-auto max-w-2xl"><Link to="/" className="text-sm underline">← Kembali ke {app.brand_name}</Link>
    <h1 className="font-display mt-6 text-3xl font-semibold">{title}</h1><p className="mt-2 text-sm text-black/50">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</p>
    <div className="mt-8 space-y-6">{secs.map(([h,t])=><section key={h}><h2 className="font-semibold">{h}</h2><p className="mt-1.5 text-sm leading-relaxed text-black/70">{t}</p></section>)}</div>
    {(app.support_email||app.support_whatsapp)&&<p className="mt-10 text-sm text-black/60">Kontak: {app.support_email} {app.support_whatsapp&&`· WhatsApp +${app.support_whatsapp.replace(/\D/g,'')}`}</p>}</div></div>)
}
