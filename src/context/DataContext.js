// src/context/DataContext.js
import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [togetherCreateState, setTogetherCreateState] = useState({}); // 추가된 상태

  return (
    <DataContext.Provider
      value={{
        posts,
        setPosts,
        togetherCreateState,
        setTogetherCreateState,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
