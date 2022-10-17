import { useState } from 'react';
import { ReportCreateDto } from '@/entities/report';
import { getAuthTokenHeaders } from '@/lib/helpers/browser-auth-token';

async function requestPostReport(dto: ReportCreateDto) {
  const res = await fetch(`/api/wallpapers/${dto.wallpaperId}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthTokenHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    if (res.status === 400 || res.status === 409) {
      const json = await res.json();
      throw new Error(json.error);
    }
    throw new Error(`Failed to file report: ${res.status}`);
  }
}

interface Options {
  onError?: (err: string) => void;
  onSuccess?: () => void;
  onComplete?: (err: string | null) => void;
}

export function usePostReport({ onComplete, onError, onSuccess }: Options) {
  const [{ error, processing }, setState] = useState({
    error: '',
    processing: false,
  });

  const invalidate = () => {
    setState({
      error: '',
      processing: false,
    });
  };

  const setError = (error: string) => {
    setState({
      processing: false,
      error,
    });
  };

  const post = async (dto: ReportCreateDto) => {
    setState({
      processing: true,
      error: '',
    });
    try {
      await requestPostReport(dto);
      invalidate();
      if (onSuccess) onSuccess();
      if (onComplete) onComplete(null);
    } catch (err) {
      const error = err instanceof Error ? err.message : `${err}`;
      setError(error);
      if (onError) onError(error);
      if (onComplete) onComplete(error);
    }
  };

  return { error, processing, post, invalidate, setError };
}
