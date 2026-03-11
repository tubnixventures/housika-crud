import { deleteBannerModel } from "../../models/banners/deleteBanner.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function deleteBannerController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  if (payload.role !== "ceo" && payload.role !== "admin") {
    throw new Error("Not authorized to delete banners");
  }

  const urls: string[] = req.body?.urls;
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error("Request body must include a non-empty 'urls' array");
  }

  // ✅ Harden: only allow URLs pointing to your storage domain
  const allowedDomain = process.env.allowed_storage_domain; // e.g. "https://cdn.housika.com/"
  if (!allowedDomain) {
    throw new Error("Allowed storage domain not configured");
  }
  for (const url of urls) {
    if (!url.startsWith(allowedDomain)) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  const storageUrl = process.env.storage_url;
  if (!storageUrl) {
    throw new Error("Storage URL not configured");
  }

  // Try storage deletion first
  const res = await fetch(`${storageUrl}/delete?bucket=banners`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(urls)
  });

  const storageResult = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(storageResult.error || `Failed to delete banner files: ${res.statusText}`);
  }

  // Only delete DB record if storage deletion succeeded
  const dbResult = await deleteBannerModel(req.params.id);

  return {
    success: true,
    db: dbResult,
    storage: storageResult
  };
}
