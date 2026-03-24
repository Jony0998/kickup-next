import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { graphqlRequest } from '@/lib/graphqlClient';

// ==================== TYPES ====================
// Corresponds to backend enums
export type MemberType = 'USER' | 'AGENT' | 'ADMIN';
export type MemberStatus = 'ACTIVE' | 'BLOCK' | 'DELETE';
export type MemberAuthType = 'PHONE' | 'EMAIL' | 'TELEGRAM' | 'GOOGLE';

export interface User {
  id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberAuthType: MemberAuthType;
  memberSkillLevel: string;
  memberPhone: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberFollowers: number;
  memberFollowings: number;
  memberWarnings: number;
  memberBlocks: number;
  memberRank: number;
  createdAt: string;
  updatedAt: string;
  role?: UserRole;
}

// Frontend convenience fields
export type UserRole = 'user' | 'admin' | 'agent' | 'field_admin' | 'match_admin';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (loginValue: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithTelegram: (telegramUser: any) => Promise<boolean>;
  register: (phone: string, password: string, nickname: string, memberType: MemberType, fullName?: string, adminSecretKey?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Record<string, any>) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== MEMBER FRAGMENT ====================
const MEMBER_FIELDS = `
  _id
  memberType
  memberStatus
  memberAuthType
  memberSkillLevel
  memberPhone
  memberNick
  memberFullName
  memberImage
  memberAddress
  memberDesc
  memberPoints
  memberLikes
  memberViews
  memberFollowers
  memberFollowings
  memberWarnings
  memberBlocks
  memberRank
  createdAt
  updatedAt
`;

// ==================== HELPER ====================
function memberToUser(member: any): User {
  return {
    id: member._id,
    memberType: member.memberType,
    memberStatus: member.memberStatus,
    memberAuthType: member.memberAuthType,
    memberSkillLevel: member.memberSkillLevel,
    memberPhone: member.memberPhone,
    memberNick: member.memberNick,
    memberFullName: member.memberFullName || undefined,
    memberImage: (member.memberImage != null && member.memberImage !== '') ? member.memberImage : undefined,
    memberAddress: member.memberAddress || undefined,
    memberDesc: member.memberDesc || undefined,
    memberPoints: member.memberPoints || 0,
    memberLikes: member.memberLikes || 0,
    memberViews: member.memberViews || 0,
    memberFollowers: member.memberFollowers || 0,
    memberFollowings: member.memberFollowings || 0,
    memberWarnings: member.memberWarnings || 0,
    memberBlocks: member.memberBlocks || 0,
    memberRank: member.memberRank || 0,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    // Add role for backward compatibility with some components/adminApi
    role: getMemberTypeRole(member.memberType),
  };
}

function getMemberTypeRole(memberType: MemberType): UserRole {
  switch (memberType) {
    case 'ADMIN': return 'admin';
    case 'AGENT': return 'agent';
    default: return 'user';
  }
}

// ==================== PROVIDER ====================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Auto-login: check stored token and fetch current user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Try to fetch current user from backend
        type MeQuery = { me: any };
        const data = await graphqlRequest<MeQuery>(
          `query Me { me { ${MEMBER_FIELDS} } }`,
          { auth: true }
        );

        const currentUser = memberToUser(data.me);
        // Keep saved profile image on refresh/login if backend returned empty (avoid image disappearing after logout/login)
        const savedImage = (() => {
          try {
            const raw = localStorage.getItem('user');
            if (!raw) return undefined;
            const parsed = JSON.parse(raw);
            return parsed?.memberImage;
          } catch {
            return undefined;
          }
        })();
        if (savedImage && (currentUser.memberImage == null || currentUser.memberImage === '')) {
          currentUser.memberImage = savedImage;
        }
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (error) {
        console.warn('Auto-login failed, clearing stored data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ==================== LOGIN ====================
  const login = async (loginValue: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);

      const trimmedValue = loginValue.trim();

      // Basic heuristic: if it looks like a phone number (start with +, or only digits/spaces/hyphens)
      // otherwise treat it as a nickname.
      const isPhone = /^\+?[\d\s-]+$/.test(trimmedValue);

      const input: Record<string, string> = {
        memberPassword: password
      };

      if (isPhone) {
        input.memberPhone = trimmedValue.replace(/[\s-]/g, '');
      } else {
        input.memberNick = trimmedValue;
      }

      type LoginMutation = {
        login: {
          member: any;
          accessToken: string;
          refreshToken?: string;
        };
      };

      const data = await graphqlRequest<LoginMutation>(
        `mutation Login($input: LoginInput!) {
          login(input: $input) {
            member { ${MEMBER_FIELDS} }
            accessToken
            refreshToken
          }
        }`,
        { variables: { input } }
      );

      const loggedInUser = memberToUser(data.login.member);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', data.login.accessToken);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error?.message || 'Login error.' };
    } finally {
      setLoading(false);
    }
  };

  // ==================== TELEGRAM LOGIN ====================
  const loginWithTelegram = async (telegramUser: any): Promise<boolean> => {
    try {
      setLoading(true);

      const telegramData = {
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name || undefined,
        username: telegramUser.username || undefined,
        photo_url: telegramUser.photo_url || undefined,
        auth_date: telegramUser.auth_date,
        hash: telegramUser.hash,
      };

      type TelegramLoginMutation = {
        loginWithTelegram: {
          member: any;
          accessToken: string;
          refreshToken?: string;
        };
      };

      const data = await graphqlRequest<TelegramLoginMutation>(
        `mutation LoginWithTelegram($telegramData: TelegramAuthInput!) {
          loginWithTelegram(telegramData: $telegramData) {
            member { ${MEMBER_FIELDS} }
            accessToken
            refreshToken
          }
        }`,
        { variables: { telegramData } }
      );

      const loggedInUser = memberToUser(data.loginWithTelegram.member);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', data.loginWithTelegram.accessToken);

      return true;
    } catch (error: any) {
      console.error('Telegram login error:', error);
      throw new Error(error?.message || 'Telegram login error.');
    } finally {
      setLoading(false);
    }
  };

  // ==================== REGISTER ====================
  const register = async (
    phone: string,
    password: string,
    nickname: string,
    memberType: MemberType,
    fullName?: string,
    adminSecretKey?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const input: Record<string, any> = {
        memberPhone: phone.replace(/[\s-]/g, ''),
        memberPassword: password,
        memberNick: nickname,
        memberType: adminSecretKey ? 'ADMIN' : memberType,
      };

      if (fullName) input.memberFullName = fullName;
      if (adminSecretKey) {
        input.isAdmin = true;
        input.adminSecretKey = adminSecretKey;
      }

      type RegisterMutation = {
        register: {
          member: any;
          accessToken: string;
          refreshToken?: string;
        };
      };

      const data = await graphqlRequest<RegisterMutation>(
        `mutation Register($input: RegisterInput!) {
          register(input: $input) {
            member { ${MEMBER_FIELDS} }
            accessToken
            refreshToken
          }
        }`,
        { variables: { input } }
      );

      const registeredUser = memberToUser(data.register.member);
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      localStorage.setItem('token', data.register.accessToken);

      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error?.message || 'Registration error.');
    } finally {
      setLoading(false);
    }
  };

  // ==================== UPDATE PROFILE ====================
  const updateProfile = async (data: Record<string, any>): Promise<boolean> => {
    try {
      const hasGraphql = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;
      if (!hasGraphql) {
        // Mock mode: Update user in local state and localStorage
        const updatedUser = { ...user, ...data } as User;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }

      type UpdateProfileMutation = { updateProfile: any };

      const result = await graphqlRequest<UpdateProfileMutation>(
        `mutation UpdateProfile($updateData: String!) {
          updateProfile(updateData: $updateData) { ${MEMBER_FIELDS} }
        }`,
        { variables: { updateData: JSON.stringify(data) }, auth: true }
      );

      const updatedUser = memberToUser(result.updateProfile);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error?.message || 'Profile update error.');
    }
  };

  // ==================== LOGOUT ====================
  const logout = async () => {
    try {
      // Try to call backend logout (revokes refresh token)
      await graphqlRequest(
        `mutation Logout { logout }`,
        { auth: true }
      );
    } catch (error) {
      console.warn('Backend logout failed, clearing local data anyway:', error);
    }

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  // ==================== COMPUTED VALUES ====================
  const isAuthenticated = !!user;
  const isAdmin = user?.memberType === 'ADMIN';
  const isAgent = user?.memberType === 'AGENT';
  const role = user ? getMemberTypeRole(user.memberType) : 'user';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithTelegram,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        isAdmin,
        isAgent,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
