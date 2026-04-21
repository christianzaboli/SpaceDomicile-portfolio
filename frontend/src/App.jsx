import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import DefaultLayout from "./Layout/DefaultLayout.jsx";
import { DefaultProvider } from "./Contexts/DefaultContext.jsx";
import { CartProvider } from "./Contexts/CartContext.jsx";
import useDrawer, { DrawerProvider } from "./hooks/useDrawer.jsx";
import CartDrawer from "./Components/MicroComponents/CartDrawer.jsx";
import AppLoader from "./Components/MicroComponents/AppLoader.jsx";
import ScrollToTop from "./Components/app/ScrollToTop.jsx";

const HomePage = lazy(() => import("./Pages/HomePage.jsx"));
const AboutUsPage = lazy(() => import("./Pages/AboutUsPage.jsx"));
const ContactUsPage = lazy(() => import("./Pages/ContactUsPage.jsx"));
const PlanetPage = lazy(() => import("./Pages/Planet.jsx"));
const CartPage = lazy(() => import("./Pages/CartPage.jsx"));
const SearchPage = lazy(() => import("./Pages/SearchPage.jsx"));
const ComingSoonPage = lazy(() => import("./Pages/ComingSoon.jsx"));
const CheckoutPage = lazy(() => import("./Pages/CheckOutPage.jsx"));
const GalaxiesListPage = lazy(() => import("./Pages/GalaxiesList.jsx"));
const GalaxyPage = lazy(() => import("./Pages/GalaxyPage.jsx"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage.jsx"));
const SuccessPage = lazy(() => import("./Pages/Success.jsx"));

function AppContent() {
  const { drawerOpen, closeDrawer } = useDrawer();

  return (
    <CartProvider>
      <DefaultProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense
            fallback={
              <AppLoader text="Caricamento catalogo..." minHeight="55vh" />
            }
          >
            <Routes>
              <Route element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path="galaxies">
                  <Route index element={<GalaxiesListPage />} />
                  <Route path=":galaxySlug" element={<GalaxyPage />} />
                  <Route
                    path=":galaxySlug/:planetSlug"
                    element={<PlanetPage />}
                  />
                </Route>
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
          <CartDrawer open={drawerOpen} onClose={closeDrawer} />
        </BrowserRouter>
      </DefaultProvider>
    </CartProvider>
  );
}

export default function App() {
  return (
    <DrawerProvider>
      <AppContent />
    </DrawerProvider>
  );
}
