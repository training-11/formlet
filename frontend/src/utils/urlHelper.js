/**
 * Helper to get the correct image URL for a product.
 * Handles both "image" and "image_url" fields.
 * Handles full URLs (http), uploaded paths (/uploads), and static assets.
 */
export const getProductImage = (product) => {
    if (!product) return "https://via.placeholder.com/150?text=No+Image";

    // 1. Prefer image_url, fallback to image
    const rawUrl = product.image_url || product.image;

    if (!rawUrl) {
        return "https://via.placeholder.com/150?text=No+Image";
    }

    // 2. If it's a full URL (external), return as is
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        return rawUrl;
    }

    // 3. If it's an uploaded file (starts with /uploads or /api/uploads), prepend BACKEND_API
    if (rawUrl.startsWith("/uploads") || rawUrl.startsWith("/api/uploads")) {
        // Ensure BACKEND_API is defined; fallback to empty string if not (relative path)
        const backendApi = window.ENV?.BACKEND_API || "";
        return `${backendApi}${rawUrl}`;
    }

    // 4. If it's a static frontend asset (e.g., "fruit1.png" or "/images/fruit1.png")
    // The seed data uses "fruit1.png" effectively assuming it's in public folder or imported.
    // However, the seed script prepended "/images/" to them in the DB.
    // So if it starts with "/", assume it's relative to public root.
    if (rawUrl.startsWith("/")) {
        return rawUrl;
    }

    // 5. If it's just a filename "fruit1.png", assume it's in /images/ (based on typical app structure)
    // or just return it if the app expects imports. 
    // Given the seed data puts "/images/...", let's assume raw filenames might need that prefix if they lack it.
    // But let's be safe and just return it, maybe it's a relative path.
    // Actually, looking at seed_data.js: const prodImage = "/images/" + prod.image;
    // So DB has "/images/fruit1.png". That falls into case 4.

    // Fallback
    return rawUrl;
};
