import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit';
import { ActionCreators } from '../state';
import { MoviesDataService } from '../DataService/MoviesDataService';
import { useEffect } from 'react';
import { useRef } from 'react';

export const SIDES = {
    LEFT: 'left',
    RIGHT: 'right'
}

export const useCardsControl = (callback) => {
    const cardsList = useSelector(callback)
    const dispatch = useDispatch()
    const isUpdating = useRef(true)

    const offset = 3;
    const { appendCardsListLeft, appendCardsListRight, 
            moveCurrentCardLeft, moveCurrentCardRight,
            setLoadedMovies } = bindActionCreators(ActionCreators, dispatch)

    const notInOffset = (position, cards) => position < offset || position >= cards.loadedCards.length - offset ;

    const updateCardsList = (direction, cards) => {
        isUpdating.current = true
        MoviesDataService.getMoviesDiscoverPage(cards.lastPage).then(data => {
            if (direction === SIDES.LEFT) appendCardsListLeft(data)
            if (direction === SIDES.RIGHT) appendCardsListRight(data)
            isUpdating.current = false
        })
    }
    
    useEffect(_ => {
        MoviesDataService.getMoviesDiscoverPage(1)
             .then(data => { 
                setLoadedMovies(data)
                isUpdating.current = false
            })
    }, [])
    
    const isInBoundaries = (newIndex, cards) => newIndex >= 0 && newIndex < cards.loadedCards.length

    const cardChange = direction => {
        const newIndex = direction === SIDES.LEFT ? cardsList.currentCard - 1 : cardsList.currentCard + 1
        if (!isInBoundaries(newIndex, cardsList)) return
        if (direction === SIDES.LEFT) moveCurrentCardLeft()
        if (direction === SIDES.RIGHT) moveCurrentCardRight()

        if (!isUpdating.current && notInOffset(cardsList.currentCard, cardsList)) updateCardsList(direction, cardsList) 
        
    }
    const isElementExist = index => (isInBoundaries(index, cardsList) && cardsList.loadedCards !== undefined && 
                              cardsList.loadedCards[index] !== undefined)

    const isCardsListExist = _ => cardsList.loadedCards !== undefined && 
                                  cardsList.currentCard !== undefined && 
                                  cardsList.loadedCards[cardsList.currentCard] !== undefined
    
    const dataOrStatus =  !isCardsListExist() || !isElementExist(cardsList.currentCard)  
                            ? 'notInitialized'
                            : cardsList.loadedCards[cardsList.currentCard] 

    useEffect(_ => {
        if (!isCardsListExist()) return;

        const preloadOffset = 2;
        for (let i = cardsList.currentCard - preloadOffset; i <= cardsList.currentCard + preloadOffset; i++){

            if (isElementExist(i)) {
                new Image().src = cardsList.loadedCards[i].image.highRes
            }
        }
    })
                        

    return [dataOrStatus, cardChange]
}

