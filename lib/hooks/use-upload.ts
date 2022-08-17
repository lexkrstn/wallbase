import { useCallback, useState } from 'react';
import { parse } from 'cookie';
import { TOKEN_NAME } from '../../interfaces/constants';

interface UseUploadOptions {
  body?: Record<string, string | number>;
  name?: string;
  method?: string;
  headers?: Record<string, string>;
  useCookieToken?: boolean;
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

interface UploadOptions {
  headers?: Record<string, string>;
  body?: Record<string, string | number>;
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

export function useUpload(url: string, {
  body = {},
  name = 'file',
  method = 'POST',
  headers = {},
  useCookieToken = false,
  onError,
  onSuccess,
}: UseUploadOptions = {}) {
  const [{ uploading, error }, setState] = useState({
    uploading: false,
    error: '',
  });

  const upload = useCallback(async (file: File, uploadOptions: UploadOptions = {}) => {
    setState({
      uploading: true,
      error: '',
    });

    const formData = new FormData();
    formData.append(name, file);
    for (const key of Object.keys(body)) {
      formData.append(key, `${body[key]}`);
    }
    if (uploadOptions.body) {
      for (const key of Object.keys(uploadOptions.body)) {
        formData.append(key, `${uploadOptions.body[key]}`);
      }
    }

    const allHeaders = { ...headers };
    if (useCookieToken) {
      const cookies = parse(document.cookie);
      const token = cookies[TOKEN_NAME];
      if (token) {
        headers['Authorization'] = `Bearer ${useCookieToken}`;
      }
    }
    if (uploadOptions.headers) {
      Object.assign(allHeaders, uploadOptions.headers);
    }

    const result = await fetch(url, {
      method,
      body: formData,
      headers: allHeaders,
    });

    if (!result.ok) {
      const errorMessage = `HTTP error ${result.status} (${result.statusText})`;
      setState({
        uploading: false,
        error: errorMessage,
      });
      if (uploadOptions.onError) {
        uploadOptions.onError(new Error(errorMessage));
      }
      if (onError) {
        onError(new Error(errorMessage));
      }
      return;
    }

    setState({
      uploading: false,
      error: '',
    });

    if (uploadOptions.onSuccess) {
      uploadOptions.onSuccess();
    }
    if (onSuccess) {
      onSuccess();
    }
  }, [uploading, method, name, JSON.stringify(body), onError, onSuccess]);

  return { uploading, upload, error };
}
