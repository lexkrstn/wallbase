import { FormEvent, useCallback, useState } from 'react';
import Router from 'next/router';
import { useSWRConfig } from 'swr';

const MIN_USERNAME = 3;
const MIN_PASSWORD = 5;

interface UseSignInOptions {
  redirectTo?: string;
  onLoggedIn?: (token: string) => void;
}

interface UseSignInState {
  error: string;
  token: string;
  loading: boolean;
}

export function useSignIn({ redirectTo, onLoggedIn }: UseSignInOptions = {}) {
  const [{ token, loading, error }, setState] = useState<UseSignInState>({
    error: '',
    token: '',
    loading: false,
  });

  const { mutate } = useSWRConfig();

  const setError = (message: string) => {
    setState({
      error: message,
      token: '',
      loading: false,
    });
  };

  const signIn = useCallback(async (username: string, password: string) => {
    if (loading) return;
    setState({
      error: '',
      token: '',
      loading: true,
    });
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (res.status !== 200 && res.status !== 401) {
        throw new Error(`Unexpected connection error ${res.status}`);
      }
      if (!res.ok) {
        throw new Error((await res.json()).error);
      }
      const { token } = await res.json();
      setState({
        error: '',
        token,
        loading: false,
      });
      mutate('/api/user');
      if (onLoggedIn) {
        onLoggedIn(token);
      }
      if (redirectTo) {
        Router.push(redirectTo);
      }
    } catch (err : any) {
      setError(err.message);
    }
  }, [loading]);

  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const username = (elements.namedItem('username') as HTMLInputElement).value;
    const password = (elements.namedItem('password') as HTMLInputElement).value;
    if (username.length < MIN_USERNAME) {
      setError(`Username must be at least ${MIN_USERNAME} characters long`);
      return;
    } else if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters long`);
      return;
    }
    signIn(username, password);
  }, []);

  const invalidate = useCallback(() => {
    if (error) {
      setError('');
    }
  }, [!!error]);

  return { signIn, onSubmit, token, loading, error, invalidate };
}
