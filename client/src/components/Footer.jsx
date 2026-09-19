import { Link } from "react-router-dom";
import { EVENT } from "../eventConfig";
import { useSiteContent } from "../SiteContentContext";
import logo from "../assets/logo-nav.png";
import cultEventsLogo from "../assets/cult-events-logo.jpg";

export default function Footer() {
  const { settings } = useSiteContent();

  return (
    <footer className="footer">
      <div className="footer-diyas" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="footer-diya" />
        ))}
      </div>

      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt={EVENT.name} className="footer-logo" />
          <p>{settings.tagline}</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/tickets">Get Tickets</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <a href={settings.instagram_url} target="_blank" rel="noreferrer">
            Instagram
          </a>
          {settings.contact_email && <a href={`mailto:${settings.contact_email}`}>Email</a>}
          {settings.whatsapp_number && (
            <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <p className="footer-quote">
        May these nine nights fill your life with color, joy, devotion, and new beginnings.
      </p>

      <div className="footer-legal">
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/refund-policy">Refund Policy</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
      <p className="footer-copy">
        © {EVENT.year} {EVENT.name}. All rights reserved.
      </p>
      <p className="footer-presenter-row">
        <img src={cultEventsLogo} alt="Cult Events" className="footer-presenter-badge" />
        An event by <span className="footer-presenter">Cult Events</span>
      </p>
    </footer>
  );
}
