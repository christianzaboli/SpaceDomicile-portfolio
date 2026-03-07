import { NavLink } from "react-router-dom";
import galaxyIcon from "/img/galaxy-icon.png";
import CartBadge from "./CartBadge";
import { useState, useEffect } from "react";
import { scrollToTop } from "../../libs/utils";

export default function NavBar({ setDrawerOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [mobileOpen]);

  const clicknav = () => {
    setMobileOpen(false);
    scrollToTop();
  };
  return (
    <nav>
      <div className="nav-cont">
        <NavLink to="/">
          <div className="rocket" onClick={scrollToTop}>
            <img
              src={galaxyIcon}
              alt="Galassia"
              className="galaxy-header-icon logo-dim"
            />
            <p>Space Domicile</p>
          </div>
        </NavLink>
        <div className="nav-cont-right">
          {/* hamburger menu mobile */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className="fa-solid fa-bars" style={{ color: "#ffffff" }}></i>
          </button>
          <div className={`links ${mobileOpen ? "open" : ""}`}>
            <NavLink
              to="/galaxies"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => clicknav()}
            >
              <span>
                Galassie
                <i className="fa-solid fa-shuttle-space marg"></i>
              </span>
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => clicknav()}
            >
              <span>
                Cerca
                <i className="fa-solid fa-magnifying-glass marg"></i>
              </span>
            </NavLink>

            <NavLink
              to="/about-us"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => clicknav()}
            >
              <span>
                Chi Siamo
                <i className="fa-regular fa-address-card marg"></i>
              </span>
            </NavLink>

            <NavLink
              to="/contact-us"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => clicknav()}
            >
              <span>
                Contattaci!
                <i className="fa-regular fa-message marg"></i>
              </span>
            </NavLink>
          </div>
          <div
            className={`menu-drawer-overlay ${mobileOpen ? "open" : ""}`}
          ></div>

          <button onClick={() => setDrawerOpen(true)} className="cart">
            <CartBadge />
          </button>
        </div>
      </div>
    </nav>
  );
}
