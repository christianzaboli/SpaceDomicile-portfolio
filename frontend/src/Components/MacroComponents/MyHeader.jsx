import NavBar from "../MicroComponents/NavBar";
export default function MyHeader({ setDrawerOpen }) {
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("navbar").style.top = "0";
    } else {
      document.getElementById("navbar").style.top = "-101px";
    }
    prevScrollpos = currentScrollPos;
  };
  return (
    <header className="back-header" id="navbar" style={{ top: "0px" }}>
      <NavBar setDrawerOpen={setDrawerOpen} />
    </header>
  );
}

