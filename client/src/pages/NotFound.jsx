import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section">
      <p className="section-eyebrow">404</p>
      <h1>Page Not Found</h1>
      <p className="section-lede">That page doesn't exist — let's get you back on track.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
