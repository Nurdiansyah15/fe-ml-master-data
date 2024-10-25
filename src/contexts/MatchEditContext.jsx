import React, { createContext, useState, useEffect } from "react";

const MatchEditContext = createContext();

export const MatchEditProvider = ({ children }) => {
  const [isEditingMatch, setIsEditingMatch] = useState(() => {
    const storedValue = localStorage.getItem("isEditingMatch");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isEditingMatch", JSON.stringify(isEditingMatch));
  }, [isEditingMatch]);

  const toggleEditing = () => {
    setIsEditingMatch((prevState) => !prevState);
  };

  const removeEditing = () => {
    setIsEditingMatch(false);
    localStorage.removeItem("isEditingMatch");
  };

  return (
    <MatchEditContext.Provider
      value={{ isEditingMatch, toggleEditing, removeEditing }}
    >
      {children}
    </MatchEditContext.Provider>
  );
};

export const useMatchEdit = () => {
  const context = React.useContext(MatchEditContext);
  if (context === undefined) {
    throw new Error("useMatchEdit must be used within a MatchEditProvider");
  }
  return context;
};

export default MatchEditContext;
