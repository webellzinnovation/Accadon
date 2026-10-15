import { TABLE_LENGTH_CM as L, TABLE_WIDTH_CM as W, TABLE_HEIGHT_CM as H, NET_HEIGHT_CM as N, tablePath as path } from './tableGeometry';
export function Court() {
  return <svg className="court-art" viewBox="0 0 1000 760" role="img" aria-labelledby="court-title">
    <title id="court-title">Illustrated table tennis table with a 274 by 152.5 centimetre playing surface, net, paddle and ball</title>
    <defs>
      <linearGradient id="floor" x2="0" y2="1"><stop stopColor="#202b22"/><stop offset="1" stopColor="#101511"/></linearGradient>
      <linearGradient id="top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#537d5e"/><stop offset="1" stopColor="#284a37"/></linearGradient>
      <linearGradient id="rubber" x2="1" y2="1"><stop stopColor="#ff9561"/><stop offset="1" stopColor="#be472c"/></linearGradient>
      <radialGradient id="light"><stop stopColor="#c9deb0" stopOpacity=".2"/><stop offset="1" stopColor="#c9deb0" stopOpacity="0"/></radialGradient>
      <pattern id="net" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 0H10M0 0V10" stroke="#d6dfca" strokeOpacity=".65" strokeWidth=".9"/></pattern>
      <filter id="shadow"><feGaussianBlur stdDeviation="20"/></filter>
      <pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".6" fill="#fff" opacity=".08"/></pattern>
    </defs>
    <g className="court-floor">
      <ellipse cx="510" cy="340" rx="480" ry="330" fill="url(#light)"/>
      <path d="m40 480 480-240 450 240-480 230Z" fill="url(#floor)"/>
      <path d="m75 484 446-222 413 221-445 225Z M160 485l359-177 323 177-353 177Z" fill="none" stroke="#66805c" strokeWidth="1.5" opacity=".3"/>
      <path d="m510 275-8 405M120 483l770 0" stroke="#65805d" opacity=".16"/>
      <ellipse cx="510" cy="555" rx="290" ry="70" fill="#000" opacity=".5" filter="url(#shadow)"/>
    </g>
    <g className="court-table">
      {/* Equal-scale isometric axes preserve the physical 274:152.5 length/width ratio. */}
      {[[22,18],[L-22,18],[L-22,W-18],[22,W-18]].map(([l,w]) => <path key={`${l}-${w}`} d={path([[l,w,0],[l,w,-H]])} stroke="#99a295" strokeWidth="8" fill="none"/>)}
      <path d={path([[22,18,-H+20],[L-22,18,-H+20],[L-22,W-18,-H+20],[22,W-18,-H+20]],true)} stroke="#5f6b5b" strokeWidth="5" fill="none"/>
      <path d={path([[0,0,-7],[L,0,-7],[L,W,-7],[0,W,-7]],true)} fill="#172c22" stroke="#172c22" strokeWidth="5"/>
      <path d={path([[0,0],[L,0],[L,W],[0,W]],true)} fill="url(#top)" stroke="#e1e6d4" strokeWidth="4"/>
      <path d={path([[0,0],[L,0],[L,W],[0,W]],true)} fill="url(#grain)"/>
      {/* Doubles centre line runs along the length, not along the net. */}
      <path d={path([[0,W/2],[L,W/2]])} stroke="#e6e6d9" strokeWidth="1.5" opacity=".8"/>
      <path d={path([[L/2,0],[L/2,0,N],[L/2,W,N],[L/2,W]],true)} fill="#182c25" fillOpacity=".75"/>
      <path d={path([[L/2,0],[L/2,0,N],[L/2,W,N],[L/2,W]],true)} fill="url(#net)" stroke="#dbe3d3" strokeWidth="1.5"/>
      <path d={path([[L/2,-7,N],[L/2,W+7,N]])} stroke="#fff5dd" strokeWidth="3"/>
      <path d={`${path([[L/2,-7,-5],[L/2,-7,N]])} ${path([[L/2,W+7,-5],[L/2,W+7,N]])}`} stroke="#b6c1b2" strokeWidth="4"/>
    </g>
    <g className="court-paddle" transform="translate(760 270) rotate(30)">
      <ellipse cx="0" cy="12" rx="64" ry="77" fill="#e6c397"/>
      <path d="M-13 71h26l4 85c-3 12-28 12-34 0Z" fill="#b58b56" stroke="#e8c497" strokeWidth="3"/>
      <path d="M-4 82h8v72" stroke="#614834" strokeWidth="3"/>
      <ellipse rx="62" ry="75" fill="url(#rubber)"/>
      <ellipse rx="54" ry="67" fill="url(#grain)"/>
      <path d="M-32-46c18-16 40-15 55-5" fill="none" stroke="#ffc49a" strokeOpacity=".6" strokeWidth="3"/>
    </g>
    <path d="M260 300Q480 70 656 228" fill="none" stroke="#d5bd8b" strokeWidth="1.5" strokeDasharray="4 9" opacity=".45"/>
    <g className="court-ball"><ellipse cx="459" cy="385" rx="22" ry="10" fill="#101e16" opacity=".3"/><circle cx="454" cy="202" r="18" fill="#f4ead0"/><circle cx="449" cy="196" r="6" fill="#fffdf3" opacity=".8"/></g>
  </svg>;
}
