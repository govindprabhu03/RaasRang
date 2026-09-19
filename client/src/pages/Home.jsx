import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { EVENT } from "../eventConfig";
import { useSiteContent } from "../SiteContentContext";
import raasRangCrest from "../assets/logo-nav.png";
import cultEventsLogo from "../assets/cult-events-logo.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const galleryImages = Object.values(
  import.meta.glob("../assets/gallery/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" })
);

const NINE_NIGHTS = [
  { n: 1, goddess: "Shailaputri", color: "#e0685a", meaning: "Daughter of the Mountains", desc: "The first spark of Shakti — grounded strength and new beginnings." },
  { n: 2, goddess: "Brahmacharini", color: "#e0a13d", meaning: "The Ascetic", desc: "Devotion, discipline, and the pursuit of inner knowledge." },
  { n: 3, goddess: "Chandraghanta", color: "#d6b23e", meaning: "Bearer of the Crescent Bell", desc: "Grace paired with fearless courage against evil." },
  { n: 4, goddess: "Kushmanda", color: "#7aa657", meaning: "Creator of the Universe", desc: "Radiant energy said to have created the cosmos with a smile." },
  { n: 5, goddess: "Skandamata", color: "#3f9e8f", meaning: "Mother of Skanda", desc: "Nurturing strength — the fierce, protective power of motherhood." },
  { n: 6, goddess: "Katyayani", color: "#3d7fa6", meaning: "The Warrior Sage's Daughter", desc: "Bold, decisive energy — a fighter for justice." },
  { n: 7, goddess: "Kalaratri", color: "#6a4c93", meaning: "The Dark Night", desc: "Destroyer of ignorance and fear, beneath a fierce exterior." },
  { n: 8, goddess: "Mahagauri", color: "#b34f8c", meaning: "The Radiant One", desc: "Peace and purity restored after the fiercest battles." },
  { n: 9, goddess: "Siddhidatri", color: "#c9932f", meaning: "Bestower of Perfection", desc: "Fulfilment and grace — the festival's joyful culmination." },
];

function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <div className="countdown-grid">
      {[
        ["Days", days],
        ["Hours", hours],
        ["Minutes", minutes],
        ["Seconds", seconds],
      ].map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <span className="countdown-value">{String(value).padStart(2, "0")}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

const NAVRATRI_STORY = [
  {
    title: "The Meaning",
    text: "\"Navratri\" means nine nights — nine nights of devotion, dance, and renewal, observed across India each autumn.",
  },
  {
    title: "Goddess Durga",
    text: "At its heart, the festival honors Durga's victory over the demon Mahishasura — good triumphing over evil.",
  },
  {
    title: "Devotion in Motion",
    text: "Garba and Dandiya turn worship into movement — dancers circling a central lamp or idol, night after night.",
  },
  {
    title: "Community & Joy",
    text: "More than ritual, Navratri is a gathering — families, friends, and strangers moving to the same rhythm.",
  },
];

function EventShowcase({ settings }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/tickets`)
      .then((res) => setTickets(res.data))
      .catch(() => {});
  }, []);

  return (
    <section className="section event-section">
      <p className="section-eyebrow">The Event</p>
      <h2>
        Raas Rang {EVENT.year}
      </h2>
      <div className="event-card">
        <span className="event-card-corner tl" />
        <span className="event-card-corner tr" />
        <span className="event-card-corner bl" />
        <span className="event-card-corner br" />

        <span className="event-type-tag">Garba &amp; Dandiya Night</span>

        <div className="event-meta">
          <div className="event-meta-item">
            <span className="event-meta-label">Date</span>
            <span className="event-meta-value">{settings.date_label}</span>
          </div>
          <div className="event-meta-item">
            <span className="event-meta-label">Venue</span>
            <span className="event-meta-value">{settings.venue}</span>
          </div>
        </div>

        <p className="event-desc">
          Live Dandiya &amp; Garba, festive food and stalls, and prizes for the best on the
          floor — one night, all in.
        </p>

        {tickets.length > 0 && (
          <div className="event-tiers">
            {tickets.map((t) => (
              <div className="event-tier" key={t.id}>
                <span className="event-tier-name">{t.name}</span>
                <span className="event-tier-price">₹{t.price}</span>
              </div>
            ))}
          </div>
        )}

        <div className="event-card-actions">
          <Link to="/tickets" className="btn btn-primary">
            Book Your Pass <span>→</span>
          </Link>
          <Link to="/contact" className="btn btn-outline">
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = ["Garba", "Dandiya", "Navratri 2026", "Nine Nights", "Raas Rang"];

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((label, i) => (
          <span className="marquee-item" key={i}>
            {label} <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

function GarbaCircle() {
  const sticks = Array.from({ length: 16 });
  return (
    <div className="garba-circle" aria-hidden="true">
      <div className="garba-ring">
        {sticks.map((_, i) => (
          <span
            key={i}
            className="garba-stick"
            style={{ transform: `translateX(-50%) rotate(${(360 / sticks.length) * i}deg)` }}
          />
        ))}
      </div>
      <div className="garba-center" />
    </div>
  );
}

export default function Home() {
  const { settings, team } = useSiteContent();
  const [activeNight, setActiveNight] = useState(0);

  const previewPhotos = galleryImages.slice(0, 3);

  return (
    <div>
      <section className="hero-glass">
        <div className="hero-glass-card">
          <img src={raasRangCrest} alt="Raas Rang crest" className="hero-crest" />
          <p className="presenter-credit">
            <img src={cultEventsLogo} alt="Cult Events" className="presenter-badge" />
            Cult Events presents
          </p>
          <p className="eyebrow">Garba · Dandiya · Navratri 2026</p>
          <h1>
            Raas Rang <i>2026</i>
          </h1>
          <p className="lede">{settings.tagline}</p>
          <div className="hero-actions">
            <Link to="/tickets" className="btn btn-primary">
              Book Your Pass <span>→</span>
            </Link>
            <Link to="/gallery" className="btn btn-outline">
              See Last Year
            </Link>
          </div>
          <div className="hero-meta">
            <span>{settings.date_label}</span>
            <span className="dot" />
            <span>{settings.venue}</span>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="intro section">
        <p className="eyebrow">An evening with intention</p>
        <h2>
          Rooted in tradition.
          <br />
          <i>Made for Goa.</i>
        </h2>
        <div className="intro-grid">
          <p>{settings.about_navratri}</p>
          <Link to="/contact" className="text-link">
            Get in touch <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="gallery section">
        <div className="section-head">
          <div>
            <p className="eyebrow">A glimpse inside</p>
            <h2>
              Captured in <i>motion.</i>
            </h2>
          </div>
          <Link to="/gallery" className="circle-btn" aria-label="See full gallery">
            →
          </Link>
        </div>
        {previewPhotos.length > 0 && (
          <div className="gallery-grid">
            {previewPhotos.map((src, i) => (
              <Link
                to="/gallery"
                className={`gallery-card ${i === 0 ? "tall" : ""}`}
                key={src}
              >
                <div className="photo" style={{ backgroundImage: `url(${src})` }} />
                <p>
                  {String(i + 1).padStart(2, "0")}{" "}
                  <span>
                    {i === 0
                      ? "Tradition, in every turn"
                      : i === 1
                      ? "The circle, come alive"
                      : "Gold after dark"}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section about-story">
        <p className="section-eyebrow">The Festival</p>
        <h2>About Navratri</h2>
        <p className="section-lede">{settings.about_navratri}</p>
        <div className="story-timeline">
          {NAVRATRI_STORY.map((item) => (
            <div className="story-card" key={item.title}>
              <span className="story-dot" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section nine-nights">
        <p className="section-eyebrow">Nine Forms of Shakti</p>
        <h2>The Nine Nights</h2>
        <p className="section-lede">
          Each night of Navratri honors a different form of the Goddess — nine colors, nine
          energies, one celebration.
        </p>
        <div className="nights-row">
          {NINE_NIGHTS.map((night, i) => (
            <button
              key={night.n}
              type="button"
              className={`night-chip ${activeNight === i ? "active" : ""}`}
              style={{ "--night-color": night.color }}
              onClick={() => setActiveNight(i)}
            >
              <span className="night-chip-num">{night.n}</span>
              {night.goddess}
            </button>
          ))}
        </div>
        <div className="night-detail-panel" style={{ "--night-color": NINE_NIGHTS[activeNight].color }}>
          <span className="night-detail-goddess">{NINE_NIGHTS[activeNight].goddess}</span>
          <em>{NINE_NIGHTS[activeNight].meaning}</em>
          <p>{NINE_NIGHTS[activeNight].desc}</p>
        </div>
      </section>

      <EventShowcase settings={settings} />

      {settings.event_date ? (
        <section className="section countdown-section">
          <p className="section-eyebrow">Mark Your Calendar</p>
          <h2>The Celebration Begins In</h2>
          <Countdown target={settings.event_date} />
        </section>
      ) : null}

      <section className="section about">
        <p className="section-eyebrow">Our Story</p>
        <h2>About Raas Rang</h2>
        <p>{settings.about_raas_rang}</p>
      </section>

      <section className="section garba-dandiya">
        <p className="section-eyebrow">The Dance</p>
        <h2>Garba &amp; Dandiya Raas</h2>
        <p className="section-lede">
          Two traditions, one circle — the rhythm that carries every Navratri night from the
          first dhol beat to the last.
        </p>
        <div className="gd-layout">
          <GarbaCircle />
          <div className="gd-cards">
            <div className="gd-card">
              <span className="gd-index">01</span>
              <h3>Garba</h3>
              <p>
                A devotional circular dance performed around a central lamp or idol, Garba
                traces the cycle of life — dancers moving in unison, step by step, as the circle
                widens through the night.
              </p>
            </div>
            <div className="gd-card">
              <span className="gd-index">02</span>
              <h3>Dandiya Raas</h3>
              <p>
                Danced in pairs with decorated sticks, Dandiya Raas echoes the battle between
                Goddess Durga and Mahishasura — playful, high-energy, and built for a packed
                floor.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section highlights">
        <p className="section-eyebrow">On the Night</p>
        <h2>What to Expect</h2>
        <div className="highlight-grid">
          <div className="highlight-card">
            <h3>Live Dandiya & Garba</h3>
            <p>Non-stop music and dance through the night.</p>
          </div>
          <div className="highlight-card">
            <h3>Food & Stalls</h3>
            <p>Festive food, drinks, and pop-up stalls.</p>
          </div>
          <div className="highlight-card">
            <h3>Prizes & Contests</h3>
            <p>Best dressed, best dandiya moves, and more.</p>
          </div>
        </div>
      </section>

      <section className="section team">
        <p className="section-eyebrow">Behind Raas Rang</p>
        <h2>Core Team</h2>
        {team.length === 0 ? (
          <p className="team-empty">Team lineup coming soon.</p>
        ) : (
          <div className="team-grid">
            {team.map((member) => (
              <div className="team-card" key={member.id}>
                {member.photo_url && <img src={member.photo_url} alt={member.name} />}
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section cta-strip">
        <h2>Ready to celebrate?</h2>
        <Link to="/tickets" className="btn btn-primary">
          Buy Your Pass Now
        </Link>
      </section>
    </div>
  );
}
