import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export interface LikedMatch {
  id: string;
  matchId: string;
  title: string;
  date: string;
  time: string;
  field: string;
  location: string;
  details: string[];
  price: number;
  availableSpots: number;
  likedAt: string;
}

// Get liked matches
export async function getLikedMatches(): Promise<LikedMatch[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<LikedMatch[]>("/matches/liked", {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching liked matches:", error);
      throw new Error(error?.message || "Failed to fetch liked matches");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type LikedMatchesQuery = {
        myLikedMatches: Array<{
          _id: string;
          matchId: string;
          title: string;
          date: string;
          time: string;
          field: string;
          location: string;
          details: string[];
          price: number;
          availableSpots: number;
          likedAt: string;
        }>;
      };

      const data = await graphqlRequest<LikedMatchesQuery>(
        `
          query MyLikedMatches {
            myLikedMatches {
              _id
              matchId
              title
              date
              time
              field
              location
              details
              price
              availableSpots
              likedAt
            }
          }
        `,
        {
          auth: true,
        }
      );

      return data.myLikedMatches.map((m) => ({
        id: m._id,
        matchId: m.matchId,
        title: m.title,
        date: m.date,
        time: m.time,
        field: m.field,
        location: m.location,
        details: m.details,
        price: m.price,
        availableSpots: m.availableSpots,
        likedAt: m.likedAt,
      }));
    } catch (error: any) {
      console.error("Error fetching liked matches:", error);
      throw new Error(error?.message || "Failed to fetch liked matches");
    }
  }

  // Mock data
  return [
    {
      id: "1",
      matchId: "m1",
      title: "Friday Night Match",
      date: "2026-01-30",
      time: "18:00",
      field: "Suwon AK Pumatown Futsal Field 2",
      location: "Suwon",
      details: ["Both men and women", "5vs5"],
      price: 50000,
      availableSpots: 5,
      likedAt: new Date().toISOString(),
    },
    {
      id: "2",
      matchId: "m2",
      title: "Weekend Match",
      date: "2026-02-01",
      time: "20:00",
      field: "Flap Stadium Suwon Indoor",
      location: "Suwon",
      details: ["Both men and women", "6vs6"],
      price: 55000,
      availableSpots: 3,
      likedAt: new Date().toISOString(),
    },
  ];
}

// Unlike match
export async function unlikeMatch(matchId: string): Promise<{ success: boolean }> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<{ success: boolean }>(`/matches/${matchId}/like`, {
        method: "DELETE",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error unliking match:", error);
      throw new Error(error?.message || "Failed to unlike match");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type UnlikeMatchMutation = {
        unlikeMatch: {
          success: boolean;
        };
      };

      const data = await graphqlRequest<UnlikeMatchMutation>(
        `
          mutation UnlikeMatch($matchId: ID!) {
            unlikeMatch(matchId: $matchId) {
              success
            }
          }
        `,
        {
          variables: { matchId },
          auth: true,
        }
      );

      return data.unlikeMatch;
    } catch (error: any) {
      console.error("Error unliking match:", error);
      throw new Error(error?.message || "Failed to unlike match");
    }
  }

  // Mock success
  return { success: true };
}

