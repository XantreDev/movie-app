import { AnimatePresence } from "framer-motion";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import AllProviders from "./components/AllProviders";
import SearchBar from "./components/SearchBar";
import { Pages, PATHS } from "./constants/paths";
import { usePage } from "./hooks/usePath";
import DetailsPage from "./pages/DetailsPage";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";

// const Cursor = styled.div`
//   position: absolute;
//   width: 50px;
//   height: 50px;
//   background-color: rgba(255, 255, 255, 0.5);
//   top: 0;
//   left: 0;
//   transform: translate(-50%, -50%);
//   transform-origin: center;
//   border-radius: 50%;

//   z-index: 10;
//   pointer-events: none;
//   transition: 100ms ease-out;
// `;

const RootDiv = styled.div<{ path: Pages }>`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  background: ${(props) => props.theme.colors.background};
  ${({ path }) => {
    if (path === Pages.Main) {
      return "height: 100vh;";
    }
    return "min-height: 100vh; background: #000;";
  }}
  transition: background 100ms;
`;

const BodyStyle = createGlobalStyle<{ path: Pages }>`
  body {
    overflow-x: hidden;
    overflow-y:${({ path }) => (path === Pages.Main ? "hidden" : "scroll")};
  }
`;

function App() {
  const page = usePage();

  return (
    <AllProviders>
      <div className="App">
        <RootDiv path={page}>
          <BodyStyle path={page} />
          <SearchBar />
          <AnimatePresence exitBeforeEnter>
            <Routes key={page}>
              <Route path={PATHS.MAIN} element={<MainPage />} />
              <Route path={PATHS.SEARCH} element={<SearchPage />} />
              <Route path={PATHS.DETAILS} element={<DetailsPage />} />
              <Route path={"*"} element={<Navigate to={PATHS.MAIN} />} />
            </Routes>
          </AnimatePresence>
        </RootDiv>
      </div>
    </AllProviders>
  );
}

export default App;
