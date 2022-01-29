import React, { useEffect, useState } from "react";
import Card from "./components/Card/Card";
import CardsList from "./components/CardsList/CardsList";
import { DataService } from "./DataService/DataService";

function App() {
    const [slides, setSlides] = useState([]);

    const [loadedMovies, setLoadedMovies] = useState([]);
    const [movieIndex, setMovieIndex] = useState(0);

    useEffect((_) => reciveMovies(), []);

    const reciveMovies = async () => {
        const moviesList = await DataService.getTrendingMovies();
        setLoadedMovies(moviesList);
        setSlides(moviesList.slice(0, 5));
    };

    const fetchSlides = (event) => {};

    return (
        <div className="App">
            {loadedMovies.length !== 0 ? (
                <CardsList>
                    {slides.map((slide) => (
                        <Card {...slide} />
                    ))}
                </CardsList>
            ) : (
                <h1>Loading</h1>
            )}
        </div>
    );
}

export default App;
