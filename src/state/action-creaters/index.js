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

export const setLoadedMovies = movies => {
    return dispatch => {
        dispatch({
            type: CARDSLIST_ACTIONS_TYPE.SET_LOADED_MOVIES,
            payload: movies
        })
    }
}

export const appendCardsListLeft = movies => {
    return dispatch => {
        dispatch({
            type: CARDSLIST_ACTIONS_TYPE.APPEND_CARDSLIST_LEFT,
            payload: movies
        })
    }
}

export const appendCardsListRight = movies => {
    return dispatch => {
            dispatch({
                type: CARDSLIST_ACTIONS_TYPE.APPEND_CARDSLIST_RIGHT,
                payload: movies
        })
    }
}

export const moveCurrentCardLeft = _ => dispatch => dispatch({ type: CARDSLIST_ACTIONS_TYPE.MOVE_CURRENT_CARD_LEFT })
export const moveCurrentCardRight = _ => dispatch => dispatch({ type: CARDSLIST_ACTIONS_TYPE.MOVE_CURRENT_CARD_RIGHT })


export const grabCardsListFromCache = _ => {
    return dispatch => {
        dispatch({
            type: CARDSLIST_ACTIONS_TYPE.GRAB_CARDSLIST_FROM_CACHE
        })
    }
}
