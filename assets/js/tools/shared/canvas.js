export function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Unable to generate the output file."));
        }
      },
      type,
      quality
    );
  });
}

export function detectTransparency(canvas) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return false;
  }

  let pixels;
  try {
    pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  } catch (error) {
    return false;
  }

  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 255) {
      return true;
    }
  }

  return false;
}
