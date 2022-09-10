import { createWriteStream } from 'fs';
import gm from 'gm';

const SIMDATA_SIDE = 16;

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
  numColors = 5,
): Promise<number[]> {
  return new Promise((resolve, reject) => {
    gm(filePath).colors(numColors).setFormat('ppm').toBuffer((err, buffer) => {
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
        colors.push(Math.round(r), Math.round(g), Math.round(b));
        if (colors.length === numColors * 3) break; // 5 RGB triads
      }
      // if rgb triads < 5 copy from the beginning
      i = colors.length;
      j = 0;
      while (i < numColors * 3) {
        colors[i++] = colors[j++];
      }
      resolve(colors);
    });
  });
}

export function getImageSimdata(filePath: string) {
  return new Promise<number[]>((resolve, reject) => {
    gm(filePath)
      .resize(SIMDATA_SIDE, SIMDATA_SIDE, '!')
      .setFormat('ppm')
      .toBuffer((err, buffer) => {
        if (err) return reject(err);
        const numPixels = SIMDATA_SIDE * SIMDATA_SIDE;
        const pixelDataOffset = buffer.length - numPixels * 3;
        const luminances: number[] = [];
        let [r, g, b, luminance] = [0, 0, 0, 0];
        // Get luminance ("grayscale") data
        for (let i = 0; i < numPixels; i++) {
          r = buffer.readUInt8(pixelDataOffset + i * 3 + 0);
          g = buffer.readUInt8(pixelDataOffset + i * 3 + 1);
          b = buffer.readUInt8(pixelDataOffset + i * 3 + 2);
          luminance = Math.round((r + g + b) / 3);
          luminances.push(luminance);
        }
        // Normalize data
        resolve(luminances);
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

export function createThumbnailStream(
  filePath: string,
  width: number,
  height: number,
  stream: NodeJS.WritableStream,
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
      .stream((err, stdout) => {
        if (err) return reject(err);
        stdout
          .on('error', reject) // listen to stdout errors
          .pipe(stream)
          .on('error', reject) // listen to stream errors
          .on('finish', resolve);
      });
  });
}

export function createThumbnail(
  filePath: string,
  width: number,
  height: number,
  thumbPath: string,
  dstWidth: number,
  dstHeight: number,
) {
  const stream = createWriteStream(thumbPath, {
    encoding: 'binary',
    mode: 0o644,
  });
  return createThumbnailStream(filePath, width, height, stream, dstWidth, dstHeight);
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
  return rgb.map(c => Math.round(c / pixelCount));
}
