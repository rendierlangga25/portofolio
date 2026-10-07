// Data contoh untuk halaman /demo (tidak memakai database)
const id=(p,i)=>p+i
export const DEMO={
  profile:{name:'Nadia Putri',headline:'UI/UX Designer | Product Thinker | Fresh Graduate',hero_title:'Merancang pengalaman digital yang terasa mudah.',hero_subtitle:'Saya Nadia, lulusan Desain Komunikasi Visual yang suka mengubah masalah rumit menjadi tampilan sederhana. Terbuka untuk magang dan proyek freelance.',bio:'Saya lulusan Desain Komunikasi Visual dengan fokus pada desain antarmuka dan riset pengguna. Selama kuliah saya mengerjakan proyek nyata untuk UMKM, komunitas kampus, dan startup tahap awal.\n\nSaya percaya desain yang baik berangkat dari memahami orang yang memakainya. Karena itu setiap proyek saya mulai dari wawancara singkat, lalu diuji berulang sebelum diserahkan.',location:'Jakarta, Indonesia',education_text:'S1 Desain Komunikasi Visual',focus_text:'UI/UX, Riset Pengguna, Design System',email:'halo@contoh.com',whatsapp:'6281234567890',contact_title:'Mari bikin sesuatu yang bermakna.',stats:[{n:'12+',l:'Proyek selesai'},{n:'4',l:'Sertifikat desain'},{n:'3 thn',l:'Pengalaman freelance'}],cv_url:'',avatar_url:''},
  settings:{},
  experiences:[{id:id('e',1),role:'UI/UX Designer Intern',company:'Startup Edutech Nusantara',period:'2025 – Sekarang',bullets:'Merancang ulang alur onboarding aplikasi belajar\nMenjalankan 20+ sesi uji kegunaan\nMembangun design system di Figma\nBekerja sama dengan tim developer',sort_order:1},{id:id('e',2),role:'Freelance Graphic Designer',company:'Mandiri',period:'2023 – 2025',bullets:'Membuat identitas visual untuk 8 UMKM\nMendesain materi sosial media dan kemasan',sort_order:2}],
  education:[{id:id('d',1),institution:'Universitas Contoh Indonesia',degree:'S1',field:'Desain Komunikasi Visual',start_year:'2021',end_year:'2025',description:'IPK 3,78. Aktif di Himpunan Mahasiswa Desain.'}],
  projects:[
   {id:id('p',1),title:'Redesain Aplikasi Belajar Online',slug:'redesain-aplikasi-belajar',category:'UI/UX',description:'Studi kasus perancangan ulang onboarding dan dashboard belajar. Waktu menyelesaikan tugas pertama turun 38% setelah uji kegunaan.',technologies:'Figma, Riset Pengguna, Prototyping',featured:true,images:[]},
   {id:id('p',2),title:'Identitas Visual Kopi Senja',slug:'kopi-senja',category:'Branding',description:'Logo, palet warna, kemasan, dan panduan merek untuk kedai kopi lokal yang baru dibuka.',technologies:'Illustrator, Branding',images:[]},
   {id:id('p',3),title:'Design System Komunitas Kampus',slug:'design-system-kampus',category:'Design System',description:'Kumpulan komponen dan pedoman penggunaan untuk seluruh aplikasi organisasi mahasiswa.',technologies:'Figma, Dokumentasi',images:[]}],
  categories:[{id:'c1',name:'Desain'},{id:'c2',name:'Tools'},{id:'c3',name:'Profesional'}],
  skills:[['Desain','UI Design'],['Desain','UX Research'],['Desain','Branding'],['Desain','Prototyping'],['Tools','Figma'],['Tools','Illustrator'],['Tools','Notion'],['Tools','Maze'],['Profesional','Komunikasi'],['Profesional','Presentasi'],['Profesional','Kolaborasi']].map(([c,n],i)=>({id:id('s',i),name:n,category_id:'c'+(['Desain','Tools','Profesional'].indexOf(c)+1)})),
  certificates:[{id:'ce1',title:'Google UX Design Professional Certificate',issuer:'Coursera',issued_at:'2024',description:'Program sertifikasi desain UX dari dasar hingga portofolio.'},{id:'ce2',title:'UI Design Fundamentals',issuer:'Dicoding',issued_at:'2024',description:'Dasar-dasar tata letak, tipografi, dan warna untuk antarmuka.'}],
  socials:[{id:'so1',platform:'linkedin',url:'https://linkedin.com/in/contoh'},{id:'so2',platform:'instagram',url:'https://instagram.com/contoh'}]
}
export const THEMES=[
 ['Oranye',{accent_color:'#e2561b'}],
 ['Hijau',{accent_color:'#0f9d75',bg_color:'#e6efe9',dark_color:'#0b3d2e'}],
 ['Indigo',{accent_color:'#4f46e5',bg_color:'#e8e8f4',dark_color:'#1e1b4b'}],
 ['Gelap',{accent_color:'#f59e0b',bg_color:'#171717',card_color:'#262626',text_color:'#f5f5f5',dark_color:'#f59e0b',nav_color:'rgba(255,255,255,.1)',navtext_color:'#f5f5f5'}]]
