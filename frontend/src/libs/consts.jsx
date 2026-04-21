import { FREE_SHIPPING_THRESHOLD } from "../lib/commerceConfig.js";
import milkyWay from "/img/milky-way.png";
import andromeda from "/img/andromeda.png";
import sombrero from "/img/sombrero.png";
import {
  faGlobe,
  faCertificate,
  faStar,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

export const NAV_LINKS = [
  {
    to: "/galaxies",
    label: "Galassie",
    iconClass: "fa-solid fa-shuttle-space marg",
  },
  {
    to: "/search",
    label: "Cerca",
    iconClass: "fa-solid fa-magnifying-glass marg",
  },
  {
    to: "/about-us",
    label: "Chi Siamo",
    iconClass: "fa-regular fa-address-card marg",
  },
  {
    to: "/contact-us",
    label: "Contattaci!",
    iconClass: "fa-regular fa-message marg",
  },
]

export const TEAM_MEMBERS = [
  {
    name: "Alessandro",
    cardClass: "alessandro",
    github: "https://github.com/Aleiaco02",
    linkedin: "https://www.linkdn.com",
    facebook: "https://www.facebook.com",
  },
  {
    name: "Christian",
    cardClass: "christian",
    github: "https://github.com/christianzaboli",
    linkedin: "https://www.linkedin.com/in/christianzabolivedovi",
    facebook: "https://www.facebook.com/Osazeh",
  },
  {
    name: "Claudia",
    cardClass: "claudia",
    github: "https://github.com/ClaudiaSgalippa",
    linkedin: "https://www.linkedin.com/in/claudia-sgalippa-b966a7181/",
    facebook: "https://www.facebook.com/claudia.sgalippa",
  },
  {
    name: "Daniel",
    cardClass: "daniel",
    github: "https://github.com/Daniel-Di-Fraia",
    linkedin: "https://www.linkdn.com",
    facebook: "https://www.facebook.com/daniel.difraia.1",
  },
  {
    name: "Stefano",
    cardClass: "stefano",
    github: "https://github.com/StefanoSalaa98",
    linkedin: "https://www.linkdn.com",
    facebook: "https://www.facebook.com",
  },
];


export const GALAXY_ITEMS = [
  {
    to: "/galaxies/milky-way",
    imageSrc: milkyWay,
    imageAlt: "Via Lattea",
    title: "Esplora la Via Lattea",
    description: "Scopri stelle e pianeti abitabili nella nostra galassia",
  },
  {
    to: "/galaxies/andromeda",
    imageSrc: andromeda,
    imageAlt: "Andromeda",
    title: "Esplora Andromeda",
    description: "Esplora in largo nella galassia più prossima",
  },
  {
    to: "/galaxies/sombrero",
    imageSrc: sombrero,
    imageAlt: "Sombrero",
    title: "Esplora Sombrero",
    description: "Lo spazio é vasto e fantastico, come i pianeti di questa galassia",
    imageClassName: "card-image-sombrero",
  },
];

export const FEATURE_ITEMS = [
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
    description: `Del tuo attestato con un minimo d'acquisto di ${FREE_SHIPPING_THRESHOLD} EUR`,
  },
];


