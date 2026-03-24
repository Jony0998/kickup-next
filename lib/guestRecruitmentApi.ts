import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export interface GuestPost {
  id: string;
  teamId: string;
  teamName: string;
  teamLogo?: string;
  matchId?: string;
  matchDate: string;
  matchTime: string;
  location: string;
  field: string;
  gender: string;
  format: string;
  level: string;
  parking?: string;
  needed: number;
  description: string;
  postedDate: string;
  appliedCount: number;
  status: "open" | "closed" | "filled";
}

export interface GuestApplication {
  id: string;
  postId: string;
  playerId: string;
  playerName: string;
  playerAvatar?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

// Get guest posts
export async function getGuestPosts(filter?: { gender?: string }): Promise<GuestPost[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const params = new URLSearchParams();
      if (filter?.gender) params.append("gender", filter.gender);
      const data = await apiRequest<GuestPost[]>(`/guest-posts?${params.toString()}`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching guest posts:", error);
      throw new Error(error?.message || "Failed to fetch guest posts");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type GuestPostsQuery = {
        guestPosts: Array<{
          _id: string;
          teamId: string;
          teamName: string;
          teamLogo?: string;
          matchId?: string;
          matchDate: string;
          matchTime: string;
          location: string;
          field: string;
          gender: string;
          format: string;
          level: string;
          parking?: string;
          needed: number;
          description: string;
          postedDate: string;
          appliedCount: number;
          status: string;
        }>;
      };

      const data = await graphqlRequest<GuestPostsQuery>(
        `
          query GuestPosts($gender: String) {
            guestPosts(gender: $gender) {
              _id
              teamId
              teamName
              teamLogo
              matchId
              matchDate
              matchTime
              location
              field
              gender
              format
              level
              parking
              needed
              description
              postedDate
              appliedCount
              status
            }
          }
        `,
        {
          variables: { gender: filter?.gender },
          auth: true,
        }
      );

      return data.guestPosts.map((p) => ({
        id: p._id,
        teamId: p.teamId,
        teamName: p.teamName,
        teamLogo: p.teamLogo,
        matchId: p.matchId,
        matchDate: p.matchDate,
        matchTime: p.matchTime,
        location: p.location,
        field: p.field,
        gender: p.gender,
        format: p.format,
        level: p.level,
        parking: p.parking,
        needed: p.needed,
        description: p.description,
        postedDate: p.postedDate,
        appliedCount: p.appliedCount,
        status: p.status as any,
      }));
    } catch (error: any) {
      console.error("Error fetching guest posts:", error);
      throw new Error(error?.message || "Failed to fetch guest posts");
    }
  }

  // Mock data
  return [
    {
      id: "1",
      teamId: "t1",
      teamName: "FC Warriors",
      teamLogo: "/team1.jpg",
      matchDate: "January 30, Friday",
      matchTime: "20:00",
      location: "Seoul, Yongsan",
      field: "Adidas The Base Field 2 / Man Utd",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      parking: "Parking Full",
      needed: 2,
      description: "Need 2 guest players for our league match this Friday. We're looking for experienced players who can contribute to our team.",
      postedDate: "1 day ago",
      appliedCount: 3,
      status: "open",
    },
    {
      id: "2",
      teamId: "t2",
      teamName: "Thunder FC",
      teamLogo: "/team2.jpg",
      matchDate: "February 1, Sunday",
      matchTime: "18:00",
      location: "Seoul, Gangnam",
      field: "SKY Futsal Park A",
      gender: "Mixed",
      format: "5vs5",
      level: "All Levels",
      needed: 1,
      description: "Looking for 1 guest player. Fun and friendly match!",
      postedDate: "3 days ago",
      appliedCount: 5,
      status: "open",
    },
  ];
}

// Create guest post
export async function createGuestPost(data: {
  matchId?: string;
  matchDate: string;
  matchTime: string;
  location: string;
  field: string;
  gender: string;
  format: string;
  level: string;
  needed: number;
  description: string;
}): Promise<GuestPost> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const result = await apiRequest<GuestPost>("/guest-posts", {
        method: "POST",
        body: JSON.stringify(data),
        auth: true,
      });
      return result;
    } catch (error: any) {
      console.error("Error creating guest post:", error);
      throw new Error(error?.message || "Failed to create guest post");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type CreateGuestPostMutation = {
        createGuestPost: {
          _id: string;
          teamId: string;
          teamName: string;
          matchDate: string;
          matchTime: string;
          location: string;
          field: string;
          gender: string;
          format: string;
          level: string;
          needed: number;
          description: string;
          postedDate: string;
          appliedCount: number;
          status: string;
        };
      };

      const result = await graphqlRequest<CreateGuestPostMutation>(
        `
          mutation CreateGuestPost($input: GuestPostInput!) {
            createGuestPost(input: $input) {
              _id
              teamId
              teamName
              matchDate
              matchTime
              location
              field
              gender
              format
              level
              needed
              description
              postedDate
              appliedCount
              status
            }
          }
        `,
        {
          variables: { input: data },
          auth: true,
        }
      );

      const post = result.createGuestPost;
      return {
        id: post._id,
        teamId: post.teamId,
        teamName: post.teamName,
        matchDate: post.matchDate,
        matchTime: post.matchTime,
        location: post.location,
        field: post.field,
        gender: post.gender,
        format: post.format,
        level: post.level,
        needed: post.needed,
        description: post.description,
        postedDate: post.postedDate,
        appliedCount: post.appliedCount,
        status: post.status as any,
      };
    } catch (error: any) {
      console.error("Error creating guest post:", error);
      throw new Error(error?.message || "Failed to create guest post");
    }
  }

  // Mock success
  return {
    id: "new-1",
    teamId: "t1",
    teamName: "My Team",
    matchDate: data.matchDate,
    matchTime: data.matchTime,
    location: data.location,
    field: data.field,
    gender: data.gender,
    format: data.format,
    level: data.level,
    needed: data.needed,
    description: data.description,
    postedDate: "Just now",
    appliedCount: 0,
    status: "open",
  };
}

// Apply as guest
export async function applyAsGuest(postId: string, message?: string): Promise<{ success: boolean; applicationId: string }> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const result = await apiRequest<{ success: boolean; applicationId: string }>(`/guest-posts/${postId}/apply`, {
        method: "POST",
        body: JSON.stringify({ message }),
        auth: true,
      });
      return result;
    } catch (error: any) {
      console.error("Error applying as guest:", error);
      throw new Error(error?.message || "Failed to apply as guest");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type ApplyAsGuestMutation = {
        applyAsGuest: {
          success: boolean;
          applicationId: string;
        };
      };

      const result = await graphqlRequest<ApplyAsGuestMutation>(
        `
          mutation ApplyAsGuest($postId: ID!, $message: String) {
            applyAsGuest(postId: $postId, message: $message) {
              success
              applicationId
            }
          }
        `,
        {
          variables: { postId, message },
          auth: true,
        }
      );

      return result.applyAsGuest;
    } catch (error: any) {
      console.error("Error applying as guest:", error);
      throw new Error(error?.message || "Failed to apply as guest");
    }
  }

  // Mock success
  return { success: true, applicationId: "app-1" };
}

