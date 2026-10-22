/**
 * Prefix a public/ file path with the deployment base path.
 * Needed for static hosting under a sub-path (e.g. GitHub Pages at /Reshade),
 * where next/image, CSS url() and canvas loaders don't add basePath themselves.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;
