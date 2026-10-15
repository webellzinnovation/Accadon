/** Qualification is based on final place, never player/seed numbering. */
export function KitPlace({place,qualifierCount}:{place:number;qualifierCount:number}){
 const qualified=place>0&&place<=Math.max(0,Math.floor(qualifierCount));
 return <span className={'kit-cross-place'+(qualified?' is-qualified':'')} aria-label={'Place '+place+(qualified?', qualifies':', outside qualifying places')}>{place}</span>;
}
