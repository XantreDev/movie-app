import {
    getCachedCardsList,
    isCachedCardsListExist
} from '../../local-storage/cacheCardsList';
import { MoviesDataService } from '../../DataService/MoviesDataService';
export const CARDSLIST_ACTIONS_TYPE = {
    SET_CARDLIST: 'setSlide',
    GRAB_CARDSLIST_FROM_CACHE: 'readSlideFromCache',
    LOAD_CARDSLIST: 'loadCardsList'
}

export const CARDSLIST_LOAD_SIDES = {
    LEFT: 'left',
    RIGHT: 'right'
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

const cardsListReducer = async (state = null, action) => {
    switch (action.type) {
        case CARDSLIST_ACTIONS_TYPE.SET_CARDLIST:
            return action.payload
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
        case CARDSLIST_ACTIONS_TYPE.LOAD_CARDSLIST:
            if (state === null) {
                const loadedCards = await MoviesDataService.getMoviesDiscoverPage(1)
                return cardsListsFabric({
                    ...CARDLIST_OBJECT,
                    loadedCards: loadedCards
                })
            }
            const targetPage = CARDLIST_OBJECT.lastPage
            const loadedCards = await MoviesDataService.getMoviesDiscoverPage(targetPage)
            if (action.payload === CARDSLIST_LOAD_SIDES.LEFT) {
                return cardsListsFabric({
                    currentCard: state.currentCard + loadedCards.length,
                    loadedCards: [...loadedCards, state.loadedCards],
                    lastPage: targetPage + 1
                })
            }

            return cardsListsFabric({
                currentCard: state.currentCard,
                loadedCards: [state.loadedCards, ...loadedCards],
                lastPage: targetPage + 1
            })
        default:
            return state 
 
    }
}

export default cardsListReducer