import { graphqlRequest } from "./graphqlClient";

// -------------------- CLIENT-SIDE TTL CACHE --------------------
// Navigation paytida homepage qayta mont bo‘ladi va match list yana fetch bo‘lib qoladi.
// `graphqlRequest` Apollo cache’dan foydalanmaganligi uchun, tezlikni oshirish uchun
// shu joyda qisqa TTL bilan in-memory cache qo‘yamiz.
const DEBUG_MATCH_LIST_CACHE =
  process.env.NEXT_PUBLIC_DEBUG_MATCH_LIST_CACHE === "true";

const MATCH_LIST_CACHE_TTL_MS = parseInt(
  process.env.NEXT_PUBLIC_MATCH_LIST_CACHE_TTL_MS ?? "10000",
  10
);

type CacheEntry<T> = { value: T; expiresAt: number };
const matchListCache = new Map<string, CacheEntry<any>>();

function getCache<T>(key: string): T | null {
  const entry = matchListCache.get(key);
  if (!entry) {
    if (DEBUG_MATCH_LIST_CACHE) console.log(`[MatchApi cache] MISS (no entry) key=${key}`);
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    matchListCache.delete(key);
    if (DEBUG_MATCH_LIST_CACHE) console.log(`[MatchApi cache] MISS (expired) key=${key}`);
    return null;
  }
  if (DEBUG_MATCH_LIST_CACHE) console.log(`[MatchApi cache] HIT key=${key}`);
  return entry.value as T;
}

function setCache<T>(key: string, value: T): void {
  if (DEBUG_MATCH_LIST_CACHE) console.log(`[MatchApi cache] SET key=${key} ttlMs=${MATCH_LIST_CACHE_TTL_MS}`);
  matchListCache.set(key, { value, expiresAt: Date.now() + MATCH_LIST_CACHE_TTL_MS });
}

function clearMatchListCache(): void {
  if (DEBUG_MATCH_LIST_CACHE) console.log(`[MatchApi cache] CLEAR all match list cache`);
  matchListCache.clear();
}

function getAuthCacheKeyPart(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("token") ?? "";
  } catch {
    return "";
  }
}

// ==================== TYPES ====================

export type MatchStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type MatchType = 'FRIENDLY' | 'TOURNAMENT' | 'LEAGUE';

export interface MatchLocation {
  address?: string;
  city?: string;
  district?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

// Populated Property
export interface MatchField {
  _id: string;
  propertyName: string;
  propertyDescription?: string;
  location: {
    address: string;
    city: string;
    district?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  amenities?: string[];
  images?: string[];
  hourlyRate?: number;
  rating?: {
    average: number;
    count: number;
  };
}

// Populated Member
export interface MatchMember {
  _id: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: string;
  memberSkillLevel?: string;
}

export interface Match {
  _id: string;
  matchTitle: string;
  matchDescription?: string;
  matchType: MatchType;
  matchStatus: MatchStatus;
  fieldId: string | MatchField;
  // Some DB records may have `organizerId` missing.
  // Upstream GraphQL schema currently declares it non-nullable, which can break list queries.
  // For list views we may intentionally not request it (see `MATCH_HOME_LIST`).
  organizerId?: string | MatchMember;
  matchDate: string;
  matchTime: string;
  duration?: number;
  maxPlayers: number;
  currentPlayers: number;
  joinedPlayers: (string | MatchMember)[];
  checkedInPlayers?: (string | MatchMember)[];
  matchFee?: number;
  skillLevel?: string;
  gender?: string;
  location?: MatchLocation;
  matchImage?: string;
  images?: string[];
  views: number;
  likes: number;
  likedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== HELPERS ====================

export function getFieldData(match: Match): MatchField | null {
  if (typeof match.fieldId === 'object' && match.fieldId !== null) {
    return match.fieldId as MatchField;
  }
  return null;
}

export function getOrganizer(match: Match): MatchMember | null {
  if (typeof match.organizerId === 'object' && match.organizerId !== null) {
    return match.organizerId as MatchMember;
  }
  return null;
}

export function getJoinedMembers(match: Match): MatchMember[] {
  return (match.joinedPlayers || []).filter(
    (p): p is MatchMember => typeof p === 'object' && p !== null
  );
}

/** Check if a user (by member id) is in the match's joined list. Handles both populated objects and raw IDs. */
export function isUserJoined(match: Match, userId: string | undefined): boolean {
  if (!userId) return false;
  const id = String(userId);
  const list = match.joinedPlayers || [];
  return list.some((p) => {
    if (typeof p === 'string') return String(p) === id;
    if (typeof p === 'object' && p !== null && '_id' in p) return String((p as MatchMember)._id) === id;
    return false;
  });
}

// ==================== GRAPHQL FRAGMENTS ====================

const MATCH_FIELDS = `
  _id
  matchTitle
  matchDescription
  matchType
  matchStatus
  matchDate
  matchTime
  duration
  maxPlayers
  currentPlayers
  matchFee
  skillLevel
  matchImage
  images
  views
  likes
  location {
    address
    city
    district
    coordinates {
      lat
      lng
    }
  }
  createdAt
  updatedAt
`;

const MATCH_WITH_RELATIONS = `
  ${MATCH_FIELDS}
  fieldId {
    _id
    propertyName
    propertyDescription
    location {
      address
      city
      district
      coordinates {
        lat
        lng
      }
    }
    amenities
    images
    hourlyRate
    rating {
      average
      count
    }
  }
  organizerId {
    _id
    memberNick
    memberFullName
    memberImage
    memberSkillLevel
  }
  joinedPlayers {
    _id
    memberNick
    memberFullName
    memberImage
    memberSkillLevel
  }
  checkedInPlayers {
    _id
    memberNick
    memberFullName
    memberImage
    memberSkillLevel
  }
  likedBy
`;

/** Bosh sahifa ro‘yxati: kamroq maydon — backendda populate/rating xatolari bilan 500 bo‘lishini kamaytirish */
const MATCH_HOME_LIST = `
  ${MATCH_FIELDS}
  fieldId {
    _id
    propertyName
    location {
      address
      city
      district
      coordinates {
        lat
        lng
      }
    }
  }
  joinedPlayers {
    _id
    memberNick
    memberFullName
    memberImage
    memberSkillLevel
  }
  likedBy
`;

// ==================== QUERIES ====================

/**
 * 💡 STRICT GRAPHQL ONLY. NO MOCKS.
 */

/** Qidiruv sahifasi: `getMatches` bilan bir xil, nomi qidiruv uchun. */
export async function searchMatches(filters: {
  city?: string;
  district?: string;
  limit?: number;
  skip?: number;
}): Promise<Match[]> {
  return getMatches({
    city: filters.city,
    district: filters.district,
    limit: filters.limit ?? 20,
    skip: filters.skip ?? 0,
  });
}

export async function getMatches(filters?: {
  status?: MatchStatus;
  city?: string;
  district?: string;
  date?: string;
  limit?: number;
  skip?: number;
}): Promise<Match[]> {
  console.log("MatchApi: getMatches called", filters);
  try {
    const cacheKey = `getMatches:${JSON.stringify(filters ?? {})}`;
    const cached = getCache<Match[]>(cacheKey);
    if (cached) return cached;

    const data = await graphqlRequest<{ matches: Match[] }>(
      `
        query GetMatches(
          $status: MatchStatus,
          $city: String,
          $district: String,
          $date: DateTime,
          $limit: Float,
          $skip: Float
        ) {
          matches(
            status: $status,
            city: $city,
            district: $district,
            date: $date,
            limit: $limit,
            skip: $skip
          ) {
            ${MATCH_HOME_LIST}
          }
        }
      `,
      {
        variables: {
          status: filters?.status,
          city: filters?.city,
          district: filters?.district,
          date: filters?.date ? new Date(filters.date) : undefined,
          limit: filters?.limit,
          skip: filters?.skip,
        },
      }
    );
    const result = data.matches || [];
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("MatchApi: Error fetching matches:", error);
    return [];
  }
}

export async function getMatchDetails(matchId: string): Promise<Match> {
  console.log("MatchApi: getMatchDetails called", matchId);
  const data = await graphqlRequest<{ match: Match }>(
    `
      query GetMatch($id: ID!) {
        match(id: $id) {
          ${MATCH_WITH_RELATIONS}
        }
      }
    `,
    {
      variables: { id: matchId },
    }
  );

  if (!data.match) {
    throw new Error("Match topilmadi");
  }

  return data.match;
}

export async function getUpcomingMatches(limit: number = 10): Promise<Match[]> {
  try {
    const cacheKey = `upcomingMatches:${limit}`;
    const cached = getCache<Match[]>(cacheKey);
    if (cached) return cached;

    const data = await graphqlRequest<{ upcomingMatches: Match[] }>(
      `
        query GetUpcomingMatches($limit: Float) {
          upcomingMatches(limit: $limit) {
            ${MATCH_WITH_RELATIONS}
          }
        }
      `,
      {
        variables: { limit },
      }
    );
    const result = data.upcomingMatches || [];
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("MatchApi: Error fetching upcoming matches:", error);
    return [];
  }
}

export async function getMyMatches(): Promise<Match[]> {
  try {
    const cacheKey = `myMatches:${getAuthCacheKeyPart()}`;
    const cached = getCache<Match[]>(cacheKey);
    if (cached) return cached;

    const data = await graphqlRequest<{ myMatches: Match[] }>(
      `
        query GetMyMatches {
          myMatches {
            ${MATCH_WITH_RELATIONS}
          }
        }
      `,
      { auth: true }
    );
    const result = data.myMatches || [];
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("MatchApi: Error fetching my matches:", error);
    return [];
  }
}

export async function getMyJoinedMatches(): Promise<Match[]> {
  try {
    const cacheKey = `myJoinedMatches:${getAuthCacheKeyPart()}`;
    const cached = getCache<Match[]>(cacheKey);
    if (cached) return cached;

    const data = await graphqlRequest<{ myJoinedMatches: Match[] }>(
      `
        query GetMyJoinedMatches {
          myJoinedMatches {
            ${MATCH_WITH_RELATIONS}
          }
        }
      `,
      { auth: true }
    );
    const result = data.myJoinedMatches || [];
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("MatchApi: Error fetching joined matches:", error);
    return [];
  }
}

// ==================== MUTATIONS ====================

export async function createMatch(input: {
  matchTitle: string;
  fieldId?: string;
  address?: string;
  matchDate: string;
  matchTime: string;
  maxPlayers?: number;
  duration?: number;
  matchType?: MatchType;
  matchDescription?: string;
  matchFee?: number;
  skillLevel?: string;
  matchImage?: string;
  images?: string[];
}): Promise<Match> {
  console.log("MatchApi: createMatch called", input);
  const data = await graphqlRequest<{ createMatch: Match }>(
    `
      mutation CreateMatch($input: CreateMatchInput!) {
        createMatch(input: $input) {
          ${MATCH_FIELDS}
        }
      }
    `,
    {
      variables: {
        input: {
          matchTitle: input.matchTitle,
          matchDescription: input.matchDescription,
          matchType: input.matchType,
          fieldId: input.fieldId,
          address: input.address,
          matchDate: new Date(input.matchDate).toISOString(),
          matchTime: input.matchTime,
          maxPlayers: input.maxPlayers ? Math.round(Number(input.maxPlayers)) : undefined,
          duration: input.duration ? Math.round(Number(input.duration)) : undefined,
          matchFee: input.matchFee !== undefined ? Number(input.matchFee) : undefined,
          skillLevel: input.skillLevel,
          matchImage: input.matchImage || undefined,
          images: input.images?.length ? input.images : undefined,
        },
      },
      auth: true,
    }
  );

  clearMatchListCache();
  return data.createMatch;
}

export async function joinMatch(matchId: string): Promise<Match> {
  const data = await graphqlRequest<{ joinMatch: Match }>(
    `
      mutation JoinMatch($matchId: ID!) {
        joinMatch(matchId: $matchId) {
          _id
          currentPlayers
        }
      }
    `,
    {
      variables: { matchId },
      auth: true,
    }
  );

  clearMatchListCache();
  return data.joinMatch;
}

export async function leaveMatch(matchId: string): Promise<Match> {
  const data = await graphqlRequest<{ leaveMatch: Match }>(
    `
      mutation LeaveMatch($matchId: ID!) {
        leaveMatch(matchId: $matchId) {
          _id
          currentPlayers
        }
      }
    `,
    {
      variables: { matchId },
      auth: true,
    }
  );

  clearMatchListCache();
  return data.leaveMatch;
}

export async function likeMatch(matchId: string): Promise<Match> {
  const data = await graphqlRequest<{ likeMatch: Match }>(
    `
      mutation LikeMatch($matchId: ID!) {
        likeMatch(matchId: $matchId) {
          _id
          likes
          likedBy
        }
      }
    `,
    {
      variables: { matchId },
      auth: true,
    }
  );

  clearMatchListCache();
  return data.likeMatch;
}

export async function deleteMatch(matchId: string): Promise<boolean> {
  const data = await graphqlRequest<{ deleteMatch: boolean }>(
    `
      mutation DeleteMatch($id: ID!) {
        deleteMatch(id: $id)
      }
    `,
    {
      variables: { id: matchId },
      auth: true,
    }
  );

  clearMatchListCache();
  return data.deleteMatch;
}

export async function checkIn(matchId: string, memberId: string): Promise<Match> {
  const data = await graphqlRequest<{ checkIn: Match }>(
    `
      mutation CheckIn($matchId: ID!, $memberId: ID!) {
        checkIn(matchId: $matchId, memberId: $memberId) {
          _id
          checkedInPlayers {
            _id
          }
        }
      }
    `,
    {
      variables: { matchId, memberId },
      auth: true,
    }
  );

  clearMatchListCache();
  return data.checkIn;
}
