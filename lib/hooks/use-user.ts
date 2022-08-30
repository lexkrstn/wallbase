import { useEffect } from 'react';
import Router from 'next/router';
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

interface UseUserOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useUser({ redirectTo, redirectIfFound }: UseUserOptions = {}) {
  const { data, error, isValidating } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: false,
  });
  const user = data?.user ?? null;
  const finished = !!data;
  const hasUser = !!user;

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return {
    user: error ? null : user,
    loading: isValidating,
  };
}
