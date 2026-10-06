function meta(sel,val){let m=document.querySelector(sel);if(!m){m=document.createElement('meta');const [k,v]=sel.match(/\[(.+?)="(.+?)"\]/).slice(1);m.setAttribute(k,v);document.head.appendChild(m)}m.setAttribute('content',val)}
export function applySettings(s={}){
  if(s.site_title){document.title=s.site_title;meta('meta[property="og:title"]',s.site_title)}
  if(s.meta_description){meta('meta[name="description"]',s.meta_description);meta('meta[property="og:description"]',s.meta_description)}
  if(s.og_image_url)meta('meta[property="og:image"]',s.og_image_url)
  if(s.favicon_url){const l=document.querySelector('link[rel="icon"]');if(l)l.href=s.favicon_url}
  if(/^#[0-9a-f]{6}$/i.test(s.accent_color||''))document.documentElement.style.setProperty('--ac',s.accent_color)
}
