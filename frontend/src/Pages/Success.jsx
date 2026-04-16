import { useEffect, useState } from "react";
import galaxyIcon from "/img/galaxy-icon.png";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkTransaction, setCheckTransaction] = useState(false);

  function TargetPage() {
    const transactionId = location.state?.transactionId;

    if (!transactionId) {
      return navigate("/");
    }
    setCheckTransaction(true);
  }

  useEffect(() => {
    TargetPage();
  }, []);

  return (
    <div className="galaxy-page thanks">
      {checkTransaction && (
        <div>
          <h1
            style={{
              marginTop: "90px",
              lineHeight: "1.3",
              marginBottom: "70px",
            }}
          >
            Ordine Confermato
            <br />
            Benvenuto nell’Universo di SpaceDomiciles
          </h1>

          <p
            style={{
              maxWidth: "750px",
              margin: "40px auto",
              textAlign: "center",
              lineHeight: "1.7",
              fontSize: "1.15rem",
              opacity: 0.95,
            }}
          >
            La tua richiesta è stata ricevuta ed è stata proiettata con successo
            nelle profondità del nostro sistema interstellare. <br />
            <br />
            <span style={{ color: "violet", fontSize: "28px" }}>
              Tra pochi istanti riceverai una mail contenente: <br />
            </span>
            Il riepilogo dettagliato del tuo ordine <br />
            Il certificato ufficiale di proprietà del tuo oggetto celeste <br />
            Tutte le informazioni utili per seguire il viaggio del pacco
            attraverso la galassia <br />
            <br />
            Grazie per aver scelto di viaggiare con noi. Il tuo acquisto non è
            solo un ordine: è un piccolo passo verso l’infinito.
          </p>

          <div
            className="gal-dim"
            style={{ textAlign: "center", marginTop: "30px" }}
          >
            <Link to="/">
              <img
                src={galaxyIcon}
                alt="Galassia"
                className="galaxy-header-icon"
                style={{
                  width: "120px",
                  height: "120px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
            </Link>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "10px",
              fontSize: "1.05rem",
              opacity: 0.8,
              paddingBottom: "42px",
            }}
          >
            Premi la galassia e fai un salto nell’iperspazio verso la Home
          </p>
        </div>
      )}
    </div>
  );
};

export default Success;
