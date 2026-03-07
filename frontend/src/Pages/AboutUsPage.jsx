import GradientText from "../Components/ReactBits/GradientText";
import BackToHomeBtn from "../Components/MicroComponents/BackToHomeBtn";
import TeamMemberCard from "../Components/MicroComponents/TeamMemberCard";
import { TEAM_MEMBERS } from "../libs/consts";

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
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
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

          <BackToHomeBtn />
        </div>
      </div>
    </>
  );
}
