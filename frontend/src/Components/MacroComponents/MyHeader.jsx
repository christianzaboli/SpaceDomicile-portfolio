import { useEffect, useRef, useState } from "react";
import NavBar from "../MicroComponents/NavBar.jsx";

const HEADER_OFFSET = 101;
const REVEAL_ZONE = 30;

export default function MyHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      setIsVisible(!isScrollingDown || currentScrollY === 0);

      lastScrollY.current = currentScrollY;
    };

    const handlePointerMove = (event) => {
      if (event.clientY <= REVEAL_ZONE) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <header
      className="back-header"
      style={{ top: isVisible ? "0px" : `-${HEADER_OFFSET}px` }}
    >
      <NavBar />
    </header>
  );
}
