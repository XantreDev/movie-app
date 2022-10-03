import axios from "axios";
import dayjs from "dayjs";

import { LoadedMovie } from "../types/movie";
import { MovieDetailsRest } from "../types/movieDetails";
import {
  MovieSearchData,
  MoviesSearchResultTransformed
} from "../types/movieSearchResults";
import { DataRest, Generes } from "../types/rest";
import { generateBaseRequest } from "../utils/utils";

export class MoviesDataService {
  static apiKey =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTFkYzVkNjU0M2E5YzgzM2IxNDNhODc5MGVlOTk5NSIsInN1YiI6IjYxZjJlODA2OWEzYzQ5MDA0NDY5NDU4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZFB-6d11GjxbaPcH9IsJiTHo4e2IxxNspyF0MmDYpJU";
  static apiUrl = "https://api.themoviedb.org/3";

  private static baseMovieRequest = generateBaseRequest(
    this.apiUrl,
    this.apiKey
  );

  static async getTrendingMovies() {
    const contentType = "movies";
    const timeWindow = "week";

    var response = await axios({
      method: "get",
      url: `/trending/${contentType}/${timeWindow}`,
    });

    const moviesObject = this.transformResponseToMoviesObject(response as any);
    return moviesObject;
  }

  static getGeneres = async () => {
    const result = (
      await axios({
        ...this.baseMovieRequest,
        method: "get",
        url: "/genre/movie/list",
      })
    ).data.genres as Generes;
    return result;
  };

  // static async getTrendingMoviesIn

  private static transformResponseToMoviesObject = (
    data: DataRest
  ): Omit<LoadedMovie, "key">[] =>
    data.results.map((value) => ({
      isLoading: false,
      id: value.id,
      rating: value.vote_average,
      img:
        (value.backdrop_path && this.getImageFromPath(value.backdrop_path)) ||
        (value.poster_path && this.getImageFromPath(value.poster_path)),
      name:
        value.name ||
        value.original_name ||
        value.title ||
        value.original_title ||
        "Noname",
      releaseDate:
        (value?.release_date && dayjs(value?.release_date)) ?? "Unknown",
    }));

  private static getImageFromPath = (path: string) =>
    `${this.middleResImageUrl}${path}`;
  // return response.data.results.map((movie) => {
  //     return {
  //         id: movie.id,
  //         title: movie.title,
  //         overview: movie.overview,
  //         image: this.chooseImage(movie),
  //         rating: movie.vote_average,
  //     };
  // });

  private static lowResImageUrl = "https://image.tmdb.org/t/p/w300";
  private static middleResImageUrl = "https://image.tmdb.org/t/p/w500";
  private static highResImageUrl = "https://image.tmdb.org/t/p/original";

  static chooseImage(movie) {
    const lowResImageUrl = "https://image.tmdb.org/t/p/w300";
    const middleResImageUrl = "https://image.tmdb.org/t/p/w500";
    const highResImageUrl = "https://image.tmdb.org/t/p/original";

    if (movie.backdrop_path !== null) {
      return {
        lowRes: lowResImageUrl + movie.backdrop_path,
        middleRes: middleResImageUrl + movie.backdrop_path,
        highRes: highResImageUrl + movie.backdrop_path,
      };
    } else if (movie.poster_path !== null) {
      return {
        lowRes: lowResImageUrl + movie.poster_path,
        middleRes: middleResImageUrl + movie.poster_path,
        highRes: highResImageUrl + movie.poster_path,
      };
    } else {
      return null;
    }
  }

  static getImageUrl = (
    path: string,
    quality: "original" | "medium" | "crap"
  ) => {
    switch (quality) {
      case "crap": {
        return this.lowResImageUrl + path;
      }
      case "medium": {
        return this.middleResImageUrl + path;
      }
      default: {
        return this.highResImageUrl + path;
      }
    }
  };

  static async getMoviesDiscoverPage(targetPage: number, genre?: Generes[0]) {
    const sortBy = "vote_count.desc";

    const discoverUrl = "/discover/movie";

    const genreOptions = genre
      ? {
          with_genres: `${genre.id}`,
        }
      : {};

    const response = (
      await axios({
        ...this.baseMovieRequest,
        method: "get",
        url: discoverUrl,
        params: {
          page: targetPage,
          sort_by: sortBy,
          ...genreOptions,
        },
      })
    ).data as DataRest;

    const moviesObject = this.transformResponseToMoviesObject(response);

    return moviesObject;
  }

  static async getMovieInfo(movieId) {
    const movieInfoUrl = `/movie/${movieId}`;
    const additionalCategory = "credits";

    const movieInfo = await axios({
      ...this.baseMovieRequest,
      url: movieInfoUrl,
      params: {
        append_to_response: additionalCategory,
      },
    });

    // console.log(movieInfoUrl)
  }

  static async getMovieVideoId(movie_id) {
    const movieVideoApiUrl = `/movie/${movie_id}/videos`;

    const movieVideos = await axios({
      ...this.baseMovieRequest,
      url: movieVideoApiUrl,
    });

    if (movieVideos.data.results.length === undefined) {
      return null;
    }

    const movieVideo = movieVideos.data.results.filter(
      (movieVideoInfo) => movieVideoInfo.site === "YouTube"
    )[0];

    if (movieVideo === undefined) {
      return null;
    }

    return movieVideo.key;
  }

  static findMovieByQuery = async (
    query: string,
    signal?: AbortSignal
  ): Promise<MoviesSearchResultTransformed[]> => {
    const movieFindUrl = "/search/movie";
    const result = (
      await axios({
        ...this.baseMovieRequest,
        url: movieFindUrl,
        params: {
          query,
        },
        signal,
      })
    ).data as MovieSearchData;

    const { getImageUrl } = this;

    return result.results.map((data) => ({
      ...data,
      backdropUrl: getImageUrl(data.backdrop_path, "medium"),
      posterUrl: getImageUrl(data.poster_path, "medium"),
    }));
  };

  static async getMovieDetails(movieId: number) {
    const movieDetailsUrl = `movie/${movieId}`;
    const result = (
      await axios({
        ...this.baseMovieRequest,
        url: movieDetailsUrl,
        params: {
          append_to_response: "credits,reviews,similar,images",
        },
      })
    ).data as MovieDetailsRest;

    return result;
  }
}
