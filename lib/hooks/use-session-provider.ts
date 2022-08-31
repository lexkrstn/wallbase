import { createContext, useMemo } from 'react';
import useSWR from 'swr';
import User from '@/entities/user';
import { forgetAuthToken, getAuthToken } from '@/lib/helpers/browser-auth-token';

interface Data {
  user: User | null;
}

const fetcher = async (url: string): Promise<Data> => {
  // Do not request if there is not token in cookies
  const token = getAuthToken();
  if (!token) {
    return { user: null };
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Do not retry if status = 401
  if (res.status === 401) {
    forgetAuthToken();
    return { user: null };
  }
  const json = await res.json();
  return {
    user: json?.user ? (json.user as User) : null,
  };
};

interface SessionData {
  user: User | null;
  finished: boolean;
  loading: boolean;
  error: string;
}

export const SessionContext = createContext<SessionData>({
  user: null,
  finished: false,
  loading: false,
  error: '',
});

interface Options {
  onError?: (err: unknown) => void;
  onSuccess?: (data: SessionData) => void;
}

export function useSessionProvider({ onError, onSuccess }: Options = {}) {
  const { data, error, isValidating } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: false,
    onError,
    onSuccess: (responseData) => {
      if (onSuccess) {
        onSuccess({
          user: responseData.user,
          finished: true,
          loading: false,
          error: '',
        });
      }
    },
  });
  const user = data?.user ?? null;
  const finished = !!data;

  return useMemo<SessionData>(() => ({
    user,
    finished,
    loading: isValidating,
    error: error ? (error instanceof Error ? error.message : `${error}`) : '',
  }), [data, error, isValidating]);
}
