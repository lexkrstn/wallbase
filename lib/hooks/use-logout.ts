import { useCallback, useState } from 'react';
import { useSWRConfig } from 'swr';
import { forgetAuthToken, getAuthTokenHeaders } from '@/lib/helpers/browser-auth-token';

export function useLogout() {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthTokenHeaders(),
      },
      body: JSON.stringify({}),
    });
    setLoading(false);
    forgetAuthToken();
    mutate('/api/user', { user: null });
  }, []);

  return { logout, loading };
}
