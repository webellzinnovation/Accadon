import {useEffect,useState} from 'react';
import {api} from './LiveWorkspace';
type Match={id:string;round:number;position:number;player_a:string|null;player_b:string|null;player_a_name:string|null;player_b_name:string|null;winner_name:string|null;score_a:number|null;score_b:number|null;status:string};
type Draw={id:string;format:string;status:string;created_at:string};
type Results={format:string;complete:boolean;champion?:string|null;standings?:{player_id:string;name:string;played:number;won:number;drawn:number;lost:number;points:number;score_for:number;score_against:number}[];rounds?:{round:number;matches:{position:number;player_a_name:string|null;player_b_name:string|null;score_a:number|null;score_b:number|null;status:string;winner_name:string|null}[]}[]};
const fmt=(f:string)=>f.replaceAll('_',' ');
export function DrawPanel({tournamentId,tournamentName,format,canManage}:{tournamentId:string;tournamentName:string;format:string;canManage:boolean}){
 const [draw,setDraw]=useState<Draw|null>(null),[matches,setMatches]=useState<Match[]>([]),[results,setResults]=useState<Results|null>(null);
 const [error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const [scores,setScores]=useState<Record<string,{a:string;b:string}>>({});
 const load=async()=>{setLoading(true);setError('');try{
  const d=await api(`/tournaments/${tournamentId}/draw`);setDraw(d.draw);setMatches(d.matches);
  setResults(await api(`/tournaments/${tournamentId}/results`));
 }catch(e){const m=(e as Error).message;if(m.includes('No draw')){setDraw(null);setMatches([]);setResults(null)}else setError(m)}finally{setLoading(false)}};
 useEffect(()=>{void load()},[tournamentId]);
 const run=async(fn:()=>Promise<unknown>,ok:string)=>{setBusy(true);setError('');setNotice('');try{await fn();await load();setNotice(ok)}catch(e){setError((e as Error).message)}finally{setBusy(false)}};
 const saveScore=(m:Match)=>{const s=scores[m.id];if(!s||s.a===''||s.b===''){setError('Enter both scores first.');return}void run(()=>api(`/matches/${m.id}/score`,'POST',{score_a:Number(s.a),score_b:Number(s.b)}),'Result saved.')};
 if(loading)return <p role="status">Loading draw…</p>;
 const rounds=[...new Set(matches.map(m=>m.round))].sort((a,b)=>a-b);
 return <section className="draw-panel"><div className="live-list-heading"><h2>Draw & scoring · {tournamentName}</h2><span className="ui-chip amber">{fmt(format)}</span></div>
 {error&&<div className="live-error" role="alert">{error}</div>}{notice&&<div className="live-success" role="status">{notice}</div>}
 {!draw?<div className="live-empty"><span>♜</span><h3>No draw yet</h3><p>{canManage?'Generate the draw once at least 2 entries are accepted. Round robin and single elimination brackets are built from the accepted entries.':'The organizer has not generated the draw yet.'}</p>{canManage&&<button className="button primary" disabled={busy} onClick={()=>void run(()=>api(`/tournaments/${tournamentId}/draw`,'POST',{}),'Draw generated.')}>{busy?'Working…':'Generate draw ↗'}</button>}</div>:<>
 {canManage&&<div className="live-record-actions"><button className="live-secondary" disabled={busy} onClick={()=>{if(window.confirm('Regenerate the draw from the current accepted entries? The existing draw and its scores are archived.'))void run(()=>api(`/tournaments/${tournamentId}/draw`,'POST',{}),'Draw regenerated. The previous draw is archived.')}}>Regenerate from accepted entries</button></div>}
 {rounds.map(r=><div className="draw-round" key={r}><h3>{draw.format==='single_elimination'?(r===Math.max(...rounds)?'Final':r===Math.max(...rounds)-1?'Semifinals':`Round ${r}`):`Round ${r}`}</h3><div className="draw-matches">{matches.filter(m=>m.round===r).map(m=><article className={'draw-match'+(m.status==='completed'?' done':'')} key={m.id}>
  <div className="draw-match-rows"><div className={m.winner_name&&m.winner_name===m.player_a_name?'winner':''}><span>{m.player_a_name||'To be decided'}</span><b>{m.score_a??''}</b></div><div className={m.winner_name&&m.winner_name===m.player_b_name?'winner':''}><span>{m.player_b_name||(m.status==='bye'?'Bye':'To be decided')}</span><b>{m.score_b??''}</b></div></div>
  {m.status==='bye'?<small className="draw-chip">Bye</small>:m.status==='completed'?<small className="draw-chip">Final{m.winner_name?` · ${m.winner_name}`:''}</small>:null}
  {canManage&&m.status==='scheduled'&&m.player_a&&m.player_b&&<div className="draw-score"><input type="number" min={0} max={999} aria-label={`Score ${m.player_a_name}`} value={scores[m.id]?.a??''} onChange={e=>setScores(p=>({...p,[m.id]:{a:e.target.value,b:p[m.id]?.b??''}}))}/><span>-</span><input type="number" min={0} max={999} aria-label={`Score ${m.player_b_name}`} value={scores[m.id]?.b??''} onChange={e=>setScores(p=>({...p,[m.id]:{a:p[m.id]?.a??'',b:e.target.value}}))}/><button className="live-secondary" disabled={busy} onClick={()=>saveScore(m)}>Save</button></div>}
 </article>)}</div></div>)}
 {results&&draw.format==='round_robin'&&<div className="draw-standings"><h3>Standings</h3>{results.standings!.length?<table><thead><tr><th>Player</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr></thead><tbody>{results.standings!.map(s=><tr key={s.player_id}><td>{s.name}</td><td>{s.played}</td><td>{s.won}</td><td>{s.drawn}</td><td>{s.lost}</td><td><b>{s.points}</b></td></tr>)}</tbody></table>:<p className="live-muted">No results recorded yet.</p>}{results.complete&&<p className="live-success" role="status">All rounds complete.</p>}</div>}
 {results&&draw.format==='single_elimination'&&results.complete&&results.champion&&<p className="live-success" role="status">Champion: <b>{results.champion}</b></p>}
 </>}
 </section>}
