import { Link } from "react-router-dom";
import { scrollToTop } from "../../libs/utils";
import galaxyIcon from "/img/galaxy-icon.png";
export default function () {
  return (
    <>
      <div className="gal-dim" onClick={scrollToTop}>
        <Link to="/">
          <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
        </Link>
      </div>
      <p className="go-back-text">
        Premi la galassia: la rotta per la Home è già calcolata!
      </p>
    </>
  );
}
