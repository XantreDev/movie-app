// @ts-check
import React from 'react';
import { useSelector } from 'react-redux';
import searchIcon from "./imgs/search_icon.svg"
import styles from './SearchBar.module.scss'
import { useDispatch } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { ActionCreators } from '../../../state';

const SearchBar = () => {
    const searchRequestFromStore = useSelector(state => state.searchRequest)
    const searchRequest = searchRequestFromStore !== null ? searchRequestFromStore : ''
    const navigate = useSelector(state => state.navigate)
    const dispatch = useDispatch()

    const { changeSearchRequest } = bindActionCreators(ActionCreators, dispatch)

    const findMovie = e => {
        e.preventDefault()
        navigate("/search", {replace: false})
    }


    return (
    <div className={styles.container}>
        <input
            value={searchRequest}
            onChange={event => changeSearchRequest(event.target.value)}
            className={styles.input}
            type="search"
            name=""
            id=""
            placeholder="Search"
            onKeyDown={key => {
                if (key.key === "Enter"){
                    findMovie(key)
                }
            }}
        />
        <button onClick={findMovie} className={styles.submitButton}>
            <img className={styles.searchIcon} src={searchIcon} alt=""/> 
            <div className={styles.hoverSubmitButtonAnimation}></div>
        </button>
    </div>
  );
};

export default SearchBar;
