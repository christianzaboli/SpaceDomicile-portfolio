// DIPENDENZE REACT
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// LAYOUT
import DefaultLayout from "./Layout/DefaultLayout";

// CONTEXTS
import { DefaultProvider } from "./Contexts/DefaultContext";
import { CartProvider } from "./Contexts/CartContext";

// PAGINE
import HomePage from "./Pages/HomePage";
import MilkyWayPage from "./Pages/MilkyWayPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUsPage";
import Planet from "./Pages/Planet";
import CartPage from "./Pages/CartPage";
import SearchPage from "./Pages/SearchPage";
import ComingSoon from "./Pages/ComingSoon";
import CheckOutPage from "./Pages/CheckOutPage";
import GalaxiesPage from "./Pages/GalaxiesPage";
import NotFoundPage from "./Pages/NotFoundPage";
import Success from "./Pages/Success";

//components
import CartDrawer from "./Components/MicroComponents/CartDrawer";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [drawerOpen]);
  return (
    <>
      <CartProvider setDrawerOpen={setDrawerOpen}>
        <DefaultProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<DefaultLayout setDrawerOpen={setDrawerOpen} />}>
                <Route index element={<HomePage />} />
                <Route path="galaxies">
                  <Route index element={<GalaxiesPage />} />
                  <Route path=":galaxySlug" element={<MilkyWayPage />} />
                  <Route path=":galaxySlug/:planetSlug" element={<Planet />} />
                </Route>
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/checkout" element={<CheckOutPage />} />
                <Route path="/success" element={<Success />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <CartDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />
          </BrowserRouter>
        </DefaultProvider>
      </CartProvider>
    </>
  );
}

export default App;

