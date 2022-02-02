import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import YouTube from "react-youtube";
import { MoviesDataService } from "../../DataService/MoviesDataService";
import styles from "./Card.module.scss";
import Video from './../UI/Video/Video';


const Card = ({ title, rating, image, id, ...props }) => {
    const [needToDraw, setNeedToDraw] = useState(false)
    const needToDrawUnmount = useRef(null) 
    const [videoId, setVideoId] = useState("")

    const backgroundCssVariable = {"--background": `url(${image})`, "--background-blur": `url(${image})`}

    useEffect(_ => {
        MoviesDataService.getMovieVideoId(id).then(key => {
            console.log(key)
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
                    , 1000
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
    
        
    console.log(videoId)
                
    const iframeAppearTransition = { transition: "opacity 1s ease-in", } 

    
    const backgroundRef = useRef(null)
    
    return (
        <div
            style={{ 
                ...iframeAppearTransition,
                ...backgroundCssVariable
            }}
            onClick = {props.onClick}

            className={styles.card}
        >
            <Video videoId={videoId} needToDraw={needToDraw} id={id} title={title} focus={props.focus}/>

            <CSSTransition
                in={props.focus}
                mountOnEnter={false}
                key={"1" + id}
                ref={backgroundRef}
                classNames={{
                    appear: styles.bluredImageAppear,
                    appearActive: styles.bluredImageAppearActive,
                    appearDone: styles.bluredImageAppearDone,
                    enter: styles.bluredImageEnter,
                    enterActive: styles.bluredImageEnterActive,
                    enterDone: styles.bluredImageEnterDone,
                    exit: styles.bluredImageExit,
                    exitActive: styles.bluredImageExitActive,
                }}
                timeout={{
                    enter: 600,
                    exit: 600,
                }}
                appear={true}                
            >
                <div
                    key={"id:" + id}
                    ref={backgroundRef}
                    className={styles.bluredImage}
                ></div>
            </CSSTransition>
            <div className={styles.like}>Like</div>
            <div className={styles.title}>{title}</div>
            <div className={styles.rating}>{`${rating}/10`}</div>
        </div>
    );
};

export default Card;
