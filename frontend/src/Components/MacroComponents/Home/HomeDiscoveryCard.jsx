import { Link } from "react-router-dom";
import GradientText from "../../ReactBits/GradientText";

export default function HomeDiscoveryCard({
  to,
  imageSrc,
  imageAlt,
  title,
  description,
  imageClassName = "",
}) {
  const classes = imageClassName ? `card-image ${imageClassName}` : "card-image";

  return (
    <div className="cards-container-2">
      <Link to={to} className="glass-card-2">
        <img src={imageSrc} alt={imageAlt} className={classes} />
        <GradientText className="card-title">
          <h2>{title}</h2>
        </GradientText>
        <p>{description}</p>
      </Link>
    </div>
  );
}
