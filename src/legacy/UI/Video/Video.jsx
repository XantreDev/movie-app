import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import YouTube  from 'react-youtube';
import styles from "./Video.module.scss";

const Video = ({id, title, needToDraw, videoId, focus}) => {
    const videoOptions = {
        width: "560",
        height: "315",
        frameBorder: "0",
        title: "YouTube video player",
        allowFullScreen: "allowfullscreen",
        playerVars: {
            autoplay: 0,
            control: 0,
            disablekb: 1,
            loop: 1,
            playlist: videoId
        }
    }

    const nodeRef = useRef(null)
    
    return (
            
        <CSSTransition
            key={id}
            ref={nodeRef}
            mountOnEnter
            in={needToDraw && focus}
            classNames={{
                enter: styles.videoTransitionEnter,
                enterActive: styles.videoTransitionEnterActive,
                exit: styles.videoTransitionExit,
                exitActive: styles.videoTransitionExitActive,
            }}
            timeout={100}
            unmountOnExit
        >
            <YouTube
                onReady={player => {
                    player.target.mute()
                    player.target.playVideo()
                }}
                // key={"220" + title + id}
                ref={nodeRef}
                videoId={videoId}
                className={styles.video}
                containerClassName={styles.videoContainer}
                opts={videoOptions}
            />
        </CSSTransition>
    );
};

export default Video;
