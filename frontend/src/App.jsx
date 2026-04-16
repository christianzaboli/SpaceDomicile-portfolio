// DIPENDENZE REACT
import { BrowserRouter, Routes, Route } from "react-router-dom";

// LAYOUT
import DefaultLayout from "./Layout/DefaultLayout.jsx";

// CONTEXTS
import { DefaultProvider } from "./Contexts/DefaultContext.jsx";
import { CartProvider } from "./Contexts/CartContext.jsx";
import useDrawer, { DrawerProvider } from "./hooks/useDrawer.jsx";

// PAGINE
import HomePage from "./Pages/HomePage.jsx";
import AboutUsPage from "./Pages/AboutUsPage.jsx";
import ContactUs from "./Pages/ContactUsPage.jsx";
import Planet from "./Pages/Planet.jsx";
import CartPage from "./Pages/CartPage.jsx";
import SearchPage from "./Pages/SearchPage.jsx";
import ComingSoon from "./Pages/ComingSoon.jsx";
import CheckOutPage from "./Pages/CheckOutPage.jsx";
import GalaxiesList from "./Pages/GalaxiesList.jsx";
import GalaxyPage from "./Pages/GalaxyPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import Success from "./Pages/Success.jsx";

//components
import CartDrawer from "./Components/MicroComponents/CartDrawer.jsx";

function AppContent() {
  const { drawerOpen, closeDrawer } = useDrawer();

  return (
    <>
      <CartProvider>
        <DefaultProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path="galaxies">
                  <Route index element={<GalaxiesList />} />
                  <Route path=":galaxySlug" element={<GalaxyPage />} />
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
            <CartDrawer open={drawerOpen} onClose={closeDrawer} />
          </BrowserRouter>
        </DefaultProvider>
      </CartProvider>
    </>
  );
}

function App() {
  return (
    <DrawerProvider>
      <AppContent />
    </DrawerProvider>
  );
}

export default App;
