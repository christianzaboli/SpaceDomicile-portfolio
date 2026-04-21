import { Link } from "react-router-dom";
import { scrollToTop } from "../../libs/utils.jsx";
import galaxyIcon from "/img/galaxy-icon.png";

export default function BackToHomeBtn() {
  return (
    <>
      <div className="gal-dim" onClick={scrollToTop}>
        <Link to="/">
          <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
        </Link>
      </div>
      <p className="go-back-text">Tocca la galassia per tornare alla home.</p>
    </>
  );
}
