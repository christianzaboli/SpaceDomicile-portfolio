import BlurText from "../../ReactBits/BlurText.jsx";
import GradientText from "../../ReactBits/GradientText.jsx";

export default function HomeIntroSection() {
  return (
    <>
      <BlurText
        text="Benvenuti in Space Domicile"
        delay={30}
        animateBy={window.innerWidth <= 768 ? 'words' : "letters" }
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
        Il futuro dell'umanita non e più sulla Terra. 
        <br />
        Oggi puoi rivendicare il
        tuo posto tra le stelle.
        <br />
        Non guardare lo spazio. Entraci dentro.
      </GradientText>
    </>
  );
}
