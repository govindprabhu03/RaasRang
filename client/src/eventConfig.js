// Fixed brand identifiers that don't change from the admin portal.
// Editable event details (dates, venue, about text, contact info) now live in
// the site_settings table — see SiteContentContext.jsx and pages/Admin.jsx.
// The values below are only the fallback used before that data loads.
export const EVENT = {
  name: "Raas Rang",
  tagline: "Goa's Garba & Dandiya Night",
  year: 2026,
  dateLabel: "Dates coming soon",
  venue: "Venue to be announced",
  instagramHandle: "@raasrang.goa2.0",
  instagramUrl: "https://www.instagram.com/raasrang.goa2.0",
  whatsappNumber: "",
  contactEmail: "",
};

export const ABOUT_NAVRATRI =
  "Navratri, meaning \"nine nights,\" is one of India's most celebrated festivals — a tribute to the divine feminine and the triumph of good over evil. Each night carries its own energy, color, and ritual, building toward a celebration of community, devotion, and joy. Across Gujarat and beyond, the festival comes alive through Garba and Dandiya Raas — circular folk dances performed to the rhythm of dhol and traditional song.";

export const ABOUT_RAAS_RANG =
  "Raas Rang started as a small gathering of friends who wanted to bring authentic Garba and Dandiya energy to Goa. What began as a single night has grown into one of the region's most anticipated Navratri events — bringing together dancers, musicians, food, and a community that shows up year after year. Raas Rang 2025 saw hundreds come together for a night of music, movement, and tradition, and 2026 is set to be bigger.";

// Placeholder gallery — swap these with real photos from last year's Drive folder.
// Put images in client/src/assets/gallery/ and import them here, or reference
// a public URL if you're pulling from Drive/Instagram directly.
export const GALLERY_PLACEHOLDER_COUNT = 8;
