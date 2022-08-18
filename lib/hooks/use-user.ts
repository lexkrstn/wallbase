import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import { parse } from 'cookie';
import User from '../../interfaces/user';
import { TOKEN_NAME } from '../../interfaces/constants';

interface Data {
  user: User | null;
}

const fetcher = async (url: string): Promise<Data> => {
  // Do not request if there is not token in cookies
  const token = parse(document.cookie)[TOKEN_NAME];
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
    document.cookie = `${TOKEN_NAME}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
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
