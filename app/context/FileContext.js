// src/context/FileContext.js
"use client";
import { createContext, useContext, useState } from "react";

const FileContext = createContext({
  file: null,
  setFile: () => {},
});

export const FileProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => useContext(FileContext);
