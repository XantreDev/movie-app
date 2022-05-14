import { AnimatePresence } from "framer-motion";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import SearchBar from "./components/SearchBar";
import MoviesDataProvider from "./contexts/MoviesDataProvider";
import StyleProvider from "./contexts/StyleProvider";
import { MoviesDataService } from "./DataService/MoviesDataService";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import DetailsPage from "./pages/DetailsPage";
import { MovieSearchData, MoviesSearchRequest, RequestStatus } from "./types/movieSearchResults";
import { HelmetProvider } from "react-helmet-async";
import { Paths } from './constants/paths'
import NotificationsProvider from "./components/NotificationsProvider";
import ModalProvider from "./components/ModalProvider";
import AllProviders from "./components/AllProviders";


const Cursor = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, .5);
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  transform-origin: center;
  border-radius: 50%;

  z-index: 10;
  pointer-events: none;
  transition: 100ms ease-out;
`


const RootDiv = styled.div<{ path: Paths }>`

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  background: ${(props) => props.theme.colors.background};
  ${
    ({path}) => {
      if (path === Paths.Main) {
        return "height: 100vh;"
      }
      return "min-height: 100vh; background: #000;"
    }
  }
  transition: background 100ms;
  
`;

const BodyStyle = createGlobalStyle<{path: Paths}>`
  body {
    overflow-x: hidden;
    overflow-y:${({path}) => path === Paths.Main ? 'hidden' : 'scroll'};
  }
`


function App() {
  const cursorRef = useRef<HTMLDivElement>();

  const navigate = useNavigate();
  const location = useLocation() ?? { pathname: "" };

  const locationPath = useMemo(() => {
    if (location.pathname.includes(Paths.Details)) return Paths.Details;
    if (location.pathname.includes(Paths.Search)) return Paths.Search;
    return Paths.Main;
  }, [location]) as Paths;

  return (
    <AllProviders>
      <div className="App">
        <RootDiv path={locationPath}>
          <BodyStyle path={locationPath} />
            <SearchBar />
            <AnimatePresence exitBeforeEnter>
              <Routes location={location} key={locationPath}>
                <Route
                  key="main-route"
                  path={`/${Paths.Main}`}
                  element={<MainPage />}
                />
                <Route
                  key="search-route"
                  path={`/${Paths.Search}/:searchQuery`}
                  element={<SearchPage />}
                />
                <Route
                  key="film-details-route"
                  path={`/${Paths.Details}/:movieId`}
                  element={<DetailsPage />}
                />
                <Route path={'*'} element={<Navigate to={`/${Paths.Main}`}/>} />
              </Routes>
            </AnimatePresence>
        </RootDiv>
      </div>
      {/* <div id="cursor" ref={cursorRef}></div> */}
      {/* <Cursor ref={cursorRef}></Cursor> */}
    </AllProviders>
  );
}

export default App;
