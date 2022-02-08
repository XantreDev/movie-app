import { SEARCH_ACTION_TYPES } from '../reducers/searchReducer';
import { NAVIGATE_ACTION_TYPES } from '../reducers/navigateReducer';
import { CARDSLIST_ACTIONS_TYPE } from '../reducers/cardsListReducer'

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

export const setCardsList = slide => {
    return dispatch => {
        dispatch({
            type: CARDSLIST_ACTIONS_TYPE.SET_CARDLIST,
            payload: slide
        })
    }
}

export const grabCardsListFromCache = _ => {
    return dispatch => {
        dispatch({
            type: CARDSLIST_ACTIONS_TYPE.GRAB_CARDSLIST_FROM_CACHE
        })
    }
}

export const loadCardsList = side => {
    return dispatch => {
        dispatch({
            action: CARDSLIST_ACTIONS_TYPE.LOAD_CARDSLIST,
            payload: side,
        })
    }
}