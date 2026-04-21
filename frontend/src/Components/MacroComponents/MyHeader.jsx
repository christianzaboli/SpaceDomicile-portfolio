import { useEffect } from "react";
import NavBar from "../MicroComponents/NavBar.jsx";

export default function MyHeader() {
  useEffect(() => {
    let prevScrollPos = window.pageYOffset;
    const navbar = document.getElementById("navbar");

    if (!navbar) {
      return undefined;
    }

    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      const currentScrollPos = window.pageYOffset;

      if (isMobile) {
        navbar.style.top = "0";
      } else if (prevScrollPos > currentScrollPos) {
        navbar.style.top = "0";
      } else {
        navbar.style.top = "-101px";
      }

      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header className="back-header" id="navbar" style={{ top: "0px" }}>
      <NavBar />
    </header>
  );
}
