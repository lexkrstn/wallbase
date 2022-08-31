import { useContext, useEffect } from 'react';
import Router from 'next/router';
import { SessionContext } from './use-session-provider';

interface Options {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useSession({ redirectTo, redirectIfFound }: Options = {}) {
  const session = useContext(SessionContext);
  const { finished, user } = session;

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && !!user)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, session]);

  return session;
}
