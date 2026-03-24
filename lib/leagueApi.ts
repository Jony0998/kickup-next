import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export interface LeagueMatch {
  id: string;
  date: string;
  time: string;
  field: string;
  status: "upcoming" | "live" | "completed" | "closed";
  gender: string;
  format: string;
  level: string;
  parking?: string;
  teams: Array<{
    name: string;
    logo?: string;
    score?: number;
    id?: string;
  }>;
}

export interface LeagueResult {
  id: string;
  date: string;
  time: string;
  field: string;
  team1: {
    name: string;
    logo?: string;
    score: number;
  };
  team2: {
    name: string;
    logo?: string;
    score: number;
  };
  status: "completed";
}

export interface TeamRanking {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface IndividualRanking {
  rank: number;
  playerId: string;
  playerName: string;
  playerAvatar?: string;
  teamName: string;
  goals: number;
  assists: number;
  matches: number;
  rating: number;
}

export interface League {
  id: string;
  title: string;
  season: string;
  status: string;
  startDate: string;
  endDate: string;
  description?: string;
  rules?: string;
  organizer: string;
}

// Get league details
export async function getLeague(): Promise<League | null> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasGraphqlBackend) {
    try {
      type LeaguesQuery = {
        leagues: Array<{
          _id: string;
          leagueName: string;
          leagueStatus: string;
          startDate: string;
          endDate: string;
          leagueDescription?: string;
          rules?: string;
        }>;
      };

      const data = await graphqlRequest<LeaguesQuery>(
        `
          query Leagues {
            leagues(limit: 1) {
              _id
              leagueName
              leagueStatus
              startDate
              endDate
              leagueDescription
              rules
            }
          }
        `,
        { auth: true }
      );

      if (!data.leagues || data.leagues.length === 0) return null;
      const league = data.leagues[0];

      return {
        id: league._id,
        title: league.leagueName,
        season: "2025 Season 1", // Derived or placeholder
        status: league.leagueStatus,
        startDate: league.startDate,
        endDate: league.endDate,
        description: league.leagueDescription,
        rules: league.rules,
        organizer: "KickUp", // Hardcoded for now
      };
    } catch (error) {
      console.error("Error fetching league:", error);
      return null;
    }
  }

  return null;
}

// Get single league match
export async function getLeagueMatch(id: string): Promise<LeagueMatch | null> {
  const matches = await getLeagueMatches();
  return matches.find((m) => m.id === id) || null;
}

// Get league matches (schedule)
export async function getLeagueMatches(filter?: { gender?: string }): Promise<LeagueMatch[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const params = new URLSearchParams();
      if (filter?.gender) params.append("gender", filter.gender);
      const data = await apiRequest<LeagueMatch[]>(`/league/matches?${params.toString()}`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching league matches:", error);
      throw new Error(error?.message || "Failed to fetch league matches");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type LeaguesQuery = {
        leagues: Array<{
          matches: Array<{
            matchId: string;
            status: string;
            match: {
              matchDate: string;
              matchTime: string;
              location: {
                address: string;
              };
              skillLevel: string;
            };
            homeTeam: {
              teamName: string;
              teamLogo?: string;
            };
            awayTeam: {
              teamName: string;
              teamLogo?: string;
            };
          }>;
          _id: string;
        }>;
      };

      const data = await graphqlRequest<LeaguesQuery>(
        `
          query Leagues {
            leagues(limit: 1) {
              matches {
                matchId
                status
                match {
                  matchDate
                  matchTime
                  location {
                    address
                  }
                  skillLevel
                }
                homeTeam {
                  teamName
                  teamLogo
                }
                awayTeam {
                  teamName
                  teamLogo
                }
              }
            }
          }
        `,
        {
          auth: true,
        }
      );

      if (!data.leagues || data.leagues.length === 0) return [];

      const league = data.leagues[0];
      const matches = league.matches.filter(m => m.status !== 'COMPLETED' && m.status !== 'CANCELLED');

      return matches.map((m) => {
        const matchDetails = m.match || { matchDate: new Date().toISOString(), matchTime: "TBD", location: { address: "TBD" }, skillLevel: "All Levels" };
        const leagueTeams = [];
        if (m.homeTeam) leagueTeams.push({ name: m.homeTeam.teamName, logo: m.homeTeam.teamLogo, score: undefined, id: 'home' });
        if (m.awayTeam) leagueTeams.push({ name: m.awayTeam.teamName, logo: m.awayTeam.teamLogo, score: undefined, id: 'away' });

        return {
          id: m.matchId,
          date: new Date(matchDetails.matchDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
          time: matchDetails.matchTime,
          field: matchDetails.location?.address || "Unknown Field",
          status: (m.status.toLowerCase() === 'scheduled' ? 'upcoming' : m.status.toLowerCase()) as any,
          gender: "Mixed",
          format: "6vs6",
          level: matchDetails.skillLevel || "All Levels",
          parking: "Ample",
          teams: leagueTeams,
        };
      });
    } catch (error: any) {
      console.error("Error fetching league matches:", error);
    }
  }

  return [];
}

// Get league results
export async function getLeagueResults(filter?: { gender?: string }): Promise<LeagueResult[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const params = new URLSearchParams();
      if (filter?.gender) params.append("gender", filter.gender);
      const data = await apiRequest<LeagueResult[]>(`/league/results?${params.toString()}`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching league results:", error);
      throw new Error(error?.message || "Failed to fetch league results");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type LeaguesQuery = {
        leagues: Array<{
          matches: Array<{
            matchId: string;
            status: string;
            match: {
              matchDate: string;
              matchTime: string;
              location: {
                address: string;
              };
            };
            homeTeam: {
              teamName: string;
              teamLogo?: string;
            };
            awayTeam: {
              teamName: string;
              teamLogo?: string;
            };
          }>;
        }>;
      };

      const data = await graphqlRequest<LeaguesQuery>(
        `
          query Leagues {
            leagues(limit: 1) {
              matches {
                matchId
                status
                match {
                  matchDate
                  matchTime
                  location {
                    address
                  }
                }
                homeTeam {
                  teamName
                  teamLogo
                }
                awayTeam {
                  teamName
                  teamLogo
                }
              }
            }
          }
        `,
        { auth: true }
      );

      if (!data.leagues || data.leagues.length === 0) return [];
      const league = data.leagues[0];
      const results = league.matches.filter(m => m.status === 'COMPLETED');

      return results.map(r => ({
        id: r.matchId,
        date: new Date(r.match?.matchDate || Date.now()).toLocaleDateString(),
        time: r.match?.matchTime || "00:00",
        field: r.match?.location?.address || "Unknown",
        team1: { name: r.homeTeam?.teamName || "TBD", logo: r.homeTeam?.teamLogo, score: (r as any).homeScore ?? 0 },
        team2: { name: r.awayTeam?.teamName || "TBD", logo: r.awayTeam?.teamLogo, score: (r as any).awayScore ?? 0 },
        status: "completed" as const,
      }));
    } catch (e) {
      console.error(e);
    }
  }

  return [];
}

// Get team rankings
export async function getTeamRankings(filter?: { gender?: string }): Promise<TeamRanking[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const params = new URLSearchParams();
      if (filter?.gender) params.append("gender", filter.gender);
      const data = await apiRequest<TeamRanking[]>(`/league/rankings/teams?${params.toString()}`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching team rankings:", error);
      throw new Error(error?.message || "Failed to fetch team rankings");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type LeaguesQuery = {
        leagues: Array<{
          teams: Array<{
            teamId: string;
            points: number;
            wins: number;
            draws: number;
            losses: number;
            goalsFor: number;
            goalsAgainst: number;
            goalDifference: number;
            matchesPlayed: number;
            team: {
              teamName: string;
              teamLogo?: string;
            }
          }>
        }>
      };

      const data = await graphqlRequest<LeaguesQuery>(
        `query Leagues {
                leagues(limit: 1) {
                    teams {
                        teamId
                        points
                        wins
                        draws
                        losses
                        goalsFor
                        goalsAgainst
                        goalDifference
                        matchesPlayed
                        team {
                            teamName
                            teamLogo
                        }
                    }
                }
            }`,
        { auth: true }
      );

      if (!data.leagues || data.leagues.length === 0) return [];
      const teams = data.leagues[0].teams;

      // Sort by points desc
      teams.sort((a, b) => b.points - a.points);

      return teams.map((t, index) => ({
        rank: index + 1,
        teamId: t.teamId,
        teamName: t.team?.teamName || "Unknown",
        teamLogo: t.team?.teamLogo,
        played: t.matchesPlayed,
        won: t.wins,
        drawn: t.draws,
        lost: t.losses,
        goalsFor: t.goalsFor,
        goalsAgainst: t.goalsAgainst,
        goalDifference: t.goalDifference,
        points: t.points,
      }));

    } catch (e) {
      console.error(e);
    }
  }

  return [];
}

// Get individual rankings
export async function getIndividualRankings(filter?: { gender?: string }): Promise<IndividualRanking[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const params = new URLSearchParams();
      if (filter?.gender) params.append("gender", filter.gender);
      const data = await apiRequest<IndividualRanking[]>(`/league/rankings/individuals?${params.toString()}`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching individual rankings:", error);
      throw new Error(error?.message || "Failed to fetch individual rankings");
    }
  }

  // Individual rankings from league: use real API when backend supports it
  return [];
}
