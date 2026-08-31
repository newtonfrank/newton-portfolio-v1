import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * `outputFileTracingRoot` is pinned to this directory because a stray
 * package-lock.json sits in the parent folder — without this Next infers the
 * parent as the workspace root and traces the wrong tree.
 */
const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: here,
  images: {
    formats: ["image/webp", "image/avif"],
  },
  compress: true,
};

export default nextConfig;
