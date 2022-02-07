import { LOCAL_STORAGE_KEYS } from './keys';

export const isCachedSearchRequestExist = _ => localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_REQUEST) !== null
export const getCachedSearchRequest = _ => localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_REQUEST)
export const setCachedSearchRequest = searchRequest => localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_REQUEST, searchRequest)