import BlurText from "../Components/ReactBits/BlurText";
import Galaxy from "../Components/ReactBits/Galaxy";
import GradientText from "../Components/ReactBits/GradientText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCertificate,
  faStar,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import milkyWay from "/img/milky-way.png";
import andromeda from "/img/andromeda.png";
import sombrero from "/img/sombrero.png";
import axios from "axios";
import { buildApiUrl } from "../libs/utils";


export default function HomePage() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };


  const contentRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('100vh');


  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        // Resetta temporaneamente per ricalcolare correttamente
        setContainerHeight('auto');
        
        setTimeout(() => {
          if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            const windowHeight = window.innerHeight;
            
            const calculatedHeight = Math.max(contentHeight + 42, windowHeight);
            setContainerHeight(`${calculatedHeight}px`);
          }
        }, 0);
      }
    };

    // Aspetta che tutto sia caricato
    setTimeout(updateHeight, 500);
    
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);


  const [planet1, setPlanet1] = useState(null);
  const [planet2, setPlanet2] = useState(null);
  const [planet3, setPlanet3] = useState(null);


  const fetchPlanets = async () => {
    try {
      const [p1, p2, p3] = await Promise.all([
        axios.get(buildApiUrl("/api/planets/mars")),
        axios.get(buildApiUrl("/api/planets/jupiter")),
        axios.get(buildApiUrl("/api/planets/saturn")),
      ]);


      setPlanet1(p1.data);
      setPlanet2(p2.data);
      setPlanet3(p3.data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchPlanets();
  }, []);


  // Ricalcola l'altezza quando cambiano i pianeti
  useEffect(() => {
    if (planet1 && planet2 && planet3) {
      setTimeout(() => {
        if (contentRef.current) {
          const contentHeight = contentRef.current.scrollHeight;
          const windowHeight = window.innerHeight;
          const calculatedHeight = Math.max(contentHeight + 42, windowHeight);
          setContainerHeight(`${calculatedHeight}px`);
        }
      }, 100);
    }
  }, [planet1, planet2, planet3]);


  return (
    <div
      style={{ width: "100%", height: containerHeight, position: "relative", minHeight: "100vh" }}
      className="container-jumbotrone"
    >
      <Galaxy
        saturation={0.8}
        hueShift={140}
        density={1.9}
        starSpeed={1.3}
        mouseRepulsion={false}
      />


      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          paddingTop: 200,
        }}
      >
        <BlurText
          text="Benvenuto in Space Domicile"
          delay={400}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="titolo-jumbotrone"
        />


        <GradientText
          className="descrizione-jumbotrone"
          style={{ display: "inline-block", textAlign: "center" }}
        >
          Il futuro dell'umanità non è più sulla Terra. Oggi puoi rivendicare il
          tuo posto tra le stelle.
          <br />
          Non guardare lo spazio. Entraci dentro.
        </GradientText>


        <div className="cards-wrapper">
          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <GradientText className="card-title">Pianeti Reali</GradientText>
            <p>Terreni su pianeti realmente scoperti dalla NASA e dall'ESA</p>
          </div>


          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faCertificate} />
            </div>
            <GradientText className="card-title">
              Certificato Ufficiale
            </GradientText>
            <p>Ricevi un certificato di proprietà galattica registrato</p>
          </div>


          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faStar} />
            </div>
            <GradientText className="card-title">
              Investimento Unico
            </GradientText>
            <p>Possiedi un pezzo di universo per sempre</p>
          </div>


          <div className="glass-card">
            <div className="icon">
              <FontAwesomeIcon icon={faRocket} />
            </div>
            <GradientText className="card-title">
              Spedizione gratuita
            </GradientText>
            <p>Del tuo attestato con un minimo d'acquisto di 1500€</p>
          </div>
        </div>


        <h2 className="classe">SCEGLI LA TUA GALASSIA PREFERITA</h2>


        <div className="container-galassie">
          <div className="cards-container-2">
            <Link to="/galaxies/milky-way" className="glass-card-2">
              <img src={milkyWay} alt="Via Lattea" className="card-image" />
              <GradientText className="card-title">
                <h2>Esplora la Via Lattea</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>


          <div className="cards-container-2">
            <Link to="/galaxies/andromeda" className="glass-card-2">
              <img src={andromeda} alt="Andromeda" className="card-image" />
              <GradientText className="card-title">
                <h2>Esplora Andromeda</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>


          <div className="cards-container-2">
            <Link to="/galaxies/sombrero" className="glass-card-2">
              <img
                src={sombrero}
                alt="Sombrero"
                className="card-image card-image-sombrero"
              />
              <GradientText className="card-title">
                <h2>Esplora Sombrero</h2>
              </GradientText>
              <p>Scopri stelle, pianeti e sistemi abitabili.</p>
            </Link>
          </div>
        </div>


        <h2 className="classe">I PIANETI PIU' POPOLARI</h2>


        <div className="container-galassie">
          {planet1 && (
            <div className="cards-container-2">
              <Link
                to={`/galaxies/${planet1.galaxy_slug}/${planet1.slug}`}
                className="glass-card-2"
              >
                <img src={planet1.image} alt={planet1.name} className="card-image" />
                <GradientText className="card-title">
                  <h2>{planet1.name}</h2>
                </GradientText>
                <p>{planet1.description}</p>
              </Link>
            </div>
          )}


          {planet2 && (
            <div className="cards-container-2">
              <Link
                to={`/galaxies/${planet2.galaxy_slug}/${planet2.slug}`}
                className="glass-card-2"
              >
                <img
                  src={planet2.image}
                  alt={planet2.name}
                  className="card-image pianeta-piccolo"
                />
                <GradientText className="card-title">
                  <h2>{planet2.name}</h2>
                </GradientText>
                <p>{planet2.description}</p>
              </Link>
            </div>
          )}


          {planet3 && (
            <div className="cards-container-2">
              <Link
                to={`/galaxies/${planet3.galaxy_slug}/${planet3.slug}`}
                className="glass-card-2"
              >
                <img
                  src={planet3.image}
                  alt={planet3.name}
                  className="card-image pianeta-piccolo"
                />
                <GradientText className="card-title">
                  <h2>{planet3.name}</h2>
                </GradientText>
                <p>{planet3.description}</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
