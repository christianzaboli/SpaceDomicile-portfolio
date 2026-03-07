import galaxyIcon from "/img/galaxy-icon.png";
import { Link } from "react-router-dom";
import { scrollToTop } from "../libs/utils";

export default function ContactUs() {
  return (
    <div className="galaxy-page pos contact">
      <h1>Contattaci</h1>
      <p>
        Per qualsiasi domanda o informazione, puoi scriverci a questo indirizzo
        email:
      </p>
      <p>
        <a
          href="mailto:info@spacedomicile.com"
          style={{ color: "#0077cc", textDecoration: "none" }}
        >
          info@spacedomicile.com
        </a>
      </p>
      <p>
        Siamo a disposizione per rispondere alle tue curiosità o per aiutarti
        nell'acquisto del suolo spaziale.
      </p>
      <div className="social">
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-pinterest"></i>
        <i className="fa-brands fa-square-x-twitter"></i>
      </div>
      <div className="gal-dim" onClick={scrollToTop}>
        <Link to="/">
          <img src={galaxyIcon} alt="Galassia" className="galaxy-header-icon" />
        </Link>
      </div>
      <p className="go-back-text">Tocca la galassia per il respawn in Home</p>
    </div>
  );
}
