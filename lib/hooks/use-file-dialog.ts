import { useCallback, useEffect, useRef, useState } from 'react';

function createHiddenFileInput(mimetypes: string[], onChange: (files: File[]) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'files';
  input.multiple = true;
  input.accept = mimetypes ? mimetypes.join(',') : '*.*';
  input.addEventListener('change', () => {
    onChange(Array.prototype.slice.call(input.files ?? []));
  });

  const submit = document.createElement('button');
  submit.type = 'submit';

  const form = document.createElement('form');
  form.style.position = 'absolute';
  form.style.left = '-100000px';
  form.style.top = '0px';
  form.appendChild(input);
  form.appendChild(submit);

  document.body.appendChild(form);

  return { form, input };
}

type Data = Partial<ReturnType<typeof createHiddenFileInput>>;

interface UseFileDialogProps {
  mimetypes?: string[];
  onChange?: (files: File[]) => void;
}

export function useFileDialog({
  mimetypes = [],
  onChange = () => {},
}: UseFileDialogProps = {}) {
  const dataRef = useRef<Data>({});
  const [files, setFiles] = useState<File[]>([]);

  const open = useCallback(() => {
    if (!dataRef.current.form) {
      const { form, input } = createHiddenFileInput(mimetypes, files => {
        setFiles(files);
        onChange(files);
        dataRef.current.form?.reset();
      });
      dataRef.current.form = form;
      dataRef.current.input = input;
    }
    dataRef.current.input!.click();
  }, [...mimetypes]);

  useEffect(() => () => {
    if (dataRef.current.form) {
      document.body.removeChild(dataRef.current.form);
    }
  }, []);

  return { open, files };
}
