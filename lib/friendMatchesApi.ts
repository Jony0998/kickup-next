import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export interface FriendMatch {
  id: string;
  matchId: string;
  matchTitle: string;
  date: string;
  time: string;
  field: string;
  location: string;
  friendName: string;
  friendAvatar?: string;
  friendId: string;
  price: number;
  availableSpots: number;
}

// Get friend matches
export async function getFriendMatches(): Promise<FriendMatch[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<FriendMatch[]>("/matches/friends", {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching friend matches:", error);
      throw new Error(error?.message || "Failed to fetch friend matches");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type FriendMatchesQuery = {
        friendMatches: Array<{
          _id: string;
          matchId: string;
          matchTitle: string;
          date: string;
          time: string;
          field: string;
          location: string;
          friendName: string;
          friendAvatar?: string;
          friendId: string;
          price: number;
          availableSpots: number;
        }>;
      };

      const data = await graphqlRequest<FriendMatchesQuery>(
        `
          query FriendMatches {
            friendMatches {
              _id
              matchId
              matchTitle
              date
              time
              field
              location
              friendName
              friendAvatar
              friendId
              price
              availableSpots
            }
          }
        `,
        {
          auth: true,
        }
      );

      return data.friendMatches.map((m) => ({
        id: m._id,
        matchId: m.matchId,
        matchTitle: m.matchTitle,
        date: m.date,
        time: m.time,
        field: m.field,
        location: m.location,
        friendName: m.friendName,
        friendAvatar: m.friendAvatar,
        friendId: m.friendId,
        price: m.price,
        availableSpots: m.availableSpots,
      }));
    } catch (error: any) {
      console.error("Error fetching friend matches:", error);
      throw new Error(error?.message || "Failed to fetch friend matches");
    }
  }

  // Mock data
  return [
    {
      id: "1",
      matchId: "m1",
      matchTitle: "Friday Night Match",
      date: "2026-01-30",
      time: "18:00",
      field: "Suwon AK Pumatown Futsal Field 2",
      location: "Suwon",
      friendName: "John",
      friendId: "u1",
      price: 50000,
      availableSpots: 5,
    },
    {
      id: "2",
      matchId: "m2",
      matchTitle: "Weekend Match",
      date: "2026-02-01",
      time: "20:00",
      field: "Flap Stadium Suwon Indoor",
      location: "Suwon",
      friendName: "Jane",
      friendId: "u2",
      price: 55000,
      availableSpots: 3,
    },
  ];
}

