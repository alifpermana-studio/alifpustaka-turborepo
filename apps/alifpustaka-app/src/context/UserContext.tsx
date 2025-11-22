'use client'; // if you’re in Next.js App Router

import { UserRole, UserStatus } from '@repo/prisma-config';
import { FormDataType, Session, User, UserRoleType, UserStatusType } from 'next-auth';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

type UserContextType = {
  user: User;
  isOwner: boolean;
  status: Status;
  session: Session | null;
  error: string | null;
  formData: FormDataType;
  refreshSession: (data?: any) => Promise<Session | null>;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  updateUser: () => void;
  updating: boolean; // mutation state (instead of loading)
};

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'not-found' | 'error';

const UserContext = createContext<UserContextType | null>(null);

const address = {
  country: '',
  province: '',
  city: '',
  postCode: '',
  taxId: '',
};

const social = {
  facebook: '',
  x: '',
  linkedin: '',
  instagram: '',
};

const currentTime = new Date(Date.now());

const initRoleReq: UserRoleType = {
  reqUserRole: UserRole.USER,
  reqMsg: '',
};

const initStatusReq: UserStatusType = {
  reqUserStatus: UserStatus.ACTIVE,
  reqMsg: '',
};

const initialFormData: FormDataType = {
  id: '',
  fname: '',
  lname: '',
  email: '',
  username: '',
  address: address,
  emailVerified: currentTime,
  social: social,
  phone: '',
  image: '',
  userRole: UserRole.USER,
  userStatus: UserStatus.ACTIVE,
  roleReq: initRoleReq,
  statusReq: initStatusReq,
  bio: '',
};

const initialUser: User = {
  id: '',
  fname: '',
  lname: '',
  email: '',
  username: '',
  address: address,
  emailVerified: currentTime,
  social: social,
  phone: '',
  image: '',
  userRole: UserRole.USER,
  userStatus: UserStatus.ACTIVE,
  bio: '',
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status: sessionStatus, update: refreshSession } = useSession();
  const [isSessionUpdated, setIsSessionUpdated] = useState(false);
  const [user, setUser] = useState<User>(initialUser);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [isOwner, setIsOwner] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const pathname = usePathname();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    setError(null);
    setStatus('loading');
    console.log('Check pathname: ', pathname);

    try {
      const res = await fetch(`/api/find-user?username=${pathname.replace('/profile/', '')}`);
      const { success, data, message, error } = await res.json();

      if (success) {
        setUser(data);
        setFormData((prev) => ({ ...prev, data }));
        setStatus('authenticated');
      } else if (error === 'username-not-exist') {
        setUser(initialUser);
        setFormData(initialFormData);
        setStatus('not-found');
      } else if (error === 'session-expired') {
        setStatus('unauthenticated');
        router.push('/signin?error=session-expired');
      } else {
        setError(error ?? message ?? 'Unknown failure');
        setUser(initialUser);
        setStatus('error');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Unexpected error');
      }
      setUser(initialUser);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      const isProfile = pathname.startsWith('/profile');
      const currentUsername = isProfile
        ? pathname.replace('/profile/', '')
        : session?.user.username;
      const currentTime = Date.now();

      if (currentUsername === session?.user.username && typeof session?.user.expires === 'number') {
        if (session?.user.expires >= currentTime) {
          // 👤 Profile owner → just use session data
          console.log('Check session: ', session);
          setUser(session.user);
          setFormData((prev) => ({
            ...prev,
            ...session.user,
            roleReq: {
              ...prev.roleReq,
              reqUserRole: session.user.userRole,
            },
          }));
          setIsOwner(true);
          setStatus('authenticated');
        } else {
          setIsOwner(false);
          setStatus('unauthenticated');
          router.push('/signin?error=session-expired');
        }
      } else {
        // 👥 Visiting another user → fetch
        setIsOwner(false);
        fetchUser(); // fetchUser itself sets status="loading" at the start
      }
    } else {
      // "loading" | "unauthenticated" from next-auth
      setStatus(sessionStatus as Status);
    }
  }, [status, pathname]);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && !isSessionUpdated) {
      refreshSession();
      setIsSessionUpdated(true);
    } else {
      setStatus(sessionStatus);
    }
  }, [sessionStatus]);

  const updateUser = async () => {
    setUpdating(true);

    try {
      const res = await fetch(`/api/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      const { success, data, message, error } = await res.json();

      if (success && data && session) {
        setUser(session.user);
        setFormData((prev) => ({
          ...prev,
          ...session.user,
        }));
      } else if (error === 'session-expired') {
        setStatus('unauthenticated');
        router.push('/signin?error=session-expired');
      } else {
        setError(error ?? message ?? 'Failed to update user');
      }

      await refreshSession(); // next-auth refresh
    } catch (err) {
      console.error('updateUser error: ', err);
      setError('Unexpected update error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isOwner,
        session,

        status,
        error,
        formData,
        setFormData,
        updating,
        refreshSession,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
};
