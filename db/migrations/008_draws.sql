-- Draws, fixtures and results. A draw is generated from a tournament's accepted
-- entries; regenerating archives the previous draw so recorded history survives.
CREATE TABLE IF NOT EXISTS tournament_draws(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  format TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN('active','archived')),
  created_by UUID NOT NULL REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS tournament_draws_one_active ON tournament_draws(tournament_id) WHERE status='active';
CREATE TABLE IF NOT EXISTS tournament_matches(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES tournament_draws(id) ON DELETE CASCADE,
  round INTEGER NOT NULL CHECK(round>=1),
  position INTEGER NOT NULL CHECK(position>=1),
  player_a UUID REFERENCES app_users(id),
  player_b UUID REFERENCES app_users(id),
  score_a INTEGER CHECK(score_a>=0),
  score_b INTEGER CHECK(score_b>=0),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN('scheduled','bye','completed','walkover')),
  winner_id UUID REFERENCES app_users(id),
  played_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(draw_id,round,position),
  CHECK(winner_id IS NULL OR winner_id=player_a OR winner_id=player_b),
  CHECK((score_a IS NULL)=(score_b IS NULL))
);
CREATE INDEX IF NOT EXISTS tournament_matches_draw_idx ON tournament_matches(draw_id,round,position);
