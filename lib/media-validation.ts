export type PropertyMediaLimits = {
  maxImages: number;
  maxImageSizeMb: number;
  maxVideoSizeMb: number;
  maxVideoDurationSeconds: number;
};

export type VideoMetadata = {
  sizeMb: number;
  durationSeconds: number;
  mimeType: string;
};

const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedImageExtensions = ["jpg", "jpeg", "png", "webp"];
const allowedVideoMimeTypes = ["video/mp4"];
const allowedVideoExtensions = ["mp4"];

export function bytesFromMb(value: number) {
  return value * 1024 * 1024;
}

export function formatFileSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

export function getRoundedMb(bytes: number) {
  return Number((bytes / 1024 / 1024).toFixed(2));
}

export function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export function validateImageFile(file: File, limits: PropertyMediaLimits) {
  const extension = getFileExtension(file.name);

  if (
    !allowedImageMimeTypes.includes(file.type) ||
    !allowedImageExtensions.includes(extension)
  ) {
    return "Only JPG, JPEG, PNG, and WEBP images are allowed.";
  }

  if (file.size > bytesFromMb(limits.maxImageSizeMb)) {
    return `Each image must be ${limits.maxImageSizeMb}MB or smaller.`;
  }

  return "";
}

export function validateImageFiles(files: File[], limits: PropertyMediaLimits) {
  if (files.length > limits.maxImages) {
    return `Upload a maximum of ${limits.maxImages} images.`;
  }

  for (const file of files) {
    const error = validateImageFile(file, limits);

    if (error) {
      return error;
    }
  }

  return "";
}

export function validateVideoFile(
  file: File,
  limits: PropertyMediaLimits,
  durationSeconds?: number | null,
) {
  const extension = getFileExtension(file.name);

  if (
    !allowedVideoMimeTypes.includes(file.type) ||
    !allowedVideoExtensions.includes(extension)
  ) {
    return "Only MP4 video is allowed.";
  }

  if (file.size > bytesFromMb(limits.maxVideoSizeMb)) {
    return `Video must be ${limits.maxVideoSizeMb}MB or smaller.`;
  }

  if (
    durationSeconds === undefined ||
    durationSeconds === null ||
    !Number.isFinite(durationSeconds) ||
    durationSeconds <= 0
  ) {
    return "Could not read video duration. Please choose another MP4 file.";
  }

  if (durationSeconds > limits.maxVideoDurationSeconds) {
    return `Video must be ${limits.maxVideoDurationSeconds} seconds or shorter.`;
  }

  return "";
}

export function readClientVideoDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video duration."));
    };
    video.src = url;
  });
}

export async function readMp4DurationSeconds(file: File) {
  const buffer = await file.arrayBuffer();
  return parseMp4DurationSeconds(buffer);
}

function parseMp4DurationSeconds(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  return findMvhdDuration(view, 0, view.byteLength, 0);
}

function findMvhdDuration(
  view: DataView,
  start: number,
  end: number,
  depth: number,
): number | null {
  if (depth > 6) {
    return null;
  }

  let offset = start;

  while (offset + 8 <= end) {
    let size = view.getUint32(offset);
    const type = readAscii(view, offset + 4, 4);
    let headerSize = 8;

    if (size === 1 && offset + 16 <= end) {
      size = Number(view.getBigUint64(offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }

    if (size < headerSize || offset + size > end) {
      break;
    }

    const bodyStart = offset + headerSize;
    const bodyEnd = offset + size;

    if (type === "mvhd") {
      return readMvhdDuration(view, bodyStart, bodyEnd);
    }

    if (
      type === "moov" ||
      type === "trak" ||
      type === "mdia" ||
      type === "minf"
    ) {
      const duration = findMvhdDuration(view, bodyStart, bodyEnd, depth + 1);

      if (duration !== null) {
        return duration;
      }
    }

    offset += size;
  }

  return null;
}

function readMvhdDuration(view: DataView, start: number, end: number) {
  if (start + 20 > end) {
    return null;
  }

  const version = view.getUint8(start);

  if (version === 1) {
    if (start + 32 > end) {
      return null;
    }

    const timescale = view.getUint32(start + 20);
    const duration = Number(view.getBigUint64(start + 24));
    return timescale > 0 ? duration / timescale : null;
  }

  const timescale = view.getUint32(start + 12);
  const duration = view.getUint32(start + 16);
  return timescale > 0 ? duration / timescale : null;
}

function readAscii(view: DataView, start: number, length: number) {
  let value = "";

  for (let index = 0; index < length; index += 1) {
    value += String.fromCharCode(view.getUint8(start + index));
  }

  return value;
}
