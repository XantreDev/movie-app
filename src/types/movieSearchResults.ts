export type MoviesSearchRequest = {
  status: RequestStatus.Loading | RequestStatus.Error
} | {
  status: RequestStatus.Finished,
  data: MoviesSearchResultTransformed[]
}

export enum RequestStatus { Loading = 'loading', Error = 'error', Finished = 'finished'}

export interface MovieSearchData {
  page:          number;
  results:       MoviesSearchResult[];
  total_pages:   number;
  total_results: number;
}

export type MoviesSearchResultTransformed = MoviesSearchResult & {
  posterUrl: string,
  backdropUrl: string
}

export type MoviesSearchResult = {
  adult:             boolean;
  backdrop_path:     null | string;
  genre_ids:         number[];
  id:                number;
  original_language: OriginalLanguage;
  original_title:    string;
  overview:          string;
  popularity:        number;
  poster_path:       string;
  release_date:      string;
  title:             string;
  video:             boolean;
  vote_average:      number;
  vote_count:        number;
} 

export enum OriginalLanguage {
  En = "en",
  Es = "es",
}
