export enum Pages {
  Main = "",
  Search = "search",
  Details = "details",
}

export const Params = {
  searchQuery: "searchQuery",
  movieId: "movieId",
} as const;

export const PATHS = {
  MAIN: Pages.Main,
  SEARCH: `${Pages.Search}/:${Params.searchQuery}`,
  DETAILS: `${Pages.Details}/:${Params.movieId}`,
} as const;

export const GET_PATH = {
  MAIN: Pages.Main,
  SEARCH: (query: string) => `${Pages.Search}/${query}`,
  DETAILS: (movieId: number | string) => `${Pages.Details}/${movieId}`,
};

export const getPath = () => window.location.pathname;
