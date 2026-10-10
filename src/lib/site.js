// Alamat situs untuk tautan di email (konfirmasi akun, reset password) dan login Google.
// Bawaan: alamat yang sedang dibuka. Opsional: isi VITE_SITE_URL di Vercel (contoh: https://namadomain.com)
// supaya tautan email selalu mengarah ke domain utama, apa pun alamat yang dipakai saat mendaftar.
const clean=u=>String(u||'').trim().replace(/\/+$/,'')
export const siteUrl=()=>{const v=clean(import.meta.env.VITE_SITE_URL);return /^https?:\/\//i.test(v)?v:location.origin}
export const siteHost=()=>siteUrl().replace(/^https?:\/\//i,'')
