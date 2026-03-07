import galaxyIcon from "/img/galaxy-icon.png";
import { Link } from "react-router-dom";
import GradientText from "../Components/ReactBits/GradientText";
import { scrollToTop } from "../libs/utils";
export default function AboutUsPage() {
  return (
    <>
      <div className="galaxy-page pos">
        <div className="about-container">
          <GradientText
            className="team-title-gradient abouth1"
            style={{ display: "block", textAlign: "center" }}
          >
            Reclute full-stack del Programma Spaziale Dev
          </GradientText>

          <div className="team-grid">
            {/* ALESSANDRO */}
            <div>
              <div className="team-card alessandro">
                <div className="team-personal-links">
                  <div className="team-overlay">
                    <h3>Alessandro</h3>
                  </div>
                  <div className="socials-container">
                    <Link to={"https://github.com/Aleiaco02"} target="_blank">
                      <i className="fa-brands fa-github"></i>
                    </Link>
                    <Link to={"https://www.linkdn.com"} target="_blank">
                      <i class="fa-brands fa-linkedin"></i>
                    </Link>
                    <Link to={"https://www.facebook.com"} target="_blank">
                      <i class="fa-brands fa-facebook"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CHRISTIAN */}
            <div>
              <div className="team-card christian">
                <div className="team-personal-links">
                  <div className="team-overlay">
                    <h3>Christian</h3>
                  </div>
                  <div className="socials-container">
                    <Link
                      to={"https://github.com/christianzaboli"}
                      target="_blank"
                    >
                      <i className="fa-brands fa-github"></i>
                    </Link>
                    <Link
                      to={
                        "https://www.linkedin.com/in/christian-zaboli-vedovi-b1b1a7260"
                      }
                      target="_blank"
                    >
                      <i class="fa-brands fa-linkedin"></i>
                    </Link>
                    <Link
                      to={"https://www.facebook.com/Osazeh"}
                      target="_blank"
                    >
                      <i class="fa-brands fa-facebook"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CLAUDIA */}
            <div>
              <div className="team-card claudia">
                <div className="team-personal-links">
                  <div className="team-overlay">
                    <h3>Claudia</h3>
                  </div>
                  <div className="socials-container">
                    <Link
                      to={"https://github.com/ClaudiaSgalippa"}
                      target="_blank"
                    >
                      <i className="fa-brands fa-github"></i>
                    </Link>
                    <Link
                      to={
                        "https://www.linkedin.com/in/claudia-sgalippa-b966a7181/"
                      }
                      target="_blank"
                    >
                      <i class="fa-brands fa-linkedin"></i>
                    </Link>
                    <Link
                      to={"https://www.facebook.com/claudia.sgalippa"}
                      target="_blank"
                    >
                      <i class="fa-brands fa-facebook"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* DANIEL */}
            <div>
              <div className="team-card daniel">
                <div className="team-personal-links">
                  <div className="team-overlay">
                    <h3>Daniel</h3>
                  </div>
                  <div className="socials-container">
                    <Link
                      to={"https://github.com/Daniel-Di-Fraia"}
                      target="_blank"
                    >
                      <i className="fa-brands fa-github"></i>
                    </Link>
                    <Link to={"https://www.linkdn.com"} target="_blank">
                      <i class="fa-brands fa-linkedin"></i>
                    </Link>
                    <Link
                      to={"https://www.facebook.com/daniel.difraia.1"}
                      target="_blank"
                    >
                      <i class="fa-brands fa-facebook"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* STEFANO */}
            <div>
              <div className="team-card stefano">
                <div className="team-personal-links">
                  <div className="team-overlay">
                    <h3>Stefano</h3>
                  </div>
                  <div className="socials-container">
                    <Link
                      to={"https://github.com/StefanoSalaa98"}
                      target="_blank"
                    >
                      <i className="fa-brands fa-github"></i>
                    </Link>
                    <Link to={"https://www.linkdn.com"} target="_blank">
                      <i class="fa-brands fa-linkedin"></i>
                    </Link>
                    <Link to={"https://www.facebook.com"} target="_blank">
                      <i class="fa-brands fa-facebook"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1>Chi Siamo</h1>

          <p>
            Siamo un team di giovani sviluppatori full-stack in formazione,
            impegnati in un programma intensivo che ci sta portando a esplorare
            tutte le galassie del web.
          </p>

          <p>
            Crediamo nell'innovazione, nella fantasia, nella tecnologia e nella
            collaborazione. Ogni giorno superiamo un nuovo pianeta, una nuova
            sfida, un nuovo bug.
          </p>

          <p>
            Questa è la nostra missione: crescere, imparare e creare esperienze
            digitali degne di uno spazio tutto da esplorare.
          </p>

          <h2>Perché scegliere Space Domicile?</h2>

          <ul>
            <li>Certificati unici e personalizzati del suolo spaziale</li>
            <li>Esperienza utente immersiva e futuristica</li>
            <li>Team giovane, creativo e full-stack ready</li>
          </ul>

          <div className="gal-dim" onClick={scrollToTop}>
            <Link to="/">
              <img
                src={galaxyIcon}
                alt="Galassia"
                className="galaxy-header-icon"
              />
            </Link>
          </div>

          <p className="go-back-text">
            Premi la galassia e fai un salto nell’iperspazio fino alla Home
          </p>
        </div>
      </div>
    </>
  );
}
