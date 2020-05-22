import React, { useState, createContext } from 'react';
import CardList from "./CardList"
export const ThemeContext = createContext({ islight: true })

export default function App() {
  let [theme, settheme] = useState({ islight: true })
  let Theme = { theme }
  return (
    <ThemeContext.Provider value={{ theme, settheme }}>
      <CardList />
    </ThemeContext.Provider>
  );
}