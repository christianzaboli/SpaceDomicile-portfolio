// DIPENDENZE REACT
import { BrowserRouter, Routes, Route } from "react-router-dom";

// LAYOUT
import DefaultLayout from "./Layout/DefaultLayout";

// CONTEXTS
import { DefaultProvider } from "./Contexts/DefaultContext";
import { CartProvider } from "./Contexts/CartContext";
import useDrawer, { DrawerProvider } from "./hooks/useDrawer";

// PAGINE
import HomePage from "./Pages/HomePage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUsPage";
import Planet from "./Pages/Planet";
import CartPage from "./Pages/CartPage";
import SearchPage from "./Pages/SearchPage";
import ComingSoon from "./Pages/ComingSoon";
import CheckOutPage from "./Pages/CheckOutPage";
import GalaxiesList from "./Pages/GalaxiesList";
import GalaxyPage from "./Pages/GalaxyPage";
import NotFoundPage from "./Pages/NotFoundPage";
import Success from "./Pages/Success";

//components
import CartDrawer from "./Components/MicroComponents/CartDrawer";

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

