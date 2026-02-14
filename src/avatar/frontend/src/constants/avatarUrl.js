/**
 * Single source of truth for the 3D avatar model URL.
 * Load from same origin (Vite serves public/ at /) so the app always gets
 * frontend/public/models/avatar.glb and avoids cross-origin or cache failures.
 * Bump the version query when you change the avatar file to bypass cache.
 */
export const AVATAR_GLB_URL = "/models/avatar.glb?v=7";
