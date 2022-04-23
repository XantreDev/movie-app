import React from 'react'
import button from './img/button.svg'
import styles from './CardsChangeButton.module.scss'
import { SIDES } from '../../hooks/useCardsControl'

const CardsChangeButton = ({side, cardChangeCallback}) => {
    const rotateOrNotStyle = side === SIDES.LEFT ? "" : "rotateY(180deg)"
    const indents = "6.25vw"

    return (
        <div onClick={_ => cardChangeCallback(side)} style={{[side === SIDES.LEFT ? "left" : "right"] : indents}} className={styles.container}>
            <img style={{transform: rotateOrNotStyle}} className={styles.button} src={button} alt="" />
        </div>
  )
}

export default CardsChangeButton