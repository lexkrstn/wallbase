import { useCallback, useState } from 'react';
import { parse } from 'cookie';
import { TOKEN_NAME } from '../../interfaces/constants';

type FormBody = Record<string, string | number | string[] | number[]>;

interface UseUploadOptions {
  body?: FormBody;
  name?: string;
  method?: string;
  headers?: Record<string, string>;
  useCookieToken?: boolean;
  errorFormatter?: (error: unknown, response: Response) => Promise<Error>;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

interface UploadOptions {
  headers?: Record<string, string>;
  body?: FormBody;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

function addFormBody(formData: FormData, body: FormBody) {
  for (const key of Object.keys(body)) {
    if (Array.isArray(body[key])) {
      for (const value of body[key] as string[]) {
        formData.append(key, `${value}`);
      }
    } else {
      formData.append(key, `${body[key]}`);
    }
  }
}

export function useUpload(url: string, {
  body = {},
  name = 'file',
  method = 'POST',
  headers = {},
  useCookieToken = false,
  errorFormatter = async error => error instanceof Error ? error : new Error(`${error}`),
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
    addFormBody(formData, body);
    if (uploadOptions.body) {
      addFormBody(formData, uploadOptions.body);
    }

    const allHeaders = { ...headers };
    if (useCookieToken) {
      const cookies = parse(document.cookie);
      const token = cookies[TOKEN_NAME];
      if (token) {
        allHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    if (uploadOptions.headers) {
      Object.assign(allHeaders, allHeaders, uploadOptions.headers);
    }

    const response = await fetch(url, {
      method,
      body: formData,
      headers: allHeaders,
    });

    if (!response.ok) {
      const newError = await errorFormatter(
        `HTTP error ${response.status} (${response.statusText})`,
        response,
      );
      setState({
        uploading: false,
        error: `${newError}`,
      });

      if (uploadOptions.onError) {
        uploadOptions.onError(newError);
      }
      if (onError) {
        onError(newError);
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
  }, [uploading, method, name, JSON.stringify(body), onError, onSuccess, errorFormatter]);

  return { uploading, upload, error };
}
