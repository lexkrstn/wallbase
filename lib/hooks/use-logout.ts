import { useCallback, useState } from 'react';
import { useSWRConfig } from 'swr';
import { TOKEN_NAME } from '@/lib/constants';

export function useLogout() {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    setLoading(false);
    document.cookie = `${TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    mutate('/api/user', { user: null });
  }, []);

  return { logout, loading };
}
