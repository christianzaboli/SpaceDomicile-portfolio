import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCertificate,
  faStar,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import GradientText from "../../ReactBits/GradientText";

const FEATURE_ITEMS = [
  {
    icon: faGlobe,
    title: "Pianeti Reali",
    description: "Terreni su pianeti realmente scoperti dalla NASA e dall'ESA",
  },
  {
    icon: faCertificate,
    title: "Certificato Ufficiale",
    description: "Ricevi un certificato di proprieta galattica registrato",
  },
  {
    icon: faStar,
    title: "Investimento Unico",
    description: "Possiedi un pezzo di universo per sempre",
  },
  {
    icon: faRocket,
    title: "Spedizione gratuita",
    description: "Del tuo attestato con un minimo d'acquisto di 1500 EUR",
  },
];

export default function HomeFeatureCards() {
  return (
    <div className="cards-wrapper">
      {FEATURE_ITEMS.map((item) => (
        <div className="glass-card" key={item.title}>
          <div className="icon">
            <FontAwesomeIcon icon={item.icon} />
          </div>
          <GradientText className="card-title">{item.title}</GradientText>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
