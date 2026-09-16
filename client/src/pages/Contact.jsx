import { useSiteContent } from "../SiteContentContext";
import instagramQr from "../assets/instagram-qr.png";

export default function Contact() {
  const { settings } = useSiteContent();

  return (
    <div className="section">
      <p className="section-eyebrow">Get in Touch</p>
      <h1>Contact &amp; Info</h1>
      <p className="section-lede">
        Questions about the event, your ticket, or just want to say hello? Here's where to find
        us.
      </p>
      <p className="contact-meta">{settings.venue}</p>
      <p className="contact-meta">{settings.date_label}</p>
      <ul className="contact-list">
        {settings.contact_email && (
          <li>
            Email: <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
          </li>
        )}
        {settings.whatsapp_number && (
          <li>
            WhatsApp:{" "}
            <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noreferrer">
              {settings.whatsapp_number}
            </a>
          </li>
        )}
        <li>
          Instagram:{" "}
          <a href={settings.instagram_url} target="_blank" rel="noreferrer">
            {settings.instagram_handle}
          </a>
        </li>
      </ul>

      <div className="qr-block">
        <a href={settings.instagram_url} target="_blank" rel="noreferrer">
          <img src={instagramQr} alt={`Scan to follow ${settings.instagram_handle} on Instagram`} />
        </a>
        <p>Scan to follow us on Instagram</p>
      </div>
    </div>
  );
}
