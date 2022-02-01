import React, { useEffect, useRef } from "react";
import { MoviesDataService } from "../../DataService/MoviesDataService";
import styles from "./Card.module.scss";

const Card = ({ title, rating, image, id, ...props }) => {
    const iframeVideoParameters = useRef(false)
    
    useEffect(_ => {
        if (props.focus){
            const videoId = MoviesDataService.getMovieVideoId(id)
            iframeVideoParameters.current = `width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen` 
        } else {
            iframeVideoParameters.current = false
        }
    }, [props.focus, id])
    
                
    const backgroundCssVariable = iframeVideoParameters.current === false ? {"--background": `url(${image})`} : {"--background": ``}
                
    const iframeAppearTransition = { transition: "opacity 1s ease-in", } 

    return (
        <div
            style={{ 
                ...backgroundCssVariable,
                ...iframeAppearTransition,
                backdropFilter: iframeVideoParameters.current === false ? 'opacity(1)' : 'opacity(0)',
                // ""
            }}
            className={styles.card}
        >
            {
                <iframe style={{
                    display: iframeVideoParameters.current === false ? "none" : "block",
                    opacity: iframeVideoParameters.current === false ? "0" : "1"

                }} className="styles.video" title={title} {...iframeVideoParameters}></iframe> 
            }
            <div className={styles.bluredImage}></div>
            <div className={styles.like}>Like</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rating}>{`${rating}/10`}</div>
        </div>
    );
};

export default Card;
