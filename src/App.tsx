import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import StyleProvider from "./contexts/StyleProvider";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
// import MainPage from "./pages/MainPage";
// import { ActionCreators } from "./state";
// import SearchPage from "./pages/SearchPage";

function App() {
  const navigation = useNavigate();

  return (
    <div className="App">
      <StyleProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </StyleProvider>
    </div>
  );
}

export default App;
