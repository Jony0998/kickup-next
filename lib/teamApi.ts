import { graphqlRequest } from "./graphqlClient";

// Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  captainId: string;
  captainName: string;
  ownerId?: string;
  members: TeamMember[];
  createdAt: string;
  stats: TeamStats;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: "owner" | "captain" | "member";
  joinedAt: string;
  level: string;
  manner: "good" | "normal" | "bad";
}

export interface TeamStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalGoals: number;
  totalGoalsAgainst: number;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  inviterId: string;
  inviterName: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface UpdateTeamInput {
  teamName?: string;
  teamDescription?: string;
  teamLogo?: string;
  teamBanner?: string;
  maxMembers?: number;
  city?: string;
  district?: string;
  lat?: number;
  lng?: number;
  teamColor?: string;
  teamColorSecondary?: string;
}

/**
 * 💡 NO MOCKS ALLOWED. THIS API IS NOW STRICTLY GRAPHQL.
 */

export interface CreateTeamOptions {
  logo?: string;
  banner?: string;
}

// Create team
export async function createTeam(
  name: string,
  description?: string,
  options?: CreateTeamOptions,
): Promise<Team> {
  console.log("TeamApi: createTeam (REAL ONLY) called", { name, hasLogo: !!options?.logo });

  try {
    type CreateTeamMutation = {
      createTeam: {
        id: string;
        teamName: string;
        teamDescription?: string;
        teamLogo?: string;
        captainId: string;
        members: Array<{
          memberId: string;
          memberNick: string;
          memberFullName: string;
          memberImage?: string;
          role: string;
          joinedAt: string;
          position: string;
          jerseyNumber: number;
        }>;
        createdAt: string;
        statistics: {
          totalMatches: number;
          wins: number;
          losses: number;
          draws: number;
          goalsFor: number;
          goalsAgainst: number;
        };
      };
    };

    const input: { teamName: string; teamDescription?: string; teamLogo?: string; teamBanner?: string } = {
      teamName: name,
      teamDescription: description || undefined,
    };
    if (options?.logo) input.teamLogo = options.logo;
    if (options?.banner) input.teamBanner = options.banner;

    const data = await graphqlRequest<CreateTeamMutation>(
      `
        mutation CreateTeam($input: CreateTeamInput!) {
          createTeam(input: $input) {
            id: _id
            teamName
            teamDescription
            teamLogo
            captainId
            createdAt
          }
        }
      `,
      {
        variables: { input },
        auth: true,
      }
    );

    const team = data.createTeam;
    return {
      id: team.id,
      name: team.teamName,
      description: team.teamDescription,
      logo: team.teamLogo,
      captainId: team.captainId,
      captainName: "Unknown",
      members: [], // Members may not be returned immediately in creation
      createdAt: team.createdAt,
      stats: {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        totalGoals: 0,
        totalGoalsAgainst: 0,
      },
    };
  } catch (error: any) {
    console.error("TeamApi: createTeam CRITICAL ERROR:", error);
    throw error;
  }
}

// Get team by ID
export async function getTeam(teamId: string): Promise<Team> {
  console.log("TeamApi: getTeam (REAL ONLY) called", { teamId });

  try {
    type TeamQuery = {
      team: {
        _id: string;
        teamName: string;
        teamDescription?: string;
        teamLogo?: string;
        captainId: string;
        ownerId: string;
        members: Array<{
          memberId: string;
          memberNick: string;
          memberFullName: string;
          memberImage?: string;
          role: string;
          joinedAt: string;
          position: string;
          jerseyNumber: number;
        }>;
        createdAt: string;
        statistics: {
          totalMatches: number;
          wins: number;
          losses: number;
          draws: number;
          goalsFor: number;
          goalsAgainst: number;
        };
      };
    };

    const data = await graphqlRequest<TeamQuery>(
      `
        query GetTeam($id: ID!) {
          team(id: $id) {
            _id
            teamName
            teamDescription
            teamLogo
            captainId
            ownerId
            members {
              memberId
              memberNick
              memberFullName
              memberImage
              role
              joinedAt
              position
              jerseyNumber
            }
            createdAt
            statistics {
              totalMatches
              wins
              losses
              draws
              goalsFor
              goalsAgainst
            }
          }
        }
      `,
      {
        variables: { id: teamId },
        auth: true,
      }
    );

    const team = data.team;
    return {
      id: team._id,
      name: team.teamName,
      description: team.teamDescription,
      logo: team.teamLogo,
      captainId: team.captainId,
      captainName: "Unknown",
      ownerId: team.ownerId,
      members: team.members.map((m) => ({
        id: m.memberId,
        name: m.memberNick || m.memberFullName || "Unknown",
        avatar: m.memberImage,
        role: m.role.toLowerCase() as "owner" | "captain" | "member",
        joinedAt: m.joinedAt,
        level: "Rookie",
        manner: "good",
      })),
      createdAt: team.createdAt,
      stats: {
        ...team.statistics,
        winRate: 0,
        totalGoals: team.statistics.goalsFor,
        totalGoalsAgainst: team.statistics.goalsAgainst,
      },
    };
  } catch (error: any) {
    console.error("TeamApi: getTeam CRITICAL ERROR:", error);
    throw error;
  }
}

// Get all teams (no auth required)
export async function getTeams(filters?: {
  city?: string;
  status?: string;
  limit?: number;
  skip?: number;
}): Promise<Team[]> {
  try {
    type TeamsQuery = {
      teams: Array<{
        _id: string;
        teamName: string;
        teamDescription?: string;
        teamLogo?: string;
        captainId: string;
        members: Array<{
          memberId: string;
          memberNick: string;
          memberFullName: string;
          memberImage?: string;
          role: string;
          joinedAt: string;
          position: string;
          jerseyNumber: number;
        }>;
        createdAt: string;
        statistics: {
          totalMatches: number;
          wins: number;
          losses: number;
          draws: number;
          goalsFor: number;
          goalsAgainst: number;
        };
      }>;
    };

    const data = await graphqlRequest<TeamsQuery>(
      `
        query Teams($city: String, $status: TeamStatus, $limit: Int, $skip: Int) {
          teams(city: $city, status: $status, limit: $limit, skip: $skip) {
            _id
            teamName
            teamDescription
            teamLogo
            captainId
            members {
              memberId
              memberNick
              memberFullName
              memberImage
              role
              joinedAt
              position
              jerseyNumber
            }
            createdAt
            statistics {
              totalMatches
              wins
              losses
              draws
              goalsFor
              goalsAgainst
            }
          }
        }
      `,
      {
        variables: {
          city: filters?.city ?? undefined,
          status: filters?.status ?? undefined,
          limit: filters?.limit ?? 50,
          skip: filters?.skip ?? 0,
        },
        auth: false,
      }
    );

    const list = data.teams || [];
    return list
      .filter((t): t is NonNullable<typeof t> => t != null)
      .map((team) => {
        const s = team?.statistics;
        const id = team?._id;
        return {
          id: id != null ? String(id) : "",
          name: (team?.teamName ?? "") as string,
          description: team?.teamDescription ?? undefined,
          logo: team?.teamLogo ?? undefined,
          captainId: team?.captainId != null ? String(team.captainId) : "",
          captainName: "Unknown",
          members: (team?.members || []).map((m) => {
            const mid = m?.memberId;
            const role = m?.role;
            return {
              id: mid != null ? String(mid) : "",
              name: (m?.memberNick || m?.memberFullName || "Unknown") as string,
              avatar: m?.memberImage,
              role: (role != null && typeof role === "string" ? role.toLowerCase() : "member") as "owner" | "captain" | "member",
              joinedAt: (m?.joinedAt ?? "") as string,
              level: "Rookie",
              manner: "good",
            };
          }),
          createdAt: (team?.createdAt ?? "") as string,
          stats: {
            totalMatches: s?.totalMatches ?? 0,
            wins: s?.wins ?? 0,
            losses: s?.losses ?? 0,
            draws: s?.draws ?? 0,
            winRate: 0,
            totalGoals: s?.goalsFor ?? 0,
            totalGoalsAgainst: s?.goalsAgainst ?? 0,
          },
        };
      });
  } catch (error: any) {
    console.error("TeamApi: getTeams error:", error);
    throw error;
  }
}

// Get user teams
export async function getMyTeams(): Promise<Team[]> {
  console.log("TeamApi: getMyTeams (REAL ONLY) called");

  try {
    type MyTeamsQuery = {
      myTeams: Array<{
        _id: string;
        teamName: string;
        teamDescription?: string;
        teamLogo?: string;
        captainId: string;
        members: Array<{
          memberId: string;
          memberNick: string;
          memberFullName: string;
          memberImage?: string;
          role: string;
          joinedAt: string;
          position: string;
          jerseyNumber: number;
        }>;
        createdAt: string;
        statistics: {
          totalMatches: number;
          wins: number;
          losses: number;
          draws: number;
          goalsFor: number;
          goalsAgainst: number;
        };
      }>;
    };

    const data = await graphqlRequest<MyTeamsQuery>(
      `
        query MyTeams {
          myTeams {
            _id
            teamName
            teamDescription
            teamLogo
            captainId
            members {
              memberId
              memberNick
              memberFullName
              memberImage
              role
              joinedAt
              position
              jerseyNumber
            }
            createdAt
            statistics {
              totalMatches
              wins
              losses
              draws
              goalsFor
              goalsAgainst
            }
          }
        }
      `,
      {
        auth: true,
      }
    );

    return data.myTeams.map((team) => ({
      id: team._id,
      name: team.teamName,
      description: team.teamDescription,
      logo: team.teamLogo,
      captainId: team.captainId,
      captainName: "Unknown",
      members: team.members.map((m) => ({
        id: m.memberId,
        name: m.memberNick || m.memberFullName || "Unknown",
        avatar: m.memberImage,
        role: m.role.toLowerCase() as "owner" | "captain" | "member",
        joinedAt: m.joinedAt,
        level: "Rookie",
        manner: "good",
      })),
      createdAt: team.createdAt,
      stats: {
        ...team.statistics,
        winRate: 0,
        totalGoals: team.statistics.goalsFor,
        totalGoalsAgainst: team.statistics.goalsAgainst,
      },
    }));
  } catch (error: any) {
    console.error("TeamApi: getMyTeams CRITICAL ERROR:", error);
    return [];
  }
}

// Invite member to team
export async function inviteTeamMember(teamId: string, userId: string): Promise<TeamInvitation> {
  try {
    type InviteMemberMutation = {
      inviteTeamMember: {
        _id: string;
        teamId: string;
        teamName: string;
        inviterId: string;
        inviterName: string;
        status: string;
        createdAt: string;
      };
    };

    const data = await graphqlRequest<InviteMemberMutation>(
      `
        mutation InviteTeamMember($teamId: ID!, $userId: ID!) {
          inviteTeamMember(teamId: $teamId, userId: $userId) {
            _id
            teamId
            teamName
            inviterId
            inviterName
            status
            createdAt
          }
        }
      `,
      {
        variables: { teamId, userId },
        auth: true,
      }
    );

    const inv = data.inviteTeamMember;
    return {
      id: inv._id,
      teamId: inv.teamId,
      teamName: inv.teamName,
      inviterId: inv.inviterId,
      inviterName: inv.inviterName,
      status: inv.status as TeamInvitation["status"],
      createdAt: inv.createdAt,
    };
  } catch (error: any) {
    console.error("TeamApi: inviteTeamMember CRITICAL ERROR:", error);
    throw error;
  }
}

// Join team
export async function joinTeam(teamId: string): Promise<{ success: boolean; message?: string }> {
  try {
    type JoinTeamMutation = {
      joinTeam: {
        success: boolean;
        message?: string;
      };
    };

    const data = await graphqlRequest<JoinTeamMutation>(
      `
        mutation JoinTeam($teamId: ID!) {
          joinTeam(teamId: $teamId) {
            success
            message
          }
        }
      `,
      {
        variables: { teamId },
        auth: true,
      }
    );

    return data.joinTeam;
  } catch (error: any) {
    console.error("TeamApi: joinTeam CRITICAL ERROR:", error);
    throw error;
  }
}

// Leave team
export async function leaveTeam(teamId: string): Promise<{ success: boolean; message?: string }> {
  try {
    type LeaveTeamMutation = {
      leaveTeam: {
        success: boolean;
        message?: string;
      };
    };

    const data = await graphqlRequest<LeaveTeamMutation>(
      `
        mutation LeaveTeam($teamId: ID!) {
          leaveTeam(teamId: $teamId) {
            success
            message
          }
        }
      `,
      {
        variables: { teamId },
        auth: true,
      }
    );

    return data.leaveTeam;
  } catch (error: any) {
    console.error("TeamApi: leaveTeam CRITICAL ERROR:", error);
    throw error;
  }
}

// Update team
export async function updateTeam(teamId: string, input: UpdateTeamInput): Promise<Team> {
  try {
    type UpdateTeamMutation = {
      updateTeam: {
        _id: string;
        teamName: string;
        teamDescription?: string;
        teamLogo?: string;
        captainId: string;
        members: Array<{
          memberId: string;
          memberNick: string;
          memberFullName: string;
          memberImage?: string;
          role: string;
          joinedAt: string;
          position: string;
          jerseyNumber: number;
        }>;
        createdAt: string;
        statistics: {
          totalMatches: number;
          wins: number;
          losses: number;
          draws: number;
          goalsFor: number;
          goalsAgainst: number;
        };
      };
    };

    const data = await graphqlRequest<UpdateTeamMutation>(
      `
        mutation UpdateTeam($teamId: ID!, $input: UpdateTeamInput!) {
          updateTeam(teamId: $teamId, input: $input) {
            _id
            teamName
            teamDescription
            teamLogo
            captainId
            members {
              memberId
              memberNick
              memberFullName
              memberImage
              role
              joinedAt
              position
              jerseyNumber
            }
            createdAt
            statistics {
              totalMatches
              wins
              losses
              draws
              goalsFor
              goalsAgainst
            }
          }
        }
      `,
      {
        variables: { teamId, input },
        auth: true,
      }
    );

    const team = data.updateTeam;
    return {
      id: team._id,
      name: team.teamName,
      description: team.teamDescription,
      logo: team.teamLogo,
      captainId: team.captainId,
      captainName: "Unknown",
      members: team.members.map((m) => ({
        id: m.memberId,
        name: m.memberNick || m.memberFullName || "Unknown",
        avatar: m.memberImage,
        role: m.role.toLowerCase() as "owner" | "captain" | "member",
        joinedAt: m.joinedAt,
        level: "Rookie",
        manner: "good",
      })),
      createdAt: team.createdAt,
      stats: {
        ...team.statistics,
        winRate: 0,
        totalGoals: team.statistics.goalsFor,
        totalGoalsAgainst: team.statistics.goalsAgainst,
      },
    };
  } catch (error: any) {
    console.error("TeamApi: updateTeam CRITICAL ERROR:", error);
    throw error;
  }
}

// Delete team
export async function deleteTeam(teamId: string): Promise<{ success: boolean; message?: string }> {
  try {
    type DeleteTeamMutation = {
      deleteTeam: boolean;
    };

    const data = await graphqlRequest<DeleteTeamMutation>(
      `
        mutation DeleteTeam($teamId: ID!) {
          deleteTeam(teamId: $teamId)
        }
      `,
      {
        variables: { teamId },
        auth: true,
      }
    );

    return { success: data.deleteTeam };
  } catch (error: any) {
    console.error("TeamApi: deleteTeam CRITICAL ERROR:", error);
    throw error;
  }
}
