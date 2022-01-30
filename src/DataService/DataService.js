import axios from "axios";

let lastDiscoverPage = 1;
export class DataService {
    static apiKey =
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTFkYzVkNjU0M2E5YzgzM2IxNDNhODc5MGVlOTk5NSIsInN1YiI6IjYxZjJlODA2OWEzYzQ5MDA0NDY5NDU4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZFB-6d11GjxbaPcH9IsJiTHo4e2IxxNspyF0MmDYpJU";
    static baseUrl = "https://api.themoviedb.org/3";
    static imageUrl = "https://image.tmdb.org/t/p/original";

    static setupAxios() {
        axios.defaults.headers.common = {
            Authorization: `Bearer ${this.apiKey}`,
        };
        axios.defaults.baseURL = this.baseUrl;
    }

    static async getTrendingMovies() {
        const contentType = "movies";
        const timeWindow = "week";

        try {
            var response = await axios({
                method: "get",
                url: `/trending/${contentType}/${timeWindow}`,
            });
        } catch (error) {
            console.log(error);
            return {};
        }

        const moviesObject = this.responseToMoviesObject(response);
        return moviesObject;
    }

    static responseToMoviesObject(response) {
        return response.data.results.map((movie) => {
            return {
                title: movie.title,
                overview: movie.overview,
                image: this.chooseImage(movie),
                rating: movie.vote_average,
            };
        });
    }

    static chooseImage(movie){
        if (movie.backdrop_path !== null){
            return this.imageUrl + movie.backdrop_path
        } else if (movie.poster_path !== null){
            return this.imageUrl + movie.poster_path
        } else {
            return null
        }
    }

    static async getMoviesDiscoverPage() {
        const sortBy = "vote_count.desc";

        try {
            var response = await axios({
                method: "get",
                url: "/discover/movie",
                params: {
                    page: lastDiscoverPage,
                    sort_by: sortBy,
                },
            });
        } catch (error) {
            console.log(error);
            return {};
        }

        console.log(lastDiscoverPage);

        const moviesObject = this.responseToMoviesObject(response);
        lastDiscoverPage++;
        return moviesObject;
    }
}

DataService.setupAxios();
