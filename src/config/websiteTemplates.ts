// Website builder template catalog. One shared section schema; every template is a data-driven skin.
export type SiteSection='hero'|'about'|'sports'|'tournaments'|'coaches'|'contact';
export const siteSections:{id:SiteSection;label:string}[]=[
 {id:'hero',label:'Hero'},{id:'about',label:'About'},{id:'sports',label:'Sports'},{id:'tournaments',label:'Tournaments'},{id:'coaches',label:'Coaches'},{id:'contact',label:'Contact'}];
export type SiteTemplate={id:string;name:string;group:'vibrant'|'soft'|'classic'|'premium';tokens:{bg:string;surface:string;ink:string;muted:string;accent:string;accentInk:string;line:string;radius:string;heading:string}};
export const siteTemplates:SiteTemplate[]=[
 {id:'vibrant-pulse',name:'Pulse',group:'vibrant',tokens:{bg:'#160b26',surface:'#231139',ink:'#f8f3ff',muted:'#c9a8ff',accent:'#bdf522',accentInk:'#160b26',line:'#3b2059',radius:'14px',heading:'800'}},
 {id:'vibrant-arena',name:'Arena',group:'vibrant',tokens:{bg:'#0c1a2f',surface:'#14263f',ink:'#eef6ff',muted:'#9dc4f5',accent:'#ff7a1a',accentInk:'#0c1a2f',line:'#24405f',radius:'12px',heading:'800'}},
 {id:'vibrant-volt',name:'Volt',group:'vibrant',tokens:{bg:'#101010',surface:'#1c1c1c',ink:'#f5f5f5',muted:'#b5b5b5',accent:'#d8ff3d',accentInk:'#101010',line:'#333333',radius:'4px',heading:'850'}},
 {id:'vibrant-rally',name:'Rally',group:'vibrant',tokens:{bg:'#24101f',surface:'#35182e',ink:'#fff2fa',muted:'#e5a8cd',accent:'#ffcf3f',accentInk:'#24101f',line:'#4a2440',radius:'12px',heading:'800'}},
 {id:'vibrant-flare',name:'Flare',group:'vibrant',tokens:{bg:'#1e0f0a',surface:'#2e1a12',ink:'#fff4ec',muted:'#e8b398',accent:'#ff4d2e',accentInk:'#fff4ec',line:'#452718',radius:'10px',heading:'800'}},
 {id:'soft-mist',name:'Mist',group:'soft',tokens:{bg:'#f4f6f8',surface:'#ffffff',ink:'#22303c',muted:'#6b7d8c',accent:'#4a90d9',accentInk:'#ffffff',line:'#dde5ec',radius:'12px',heading:'700'}},
 {id:'soft-paper',name:'Paper',group:'soft',tokens:{bg:'#faf7f2',surface:'#ffffff',ink:'#3a342c',muted:'#8a7f70',accent:'#b0773a',accentInk:'#ffffff',line:'#e8e0d4',radius:'10px',heading:'700'}},
 {id:'classic-club',name:'Club',group:'classic',tokens:{bg:'#f6f4ee',surface:'#ffffff',ink:'#1e2a1e',muted:'#5c6b5c',accent:'#1f5c38',accentInk:'#ffffff',line:'#d8d4c4',radius:'3px',heading:'750'}},
 {id:'classic-varsity',name:'Varsity',group:'classic',tokens:{bg:'#f5f6fa',surface:'#ffffff',ink:'#1c2340',muted:'#5d6480',accent:'#9c2b2e',accentInk:'#ffffff',line:'#d9dce8',radius:'3px',heading:'750'}},
 {id:'premium-onyx',name:'Onyx',group:'premium',tokens:{bg:'#0d0d0f',surface:'#16161a',ink:'#f2f0ea',muted:'#a09c92',accent:'#c8a24a',accentInk:'#0d0d0f',line:'#2a2a30',radius:'6px',heading:'650'}},
 {id:'premium-gold',name:'Gold leaf',group:'premium',tokens:{bg:'#101418',surface:'#1a2027',ink:'#f4f1e8',muted:'#a8b0b8',accent:'#d4af37',accentInk:'#101418',line:'#2b333d',radius:'8px',heading:'650'}},
];
export const defaultSectionContent=(academy:{name:string;city?:string|null})=>({
 hero:{title:academy.name,subtitle:academy.city?`Sports academy in ${academy.city}`:'Train with purpose.'},
 about:{body:''},
 sports:{},
 tournaments:{},
 coaches:{},
 contact:{email:'',phone:'',address:academy.city||''},
});
export function siteTemplate(id:string){return siteTemplates.find(t=>t.id===id)||siteTemplates[0]}
export const siteTemplateIds=siteTemplates.map(t=>t.id);
