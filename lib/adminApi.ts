/**
 * Admin API — uses only KickUp backend GraphQL admin API.
 * Backend: adminStatistics, adminAllMembers, adminAllMatches, adminAllProperties,
 * updateMemberType, blockMember, unblockMember, deleteMember, deleteMatch, deleteProperty.
 */
import { graphqlRequest } from "./graphqlClient";

// ==================== TYPES ====================
export interface DashboardStats {
  totalMatches: number;
  activeFields: number;
  totalUsers: number;
  revenue: number;
  matchesChange: string;
  fieldsChange: string;
  usersChange: string;
  revenueChange: string;
}

export interface RecentMatch {
  id: string;
  field: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  status: string;
}

export interface Field {
  id: string;
  name: string;
  location: string;
  size: string;
  indoorOutdoor: string;
  price: number;
  status: "active" | "inactive";
}

export interface Match {
  id: string;
  field: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  status: "active" | "pending" | "completed" | "cancelled";
  gender: string;
  level: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "field_admin" | "match_admin" | "agent";
  status: "active" | "blocked";
  joinDate: string;
}

export interface Booking {
  id: string;
  fieldId: string;
  field: string;
  booker: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  amount: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";
  method: string;
  date: string;
  relatedType: "MATCH" | "BOOKING" | "LEAGUE";
}

function checkAdminAccess(): void {
  if (typeof window === "undefined") return;
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("Admin access required");
    const user = JSON.parse(userStr);
    if (user.memberType !== "ADMIN") throw new Error("Admin access required");
  } catch {
    throw new Error("Admin access required");
  }
}

// ==================== DASHBOARD (adminStatistics + adminAllMatches) ====================
export async function getDashboardStats(_filter?: { ownerId?: string }): Promise<{
  stats: DashboardStats;
  recentMatches: RecentMatch[];
}> {
  checkAdminAccess();

  type AdminStatsResult = {
    adminStatistics: {
      totalMembers: number;
      activeMembers: number;
      blockedMembers: number;
      totalMatches: number;
      totalProperties: number;
      totalBookings: number;
      totalReviews: number;
    };
    adminAllMatches: Array<{
      _id: string;
      matchTitle: string;
      matchDate: string;
      matchTime: string;
      currentPlayers: number;
      maxPlayers: number;
      matchStatus: string;
      fieldId?: { propertyName?: string };
      organizerId?: { memberNick?: string };
    }>;
  };

  const data = await graphqlRequest<AdminStatsResult>(
    `
      query AdminDashboard($matchLimit: Int) {
        adminStatistics {
          totalMembers
          activeMembers
          blockedMembers
          totalMatches
          totalProperties
          totalBookings
          totalReviews
        }
        adminAllMatches(limit: $matchLimit, skip: 0) {
          _id
          matchTitle
          matchDate
          matchTime
          currentPlayers
          maxPlayers
          matchStatus
          fieldId { propertyName }
          organizerId { memberNick }
        }
      }
    `,
    { variables: { matchLimit: 5 }, auth: true }
  );

  const s = data.adminStatistics;
  const stats: DashboardStats = {
    totalMatches: s.totalMatches,
    activeFields: s.totalProperties,
    totalUsers: s.totalMembers,
    revenue: 0,
    matchesChange: "0%",
    fieldsChange: "0",
    usersChange: "0%",
    revenueChange: "0%",
  };

  const recentMatches: RecentMatch[] = (data.adminAllMatches || []).map((m) => ({
    id: m._id,
    field: (m.fieldId as any)?.propertyName ?? "—",
    date: typeof m.matchDate === "string" ? m.matchDate.split("T")[0] : "",
    time: m.matchTime ?? "",
    participants: m.currentPlayers ?? 0,
    maxParticipants: m.maxPlayers ?? 0,
    status: m.matchStatus ?? "PENDING",
  }));

  return { stats, recentMatches };
}

// ==================== ANALYTICS (raw admin statistics) ====================
export interface AdminStatistics {
  totalMembers: number;
  activeMembers: number;
  blockedMembers: number;
  totalMatches: number;
  totalProperties: number;
  totalBookings: number;
  totalReviews: number;
}

export async function getAdminStatistics(): Promise<AdminStatistics> {
  checkAdminAccess();
  type Result = { adminStatistics: AdminStatistics };
  const data = await graphqlRequest<Result>(
    `query AdminStats {
      adminStatistics {
        totalMembers
        activeMembers
        blockedMembers
        totalMatches
        totalProperties
        totalBookings
        totalReviews
      }
    }`,
    { auth: true }
  );
  return data.adminStatistics;
}

// ==================== BOOKINGS / PAYMENTS (no admin-specific API; return empty) ====================
export async function getBookings(_filter?: { ownerId?: string }): Promise<Booking[]> {
  checkAdminAccess();
  return [];
}

export async function getPayments(_filter?: { ownerId?: string }): Promise<Payment[]> {
  checkAdminAccess();
  return [];
}

// ==================== FIELDS (adminAllProperties, deleteProperty) ====================
const PROPERTY_FIELDS = `
  _id
  propertyName
  propertyStatus
  location { address city }
  hourlyRate
`;

export async function getFields(_filter?: { ownerId?: string }): Promise<Field[]> {
  checkAdminAccess();

  type PropsResult = { adminAllProperties: Array<{ _id: string; propertyName: string; propertyStatus: string; location?: { address?: string; city?: string }; hourlyRate?: number }> };
  const data = await graphqlRequest<PropsResult>(
    `query AdminProperties { adminAllProperties(limit: 100, skip: 0) { ${PROPERTY_FIELDS} } }`,
    { auth: true }
  );

  return (data.adminAllProperties || []).map((p) => ({
    id: p._id,
    name: p.propertyName,
    location: [p.location?.address, p.location?.city].filter(Boolean).join(", ") || "—",
    size: "—",
    indoorOutdoor: "—",
    price: p.hourlyRate ?? 0,
    status: (p.propertyStatus === "ACTIVE" ? "active" : "inactive") as Field["status"],
  }));
}

export async function createField(field: Omit<Field, "id">): Promise<Field> {
  checkAdminAccess();
  throw new Error("Create property is not available via admin API. Use the main site or property API.");
}

export async function deleteField(id: string): Promise<void> {
  checkAdminAccess();

  type DelPropResult = { deleteProperty: boolean };
  await graphqlRequest<DelPropResult>(
    `mutation AdminDeleteProperty($propertyId: ID!) { deleteProperty(propertyId: $propertyId) }`,
    { variables: { propertyId: id }, auth: true }
  );
}

// ==================== MATCHES (adminAllMatches, deleteMatch) ====================
const MATCH_FIELDS = `
  _id
  matchTitle
  matchDate
  matchTime
  currentPlayers
  maxPlayers
  matchStatus
  skillLevel
  fieldId { propertyName }
  organizerId { memberNick memberFullName }
`;

export async function getMatches(_filter?: { ownerId?: string }): Promise<Match[]> {
  checkAdminAccess();

  type MatchesResult = {
    adminAllMatches: Array<{
      _id: string;
      matchTitle: string;
      matchDate: string;
      matchTime: string;
      currentPlayers: number;
      maxPlayers: number;
      matchStatus: string;
      skillLevel?: string;
      fieldId?: { propertyName?: string };
      organizerId?: { memberNick?: string };
    }>;
  };
  const data = await graphqlRequest<MatchesResult>(
    `query AdminMatches { adminAllMatches(limit: 100, skip: 0) { ${MATCH_FIELDS} } }`,
    { auth: true }
  );

  return (data.adminAllMatches || []).map((m) => ({
    id: m._id,
    field: (m.fieldId as any)?.propertyName ?? "—",
    date: typeof m.matchDate === "string" ? m.matchDate.split("T")[0] : "",
    time: m.matchTime ?? "",
    participants: m.currentPlayers ?? 0,
    maxParticipants: m.maxPlayers ?? 0,
    status: (m.matchStatus?.toLowerCase() === "upcoming" ? "pending" : m.matchStatus?.toLowerCase() || "pending") as Match["status"],
    gender: "",
    level: m.skillLevel ?? "",
  }));
}

export async function createMatch(match: {
  fieldId: string;
  field?: string;
  date: string;
  time: string;
  maxParticipants: number;
  gender: string;
  level: string;
  description?: string;
}): Promise<Match> {
  checkAdminAccess();
  throw new Error("Create match from admin panel is not implemented. Use the main site Create Match.");
}

export async function deleteMatch(id: string): Promise<void> {
  checkAdminAccess();

  type DelMatchResult = { deleteMatch: boolean };
  await graphqlRequest<DelMatchResult>(
    `mutation AdminDeleteMatch($matchId: ID!) { deleteMatch(matchId: $matchId) }`,
    { variables: { matchId: id }, auth: true }
  );
}

// ==================== USERS (adminAllMembers, updateMemberType, blockMember, unblockMember) ====================
const MEMBER_FIELDS = `
  _id
  memberNick
  memberFullName
  memberPhone
  memberType
  memberStatus
  createdAt
`;

export async function getUsers(): Promise<User[]> {
  checkAdminAccess();

  type MembersResult = { adminAllMembers: Array<{ _id: string; memberNick: string; memberFullName?: string; memberPhone: string; memberType: string; memberStatus: string; createdAt: string }> };
  const data = await graphqlRequest<MembersResult>(
    `query AdminMembers { adminAllMembers(limit: 200, skip: 0) { ${MEMBER_FIELDS} } }`,
    { auth: true }
  );

  return (data.adminAllMembers || []).map((m) => ({
    id: m._id,
    name: m.memberFullName || m.memberNick || "—",
    email: m.memberPhone || "",
    role: (m.memberType?.toLowerCase() || "user") as User["role"],
    status: (m.memberStatus === "BLOCK" ? "blocked" : "active") as User["status"],
    joinDate: m.createdAt ?? "",
  }));
}

export async function updateUserRole(id: string, role: User["role"]): Promise<User> {
  checkAdminAccess();
  if (role === "admin") throw new Error("Cannot set role to admin via API.");
  const memberType = role === "agent" ? "AGENT" : "USER";

  type UpdateResult = { updateMemberType: { _id: string; memberType: string; memberStatus: string; memberNick: string; memberFullName?: string; memberPhone: string; createdAt: string } };
  const data = await graphqlRequest<UpdateResult>(
    `mutation AdminUpdateMemberType($memberId: ID!, $memberType: MemberType!) {
      updateMemberType(memberId: $memberId, memberType: $memberType) {
        _id
        memberType
        memberStatus
        memberNick
        memberFullName
        memberPhone
        createdAt
      }
    }`,
    { variables: { memberId: id, memberType }, auth: true }
  );
  const m = data.updateMemberType;
  return {
    id: m._id,
    name: m.memberFullName || m.memberNick || "—",
    email: m.memberPhone || "",
    role: (m.memberType?.toLowerCase() || "user") as User["role"],
    status: (m.memberStatus === "BLOCK" ? "blocked" : "active") as User["status"],
    joinDate: m.createdAt ?? "",
  };
}

export async function toggleUserBlock(id: string): Promise<User> {
  checkAdminAccess();

  type MemberResult = { adminMember: { _id: string; memberStatus: string; memberNick: string; memberFullName?: string; memberPhone: string; memberType: string; createdAt: string } };
  const current = await graphqlRequest<MemberResult>(
    `query AdminMember($id: ID!) { adminMember(id: $id) { _id memberStatus memberNick memberFullName memberPhone memberType createdAt } }`,
    { variables: { id }, auth: true }
  );

  const isBlocked = current.adminMember.memberStatus === "BLOCK";

  if (isBlocked) {
    type UnblockResult = { unblockMember: { _id: string; memberStatus: string; memberNick: string; memberFullName?: string; memberPhone: string; memberType: string; createdAt: string } };
    const data = await graphqlRequest<UnblockResult>(
      `mutation AdminUnblock($memberId: ID!) { unblockMember(memberId: $memberId) { _id memberStatus memberNick memberFullName memberPhone memberType createdAt } }`,
      { variables: { memberId: id }, auth: true }
    );
    const m = data.unblockMember;
    return { id: m._id, name: m.memberFullName || m.memberNick || "—", email: m.memberPhone || "", role: (m.memberType?.toLowerCase() || "user") as User["role"], status: "active" as const, joinDate: m.createdAt ?? "" };
  } else {
    type BlockResult = { blockMember: { _id: string; memberStatus: string; memberNick: string; memberFullName?: string; memberPhone: string; memberType: string; createdAt: string } };
    const data = await graphqlRequest<BlockResult>(
      `mutation AdminBlock($memberId: ID!) { blockMember(memberId: $memberId) { _id memberStatus memberNick memberFullName memberPhone memberType createdAt } }`,
      { variables: { memberId: id }, auth: true }
    );
    const m = data.blockMember;
    return { id: m._id, name: m.memberFullName || m.memberNick || "—", email: m.memberPhone || "", role: (m.memberType?.toLowerCase() || "user") as User["role"], status: "blocked" as const, joinDate: m.createdAt ?? "" };
  }
}
