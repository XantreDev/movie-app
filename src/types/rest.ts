export interface DataRest {
  page: number
  results: MovieRest[]
  total_pages: number
  total_results: number
}

export type Generes = {name: string, id: number}[]

export interface MovieRest {
  genre_ids: number[]
  original_language: string
  original_title?: string
  poster_path: string
  video?: boolean
  vote_average: number
  overview: string
  release_date?: string
  vote_count: number
  title?: string
  adult?: boolean
  backdrop_path: string
  id: number
  popularity: number
  media_type: string
  origin_country?: string[]
  first_air_date?: string
  name?: string
  original_name?: string
}