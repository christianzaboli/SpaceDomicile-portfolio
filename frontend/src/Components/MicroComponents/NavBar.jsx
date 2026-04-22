import { NavLink } from "react-router-dom";
import galaxyIcon from "/img/galaxy-icon.png";
import CartBadge from "./CartBadge.jsx";
import { useEffect, useState } from "react";
import useDrawer from "../../hooks/useDrawer.jsx";
import { NAV_LINKS } from "../../libs/consts.jsx";

function NavBrand({ onClick }) {
  return (
    <NavLink to="/" onClick={onClick}>
      <div className="rocket">
        <img
          src={galaxyIcon}
          alt="Space Domiciles"
          className="galaxy-header-icon logo-dim"
        />
        <p>Space Domiciles</p>
      </div>
    </NavLink>
  );
}

function HamburgerButton({ onToggle }) {
  return (
    <button
      className="hamburger"
      onClick={onToggle}
      aria-label="Open navigation menu"
    >
      <i className="fa-solid fa-bars" style={{ color: "#ffffff" }}></i>
    </button>
  );
}

function NavLinks({ mobileOpen, onClickNav }) {
  return (
    <div className={`links ${mobileOpen ? "open" : ""}`}>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={onClickNav}
        >
          <span>
            {link.label}
            {/* <i className={link.iconClass}></i> */}
          </span>
        </NavLink>
      ))}
    </div>
  );
}

export default function NavBar() {
  const { openDrawer } = useDrawer();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", mobileOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav>
      <div className="nav-cont">
        <NavBrand onClick={closeMobile} />
        <div className="nav-cont-right">
          <HamburgerButton
            onToggle={() => setMobileOpen((current) => !current)}
          />
          <NavLinks mobileOpen={mobileOpen} onClickNav={closeMobile} />
          <div
            className={`menu-drawer-overlay ${mobileOpen ? "open" : ""}`}
          ></div>

          <button
            onClick={openDrawer}
            className="cart"
            aria-label="Open cart drawer"
          >
            <CartBadge />
          </button>
        </div>
      </div>
    </nav>
  );
}
