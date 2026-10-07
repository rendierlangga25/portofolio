function meta(sel,val){let m=document.querySelector(sel);if(!m){m=document.createElement('meta');const [k,v]=sel.match(/\[(.+?)="(.+?)"\]/).slice(1);m.setAttribute(k,v);document.head.appendChild(m)}m.setAttribute('content',val)}
export function applySettings(s={}){
  if(s.site_title){document.title=s.site_title;meta('meta[property="og:title"]',s.site_title)}
  if(s.meta_description){meta('meta[name="description"]',s.meta_description);meta('meta[property="og:description"]',s.meta_description)}
  if(s.og_image_url)meta('meta[property="og:image"]',s.og_image_url)
  if(s.favicon_url){const l=document.querySelector('link[rel="icon"]');if(l)l.href=s.favicon_url}
  const st=document.documentElement.style,hex=c=>/^#[0-9a-f]{6}$/i.test(c||'')
  for(const [k,v] of Object.entries({accent_color:'--ac',bg_color:'--bg',card_color:'--card',text_color:'--tx',nav_color:'--nv',navtext_color:'--nvt'}))hex(s[k])?st.setProperty(v,s[k]):st.removeProperty(v)
  if(hex(s.dark_color)){const n=parseInt(s.dark_color.slice(1),16),l=(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255;st.setProperty('--dk',s.dark_color);st.setProperty('--dkt',l>.6?'#111111':'#ffffff')}else{st.removeProperty('--dk');st.removeProperty('--dkt')}
}
