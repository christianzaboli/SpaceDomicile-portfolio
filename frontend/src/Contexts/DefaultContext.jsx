import { createContext, useContext, useMemo, useState } from "react";

export const DefaultContext = createContext();

export function DefaultProvider({ children }) {
  const defaultFilter = useMemo(
    () => ({
      search: "",
      temperatureMin: -273,
      temperatureMax: 550,
      sizeMin: 0,
      sizeMax: 70000000000,
      price: 5000,
      galaxy_slug: "",
      sort: "featured",
    }),
    [],
  );

  const [filters, setFilters] = useState(defaultFilter);

  const updateFilters = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const updateFiltersBatch = (next) =>
    setFilters((prev) => ({ ...prev, ...next }));

  return (
    <DefaultContext.Provider
      value={{
        filters,
        setFilters,
        updateFilters,
        updateFiltersBatch,
        defaultFilter,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  return useContext(DefaultContext);
}
