import { useState } from "react";
import { ImageFileData, readImageFile } from "../../lib/helpers/image";
import { useFileDialog } from "./use-file-dialog";

interface UseImageFileDialogProps {
  mimetypes?: string[];
  onChange?: (files: ImageFileData[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function useImageFileDialog({
  mimetypes = ['image/png', 'image/jpeg'],
  onChange = () => {},
  onLoadingChange = () => {},
}: UseImageFileDialogProps = {}) {
  const [loading, setLoading] = useState(false);
  const { open } = useFileDialog({
    mimetypes,
    onChange: async (files) => {
      setLoading(true);
      onLoadingChange(true);
      const results = await Promise.allSettled(files.map(readImageFile));
      setLoading(false);
      onLoadingChange(false);
      const images = results.filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<ImageFileData>).value);
      onChange(images);
    },
  });
  return { open, loading };
}
