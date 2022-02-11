import React from "react";
import styles from "./CardsList.module.scss";
import Card from "./../Card/Card";
import { useCardsControl } from '../../hooks/useCardsControl';
import { SIDES } from './../../hooks/useCardsControl';

const CardsList = () => {

    const [currentCard, moveCurrentCard] = useCardsControl(state => state.cardsList)

    return (
        <div
            // onLoad={_ => fetchSlides(1)}
            // ref={cardsListRef} 
            onWheel={wheel => moveCurrentCard(wheel.deltaY > 0 ? SIDES.RIGHT : SIDES.LEFT) }
            className={styles.list}
        >
            {
                currentCard !== 'notInitialized' ?
                    <Card {...currentCard}/>
                    : <div>loading</div>
            }
                <div style={{display: "none"}}>
                    
                </div>
        </div>
    );
};

export default CardsList;

