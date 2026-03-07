import BlurText from "../../ReactBits/BlurText";
import GradientText from "../../ReactBits/GradientText";

export default function HomeIntroSection() {
  return (
    <>
      <BlurText
        text="Benvenuto in Space Domicile"
        delay={400}
        animateBy="words"
        direction="top"
        onAnimationComplete={() => {
          console.log("Animation completed!");
        }}
        className="titolo-jumbotrone"
      />

      <GradientText
        className="descrizione-jumbotrone"
        style={{ display: "inline-block", textAlign: "center" }}
      >
        Il futuro dell'umanita non e piu sulla Terra. Oggi puoi rivendicare il
        tuo posto tra le stelle.
        <br />
        Non guardare lo spazio. Entraci dentro.
      </GradientText>
    </>
  );
}
