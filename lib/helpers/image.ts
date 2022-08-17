export interface ImageFileData {
  image: HTMLImageElement;
  width: number;
  height: number;
  file: File;
  url: string;
  dispose: () => void;
}

export function readImageFile(file: File) {
  return new Promise<ImageFileData>((resolve, reject) => {
    const image = new Image();
    try {
      image.src = URL.createObjectURL(file);
    } catch (e) {
      return reject(e);
    }
    image.onload = () => {
      resolve({
        image,
        file,
        width: image.width,
        height: image.height,
        url: image.src,
        dispose: () => URL.revokeObjectURL(image.src),
      });
    };
    image.onerror = reject;
  });
}
