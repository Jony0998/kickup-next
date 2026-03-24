import { graphqlRequest } from "./graphqlClient";

export interface GoalInput {
    playerId: string;
    minute: number;
    assistPlayerId?: string;
    isOwnGoal?: boolean;
}

export interface MatchResultInput {
    matchId: string;
    homeScore: number;
    awayScore: number;
    homePlayers: string[];
    awayPlayers: string[];
    goals: GoalInput[];
}

export async function createMatchResult(input: MatchResultInput) {
    const query = `
    mutation CreateMatchResult($input: String!) {
      createMatchResult(input: $input) {
        _id
        matchId
        homeScore
        awayScore
        resultStatus
      }
    }
  `;

    try {
        const data = await graphqlRequest<any>(query, {
            variables: { input: JSON.stringify(input) },
            auth: true,
        });
        return data.createMatchResult;
    } catch (error) {
        console.error("Error creating match result:", error);
        throw error;
    }
}

export async function getMatchResult(matchId: string) {
    const query = `
    query GetMatchResult($matchId: ID!) {
      matchResult(matchId: $matchId) {
        _id
        homeScore
        awayScore
        goals {
          playerId
          minute
          assistPlayerId
        }
      }
    }
  `;

    try {
        const data = await graphqlRequest<any>(query, {
            variables: { matchId },
        });
        return data.matchResult;
    } catch (error) {
        console.error("Error fetching match result:", error);
        return null;
    }
}
