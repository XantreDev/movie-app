import { Dayjs } from "dayjs";
import { Movie } from "./movie";
import { Generes } from "./rest";

export type MoviesData =
  | { isGeneresLoading: true }
  | MoviesDataLoaded;

export type MoviesDataLoaded = {
  isGeneresLoading: false;
  data: {
    genre: Generes[0];
    currentCenter: number;
    movies: Movie[];
    lastPage: number,
  }[];
}

export type InitWithGeneresAction = {
  type: "init";
  payload: Generes;
};

export type AddMoviesAtGenreRowAction = {
  type: "add-movies-at-row";
  payload: {
    movies: Movie[];
    direction: "left" | "right";
    genre: Generes[0];
  };
};

export type SetLoadedMoviesAction = {
  type: "set-loaded-movies";
  payload: {
    genre: Generes[0];
    loadStarted: Dayjs;
    movies: Movie[];
  };
};

export type UpdateMovieByIdAndGenreAction = {
  type: "update-movie";
  payload: {
    genre: Generes[0];
    movie: Movie;
    id: number;
  };
};

export type IncrementOrDecrimentIndexAction = {
  type: 'change-index',
  payload: {
    genre: Generes[0],
    type: 'increment' | 'decriment'}
}

export type MoviesDataActions =
  | InitWithGeneresAction
  | SetLoadedMoviesAction
  | UpdateMovieByIdAndGenreAction
  | AddMoviesAtGenreRowAction
  | IncrementOrDecrimentIndexAction;
