import axios from 'axios';


export class DataService {
    static apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTFkYzVkNjU0M2E5YzgzM2IxNDNhODc5MGVlOTk5NSIsInN1YiI6IjYxZjJlODA2OWEzYzQ5MDA0NDY5NDU4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZFB-6d11GjxbaPcH9IsJiTHo4e2IxxNspyF0MmDYpJU"
    static baseUrl = "https://api.themoviedb.org/3"
    static imageUrl = "https://image.tmdb.org/t/p/original"

    static setupAxios(){
        axios.defaults.headers.common = { Authorization: `Bearer ${this.apiKey}` }
        axios.defaults.baseURL = this.baseUrl
    }

    static async getTrendingMovies() {
        this.setupAxios()

        const contentType = "movies"
        const timeWindow = "week"

        try {
            var response = await axios(
                {
                method: 'get',
                url: `/trending/${contentType}/${timeWindow}`,
            })
        } catch (error){
            console.log(error)
        }

        console.log(response)

        const moviesObject = response.data.results.map(movie => {
            return {
                title: movie.title,
                overview: movie.overview,
                image: this.imageUrl + movie.backdrop_path,
                rating: movie.vote_average
            }
        })

        return moviesObject
    }
}

