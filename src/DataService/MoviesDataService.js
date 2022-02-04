import axios from "axios";
import { generateBaseRequest } from "../utils/utils";

let lastDiscoverPage = 1;
export class MoviesDataService {
    static apiKey =
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTFkYzVkNjU0M2E5YzgzM2IxNDNhODc5MGVlOTk5NSIsInN1YiI6IjYxZjJlODA2OWEzYzQ5MDA0NDY5NDU4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZFB-6d11GjxbaPcH9IsJiTHo4e2IxxNspyF0MmDYpJU";
    static apiUrl = "https://api.themoviedb.org/3";

    static baseMovieRequest = generateBaseRequest(this.apiUrl, this.apiKey)

    static async getTrendingMovies() {
        const contentType = "movies";
        const timeWindow = "week";

        var response = await axios({
            method: "get",
            url: `/trending/${contentType}/${timeWindow}`,
        });

        const moviesObject = this.responseToMoviesObject(response);
        return moviesObject;
    }

    static responseToMoviesObject(response) {
        return response.data.results.map((movie) => {
            return {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                image: this.chooseImage(movie),
                rating: movie.vote_average,
            };
        });
    }

    static chooseImage(movie){
        const lowResImageUrl = "https://image.tmdb.org/t/p/w300";
        const middleResImageUrl = "https://image.tmdb.org/t/p/w500"
        const highResImageUrl = "https://image.tmdb.org/t/p/original"

        if (movie.backdrop_path !== null){
            return {
                lowRes: lowResImageUrl + movie.backdrop_path,
                middleRes: middleResImageUrl + movie.backdrop_path,
                highRes: highResImageUrl + movie.backdrop_path
                
            }
        } else if (movie.poster_path !== null){
            return {
                lowRes: lowResImageUrl + movie.poster_path,
                middleRes: middleResImageUrl + movie.poster_path,
                highRes: highResImageUrl + movie.poster_path
            }
        } else {
            return null
        }
    }

    static async getMoviesDiscoverPage() {
        const sortBy = "vote_count.desc";

        const discoverUrl = "/discover/movie";

        const response = await axios({
            ...this.baseMovieRequest,
            method: "get",
            url: discoverUrl,
            params: {
                page: lastDiscoverPage,
                sort_by: sortBy,
            },
        });
        
        const moviesObject = this.responseToMoviesObject(response);

        lastDiscoverPage++;
        return moviesObject;
    }

    static async getMovieInfo(){}

    static async getMovieVideoId(movie_id){
        const movieVideoApiUrl = `/movie/${movie_id}/videos`

        const movieVideos = await axios({
            ...this.baseMovieRequest,
            url: movieVideoApiUrl
        })

        if (movieVideos.data.results.length === undefined){
            return null
        }
        const movieVideo = movieVideos.data.results.filter(movieVideoInfo => movieVideoInfo.site === "YouTube")[0]

        if (movieVideo === undefined) {
            return null
        }

        return movieVideo.key
        
    }
}