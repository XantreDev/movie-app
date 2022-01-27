import React from "react";
import styles from "./Card.module.scss";

const Card = ({url}) => {
    const image = "https://www.themoviedb.org/t/p/w1066_and_h600_bestv2/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg";

    return( 
        <div style={{backgroundImage: "url(https://www.themoviedb.org/t/p/w1066_and_h600_bestv2/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg)"}} className={styles.card}>
            <div className={styles.like}>Like</div>
            <div className={styles.title}>Filmname</div>
            <div className={styles.rating}>7/10</div>
        </div>
        );
}

export default Card;