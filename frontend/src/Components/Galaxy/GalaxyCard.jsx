import { Link } from "react-router-dom";
import { scrollToTop } from "../../libs/utils";

export default function GalaxyCard({ galaxy }) {
  return (
    <Link
      to={`/galaxies/${galaxy.slug}`}
      key={galaxy.id}
      className="galaxy-card-link"
      onClick={scrollToTop}
    >
      <div className="galaxy-card">
        <img
          src={`/img/${galaxy.image}`}
          alt={galaxy.name}
          className="galaxy-card-image"
        />
        <div className="galaxy-card-title">{galaxy.name}</div>
        <div className="galaxy-card-description">{galaxy.description}</div>
      </div>
    </Link>
  );
}
