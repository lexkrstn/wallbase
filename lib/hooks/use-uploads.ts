import { useCallback, useState } from 'react';
import { useUpload } from './use-upload';

export interface UploadError {
  error: string;
  file: File;
}

interface UseUploadsOptions {
  body?: Record<string, string | number>;
  name?: string;
  method?: string;
  headers?: Record<string, string>;
  useCookieToken?: boolean;
  onStarted?: (file: File) => void;
  onError?: (file: File, error: Error | string) => void;
  onSuccess?: (file: File) => void;
  onComplete?: (errors: UploadError[], successes: File[]) => void;
}

export type UploadBody = Record<string, string | number>;

export interface UploadEntity<BodyType extends {} = UploadBody> {
  file: File;
  body?: BodyType;
}

export function useUploads<BodyType extends {} = UploadBody>(url: string, {
  onError,
  onSuccess,
  onComplete,
  onStarted,
  ...options
}: UseUploadsOptions = {}) {
  const [{ uploading, errors }, setState] = useState({
    uploading: false,
    errors: [] as UploadError[],
  });

  const { upload: uploadOne } = useUpload(url, options);

  const reset = useCallback(() => {
    setState({
      uploading: false,
      errors: [],
    });
  }, []);

  const upload = useCallback(async (files: Array<UploadEntity<BodyType> | File>) => {
    if (uploading || !files.length) return;
    setState({
      uploading: true,
      errors: [],
    });
    const errors: UploadError[] = [];
    const successes: File[] = [];
    await files.reduce((promise: Promise<void>, entityOrFile) => {
      const file = entityOrFile instanceof File ? entityOrFile : entityOrFile.file;
      const body = entityOrFile instanceof File ? undefined : entityOrFile.body;
      return promise.then(() => {
        return new Promise((resolve) => {
          if (onStarted) {
            onStarted(file);
          }
          uploadOne(file, {
            body,
            onSuccess: () => {
              successes.push(file);
              if (onSuccess) {
                onSuccess(file);
              }
              resolve();
            },
            onError: err => {
              errors.push(err);
              if (onError) {
                onError(file, err);
              }
              resolve();
            },
          })
        });
      });
    }, Promise.resolve());
    setState({ errors, uploading: false });
    if (onComplete) {
      onComplete(errors, successes);
    }
  }, [uploadOne, uploading, onSuccess, onError, onComplete, onStarted]);

  return { uploading, upload, errors, reset };
}
