import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { EVENT } from "../eventConfig";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import logo from "../assets/logo-nav.png";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    setMenuOpen(false);
    await supabase.auth.signOut();
    navigate("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="navbar">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src={logo} alt={EVENT.name} className="brand-logo" />
          <span className="brand-name">{EVENT.name}</span>
        </Link>

        <nav className="site-nav-inline">
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/gallery" onClick={closeMenu}>
            Gallery
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
          {user && (
            <NavLink to="/my-tickets" onClick={closeMenu}>
              My Tickets
            </NavLink>
          )}
        </nav>

        <div className="nav-right">
          {user ? (
            <button type="button" className="nav-link" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="nav-link">
              Sign In
            </Link>
          )}
          <Link to="/tickets" className="btn nav-cta">
            Reserve a pass <b>↗</b>
          </Link>
        </div>

        <button
          type="button"
          className={`nav-burger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Rendered outside .navbar so its own backdrop-filter doesn't become the
          containing block for this fixed-position drawer (that collapses its height). */}
      <nav className={`site-nav-drawer ${menuOpen ? "nav-open" : ""}`}>
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/gallery" onClick={closeMenu}>
          Gallery
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>
        {user && (
          <NavLink to="/my-tickets" onClick={closeMenu}>
            My Tickets
          </NavLink>
        )}
        <div className="nav-mobile-actions">
          {user ? (
            <button type="button" className="nav-link" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="nav-link" onClick={closeMenu}>
              Sign In
            </Link>
          )}
          <Link to="/tickets" className="btn nav-cta" onClick={closeMenu}>
            Reserve a pass <b>↗</b>
          </Link>
        </div>
      </nav>
    </>
  );
}
