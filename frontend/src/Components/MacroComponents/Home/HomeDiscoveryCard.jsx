import { Link } from "react-router-dom";
import GradientText from "../../ReactBits/GradientText.jsx";
import { scrollToTop } from "../../../libs/utils.jsx";

export default function HomeDiscoveryCard({
  to,
  imageSrc,
  imageAlt,
  title,
  description,
  imageClassName = "",
}) {
  const classes = imageClassName
    ? `card-image ${imageClassName}`
    : "card-image";

  return (
    <Link to={to} className="glass-card-2" onClick={scrollToTop}>
      <div className="home-discovery-header">
        <GradientText className="card-title">
          <h2>{title}</h2>
        </GradientText>
      </div>
      <div className="home-discovery-visual-shell">
        <img src={imageSrc} alt={imageAlt} className={classes} />
      </div>

      <div className="home-discovery-body">
        <p>{description}</p>
      </div>
    </Link>
  );
}
