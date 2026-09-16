import { useEffect, useState } from "react";

// Drop last year's photos into src/assets/gallery/ (jpg/png/webp) and they'll
// show up here automatically — no code changes needed.
const images = import.meta.glob("../assets/gallery/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

export default function Gallery() {
  const photos = Object.values(images);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(e) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, photos.length]);

  return (
    <div className="section">
      <p className="section-eyebrow">The Gallery</p>
      <h1>Moments from Raas Rang 2025</h1>
      <p className="section-lede">
        A look back at last year's night of colour, rhythm, and Dandiya raas — from the first
        dhol beat to the last twirl.
      </p>
      {photos.length === 0 ? (
        <p className="gallery-empty">
          Our 2025 photo album is on its way. Check back soon, or follow{" "}
          <code>client/src/assets/gallery/</code> for how new photos appear here automatically.
        </p>
      ) : (
        <div className="gallery-grid">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              className="gallery-thumb"
              onClick={() => setActiveIndex(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
            >
              <img src={src} alt={`Raas Rang 2025 moment ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {activeIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setActiveIndex(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <img
            src={photos[activeIndex]}
            alt={`Raas Rang 2025 moment ${activeIndex + 1}`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i + 1) % photos.length);
            }}
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="lightbox-count">
            {activeIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
