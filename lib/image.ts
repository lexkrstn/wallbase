import gm from 'gm';

/**
 * Computes 5 distinctive colors for the specified image.
 *
 * @param filePath - full image file path
 * @param width - image width in pixels
 * @param height - image height in pixels
 */
export function getImageDistinctiveColors(
  filePath: string,
  width: number,
  height: number,
): Promise<number[]> {
  return new Promise((resolve, reject) => {
    gm(filePath).colors(5).setFormat('ppm').toBuffer((err, buffer) => {
      if (err) return reject(new Error(err.toString()));
      // find distinct color triads
      const colors: number[] = [];
      const byteCount = width * height * 3;
      let exists, r, g, b, i, j;
      for (i = 0; i < byteCount; i += 3) {
        r = buffer.readUInt8(buffer.length - (3 + i));
        g = buffer.readUInt8(buffer.length - (2 + i));
        b = buffer.readUInt8(buffer.length - (1 + i));
        exists = false
        for (j = 0; j < colors.length; j += 3) {
          if (colors[j] == r && colors[j + 1] == g && colors[j + 2] == b) {
            exists = true;
            break;
          }
        }
        if (exists) continue;
        colors.push(r, g, b);
        if (colors.length == 15) break; // 5 RGB triads
      }
      // if rgb triads < 5 copy from the beginning
      i = colors.length;
      j = 0;
      while (i < 15) {
        colors[i++] = colors[j++];
      }
      resolve(colors);
    });
  });
}

export function getImage4x4Pixels(filePath: string) {
  return new Promise<number[]>((resolve, reject) => {
    gm(filePath)
      .resize(4, 4, '!')
      .setFormat('ppm')
      .toBuffer((err, buffer) => {
        if (err) return reject(err);
        const size = 4 * 4 * 3;
        const offset = buffer.length - size;
        const pixels = [];
        for (let i = 0; i < size; i++) {
          pixels.push(buffer.readUInt8(offset + i));
        }
        resolve(pixels)
      });
  })
}

export function getImageAvgColor(filePath: string) {
  return new Promise<number[]>(function(resolve, reject) {
    gm(filePath)
      .resize(1, 1, '!')
      .setFormat('ppm')
      .toBuffer(function (err, buffer) {
        if (err) return reject(err);
        resolve([
          buffer.readUInt8(buffer.length - 3),
          buffer.readUInt8(buffer.length - 2),
          buffer.readUInt8(buffer.length - 1),
        ]);
      });
  })
}

export function createThumbnail(
  filePath: string,
  width: number,
  height: number,
  thumbPath: string,
  dstWidth: number,
  dstHeight: number,
) {
  const xFactor = width / dstWidth;
  const yFactor = height / dstHeight;
  const minFactor = Math.min(xFactor, yFactor);
  const srcWidth = Math.floor(dstWidth * minFactor);
  const srcHeight = Math.floor(dstHeight * minFactor);
  const x = Math.floor((width - srcWidth) / 2);
  const y = Math.floor((height - srcHeight) / 2);
  return new Promise<void>((resolve, reject) => {
    gm(filePath)
      .crop(srcWidth, srcHeight, x, y)
      .resize(dstWidth, dstHeight)
      .quality(85)
      .write(thumbPath, err => {
        if (err) return reject(err);
        resolve();
      });
  });
}

export type ImageSize = { width: number, height: number };

export function getImageSize(path: string) {
  return new Promise<ImageSize>((resolve, reject) => {
    gm(path).size((err, size) => {
      if (err) return reject(err);
      resolve(size);
    });
  });
}

export function getAvgColorOfRgbPixels(pixels: number[]): number[] {
  const rgb = [0, 0, 0];
  for (let i = 0; i < pixels.length; i++) {
    rgb[i % 3] += pixels[i];
  }
  const pixelCount = Math.floor(pixels.length / 3);
  return rgb.map(c => c / pixelCount);
}
