import React, { useEffect, useRef, useState } from "react";
import { MoviesDataService } from "../../DataService/MoviesDataService";
import styles from "./Card.module.scss";
import Video from './../UI/Video/Video';


const Card = ({ title, rating, image, id, near, ...props }) => {
    const [needToDraw, setNeedToDraw] = useState(false)
    const needToDrawUnmount = useRef(null) 
    const [videoId, setVideoId] = useState("")

    const backgroundCssVariable = {"--background": `url(${image.highRes})`, "--background-blur": `url(${image.lowRes})`}

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
                    , 30000
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
                ...backgroundCssVariable
            }}
            onClick = {props.onClick}

            className={styles.card}
        >
            
            <div className={styles.bluredImage}></div>
        {
            near ?
                <Video videoId={videoId} needToDraw={needToDraw} id={id} title={title} focus={props.focus}/>
                : ""
            }
            
            <div className={styles.like}>Like</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rating}>{`${rating}/10`}</div>
        </div>
    );
};

export default Card;
