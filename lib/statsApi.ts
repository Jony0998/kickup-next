import { graphqlRequest } from "./graphqlClient";

export interface TopPlayer {
    _id: string;
    memberNick: string;
    memberFullName?: string;
    memberImage?: string;
    memberPoints: number;
    memberRank: number;
    memberSkillLevel: string;
}

export interface PlayerStats {
    _id: string;
    totalMatches: number;
    matchesWon: number;
    matchesDrawn: number;
    matchesLost: number;
    totalGoals: number;
    totalAssists: number;
    averageRating: number;
}

export async function getTopPlayers(limit: number = 10): Promise<TopPlayer[]> {
    const query = `
    query GetTopMembers($limit: Int) {
      topMembers(limit: $limit) {
        _id
        memberNick
        memberFullName
        memberImage
        memberPoints
        memberRank
        memberSkillLevel
      }
    }
  `;

    try {
        const data = await graphqlRequest<{ topMembers: TopPlayer[] }>(query, {
            variables: { limit },
        });
        return data.topMembers;
    } catch (error) {
        console.error("Error fetching top players:", error);
        return [];
    }
}

export async function getTopScorers(limit: number = 10): Promise<any[]> {
    const query = `
    query GetTopScorers($limit: Int) {
      topScorers(limit: $limit) {
        memberId
        totalGoals
        totalMatches
      }
    }
  `;

    try {
        const data = await graphqlRequest<{ topScorers: any[] }>(query, {
            variables: { limit },
        });
        return data.topScorers;
    } catch (error) {
        console.error("Error fetching top scorers:", error);
        return [];
    }
}
