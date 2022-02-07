import { SEARCH_ACTION_TYPES } from '../reducers/searchReducer';
import { NAVIGATE_ACTION_TYPES } from '../reducers/navigateReducer';

export const changeSearchRequest = (searchRequest) => {
    return dispatch => {
        dispatch({
            type: SEARCH_ACTION_TYPES.TEXT_CHANGE,
            payload: searchRequest
        })
    }
}

export const grabCachedSearchRequest = _ => {
    return dispatch => {
        dispatch({
            type: SEARCH_ACTION_TYPES.GRAB_CACHED_TEXT
        })
    }
}

export const setNavigate = (navigate) => {
    return dispatch => {
        dispatch({
            type: NAVIGATE_ACTION_TYPES.SET_NAVIGATION,
            payload: navigate
        })
    }
}

export const unsetNavigate = _ => {
    return dispatch => {
        dispatch({
            type: NAVIGATE_ACTION_TYPES.UNSET_NAVIGATION
        })
    }
}