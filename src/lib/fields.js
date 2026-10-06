const t=(key,label,o={})=>({key,label,type:'text',...o})
export const F={
  profile:[t('name','Nama'),t('headline','Headline'),t('hero_title','Judul Hero'),t('hero_subtitle','Subjudul Hero',{type:'textarea'}),t('avatar_url','Foto profil',{type:'image',folder:'profile'}),t('cv_url','CV (PDF)',{type:'file',folder:'cv',accept:'application/pdf'}),t('location','Lokasi')],
  about:[t('bio','Biografi',{type:'textarea',hint:'Pisahkan paragraf dengan satu baris kosong.'}),t('education_text','Pendidikan'),t('focus_text','Fokus'),t('stats','Statistik',{type:'stats',hint:'Satu per baris, format: Nilai | Label. Contoh: S1 | Manajemen'})],
  contact:[t('contact_title','Judul bagian kontak'),t('email','Email'),t('whatsapp','WhatsApp',{hint:'Format internasional tanpa +, contoh: 6281234567890'}),t('location','Lokasi')],
  experience:[t('role','Jabatan'),t('company','Perusahaan'),t('period','Periode',{hint:'Contoh: 2023 – Sekarang'}),t('bullets','Tanggung jawab',{type:'textarea',hint:'Satu poin per baris.'})],
  project:[t('title','Judul'),t('slug','Slug',{hint:'Kosongkan untuk dibuat otomatis dari judul.'}),t('category','Kategori'),t('description','Deskripsi',{type:'textarea'}),t('thumbnail_url','Thumbnail',{type:'image',folder:'projects'}),t('technologies','Teknologi',{hint:'Pisahkan dengan koma. Contoh: Apps Script, Google Sheets'}),t('project_url','Link proyek'),t('github_url','Link GitHub'),t('featured','Featured',{type:'check'})],
  education:[t('institution','Institusi'),t('degree','Gelar'),t('field','Jurusan'),t('start_year','Tahun mulai'),t('end_year','Tahun selesai'),t('description','Deskripsi',{type:'textarea'}),t('logo_url','Logo',{type:'image',folder:'education'})],
  category:[t('name','Nama kategori')],
  skill:[t('name','Nama skill'),{key:'category_id',label:'Kategori',type:'select',table:'skill_categories',show:'name'}],
  social:[t('platform','Platform',{hint:'linkedin, github, atau instagram (untuk ikon yang sesuai)'}),t('url','URL')],
  settings:[t('site_title','Judul website'),t('meta_description','Deskripsi (SEO)',{type:'textarea'}),t('og_image_url','Gambar Open Graph',{type:'image',folder:'site'}),t('favicon_url','Favicon',{type:'image',folder:'site'}),t('logo_text','Teks logo / monogram'),t('accent_color','Warna aksen',{type:'color'}),t('footer_text','Teks footer')]
}
