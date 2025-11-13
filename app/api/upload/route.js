import { put, del } from "@vercel/blob";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export async function POST(req) {
    try {
        const password = req.headers.get("x-edit-password");
        if (password !== process.env.CONTENT_EDIT_PASSWORD) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file");
        const oldUrls = formData.getAll("oldUrl");
        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        if (oldUrls && oldUrls.length > 0) {
            for (const oldUrl of oldUrls) {
                if (oldUrl && typeof oldUrl === "string" && oldUrl.startsWith("https://")) {
                    try {
                        await del(oldUrl, {
                            token: process.env.BLOB_READ_WRITE_TOKEN,
                        });
                        console.log(`Deleted old file from Blob: ${oldUrl}`);
                    } catch (deleteError) {
                        console.warn(`Failed to delete old file (${oldUrl}):`, deleteError.message);
                    }
                }
            }
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return Response.json(
                { error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}` },
                { status: 400 }
            );
        }

        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
        const maxSize = isImage ? MAX_IMAGE_SIZE : isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            return Response.json(
                { error: `File too large. Maximum size: ${maxSizeMB}MB` },
                { status: 400 }
            );
        }
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return Response.json(
                {
                    error: "Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable. Get it from Vercel Dashboard > Settings > Environment Variables.",
                },
                { status: 500 }
            );
        }


        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileType = isImage ? "image" : "video";
        const filename = `bootcamp-${fileType}-${timestamp}-${sanitizedName}`;

        const blob = await put(filename, file, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return Response.json({
            url: blob.url,
            type: file.type,
            size: file.size,
        });
    } catch (error) {
        console.error("Upload route error:", error);
        return Response.json(
            {
                error: `Server error: ${error.message || "Unknown error occurred"}. Make sure BLOB_READ_WRITE_TOKEN is set correctly.`,
            },
            { status: 500 }
        );
    }
}
