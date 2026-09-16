import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function useInView(threshold = 0.35) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function CineMoment({ img, caption }) {
  const [ref, inView] = useInView(0.4);
  return (
    <div className={`cine-section${inView ? " in-view" : ""}`} ref={ref}>
      <div className="cine-img" style={{ backgroundImage: `url(${img})` }} />
      <div className="cine-overlay" />
      <p className="cine-caption">{caption}</p>
    </div>
  );
}

export default function CinematicIntro({ photos = [] }) {
  const [titleRef, titleInView] = useInView(0.5);

  const pick = (i) => (photos.length ? photos[i % photos.length] : null);

  const moments = [
    { img: pick(7), caption: "Welcome to the circle" },
    { img: pick(24), caption: "Nine nights, one rhythm" },
    { img: pick(5), caption: "Dressed for the dance" },
    { img: pick(9), caption: "Colour finds you here" },
    { img: pick(1), caption: "When the dhol begins" },
  ].filter((m) => m.img);

  const finalImg = pick(19);

  return (
    <div className="cinematic">
      <div className="cine-title" ref={titleRef}>
        <p className="cine-eyebrow">Garba · Dandiya · Navratri 2026</p>
        <h1 className="cine-title-mark">Raas Rang</h1>
        <span className="cine-title-rule" />
        <div className={`cine-scroll-hint${titleInView ? "" : " hide"}`}>
          <span>Scroll to begin</span>
          <i className="cine-diamond" />
        </div>
      </div>

      <div className="cine-moments">
        <div className="cine-logo">
          <span>Raas Rang</span>
        </div>

        {moments.map((m) => (
          <CineMoment key={m.caption} img={m.img} caption={m.caption} />
        ))}

        {finalImg && (
          <div className="cine-section cine-final">
            <div className="cine-img" style={{ backgroundImage: `url(${finalImg})` }} />
            <div className="cine-overlay strong" />
            <div className="cine-final-copy">
              <p className="cine-eyebrow">Sankhali, Goa</p>
              <h2>The night is yours.</h2>
              <Link to="/tickets" className="btn btn-primary">
                Book Your Pass <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
