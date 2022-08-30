import { parse } from 'cookie';
import { TOKEN_NAME } from '@/lib/constants';

export function getAuthToken() {
  return parse(document.cookie)[TOKEN_NAME];
}

export function getAuthTokenHeaders() {
  const token = getAuthToken();
  if (!token) return;
  return { Authorization: `Bearer ${token}` };
}

export function forgetAuthToken() {
  document.cookie = `${TOKEN_NAME}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}
