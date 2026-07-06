// Returns public (non-secret) tracking IDs so the static frontend can load
// Meta Pixel / GA4 without hardcoding IDs per-environment. Pixel ID and GA4
// Measurement ID are not secrets — they're visible in every page request
// once loaded — so it's safe to expose them here.
module.exports = (req, res) => {
  res.status(200).json({
    pixelId: process.env.META_PIXEL_ID || null,
    ga4Id: process.env.GA4_MEASUREMENT_ID || null,
  });
};
