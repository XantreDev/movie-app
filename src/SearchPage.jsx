import React, { useLayoutEffect, useState } from "react";
import SearchCard from "./components/UI/SearchCard/SearchCard";
import { useDispatch, useSelector } from "react-redux";
import { MoviesDataService } from './DataService/MoviesDataService';
import { bindActionCreators } from "@reduxjs/toolkit";  
import { ActionCreators } from "./state";
import Nav from "./components/Nav/Nav";
import { setCachedSearchRequest } from './local-storage/cacheSearchRequest';
import PageWrapper from "./components/UI/PageWrapper/PageWrapper";

const SearchPage = () => {
    const [movies, setMovies] = useState([]);

    const searchRequest = useSelector((state) => state.searchRequest);

    const dispatch = useDispatch()

    const { grabCachedSearchRequest } = bindActionCreators(ActionCreators, dispatch)

    
    if (searchRequest === null){
        grabCachedSearchRequest()
    }

    const isValidRequest = (searchRequest) => typeof searchRequest == "string" && searchRequest.length > 0

    useLayoutEffect(_ => {
        setCachedSearchRequest(searchRequest)
        if (isValidRequest(searchRequest)){
            findMovies(searchRequest)
        }
    }
    , [searchRequest])

    const findMovies = async (newSearchRequst) => {
        setMovies(await MoviesDataService.findMovieByQuery(newSearchRequst))
    }

    return (
        <PageWrapper>
            <Nav />
            {movies.map((movie) => (
                <SearchCard {...movie} />
            ))}
        </PageWrapper>
    );
};

export default SearchPage;
