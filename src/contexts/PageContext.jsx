"use client";

import { createContext, useCallback, useState } from "react";

export const PageContext = createContext();

export function PageProvider({ children }) {
  const [pageTitle, setPageTitle] = useState("Home");
  const [actionButtons, setActionButtons] = useState(null);

  const updatePage = useCallback((title, buttons) => {
    setPageTitle(title);
    setActionButtons(buttons);
  }, []);

  const contextValue = {
    pageTitle,
    actionButtons,
    updatePage,
  };

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}
