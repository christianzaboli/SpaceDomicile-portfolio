export default function TeamMemberCard({ name, cardClass, github, linkedin, facebook }) {
  return (
    <div>
      <div className={`team-card ${cardClass}`}>
        <div className="team-personal-links">
          <div className="team-overlay">
            <h3>{name}</h3>
          </div>

          <div className="socials-container">
            <a href={github} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href={facebook} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
