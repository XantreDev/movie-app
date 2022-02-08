import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import styles from "./CardsList.module.scss";
import Card from "./../Card/Card";
import { useBound } from './../../hooks/useBound';
import { MoviesDataService } from "../../DataService/MoviesDataService";
import {
    getCachedCardsList,
    isCachedCardsListExist,
    updateCachedCardsList,
    updateCachedCardsListCurrentIndex
} from '../../local-storage/cacheCardsList';
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { ActionCreators } from "../../state";
import { grabCardsListFromCache } from '../../state/action-creaters';

const CardsList = () => {
    const cardsList = useSelector(state => state.cardsList)
    const [newSlide, setNewSlide] = useState({})

    const dispatch = useDispatch()
    const setCardsList = bindActionCreators(ActionCreators, dispatch)

    useEffect(_ => {
        getCardsList()
    }, [])

    const getCardsList = async _ => {
        if (isCachedCardsListExist()) {
            grabCardsListFromCache()
        } else {
             
        }
    }

    return (
        <div
            // onLoad={_ => fetchSlides(1)}
            ref={cardsListRef} 
            onWheel={wheel => slideChange(wheel.deltaY)}
            className={styles.list}
        >
        </div>
    );
};

export default CardsList;

