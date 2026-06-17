import { NextResponse } from "next/server";
import {
  createBunnyStoragePath,
  uploadFileToBunny,
} from "@/lib/bunny";
import { propertyMediaLimits } from "@/lib/constants";
import {
  getRoundedMb,
  readMp4DurationSeconds,
  validateImageFiles,
  validateVideoFile,
} from "@/lib/media-validation";

export const runtime = "nodejs";

type UploadSuccess = {
  ok: true;
  imageUrls: string[];
  video?: {
    url: string;
    sizeMb: number;
    durationSeconds: number;
    mimeType: string;
  };
};

type UploadError = {
  ok: false;
  message: string;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFiles = formData.getAll("images").filter(isUploadedFile);
    const videoFiles = formData.getAll("video").filter(isUploadedFile);

    const imageValidationError = validateImageFiles(
      imageFiles,
      propertyMediaLimits,
    );

    if (imageValidationError) {
      return jsonError(imageValidationError, 400);
    }

    if (videoFiles.length > 1) {
      return jsonError("Upload only one property video.", 400);
    }

    const propertyRef = safeFolderPart(String(formData.get("propertyRef") || ""));
    const folder = propertyRef
      ? `properties/${propertyRef}`
      : `properties/temp/${crypto.randomUUID()}`;
    const uploadedImageUrls: string[] = [];
    let uploadedVideo: UploadSuccess["video"];

    for (const [index, file] of imageFiles.entries()) {
      const path = createBunnyStoragePath({
        folder,
        mediaType: "images",
        fileName: file.name,
        index,
      });
      uploadedImageUrls.push(await uploadFileToBunny(file, path));
    }

    const videoFile = videoFiles[0];

    if (videoFile) {
      const clientDuration = Number(formData.get("videoDurationSeconds"));
      const parsedDuration = await readMp4DurationSeconds(videoFile).catch(
        () => null,
      );
      const durationSeconds =
        parsedDuration ?? (Number.isFinite(clientDuration) ? clientDuration : null);
      const videoValidationError = validateVideoFile(
        videoFile,
        propertyMediaLimits,
        durationSeconds,
      );

      if (videoValidationError) {
        return jsonError(videoValidationError, 400);
      }

      if (durationSeconds === null) {
        return jsonError("Could not read video duration.", 400);
      }

      const path = createBunnyStoragePath({
        folder,
        mediaType: "video",
        fileName: videoFile.name,
      });
      uploadedVideo = {
        url: await uploadFileToBunny(videoFile, path),
        sizeMb: getRoundedMb(videoFile.size),
        durationSeconds: Math.round(durationSeconds),
        mimeType: videoFile.type,
      };
    }

    return NextResponse.json<UploadSuccess>({
      ok: true,
      imageUrls: uploadedImageUrls,
      video: uploadedVideo,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Media upload failed. Please try again.";
    return jsonError(message, 500);
  }
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    "arrayBuffer" in value &&
    "name" in value &&
    "size" in value &&
    Number(value.size) > 0
  );
}

function safeFolderPart(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function jsonError(message: string, status: number) {
  return NextResponse.json<UploadError>({ ok: false, message }, { status });
}
