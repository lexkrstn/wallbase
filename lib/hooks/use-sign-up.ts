import { FormEvent, useCallback, useState } from 'react';
import User from '@/entities/user';
import { isValidEmail } from '@/lib/helpers/validation';

export const MIN_LOGIN = 5;
export const MIN_PASSWORD = 5;

export interface SignUpDto {
  login: string;
  email: string;
  password: string;
}

async function requestSignUp(dto: SignUpDto) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    if (res.status === 400) {
      const json = await res.json();
      throw new Error(json.error);
    }
    throw new Error(`Failed to signup: ${res.status}`);
  }
  const { token, user } = await res.json();
  return {
    user: user as User,
    token: token as string,
  };
}

interface UseSignUpOptions {
  onError?: (err: string) => void;
  onSuccess?: (user: User, token: string) => void;
  onComplete?: (err: string | null, user?: User, token?: string) => void;
}

export function useSignUp({ onComplete, onError, onSuccess }: UseSignUpOptions) {
  const [{ processing, error }, setState] = useState({
    processing: false,
    error: '',
  });

  const invalidate = () => {
    setState({
      processing: false,
      error: '',
    });
  };

  const setError = (error: string) => {
    setState({
      processing: false,
      error,
    });
  };

  const signUp = async (dto: SignUpDto) => {
    setState({
      processing: true,
      error: '',
    });
    try {
      const { user, token } = await requestSignUp(dto);
      invalidate();
      if (onSuccess) onSuccess(user, token);
      if (onComplete) onComplete(null, user, token);
    } catch (err) {
      const error = err instanceof Error ? err.message : `${err}`;
      setError(error);
      if (onError) onError(error);
      if (onComplete) onComplete(error);
    }
  };

  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const login = (elements.namedItem('login') as HTMLInputElement).value;
    const email = (elements.namedItem('email') as HTMLInputElement).value;
    const password = (elements.namedItem('password') as HTMLInputElement).value;
    if (login.length < MIN_LOGIN) {
      setError(`Login must be at least ${MIN_LOGIN} characters long`);
      return;
    } else if (!isValidEmail(email)) {
      setError('Check your email, it seems to be invalid');
      return;
    } else if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters long`);
      return;
    }
    signUp({ login, email, password });
  }, []);

  return { invalidate, signUp, processing, error, onSubmit };
}
