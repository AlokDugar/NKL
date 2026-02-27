// api.ts — Centralized API layer
// All endpoints use VITE_API_BASE_URL from .env

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

export interface Season {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  logo: string;
  primary_color: string;
  home_ground?: string;
  address?: string;
  description?: string;
  featured_img?: string;
  social_links?: { website?: string };
}

export interface Stadium {
  name: string;
}

export interface MatchDetails {
  first_team_score?: number;
  second_team_score?: number;
  status?: number; // 1 = finished
}

export interface Match {
  id: number;
  type: string;
  date: string;
  time?: string;
  season_id?: number;
  first_team: Team;
  second_team: Team;
  first_team_id?: number;
  second_team_id?: number;
  details?: MatchDetails;
  stadium?: Stadium;
  activities?: Activity[];
}

export interface Activity {
  id: number;
  team_id: number;
  type: string;
  points: number;
  time?: string;
}

export interface StandingTeam {
  id: number;
  logo: string;
  name: string;
  slug: string;
  primary_color: string;
  total_points: number;
  total_score_diff: number;
  total_matches: number;
  total_wins: number;
  total_draws: number;
  total_losses: number;
  games: Game[];
  previous_game?: Game | null;
  next_game?: Game | null;
}

export interface Game {
  id: number;
  match_number: string;
  winner_id: number;
  status: number;
  first_half_start_time: string;
  second_half_end_time: string;
  total_points: number;
  total_score_diff: number;
  stat: string;
}

export interface Player {
  id: number;
  slug: string;
  name: string;
  last_name?: string;
  photo?: string;
  player_image_url?: string;
  jersey?: number;
  debut_year?: string;
  isCaptain?: boolean;
  isSubCaptain?: boolean;
  position?: { name: string };
  country?: { code: string };
}

export interface SquadPlayer extends Player {
  jersey: number;
  isCaptain: boolean;
  isSubCaptain: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  created_at: string;
}

export interface TeamStats {
  rank: number;
  played: number;
  wins: number;
  draws: number;
  total_points: number;
  total_raids: number;
  successful_raid: number;
  super_raid: number;
  empty_raid: number;
  raid_points: number;
  bonus_point: number;
  total_tackles: number;
  successful_tackle: number;
  super_tackle: number;
  tackle_points: number;
  highest_score: number;
}

export interface PlayerStats {
  total_points: string;
  raid_points: string;
  tackle_points: string;
  gameCount: string;
  successful_raid: string;
  successful_tackle: string;
  super_raid: string;
  super_tackle: string;
  dod_points: string;
  empty_raid: string;
  super_10s: string;
  super_5s: string;
  avg_raid_points: string;
  team_name: string;
  team_logo_url: string;
  slug: string;
}

export interface LineupStats {
  [teamId: string]: LineupPlayer[];
}

export interface LineupPlayer {
  id: number;
  slug: string;
  name: string;
  player_image_url: string;
  position?: { name: string };
  gameCount: number;
  total_points?: string;
  raid_points?: string;
  tackle_points?: string;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/** Returns the season with the highest id (latest). */
export function getLatestSeason(seasons: Season[]): Season | undefined {
  if (!seasons.length) return undefined;
  return [...seasons].sort((a, b) => b.id - a.id)[0];
}

/* ─────────────────────────────────────────────
   API functions
───────────────────────────────────────────── */

/** Fetch all seasons. Latest season is the one with the highest id. */
export async function fetchSeasons(): Promise<Season[]> {
  const res = await get<{ data: Season[] }>("/seasons");
  return res.data || [];
}

/** Fetch all teams. Defaults to latest season if seasonId not provided. */
export async function fetchTeams(seasonId?: number): Promise<Team[]> {
  if (!seasonId) {
    const seasons = await fetchSeasons();
    const latest = getLatestSeason(seasons);
    seasonId = latest?.id;
  }
  const path = seasonId ? `/teams?season_id=${seasonId}` : "/teams";
  const res = await get<{ data: Team[] }>(path);
  return res.data || [];
}

/** Fetch a single team by slug. Defaults to latest season if seasonId not provided. */
export async function fetchTeam(
  slug: string,
  seasonId?: number,
): Promise<Team> {
  if (!seasonId) {
    const seasons = await fetchSeasons();
    const latest = getLatestSeason(seasons);
    seasonId = latest?.id;
  }

  const path = seasonId
    ? `/teams/${slug}?season_id=${seasonId}`
    : `/teams/${slug}`;

  const res = await get<{ data: Team }>(path);
  return res.data;
}

/** Fetch all matches. */
export async function fetchMatches(): Promise<Match[]> {
  const res = await get<{ data: Match[] }>("/games");
  return res.data || [];
}

/** Fetch a single match by id, along with its lineup stats. */
export async function fetchMatchWithLineup(
  matchId: string | number,
): Promise<{ match: Match; lineupStats: LineupStats }> {
  const [matchRes, lineupRes] = await Promise.all([
    get<{ data: Match }>(`/games/${matchId}`),
    get<{ data: LineupStats }>(`/lineup-stats/${matchId}`),
  ]);
  return {
    match: matchRes.data,
    lineupStats: lineupRes.data || {},
  };
}

/**
 * Fetch standings.
 * Pass a seasonId to filter by season, or omit for all-time.
 */
export async function fetchStandings(seasonId?: number): Promise<StandingTeam[]> {
  const path = seasonId ? `/standings?season_id=${seasonId}` : "/standings";
  const res = await get<{ data: StandingTeam[] }>(path);
  const sorted = (res.data || []).sort(
    (a, b) => b.total_points - a.total_points,
  );
  return sorted;
}

/**
 * Fetch standings for the LATEST season automatically.
 */
export async function fetchLatestStandings(): Promise<{
  standings: StandingTeam[];
  season: Season | undefined;
}> {
  const seasons = await fetchSeasons();
  const latest = getLatestSeason(seasons);
  const standings = await fetchStandings(latest?.id);
  return { standings, season: latest };
}

/** Fetch squad players for a team & season. */
export async function fetchSquad(
  teamSlug: string,
  seasonId: number,
): Promise<SquadPlayer[]> {
  const res = await get<{ data: { data: any[] } }>(
    `/squads?team_slug=${teamSlug}&season_id=${seasonId}`,
  );
  const squad = res.data?.data?.[0];
  if (!squad?.players) return [];
  return squad.players.map((p: any) => ({
    ...p.player,
    jersey: p.jersey,
    isCaptain: p.player.id === squad.captain,
    isSubCaptain: p.player.id === squad.sub_captain,
  }));
}

/** Fetch team stats for a given season. */
export async function fetchTeamStats(
  teamId: number,
  seasonId: number,
): Promise<TeamStats | null> {
  const res = await get<{ data: TeamStats[] }>(
    `/team-stats?team_id=${teamId}&season_id=${seasonId}`,
  );
  return res.data?.[0] || null;
}

/** Fetch a player by slug. */
export async function fetchPlayer(slug: string): Promise<Player> {
  const res = await get<{ data: Player }>(`/players/${slug}`);
  return res.data;
}

/** Fetch player stats for a given season. */
export async function fetchPlayerStats(
  playerId: number,
  seasonId: number,
): Promise<PlayerStats | null> {
  const res = await get<{ data: PlayerStats[] }>(
    `/player-stats?season_id=${seasonId}&player_id=${playerId}`,
  );
  return res.data?.[0] || null;
}

/** Fetch news items. */
export async function fetchNews(): Promise<NewsItem[]> {
  const res = await get<{ data: { data: any[] } }>(
    "/items?category_slug=news&category_id=74",
  );
  const items = (res.data?.data || []).map((item: any) => ({
    id: item.id,
    title: item.name,
    category: item.category?.name ?? "",
    image: item.photo,
    date: item.created_at,
    created_at: item.created_at,
  }));
  return items.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/** Optional helper: fetch teams for the latest season explicitly */
export async function fetchLatestSeasonTeams(): Promise<{
  teams: Team[];
  season: Season | undefined;
}> {
  const seasons = await fetchSeasons();
  const latest = getLatestSeason(seasons);
  const teams = await fetchTeams(latest?.id);
  return { teams, season: latest };
}