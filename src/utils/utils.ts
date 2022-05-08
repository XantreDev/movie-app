import { Paths } from './../constants/paths';
import { NavigateFunction } from 'react-router-dom';
export const generateBaseRequest = (baseUrl: string, apiKey: string) => ({
    "baseURL": baseUrl,
    headers: {
        Authorization: `Bearer ${apiKey}`
    },
})

export const redirectToMovie = (navigate: NavigateFunction, movieId: string | number) => {
  navigate(`/${Paths.Details}/${movieId}`)
} 

export const getFormattedRating = (rating: string | number) => rating.toString().includes('.') ? rating : `${rating}.0`

export const formatRutime = (runtime: number) => `${Math.floor(runtime / 60)}h ${runtime % 60}m`

export const getGoogleUrl = (query: string) => `https://www.google.com/search?q=${query}`