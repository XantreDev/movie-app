import React from "react";
import styles from "./CardsList.module.scss";
import Card from "./../Card/Card";
import { useCardsControl } from '../../hooks/useCardsControl';
import { SIDES } from './../../hooks/useCardsControl';
import CardsChangeButton from "../CardsChangeButton/CardsChangeButton";


const CardsList = () => {

    const [currentCard, moveCurrentCard] = useCardsControl(state => state.cardsList)

    return (
        <div
            // onLoad={_ => fetchSlides(1)}
            // ref={cardsListRef} 
            onWheel={wheel => moveCurrentCard(wheel.deltaY > 0 ? SIDES.RIGHT : SIDES.LEFT) }
            className={styles.list}
        >
            <CardsChangeButton cardChangeCallback={moveCurrentCard} side={SIDES.LEFT}/>     
            {
                currentCard !== 'notInitialized' ?
                    <Card {...currentCard}/>
                    : <div>loading</div>
            }
            <CardsChangeButton cardChangeCallback={moveCurrentCard} side={SIDES.RIGHT}/>     
        </div>
    );
};

export default CardsList;

