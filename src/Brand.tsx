// Canonical supplied artwork. Keep intrinsic square aspect ratio and original fills.
export function BrandMark({className=''}:{className?:string}){return <img className={`accadon-brand-mark ${className}`} src={`${import.meta.env.BASE_URL}accadon-logo.svg`} alt="Accadon logo" width="40" height="40"/>}
export function Brand({className=''}:{className?:string}){return <span className={`accadon-brand ${className}`}><BrandMark/><span>accadon</span></span>}
