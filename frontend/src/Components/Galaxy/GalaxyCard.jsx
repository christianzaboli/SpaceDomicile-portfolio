import { Link } from "react-router-dom";
import { scrollToTop } from "../../libs/utils.jsx";

export default function GalaxyCard({ galaxy }) {
  return (
    <Link
      to={`/galaxies/${galaxy.slug}`}
      key={galaxy.id}
      className="galaxy-card-link"
      onClick={scrollToTop}
    >
      <div className="galaxy-card">
        <div className="galaxy-card-header">
          <div className="galaxy-card-title">{galaxy.name}</div>
        </div>
        <div className="galaxy-card-visual-shell">
          <img
            src={`/img/${galaxy.image}`}
            alt={galaxy.name}
            className="galaxy-card-image"
          />
        </div>
        <div className="galaxy-card-body">
          <p className="galaxy-card-description">{galaxy.description}</p>
        </div>
      </div>
    </Link>
  );
}
