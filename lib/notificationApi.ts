import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export interface Notification {
  id: string;
  type: "vacancy" | "match_update" | "payment" | "system";
  title: string;
  message: string;
  matchId?: string;
  read: boolean;
  createdAt: string;
}

export interface VacancySubscription {
  id: string;
  matchId: string;
  fieldName: string;
  date: string;
  time: string;
  createdAt: string;
}

// Subscribe to match vacancy
export async function subscribeToVacancy(matchId: string): Promise<VacancySubscription> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<VacancySubscription>("/notifications/vacancy/subscribe", {
        method: "POST",
        body: JSON.stringify({ matchId }),
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error subscribing to vacancy:", error);
      throw new Error(error?.message || "Failed to subscribe to vacancy");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type SubscribeVacancyMutation = {
        subscribeToVacancy: {
          _id: string;
          matchId: string;
          fieldName: string;
          date: string;
          time: string;
          createdAt: string;
        };
      };

      const data = await graphqlRequest<SubscribeVacancyMutation>(
        `
          mutation SubscribeToVacancy($matchId: ID!) {
            subscribeToVacancy(matchId: $matchId) {
              _id
              matchId
              fieldName
              date
              time
              createdAt
            }
          }
        `,
        {
          variables: { matchId },
          auth: true,
        }
      );

      const sub = data.subscribeToVacancy;
      return {
        id: sub._id,
        matchId: sub.matchId,
        fieldName: sub.fieldName,
        date: sub.date,
        time: sub.time,
        createdAt: sub.createdAt,
      };
    } catch (error: any) {
      console.error("Error subscribing to vacancy:", error);
      throw new Error(error?.message || "Failed to subscribe to vacancy");
    }
  }

  // Mock success
  return {
    id: `sub_${Date.now()}`,
    matchId,
    fieldName: "Mock Field",
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    createdAt: new Date().toISOString(),
  };
}

// Unsubscribe from vacancy
export async function unsubscribeFromVacancy(subscriptionId: string): Promise<{ success: boolean }> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<{ success: boolean }>(
        `/notifications/vacancy/${subscriptionId}/unsubscribe`,
        {
          method: "POST",
          auth: true,
        }
      );
      return data;
    } catch (error: any) {
      console.error("Error unsubscribing from vacancy:", error);
      throw new Error(error?.message || "Failed to unsubscribe from vacancy");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type UnsubscribeVacancyMutation = {
        unsubscribeFromVacancy: {
          success: boolean;
        };
      };

      const data = await graphqlRequest<UnsubscribeVacancyMutation>(
        `
          mutation UnsubscribeFromVacancy($subscriptionId: ID!) {
            unsubscribeFromVacancy(subscriptionId: $subscriptionId) {
              success
            }
          }
        `,
        {
          variables: { subscriptionId },
          auth: true,
        }
      );

      return data.unsubscribeFromVacancy;
    } catch (error: any) {
      console.error("Error unsubscribing from vacancy:", error);
      throw new Error(error?.message || "Failed to unsubscribe from vacancy");
    }
  }

  // Mock success
  return { success: true };
}

// Get my notifications (backend: myNotifications)
export async function getMyNotifications(limit = 50): Promise<Notification[]> {
  try {
    type MyNotificationsQuery = {
      myNotifications: Array<{
        _id: string;
        notificationType: string;
        title: string;
        message: string;
        status: string;
        relatedMatchId?: string;
        readAt?: string;
        createdAt: string;
      }>;
    };
    const data = await graphqlRequest<MyNotificationsQuery>(
      `
        query MyNotifications($limit: Int) {
          myNotifications(limit: $limit) {
            _id
            notificationType
            title
            message
            status
            relatedMatchId
            readAt
            createdAt
          }
        }
      `,
      { variables: { limit }, auth: true }
    );
    return (data.myNotifications || []).map((n) => ({
      id: n._id,
      type: (n.notificationType === "MATCH_REMINDER" || n.notificationType === "MATCH_INVITATION" ? "match_update" : "system") as Notification["type"],
      title: n.title,
      message: n.message,
      matchId: n.relatedMatchId,
      read: !!n.readAt,
      createdAt: n.createdAt,
    }));
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

// Get notifications (alias, uses getMyNotifications when GraphQL)
export async function getNotifications(): Promise<Notification[]> {
  return getMyNotifications();
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<{ success: boolean }> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<{ success: boolean }>(`/notifications/${notificationId}/read`, {
        method: "POST",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      throw new Error(error?.message || "Failed to mark notification as read");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type MarkReadMutation = {
        markNotificationAsRead: {
          success: boolean;
        };
      };

      const data = await graphqlRequest<MarkReadMutation>(
        `
          mutation MarkNotificationAsRead($notificationId: ID!) {
            markNotificationAsRead(notificationId: $notificationId) {
              success
            }
          }
        `,
        {
          variables: { notificationId },
          auth: true,
        }
      );

      return data.markNotificationAsRead;
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      throw new Error(error?.message || "Failed to mark notification as read");
    }
  }

  // Mock success
  return { success: true };
}

