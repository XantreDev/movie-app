import React, { useEffect, useRef, useState } from "react";
import { MoviesDataService } from "../../DataService/MoviesDataService";
import styles from "./Card.module.scss";
import Video from './../UI/Video/Video';


const Card = ({ title, rating, image, id, near, ...props }) => {
    const [needToDraw, setNeedToDraw] = useState(false)
    const needToDrawUnmount = useRef(null) 
    const [videoId, setVideoId] = useState("")

    const backgroundCssVariable = {"--background": `url(${image.highRes})`, "--background-blur": `url(${image.lowRes})`}
    const learnMoreVisibility = {
        "--before-visability": props.focus ? "visible" : "hidden"
    }

    useEffect(_ => {
        MoviesDataService.getMovieVideoId(id).then(key => {
            if (key != null) {
                setVideoId(key)
            } 
        })
    }, [])

    useEffect(
        _ => {
            if (videoId !== "" && props.focus && !needToDraw) {
                 needToDrawUnmount.current = setTimeout(_ =>
                    setNeedToDraw(true)
                    , 30_000_000
                )
            } 
            if (!props.focus) {
                if (needToDrawUnmount.current != null){
                    clearTimeout(needToDrawUnmount.current)
                    needToDrawUnmount.current = null
                }
                setNeedToDraw(false)
            }
        }
        , [props.focus, videoId])
    
        
    
    return (
        <div
            style={{ 
                ...backgroundCssVariable,
                ...learnMoreVisibility
            }}
            onClick = {props.onClick}

            className={styles.card}
        >
            {props.focus ? ( 
            <div className={styles.learnMoreContainer}>
                <div className={styles.learnMore}>Learn more</div>
            </div>) : ""
            }   
            <div className={styles.bluredImage}></div>
        {
            near ?
                <Video videoId={videoId} needToDraw={needToDraw} id={id} title={title} focus={props.focus}/>
                : ""
            }
            
            <div className={`${styles.title} ${styles.captionBlock}`}>{title}</div>
            <div className={`${styles.rating} ${styles.captionBlock}`}>{`${rating}`}</div>
        </div>
    );
};

export default Card;
