import React, { useRef, useState, useEffect } from "react";
import styles from "./CardsList.module.scss";
import Card from "./../Card/Card";
import { useBound } from './../../hooks/useBound';
import animateScrollTo from "animated-scroll-to";
import { MoviesDataService } from "../../DataService/MoviesDataService";

const CardsList = ({ children }) => {
    const slidesCount = 9;
    const medianSlide = (slidesCount - 1) / 2
    const [slides, setSlides] = useState([]);

    const [loadedMovies, setLoadedMovies] = useState([]);
    const [slideBorderIndexes, setSlideBorderIndexes] = useState({
        left: 0,
        current: 0,
        right: slidesCount - 1
    });

    useEffect(_ => {
        const handleResize = () => {
            const medianCardXCoord = medianSlide * window.innerWidth * cardWidthRatio
            cardsListRef.current.scrollTo(medianCardXCoord, 0)
        } 

        window.addEventListener('resize', handleResize)

        return _ => {
            window.removeEventListener('click', handleResize)
        }
    })

    useEffect(_ => {
        const moveSlide = key => {
            if (key.keyCode === 39 || key.keyCode === 34) {
                slideChange(1)
            } else if (key.keyCode === 37 || key.keyCode === 33){
                slideChange(-1)
            }
        }

        window.addEventListener('keydown', moveSlide)

        return _ => window.removeEventListener('keydown', moveSlide)
    })

    const cardsListRef = useRef();
    const slidesAnimating = useRef(false)
    const [currentSlide, setCurrentSlide] = useBound({value: medianSlide, bound: slidesCount});

    useEffect((_) => reciveMovies(), []);

    const reciveMovies = async () => {
        const moviesList = await MoviesDataService.getMoviesDiscoverPage();
        setLoadedMovies(moviesList);
        const slidesBoundares = {
            left: moviesList.length / 2 - medianSlide,
            current: moviesList.length / 2,
            right: moviesList.length / 2 + medianSlide
        }
        console.log(slidesBoundares)
        setSlides(moviesList.slice(slidesBoundares.left, slidesBoundares.right));
        setSlideBorderIndexes(slidesBoundares)

        const medianCardXCoord = medianSlide * window.innerWidth * cardWidthRatio
        cardsListRef.current.scrollTo(medianCardXCoord, 0)
    };


    const cardWidthRatio = 0.8;

    const adjustSlides = (moveDirection) => {
        if (moveDirection === 1){
            setSlides([...slides.slice(1), loadedMovies[slideBorderIndexes.right + 1]])
            // setSlides([...slides.slice(deltaSlide), ...loadedMovies.slice(slideBorderIndexes.right + 1, slideBorderIndexes.right + deltaSlide)])
            
            
        } else if (moveDirection === -1) {
            setSlides([loadedMovies[slideBorderIndexes.left - 1], ...slides.slice(0, -1)])

        }
    }

    const moveBorders = (distance) => {
        return ({
            left: slideBorderIndexes.left + distance,
            current: slideBorderIndexes.current + distance,
            right: slideBorderIndexes.right + distance
        })
    }

    const fetchSlides = async (newCurrentSlideIndex, moveDirection) => {
        // console.log(moveDirection)
        console.log(loadedMovies)
        console.log(slideBorderIndexes)
        let moveBorderDistance = 0

        const nearLeft = slideBorderIndexes.left <= 2
        const nearRight = slideBorderIndexes.right >= loadedMovies.length - 3
        if (nearLeft || nearRight){
            const newMoviesPage = await MoviesDataService.getMoviesDiscoverPage()
            addNewMovies({ newMoviesPage, nearLeft, nearRight })
            if (nearLeft){            
                moveBorderDistance = newMoviesPage.length
            }
        }

        slidesAnimating.current = false

        const slideWidth = cardWidthRatio * window.innerWidth
        adjustSlides(moveDirection)

        cardsListRef.current.scrollBy(moveDirection * -slideWidth, 0)
        setCurrentSlide(newCurrentSlideIndex - moveDirection)
        
        setSlideBorderIndexes(moveBorders(moveBorderDistance + moveDirection))
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
        await animateScrollTo([newSlidePosition, 0], {
            elementToScroll: cardsListRef.current,
            cancelOnUserAction: false
        })
        
        fetchSlides(newCurrentSlide, moveDirection)

    }

    const addNewMovies = ({newMoviesPage: moviesObject, nearLeft,  nearRight}) => {
        moviesObject.map(movie => console.log(movie.title))
        if (nearLeft){
            setLoadedMovies([...moviesObject, ...loadedMovies])
        } else {
            setLoadedMovies([...loadedMovies, ...moviesObject])
        }
    }

    const toCard = (directionRight) => {
        return () => {
            if (directionRight) {
                slideChange(1)
            } else {
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
            onKeyDown={key => console.log(key)}
        >
            { slides.lenght !== 0 ? (
                slides.map((slide, i) => 
                    <Card 
                        onClick={Math.abs(i - medianSlide) === 1? 
                            _ => toCard(i - medianSlide) : {}}
                        focus={i === medianSlide ? true : false} 
                        key={slide.title} {...slide} 
                    />)
            ) : (
                <h1>Loading</h1>
            )}
        </div>
    );
};

export default CardsList;
