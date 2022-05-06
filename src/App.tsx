import { AnimatePresence } from "framer-motion";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import SearchBar from "./components/SearchBar";
import MoviesDataProvider from "./contexts/MoviesDataProvider";
import StyleProvider, { styleContext, Styles } from "./contexts/StyleProvider";
import { MoviesDataService } from "./DataService/MoviesDataService";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import DetailsPage from "./pages/DetailsPage";
import { MovieSearchData, MoviesSearchRequest, RequestStatus } from "./types/movieSearchResults";
import { Paths } from './constants/paths'
// import MainPage from "./pages/MainPage";
// import { ActionCreators } from "./state";
// import SearchPage from "./pages/SearchPage";



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


const RootDiv = styled.div<typeof Styles & { path: Paths }>`
  width: 100vw;
  background: ${(props) => props.colors.background};
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
  const cursorRef = useRef<HTMLDivElement>()

  // useEffect(() => {
  //   document.addEventListener('mousemove', (event) => {
  //     // cursorRef.current.style.transform = `translate(${event.x}, ${event.y});`
  //     cursorRef.current.style.left = `${event.pageX}px` 
  //     cursorRef.current.style.top = `${event.pageY}px`
  //     // cursorRef.current.style.top = `100px;`
  //   })
  // }, [])
  const style = useContext(styleContext)
  const [searchRequest, setSearchRequest] = useState("");

  const navigate = useNavigate()
  const location = useLocation()

  console.log(location.pathname)

  useEffect(() => {
    if (searchRequest.length && location.pathname.includes(Paths.Details)){
      setSearchRequest('')
      return 
    }
    if (searchRequest.length && location.pathname !== '/search') {
      navigate('/search')
    }
    if (!searchRequest.length && location.pathname === '/search') {
      navigate('/')
    }
  }, [searchRequest, location])

  const [searchResults, setSearchResults] = useState<MoviesSearchRequest>({ status: RequestStatus.Loading })

  useEffect(() => {
    const currentRequest = searchRequest;
    if (!searchRequest.length){
      return
    }

    (async () => {
      try {
        setSearchResults({status: RequestStatus.Loading})
        const result = await MoviesDataService.findMovieByQuery(searchRequest)
        if (searchRequest !== currentRequest) {
          return;
        }
        setSearchResults({
          data: result,
          status: RequestStatus.Finished
        })
      } catch {
        setSearchResults({
          status: RequestStatus.Error
        })
      }
    })()
  }, [searchRequest])

  const locationPath = useMemo(() => location.pathname.slice(1), [location]) as Paths
    
  return (
    <>
      <BodyStyle path={locationPath}/>
      <div className="App">
      <StyleProvider>
        <MoviesDataProvider>
          <RootDiv path={locationPath} {...style}>
            <SearchBar
              searchRequest={searchRequest}
              setSearchRequest={setSearchRequest}
            />
            <AnimatePresence exitBeforeEnter>
              <Routes location={location} key={location.pathname}>
                <Route key="main-route" path={`/${Paths.Main}`} element={<MainPage />} />
                <Route key="search-route" path={`/${Paths.Search}`} element={<SearchPage data={searchResults} />} />
                <Route key="film-details-route" path={`/${Paths.Details}/:movieId`} element={<DetailsPage />} />
              </Routes>
            </AnimatePresence>
          </RootDiv>
        </MoviesDataProvider>
      </StyleProvider>
    </div>
    {/* <div id="cursor" ref={cursorRef}></div> */}
    {/* <Cursor ref={cursorRef}></Cursor> */}
    </>
  );
}

export default App;
