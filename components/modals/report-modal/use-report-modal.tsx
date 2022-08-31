import { FormEvent, useCallback, useState } from 'react';
import { ReportType } from '@/entities/report';
import User from '@/entities/user';
import Wallpaper from '@/entities/wallpaper';
import { usePostReport } from '@/lib/hooks/use-post-report';
import ReportModal from './report-modal';

type Options = Parameters<typeof usePostReport>[0];

interface State {
  shown: boolean;
  wallpaper?: Wallpaper;
  user?: User;
}

export function useReportModal(options: Options = {}) {
  const [{ shown, wallpaper, user }, setState] = useState<State>({
    shown: false,
  });

  const { post, processing, error, invalidate, setError } = usePostReport({
    ...options,
    onSuccess: () => {
      close();
      if (options.onSuccess) {
        options.onSuccess();
      }
    },
  });

  const close = () => {
    if (processing) return;
    setState({ shown: false });
  };

  const show = (wallpaper: Wallpaper, user: User) => {
    invalidate();
    setState({
      shown: true,
      wallpaper,
      user,
    });
  };

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const message = (elements.namedItem('message') as HTMLInputElement).value;
    const duplicateId = (elements.namedItem('duplicateId') as HTMLInputElement)?.value;
    const type = (elements.namedItem('type') as HTMLInputElement).value as ReportType;
    if (!type) {
      setError('Please, select the reason.');
      return;
    }
    if (type === 'other' && !message) {
      setError('Please, describe your complaint.');
      return;
    }
    if (duplicateId === wallpaper!.id) {
      setError('The duplicate wallpaper ID cannot equals to the ID of the wallpaper itself.');
      return;
    }
    if (type === 'duplicate' && !duplicateId.trim()) {
      setError('Please, provide the duplicate ID.');
      return;
    }
    if (type === 'rule' && !message.trim()) {
      setError('Please, indicate the violated rule.');
      return;
    }
    if (type === 'copyright' && !message.trim()) {
      setError('Please, give us more information about this.');
      return;
    }
    invalidate();
    post({
      message,
      wallpaperId: wallpaper!.id,
      duplicateId,
      userId: user!.id,
      type,
    });
  }, [wallpaper?.id, user?.id]);

  const jsx = (
    <ReportModal
      shown={shown}
      onClose={close}
      onSubmit={handleSubmit}
      wallpaper={wallpaper}
      busy={processing}
      error={error}
      onInputChange={invalidate}
    />
  );

  return { shown, jsx, close, show, processing, error };
}
