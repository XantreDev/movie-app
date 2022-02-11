import {
    getCachedCardsList,
    isCachedCardsListExist
} from '../../local-storage/cacheCardsList';
import { MoviesDataService } from '../../DataService/MoviesDataService';
export const CARDSLIST_ACTIONS_TYPE = {
    SET_LOADED_MOVIES: 'setSlide',
    GRAB_CARDSLIST_FROM_CACHE: 'readSlideFromCache',
    APPEND_CARDSLIST_LEFT: 'appendLeft',
    APPEND_CARDSLIST_RIGHT: 'appendRight',
    MOVE_CURRENT_CARD_LEFT: 'moveLeft',
    MOVE_CURRENT_CARD_RIGHT: 'moveRight',
    LOAD_CARDSLIST: 'loadCardsList'
}

const CARDLIST_OBJECT = {
    currentCard: 10,
    loadedCards: [],
    lastPage: 1
}

const cardsListsFabric = ({ currentCard, loadedCards, lastPage }) => {
    return {
        currentCard,
        loadedCards,
        lastPage
    }
}

const cardsListReducer = (state = CARDLIST_OBJECT, action) => {
    switch (action.type) {
        case CARDSLIST_ACTIONS_TYPE.SET_LOADED_MOVIES:
            return cardsListsFabric({
                ...state,
                loadedCards: [...action.payload],
                lastPage: 2
            })
        case CARDSLIST_ACTIONS_TYPE.GRAB_CARDSLIST_FROM_CACHE:
            if (isCachedCardsListExist()) {
                const { cachedMovies: loadedCards, cachedCurrentSlideIndex: currentCard, lastPageIndex } = getCachedCardsList()
                return cardsListsFabric({
                    loadedCards,
                    currentCard,
                    lastPage: lastPageIndex
                })
            }
            else {
                return CARDLIST_OBJECT
            }
        case CARDSLIST_ACTIONS_TYPE.APPEND_CARDSLIST_LEFT:
            return cardsListsFabric({
                currentCard: state.currentCard + action.payload.length,
                loadedCards: [...action.payload, ...state.loadedCards],
                lastPage: state.lastPage + 1
            })
        case CARDSLIST_ACTIONS_TYPE.APPEND_CARDSLIST_RIGHT:
            return cardsListsFabric({
                currentCard: state.currentCard,
                loadedCards: [...state.loadedCards, ...action.payload],
                lastPage: state.lastPage + 1
            })
        case CARDSLIST_ACTIONS_TYPE.MOVE_CURRENT_CARD_LEFT:
            return cardsListsFabric({
                currentCard: state.currentCard - 1,
                loadedCards: state.loadedCards,
                lastPage: state.lastPage
            })
        case CARDSLIST_ACTIONS_TYPE.MOVE_CURRENT_CARD_RIGHT:
            console.log(state)
            return cardsListsFabric({
                currentCard: state.currentCard + 1,
                loadedCards: state.loadedCards,
                lastPage: state.lastPage
            })
        default:
            return state 
 
    }
}

export default cardsListReducer