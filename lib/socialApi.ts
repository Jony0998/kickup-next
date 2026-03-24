import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: string;
  manner: "good" | "normal" | "bad";
  status: "online" | "offline";
  mutualFriends?: number;
  friendshipStatus: "friend" | "pending" | "blocked" | "none";
}

export interface Activity {
  id: string;
  type: "match_joined" | "match_created" | "team_joined" | "achievement" | "rating";
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  matchId?: string;
  teamId?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  category: "matches" | "social" | "performance" | "special";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

// Get friends list
export async function getFriends(): Promise<Friend[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<Friend[]>("/friends", {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching friends:", error);
      throw new Error(error?.message || "Failed to fetch friends");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type FriendsQuery = {
        friends: Array<{
          _id: string;
          name: string;
          email: string;
          avatar?: string;
          level: string;
          manner: string;
          status: string;
          mutualFriends?: number;
          friendshipStatus: string;
        }>;
      };

      const data = await graphqlRequest<FriendsQuery>(
        `
          query GetFriends {
            friends {
              _id
              name
              email
              avatar
              level
              manner
              status
              mutualFriends
              friendshipStatus
            }
          }
        `,
        {
          auth: true,
        }
      );

      return data.friends.map((f) => ({
        id: f._id,
        name: f.name,
        email: f.email,
        avatar: f.avatar,
        level: f.level,
        manner: f.manner as Friend["manner"],
        status: f.status as Friend["status"],
        mutualFriends: f.mutualFriends,
        friendshipStatus: f.friendshipStatus as Friend["friendshipStatus"],
      }));
    } catch (error: any) {
      console.error("Error fetching friends:", error);
      throw new Error(error?.message || "Failed to fetch friends");
    }
  }

  // Mock data
  return [];
}

// Add friend
export async function addFriend(userId: string): Promise<{ success: boolean; message?: string }> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<{ success: boolean; message?: string }>("/friends", {
        method: "POST",
        body: JSON.stringify({ userId }),
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error adding friend:", error);
      throw new Error(error?.message || "Failed to add friend");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type AddFriendMutation = {
        addFriend: {
          success: boolean;
          message?: string;
        };
      };

      const data = await graphqlRequest<AddFriendMutation>(
        `
          mutation AddFriend($userId: ID!) {
            addFriend(userId: $userId) {
              success
              message
            }
          }
        `,
        {
          variables: { userId },
          auth: true,
        }
      );

      return data.addFriend;
    } catch (error: any) {
      console.error("Error adding friend:", error);
      throw new Error(error?.message || "Failed to add friend");
    }
  }

  // Mock success
  return { success: true, message: "Friend request sent" };
}

// Remove friend
export async function removeFriend(userId: string): Promise<{ success: boolean }> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<{ success: boolean }>(`/friends/${userId}`, {
        method: "DELETE",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error removing friend:", error);
      throw new Error(error?.message || "Failed to remove friend");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type RemoveFriendMutation = {
        removeFriend: {
          success: boolean;
        };
      };

      const data = await graphqlRequest<RemoveFriendMutation>(
        `
          mutation RemoveFriend($userId: ID!) {
            removeFriend(userId: $userId) {
              success
            }
          }
        `,
        {
          variables: { userId },
          auth: true,
        }
      );

      return data.removeFriend;
    } catch (error: any) {
      console.error("Error removing friend:", error);
      throw new Error(error?.message || "Failed to remove friend");
    }
  }

  // Mock success
  return { success: true };
}

// Get activity feed
export async function getActivityFeed(limit: number = 20): Promise<Activity[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<Activity[]>(`/activity?limit=${limit}`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching activity feed:", error);
      throw new Error(error?.message || "Failed to fetch activity feed");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type ActivityFeedQuery = {
        activityFeed: Array<{
          _id: string;
          type: string;
          userId: string;
          userName: string;
          userAvatar?: string;
          title: string;
          description: string;
          matchId?: string;
          teamId?: string;
          createdAt: string;
        }>;
      };

      const data = await graphqlRequest<ActivityFeedQuery>(
        `
          query GetActivityFeed($limit: Int) {
            activityFeed(limit: $limit) {
              _id
              type
              userId
              userName
              userAvatar
              title
              description
              matchId
              teamId
              createdAt
            }
          }
        `,
        {
          variables: { limit },
          auth: true,
        }
      );

      return data.activityFeed.map((a) => ({
        id: a._id,
        type: a.type as Activity["type"],
        userId: a.userId,
        userName: a.userName,
        userAvatar: a.userAvatar,
        title: a.title,
        description: a.description,
        matchId: a.matchId,
        teamId: a.teamId,
        createdAt: a.createdAt,
      }));
    } catch (error: any) {
      console.error("Error fetching activity feed:", error);
      throw new Error(error?.message || "Failed to fetch activity feed");
    }
  }

  // Mock data
  return [];
}

// Get achievements
export async function getAchievements(): Promise<Achievement[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<Achievement[]>("/achievements", {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      throw new Error(error?.message || "Failed to fetch achievements");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type AchievementsQuery = {
        achievements: Array<{
          _id: string;
          name: string;
          description: string;
          icon: string;
          unlockedAt?: string;
          progress?: number;
          target?: number;
          category: string;
        }>;
      };

      const data = await graphqlRequest<AchievementsQuery>(
        `
          query GetAchievements {
            achievements {
              _id
              name
              description
              icon
              unlockedAt
              progress
              target
              category
            }
          }
        `,
        {
          auth: true,
        }
      );

      return data.achievements.map((a) => ({
        id: a._id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        unlockedAt: a.unlockedAt,
        progress: a.progress,
        target: a.target,
        category: a.category as Achievement["category"],
      }));
    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      throw new Error(error?.message || "Failed to fetch achievements");
    }
  }

  // Mock data
  return [
    {
      id: "ach_1",
      name: "First Match",
      description: "Join your first match",
      icon: "🎯",
      unlockedAt: new Date().toISOString(),
      category: "matches",
    },
    {
      id: "ach_2",
      name: "Social Butterfly",
      description: "Add 10 friends",
      icon: "🦋",
      progress: 5,
      target: 10,
      category: "social",
    },
  ];
}

// Get badges
export async function getBadges(): Promise<Badge[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<Badge[]>("/badges", {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching badges:", error);
      throw new Error(error?.message || "Failed to fetch badges");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type BadgesQuery = {
        badges: Array<{
          _id: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          unlockedAt?: string;
          rarity: string;
        }>;
      };

      const data = await graphqlRequest<BadgesQuery>(
        `
          query GetBadges {
            badges {
              _id
              name
              description
              icon
              color
              unlockedAt
              rarity
            }
          }
        `,
        {
          auth: true,
        }
      );

      return data.badges.map((b) => ({
        id: b._id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        color: b.color,
        unlockedAt: b.unlockedAt,
        rarity: b.rarity as Badge["rarity"],
      }));
    } catch (error: any) {
      console.error("Error fetching badges:", error);
      throw new Error(error?.message || "Failed to fetch badges");
    }
  }

  // Mock data
  return [
    {
      id: "badge_1",
      name: "Early Bird",
      description: "Join matches early",
      icon: "🌅",
      color: "#FFD700",
      unlockedAt: new Date().toISOString(),
      rarity: "common",
    },
    {
      id: "badge_2",
      name: "Team Player",
      description: "Join a team",
      icon: "👥",
      color: "#4169E1",
      rarity: "rare",
    },
  ];
}

