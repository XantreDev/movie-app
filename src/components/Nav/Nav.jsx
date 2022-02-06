import React, { useState } from "react";
import styles from "./Nav.module.scss";
import searchIcon from "./imgs/search_icon.svg"
import { MoviesDataService } from "../../DataService/MoviesDataService";

const Nav = () => {
    const [inputText, setInputText] = useState('');
    const findMovie = e => {
        e.preventDefault()
        MoviesDataService.findMovieByQuery(inputText).then()
    }

    return (
        <div className={styles.nav}>
            <div className={styles.container}>
                <img className={styles.searchIcon} src={searchIcon} alt=""/>
                <input
                    value={inputText}
                    onChange={value => setInputText(_ => value.target.value)}
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
                    Find
                    <div className={styles.hoverSubmitButtonAnimation}></div>
                </button>
            </div>
        </div>
    );
};

export default Nav;
