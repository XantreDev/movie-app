import { LOCAL_STORAGE_KEYS } from './keys';


export const getCachedCardsList = _ => {
    const cachedMovies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.LOADED_MOVIES))
    const cachedCurrentSlideIndex = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_SLIDE))
    const cachedLastPage = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_PAGE))
    return {cachedMovies, cachedLastPage, cachedCurrentSlideIndex}
}

export const isCachedCardsListExist = _ => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_SLIDE) !== null && 
            localStorage.getItem(LOCAL_STORAGE_KEYS.LOADED_MOVIES) !== null && 
            localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_PAGE) !== null )
}

export const updateCachedCardsList = ({moviesList, lastPage, newCurrentSlide}) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LOADED_MOVIES, JSON.stringify(moviesList))
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_PAGE, JSON.stringify(lastPage))
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_SLIDE, JSON.stringify(newCurrentSlide))
}


export const updateCachedCardsListFromObject = cardsListObject => {
    updateCachedCardsList({
        moviesList: cardsListObject.loadedCards,
        newCurrentSlide: cardsListObject.currentCard,
        lastPage: cardsListObject.lastPage
    })
}

export const updateCachedCardsListCurrentIndex = ({newCurrentIndex}) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_SLIDE, JSON.stringify(newCurrentIndex))
}