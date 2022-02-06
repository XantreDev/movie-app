import React, { useRef, useState, useEffect } from "react";
import styles from "./CardsList.module.scss";
import Card from "./../Card/Card";
import { useBound } from './../../hooks/useBound';
import animateScrollTo from "animated-scroll-to";
import { MoviesDataService } from "../../DataService/MoviesDataService";

const slidesCount = 5;
const medianSlide = (slidesCount - 1) / 2

const CardsList = () => {
    const [slides, setSlides] = useState([]);

    const loadedMovies = useRef([]);
    const slideBorderIndexes = useRef({
        left: 0,
        current: 0,
        right: slidesCount - 1
    });

    

    useEffect(_ => {
        const handleResize = _ => {
            const medianCardXCoord = medianSlide * window.innerWidth * cardWidthRatio
            cardsListRef.current.scrollTo(medianCardXCoord, 0)
        }
    
        
        const moveSlide = key => {
            console.log(key)
            if (key.keyCode === 39 || key.keyCode === 34) {
                key.preventDefault()
                // slideChange(1)
            } else if (key.keyCode === 37 || key.keyCode === 33){
                key.preventDefault()
                // slideChange(-1)
            }
        }

        window.addEventListener('keydown', moveSlide)
        window.addEventListener('resize', handleResize)

        return _ => {
            window.removeEventListener('keydown', moveSlide)
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    


    const cardsListRef = useRef();
    const slidesAnimating = useRef(false)
    const [currentSlide, setCurrentSlide] = useBound({value: medianSlide, bound: slidesCount});

    useEffect((_) => reciveMovies(), []);

    const reciveMovies = async () => {
        const moviesList = await MoviesDataService.getMoviesDiscoverPage();
        loadedMovies.current = moviesList;
        const slidesBoundares = {
            left: moviesList.length / 2 - medianSlide,
            current: moviesList.length / 2,
            right: moviesList.length / 2 + medianSlide + 1
        }
        setSlides(moviesList.slice(slidesBoundares.left, slidesBoundares.right));
        slideBorderIndexes.current = slidesBoundares

        const medianCardXCoord = medianSlide * window.innerWidth * cardWidthRatio
        cardsListRef.current.scrollTo(medianCardXCoord, 0)
    };



    const cardWidthRatio = 0.8;

    const adjustSlides = (moveDirection) => {
        console.log(slides)
        if (moveDirection === 1){
            setSlides([...slides.slice(1), loadedMovies.current[slideBorderIndexes.current.right + 1]])
            // setSlides([...slides.slice(deltaSlide), ...loadedMovies.slice(slideBorderIndexes.right + 1, slideBorderIndexes.right + deltaSlide)])
            
            
        } else if (moveDirection === -1) {
            setSlides([loadedMovies.current[slideBorderIndexes.current.left - 1], ...slides.slice(0, -1)])
        }
    }

    const moveBorders = (distance) => {
        return ({
            left: slideBorderIndexes.current.left + distance,
            current: slideBorderIndexes.current.current + distance,
            right: slideBorderIndexes.current.right + distance
        })
    }

    const fetchSlides = async (newCurrentSlideIndex, moveDirection) => {
        let moveBorderDistance = 0

        const nearLeft = slideBorderIndexes.current.left <= 2
        const nearRight = slideBorderIndexes.current.right >= loadedMovies.current.length - 3
        if (nearLeft || nearRight){
            const newMoviesPage = await MoviesDataService.getMoviesDiscoverPage()
            addNewMovies({ newMoviesPage, nearLeft, nearRight })
            if (nearLeft){            
                moveBorderDistance = newMoviesPage.length
            }
        }

        
        const slideWidth = cardWidthRatio * window.innerWidth
        adjustSlides(moveDirection)
        
        cardsListRef.current.scrollBy(moveDirection * -slideWidth, 0)
        setCurrentSlide(newCurrentSlideIndex - moveDirection)
        slidesAnimating.current = false
        
        slideBorderIndexes.current = moveBorders(moveBorderDistance + moveDirection)
    };

    

    const slideChange = async (deltaY) => {
        if (slidesAnimating.current){
            return
        }
        
        const moveDirection = deltaY > 0 ? 1 : -1;
        const newCurrentSlide = currentSlide + moveDirection
        const newSlidePosition = cardWidthRatio * newCurrentSlide * window.innerWidth
        
        setCurrentSlide(newCurrentSlide)
        slidesAnimating.current = true
        cardsListRef.current.scrollTo({left: newSlidePosition, behavior: "smooth"})
        
        

        setTimeout(_ => fetchSlides(newCurrentSlide, moveDirection), 750)
    }

    const addNewMovies = ({newMoviesPage: moviesObject, nearLeft,  nearRight}) => {
        if (nearLeft){
            loadedMovies.current = [...moviesObject, ...loadedMovies.current]
        } else {
            loadedMovies.current = [...loadedMovies.current, ...moviesObject]
        }
    }

    const toCard = (directionRight) => {
        return () => {
            if (directionRight > 0) {
                slideChange(1)
            } else if (directionRight < 0) {
                slideChange(-1)
            }
        }
    }


    
    return (
        <div
            // onLoad={_ => fetchSlides(1)}
            ref={cardsListRef}
            onWheel={wheel => slideChange(wheel.deltaY)}
            className={styles.list}
        >
            { slides.lenght !== 0 ? (
                slides.map((slide, i) => 
                    (<Card 
                        onClick={Math.abs(i - medianSlide) === 1 ? 
                            toCard(i - medianSlide) : _ => {}} 
                        near={Math.abs(i - medianSlide) <= 1 ?
                            true : false}
                        focus={i === medianSlide ? true : false} 
                        key={slide.title} 
                        {...slide} 
                    />))
            ) : (
                <h1>Loading</h1>
            )}
        </div>
    );
};

export default CardsList;

