# Umpires, scorekeepers and allocation-based access

Research and workflow design, 15 October 2026.

## Recommendation

Add a tournament-scoped official duty to an existing person, not another global account. A conductor can nominate a parent, player or academy admin. The nomination is not a professional credential. Separate the person who enters scores, the sport official who makes decisions, and the authority that checks the result. Activate appointments only after the event's qualification, impartiality and safeguarding rules are met.

## Sport-specific research

| Sport | Grounded authority | Accadon design |
| --- | --- | --- |
| Table tennis | ITTF international regulations appoint an event referee and a match umpire/assistant. The referee appoints officials; the umpire decides rallies and calls the score (3.3.1–3.3.2). | Table + exact match allocation; umpire and assistant separate. Referee escalation for rules interpretation. Software score access is not certification as an umpire. |
| Badminton | BWF says the umpire controls a particular court/match, calls score after each point and reports to the referee. Technical officials have training/qualification pathways. | Umpire, service judge and line judge are different duties; only the assigned score writer enters the match score. |
| Football | IFAB Law 5 gives the referee match authority and final decisions on facts of play/result. Other officials assist under Law 6. | Call it Referee / scorekeeper. Volunteer operator records referee-confirmed goals and events; cannot overrule the referee. Match permission is not general pitch authority. |
| Cricket | MCC Law 2 appoints two impartial umpires, one at each end. Law 3 appoints two scorers, recording runs/wickets/overs, acknowledging umpire signals and reconciling records. | Separate on-field umpire slots from scoring operators. One active application writer with a second scorer/reconciliation role. Scorekeeper follows signals; not generic +point scoring. |
| Pickleball | USA Pickleball 2026 section 16 gives the director responsibility for officials/areas; section 17 defines referee duties. Section 24 permits player-administered non-officiated tournament play with its own modifications. | Explicit officiated vs non-officiated mode. Do not turn a player reporting a score into an appointed referee. Adopt the Indian event's governing rules first. |

These are primary-rule and governing-body references. No source establishes that any untrained parent/player/admin can officiate every sanctioned Indian competition. Indian federation/event appointment and qualification conditions remain unresolved live-activation inputs. Primary-rule sources suit authority questions better than community anecdotes. Generic current URLs can change versions; freeze the adopted season/profile before live use.

## Assignment lifecycle

1. Conductor selects an existing verified person, sport duty, exact event/category/match IDs, resource and time window. Parent/player/admin role is retained.
2. Check qualifications, own-match/family/club conflicts, availability/overlap, minimum age and safeguarding. This is an Accadon design gate, not a universal federation rule.
3. Person accepts scope; activation is recorded. No shared umpire password. Personal login can switch into the duty.
4. A table/court shift resolves to an explicit match queue. Reassignments require a handover, revision and expiry. Moving a match must never silently authorize all future matches at that location.
5. One active score writer per match; assistant/scorer support permissions are distinct. Update APIs must check tournament, assigned match, acceptance, resource revision, expiry and lock state on every write.
6. Record score events using the adopted sport engine. Undo references an exact event and reason. Revisions, incident reports and handovers remain in the audit trail. Offline entries need sequence numbers, collision review and clear pending-sync state.
7. Submit locks ordinary entry. Independent review checks scorer/official confirmation and result validity. A designated reviewer certifies under event rules; software certification does not overrule an official's sporting decision. Corrections after certification reopen an audited version and re-evaluate affected advancement.
8. Revoke/expire removes write access immediately. No finance, family contact, academy records, unrelated matches, draw editing or self-certification rights are implied.

## Static demo implemented

Officials tab on the public match desk and Umpire / scorekeeper role in workflows. Conductor can choose a fictional parent/player/admin, propose an exact match and see scope; official accepts, enters scratch totals, gives a correction reason, flags an incident and submits; conductor can revoke, return for correction or rehearse checking. Local audit trail shows the flow. Other matches are read-only.

Scratch score starts at zero, deliberately separate from published demo match snapshots. It does not implement a full sport engine, automatically conclude a match, certify a result, advance anyone, save data, invite people or authenticate a user. Cricket is run-total rehearsal only, not ball-by-ball scoring. Pickleball service state is not implemented. All changes reset when the view unmounts/reloads. Backend role/auth/scoring expansion remains paused.

## Primary source ledger

- ITTF 2026 Statutes, official consolidated PDF: https://documents.ittf.sport/sites/default/files/public/2026-02/2026_Statutes_v1_consolidated_clean.pdf . Official page fetch available, but relevant chapter text was not exposed in its extract.
- ITTF 2026 Chapter 3, association-hosted rule text: https://www.hktta.org.hk/referee/application/2026_Statutes_Chapter3.pdf . Inspected 3.3.1 referee appointments and 3.3.2 umpire/assistant/rally/score duties.
- ITTF 2026 handbook landing page: https://www.ittf.com/committees/umpires-referees/documents/hmo-18th-edition-february-2026/ . Landing page confirms document identity only; not used to assert unseen handbook text.
- BWF umpire duties and pathway: https://corporate.bwfbadminton.com/technical-officials/umpires/ . Inspected court/match control, score calls, referee authority and training.
- BWF officials: https://corporate.bwfbadminton.com/technical-officials/ . Inspected appointments, qualification system and role separation.
- IFAB Law 5: https://www.theifab.com/laws/latest/the-referee/ . Inspected authority and decisions.
- IFAB Law 6: https://www.theifab.com/laws/latest/the-other-match-officials/ . Inspected assistant duties and replacement rules.
- MCC Law 2: https://www.lords.org/mcc/the-laws/the-umpires . Inspected two umpires, impartiality and signals.
- MCC Law 3: https://www.lords.org/mcc/the-laws/the-scorers . Inspected two scorers, records agreement and acknowledging signals.
- USA Pickleball 2026 official rulebook: https://usapickleball.org/docs/rules/USAP-Official-Rulebook.pdf . Inspected sections 16, 17 and 24 in downloaded PDF text. Reference only; does not establish Indian event adoption.
