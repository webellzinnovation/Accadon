export function Court() {
  return <svg className="court-art" viewBox="0 0 1000 760" role="img" aria-labelledby="court-title">
    <title id="court-title">Illustrated table tennis court, net, paddle and ball</title>
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
      <path d="m324 472 4 118 20 8 7-118M699 479l-8 112-20 8-5-108M456 535l2 99 21 9 5-103M565 386l6 126 17 1-1-128" stroke="#99a295" strokeWidth="9" fill="none"/>
      <path d="m338 568 123 57M685 566l-208 59M343 543l335-12" stroke="#5f6b5b" strokeWidth="5"/>
      <path d="m235 443 325-161 246 154-326 166Z" fill="#172c22"/>
      <path d="M235 431 560 270l246 154-326 166Z" fill="url(#top)" stroke="#e1e6d4" strokeWidth="5"/>
      <path d="m250 431 310-153 232 146-312 158Z" fill="url(#grain)"/>
      <path d="m397 350 247 155M355 507l326-162" stroke="#e6e6d9" strokeWidth="2" opacity=".8"/>
      <path d="M355 507v-81l325-162v81Z" fill="#182c25" fillOpacity=".7"/>
      <path d="M355 507v-81l325-162v81Z" fill="url(#net)" stroke="#dbe3d3" strokeWidth="2"/>
      <path d="m347 426 341-169" stroke="#fff5dd" strokeWidth="5"/>
      <path d="M347 425v93m341-260v96" stroke="#b6c1b2" strokeWidth="6"/>
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
    <g fill="#a5b39b" fontFamily="monospace" fontSize="11" letterSpacing="3"><text x="173" y="658">PLAN. PRACTICE. PROGRESS.</text></g>
  </svg>;
}
