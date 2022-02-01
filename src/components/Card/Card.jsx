import React, { useEffect, useRef } from "react";
import { MoviesDataService } from "../../DataService/MoviesDataService";
import styles from "./Card.module.scss";

const Card = ({ title, rating, image, id, ...props }) => {
    const iframeVideoParameters = useRef(false)
    
    useEffect(_ => {
        if (props.focus){
            const videoId = MoviesDataService.getMovieVideoId(id)
            iframeVideoParameters.current = `width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen` 
        }
    }, [props.focus, id])
    
    return (
        <div
            style={{ "--background": `url(${image})` }}
            className={styles.card}
        >
            {
                iframeVideoParameters.current ?
                    <iframe className="styles.video" title={title} {...iframeVideoParameters}></iframe> 
                    :
                    ''
            }
            <div className={styles.bluredImage}></div>
            <div className={styles.like}>Like</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rating}>{`${rating}/10`}</div>
        </div>
    );
};

export default Card;
