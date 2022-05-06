import { Dayjs } from "dayjs";

export type Movie = {
  isLoading: true;
  loadStarted: Dayjs;
  id: string;
  key: string;
} | FailedMovie | LoadedMovie

export type FailedMovie = {
  isLoading: false;
  isFailed: true;
  loadStarted: Dayjs;
  id: string;
  key: string;
}

export type ReleaseDate = LoadedMovie["releaseDate"]

export type LoadedMovie = {
  isLoading: false;
  img: string;
  rating: number;
  name: string;
  releaseDate: Dayjs | 'Unknown';
  id: number;
  key: string;
}

