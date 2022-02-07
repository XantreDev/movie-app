import { getCachedSearchRequest } from '../../local-storage/cacheSearchRequest';
export const SEARCH_ACTION_TYPES = {
    TEXT_CHANGE: "changeSearchText",
    GRAB_CACHED_TEXT: "cachedText"
}

const searchReducer = (state = null, action) => {
    switch (action.type) {
        case SEARCH_ACTION_TYPES.TEXT_CHANGE:
            return action.payload
        case SEARCH_ACTION_TYPES.GRAB_CACHED_TEXT:
            const localStorageData = getCachedSearchRequest()
            const searchRequest = localStorageData !== null ?
                                  localStorageData :
                                  ""
            return searchRequest
        default:
            return state
    }
}

export default searchReducer