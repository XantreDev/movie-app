import React from "react";
import styles from "./Card.module.scss";

const Card = ({title, rating, image}) => {
    

    return( 
        <div style={{"--background": `url(${image})`}} className={styles.card}>
            <div className={styles.bluredImage}></div>
            <div className={styles.like}>Like</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rating}>{`${rating}/10`}</div>
        </div>
        );
}

export default Card;