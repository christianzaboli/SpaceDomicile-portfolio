import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DrawerContext = createContext(null);

export function DrawerProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock page scroll
  useEffect(() => {
    document.body.classList.toggle("no-scroll", drawerOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [drawerOpen]);

  // Drawer actions
  const value = useMemo(
    () => ({
      drawerOpen,
      setDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toggleDrawer: () => setDrawerOpen((prev) => !prev),
    }),
    [drawerOpen],
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

export default function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used inside DrawerProvider");
  }

  return context;
}
