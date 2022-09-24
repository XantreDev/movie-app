import produce from "immer";
import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef
} from "react";

import { MoviesDataService } from "../DataService/MoviesDataService";
import {
  MoviesData,
  MoviesDataActions,
  MoviesDataLoaded,
  SliderMetaInfo
} from "../types/context";
import { Movie } from "../types/movie";
import { AC } from "./actionCreaters";

const initialState: MoviesData = { isGeneresLoading: true };

const reducer: React.Reducer<MoviesData, MoviesDataActions> = (
  state = initialState,
  action: MoviesDataActions
) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case "init": {
        const generes = action.payload;
        return {
          isGeneresLoading: false,
          data: generes.map((genre) => ({
            currentCenter: 10,
            genre,
            movies: [],
            lastPage: 1,
          })),
        };
      }
      case "add-movies-at-row": {
        const { direction, genre, movies } = action.payload;
        if (draftState.isGeneresLoading !== false) return;
        const realDraft = draftState;
        const targetIndex = realDraft.data.findIndex(
          (value) => value.genre.id === genre.id
        );
        if (targetIndex === -1) return;
        realDraft.data[targetIndex].lastPage++;
        if (direction === "left") {
          realDraft.data[targetIndex].movies.unshift(...movies);
          realDraft.data[targetIndex].currentCenter += movies.length;
          return;
        }
        realDraft.data[targetIndex].movies.push(...movies);
        return;
      }
      case "set-loaded-movies": {
        if (draftState.isGeneresLoading !== false) return;
        const realDraft = draftState;
        const { genre, loadStarted, movies } = action.payload;

        const rowIndex = realDraft.data.findIndex(
          (value) => value.genre.id === genre.id
        );
        if (rowIndex === -1) return;

        realDraft.data[rowIndex].movies = realDraft.data[rowIndex].movies.map(
          (
            (currentIndex = 0) =>
            (movie: Movie): Movie => {
              if (currentIndex === movies.length) return movie;
              if (movie.isLoading && movie.loadStarted.isSame(loadStarted)) {
                return {
                  ...movies[currentIndex++],
                };
              }
              return movie;
            }
          )()
        );
        break;
      }
      case "change-index": {
        if (draftState.isGeneresLoading) return;
        const { genre, type } = action.payload;
        const realDraft = draftState as MoviesDataLoaded;

        const rowIndex = realDraft.data.findIndex(
          (value) => value.genre.id === genre.id
        );
        if (rowIndex === -1) return;

        const center = realDraft.data[rowIndex].currentCenter;
        realDraft.data[rowIndex].currentCenter =
          type === "decriment" ? center - 1 : center + 1;
        break;
      }
      case "update-movie": {
        if (draftState.isGeneresLoading) return;
        const { genre, id, movie } = action.payload;
        const realDraft = draftState as MoviesDataLoaded;

        const rowIndex = realDraft.data.findIndex(
          (value) => value.genre.id === genre.id
        );
        if (rowIndex === -1) return;

        const filmIndex = realDraft.data[rowIndex].movies.findIndex(
          (value) => value.id === id
        );
        if (filmIndex === -1) return;

        realDraft.data[rowIndex].movies[filmIndex] = movie;
        break;
      }
      default: {
        return;
      }
    }
  });

export const moviesDataContext = createContext({} as MoviesData);
export const moviesDataContextDispatch = createContext(
  {} as React.Dispatch<MoviesDataActions>
);
export const indexesRefContext = createContext(
  {} as React.MutableRefObject<SliderMetaInfo>
);

const MoviesDataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const indexRef = useRef<SliderMetaInfo>({
    rowIndex: 0,
    columnIndexes: [],
    rowLastPage: [],
  });

  useLayoutEffect(() => {
    if (
      state.isGeneresLoading === false &&
      !Object.keys(indexRef.current.columnIndexes).length
    ) {
      indexRef.current.columnIndexes = state.data.reduce<
        SliderMetaInfo["columnIndexes"]
      >(
        (prev, { currentCenter, genre }) => ({
          [genre.id]: currentCenter,
          ...prev,
        }),
        {}
      );
      indexRef.current.rowLastPage = state.data.reduce<
        SliderMetaInfo["rowLastPage"]
      >((state, { genre: { id } }) => ({ ...state, [id]: 1 }), {});
    }
  }, [state]);

  useEffect(() => {
    (async () => {
      try {
        const generes = await MoviesDataService.getGeneres();
        dispatch(AC.initStoreWithGeneres(generes));
      } catch {}
    })();
  }, []);

  return (
    <moviesDataContext.Provider value={state}>
      <moviesDataContextDispatch.Provider value={dispatch}>
        <indexesRefContext.Provider value={indexRef}>
          {children}
        </indexesRefContext.Provider>
      </moviesDataContextDispatch.Provider>
    </moviesDataContext.Provider>
  );
};

export default MoviesDataProvider;
