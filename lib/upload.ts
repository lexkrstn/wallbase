import { NextApiRequest } from 'next';
import { IncomingForm, File } from 'formidable';
import CONFIG from './config';

export interface UploadedFile {
  path: string;
  newFileName: string;
  origianalFileName: string | null;
  mimetype: string | null;
  size: number;
}

export interface MultipartFormData {
  fields: Record<string, string | string[]>;
  files: Record<string, UploadedFile[]>;
}

export interface UploadMultipartFormOptions {
  addFieldsToBody?: boolean;
  uploadDir?: string;
  maxFileSize?: number;
}

export function uploadMultipartForm(req: NextApiRequest, {
  addFieldsToBody = false,
  uploadDir = CONFIG.upload.path,
  maxFileSize = CONFIG.upload.maxFileSize,
}: UploadMultipartFormOptions = {}) {
  return new Promise<MultipartFormData>((resolve, reject) => {
    const form = new IncomingForm({
      multiples: true,
      maxFileSize,
      uploadDir,
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      if (addFieldsToBody) {
        req.body = Object.assign({}, req.body, fields);
      }
      const data: MultipartFormData = {
        fields,
        files: {},
      };
      for (const name of Object.keys(files)) {
        const filesArray = Array.isArray(files[name])
          ? files[name] as File[]
          : [files[name] as File];
        data.files[name] = filesArray.map(file => ({
          path: file.filepath,
          newFileName: file.newFilename,
          origianalFileName: file.originalFilename,
          mimetype: file.mimetype,
          size: file.size,
        }));
      }
      resolve(data);
    });
  });
}
