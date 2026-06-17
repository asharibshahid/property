import "server-only";

type BunnyConfig = {
  storageZone: string;
  accessKey: string;
  storageHost: string;
  cdnPublicUrl: string;
};

export function getBunnyConfig(): BunnyConfig | null {
  const storageZone = process.env.BUNNY_STORAGE_ZONE?.trim();
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY?.trim();
  const storageHost = normalizeHost(
    process.env.BUNNY_STORAGE_REGION_HOST || "storage.bunnycdn.com",
  );
  const cdnPublicUrl = normalizeBaseUrl(process.env.BUNNY_CDN_PUBLIC_URL || "");

  if (!storageZone || !accessKey || !storageHost || !cdnPublicUrl) {
    return null;
  }

  return {
    storageZone,
    accessKey,
    storageHost,
    cdnPublicUrl,
  };
}

export function safeFileName(fileName: string) {
  const fallback = "property-media";
  const normalized = fileName
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  return normalized || fallback;
}

export function createBunnyStoragePath({
  folder,
  mediaType,
  fileName,
  index,
}: {
  folder: string;
  mediaType: "images" | "video";
  fileName: string;
  index?: number;
}) {
  const timestamp = Date.now();
  const suffix = typeof index === "number" ? `-${index + 1}` : "";
  return `${folder}/${mediaType}/${timestamp}${suffix}-${safeFileName(fileName)}`;
}

export function createBunnyCdnUrl(path: string) {
  const config = getBunnyConfig();

  if (!config) {
    throw new Error("Bunny Storage/CDN is not configured.");
  }

  return `${config.cdnPublicUrl}/${path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

export async function uploadFileToBunny(file: File, path: string) {
  const config = getBunnyConfig();

  if (!config) {
    throw new Error(
      "Bunny Storage/CDN is not configured. Add Bunny environment variables first.",
    );
  }

  const endpoint = `https://${config.storageHost}/${config.storageZone}/${path}`;
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      AccessKey: config.accessKey,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Bunny upload failed (${response.status}): ${
        errorText || response.statusText || "Unknown error"
      }`,
    );
  }

  return createBunnyCdnUrl(path);
}

function normalizeHost(value: string) {
  return value.replace(/^https?:\/\//, "").replace(/\/+$/, "").trim();
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "").trim();
}
