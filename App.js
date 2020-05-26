import React, { useState, createContext } from 'react';
import CardList from "./CardList"
import { SafeAreaView } from "react-native";
export const ThemeContext = createContext({ islight: true })

export default function App() {
  let [theme, settheme] = useState({ islight: true })
  return (
    <SafeAreaView>
      <ThemeContext.Provider value={{ theme, settheme }}>
        <CardList />
      </ThemeContext.Provider>
    </SafeAreaView>
  );
}