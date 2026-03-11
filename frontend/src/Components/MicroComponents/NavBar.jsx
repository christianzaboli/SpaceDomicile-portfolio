import { NavLink } from "react-router-dom";
import galaxyIcon from "/img/galaxy-icon.png";
import CartBadge from "./CartBadge.jsx";
import { useState, useEffect } from "react";
import { scrollToTop } from "../../libs/utils.jsx";
import useDrawer from "../../hooks/useDrawer.jsx";
import { NAV_LINKS } from "../../libs/consts.jsx";


function NavBrand({ onClick }) {
  return (
    <NavLink to="/">
      <div className="rocket" onClick={onClick}>
        <img
          src={galaxyIcon}
          alt="Galassia"
          className="galaxy-header-icon logo-dim"
        />
        <p>Space Domicile</p>
      </div>
    </NavLink>
  );
}

function HamburgerButton({ onToggle }) {
  return (
    <button className="hamburger" onClick={onToggle}>
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
            <i className={link.iconClass}></i>
          </span>
        </NavLink>
      ))}
    </div>
  );
}

function CartButton({ onOpenCart }) {
  return (
    <button onClick={onOpenCart} className="cart">
      <CartBadge />
    </button>
  );
}

export default function NavBar() {
  const { openDrawer } = useDrawer();
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
        <NavBrand onClick={clicknav}/>
        <div className="nav-cont-right">
          <HamburgerButton
            onToggle={() => setMobileOpen(!mobileOpen)}
          />
          <NavLinks mobileOpen={mobileOpen} onClickNav={clicknav} />
          <div
            className={`menu-drawer-overlay ${mobileOpen ? "open" : ""}`}
          ></div>

          <CartButton onOpenCart={openDrawer} />
        </div>
      </div>
    </nav>
  );
}
