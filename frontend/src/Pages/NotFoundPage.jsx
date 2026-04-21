import { Link } from "react-router-dom";
import galaxyIcon from "/img/galaxy-icon.png";

export default function NotFoundPage() {
  return (
    <div className="galaxy-page container-coming-soon">
      <h1>404</h1>
      <p>La pagina da che cerchi é persa nello spazio piú profondo</p>
      <div className="gal-dim">
        <Link to="/">
          <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
        </Link>
      </div>
      <p className="go-back-text">
        Tocca la galassia: la Forza ti guiderà verso la Home
      </p>
    </div>
  );
}

