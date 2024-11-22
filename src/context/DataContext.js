// src/context/DataContext.js
import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [togetherCreateState, setTogetherCreateState] = useState({}); 
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <DataContext.Provider
      value={{
        posts,
        setPosts,
        togetherCreateState,
        setTogetherCreateState,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
