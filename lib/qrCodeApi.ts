import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export interface QRCode {
  id: string;
  matchId: string;
  code: string; // Base64 encoded QR code image
  url: string; // QR code data URL
  expiresAt: string;
}

export interface CheckInResponse {
  success: boolean;
  message?: string;
  checkedInAt?: string;
  isLate?: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  checkedInAt: string;
  isLate: boolean;
  status: "checked_in" | "no_show" | "late";
}

// Generate QR code for match
export async function generateQRCode(matchId: string): Promise<QRCode> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<QRCode>(`/matches/${matchId}/qr-code`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error generating QR code:", error);
      throw new Error(error?.message || "Failed to generate QR code");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type QRCodeQuery = {
        generateQRCode: {
          _id: string;
          matchId: string;
          code: string;
          url: string;
          expiresAt: string;
        };
      };

      const data = await graphqlRequest<QRCodeQuery>(
        `
          query GenerateQRCode($matchId: ID!) {
            generateQRCode(matchId: $matchId) {
              _id
              matchId
              code
              url
              expiresAt
            }
          }
        `,
        {
          variables: { matchId },
          auth: true,
        }
      );

      const qr = data.generateQRCode;
      return {
        id: qr._id,
        matchId: qr.matchId,
        code: qr.code,
        url: qr.url,
        expiresAt: qr.expiresAt,
      };
    } catch (error: any) {
      console.error("Error generating QR code:", error);
      throw new Error(error?.message || "Failed to generate QR code");
    }
  }

  // Mock QR code generation
  const qrData = `MATCH:${matchId}:${Date.now()}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  
  return {
    id: `qr_${Date.now()}`,
    matchId,
    code: qrUrl,
    url: qrUrl,
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
  };
}

// Check-in to match
export async function checkInToMatch(matchId: string, qrCode?: string): Promise<CheckInResponse> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<CheckInResponse>(`/matches/${matchId}/check-in`, {
        method: "POST",
        body: JSON.stringify({ qrCode }),
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error checking in:", error);
      throw new Error(error?.message || "Failed to check in");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type CheckInMutation = {
        checkInToMatch: {
          success: boolean;
          message?: string;
          checkedInAt?: string;
          isLate?: boolean;
        };
      };

      const data = await graphqlRequest<CheckInMutation>(
        `
          mutation CheckInToMatch($matchId: ID!, $qrCode: String) {
            checkInToMatch(matchId: $matchId, qrCode: $qrCode) {
              success
              message
              checkedInAt
              isLate
            }
          }
        `,
        {
          variables: { matchId, qrCode },
          auth: true,
        }
      );

      return data.checkInToMatch;
    } catch (error: any) {
      console.error("Error checking in:", error);
      throw new Error(error?.message || "Failed to check in");
    }
  }

  // Mock success
  const now = new Date();
  const matchTime = new Date(); // Should be match time
  matchTime.setHours(20, 0, 0, 0);
  const isLate = now > matchTime;

  return {
    success: true,
    message: isLate ? "Checked in (Late)" : "Checked in successfully",
    checkedInAt: now.toISOString(),
    isLate,
  };
}

// Get attendance list
export async function getAttendance(matchId: string): Promise<AttendanceRecord[]> {
  const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (hasRestBackend) {
    try {
      const data = await apiRequest<AttendanceRecord[]>(`/matches/${matchId}/attendance`, {
        method: "GET",
        auth: true,
      });
      return data;
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      throw new Error(error?.message || "Failed to fetch attendance");
    }
  }

  if (hasGraphqlBackend) {
    try {
      type AttendanceQuery = {
        attendance: Array<{
          _id: string;
          userId: string;
          userName: string;
          userAvatar?: string;
          checkedInAt: string;
          isLate: boolean;
          status: string;
        }>;
      };

      const data = await graphqlRequest<AttendanceQuery>(
        `
          query GetAttendance($matchId: ID!) {
            attendance(matchId: $matchId) {
              _id
              userId
              userName
              userAvatar
              checkedInAt
              isLate
              status
            }
          }
        `,
        {
          variables: { matchId },
          auth: true,
        }
      );

      return data.attendance.map((a) => ({
        id: a._id,
        userId: a.userId,
        userName: a.userName,
        userAvatar: a.userAvatar,
        checkedInAt: a.checkedInAt,
        isLate: a.isLate,
        status: a.status as AttendanceRecord["status"],
      }));
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      throw new Error(error?.message || "Failed to fetch attendance");
    }
  }

  // Mock data
  return [];
}

