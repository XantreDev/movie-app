import React, { useState } from "react";
import styles from "./Nav.module.scss";
import searchIcon from "./imgs/search_icon.svg"
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { ActionCreators } from "../../state";

const Nav = () => {
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
        <div className={styles.nav}>
            <div className={styles.container}>
                <img className={styles.searchIcon} src={searchIcon} alt=""/>
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
                    Find
                    <div className={styles.hoverSubmitButtonAnimation}></div>
                </button>
            </div>
        </div>
    );
};

export default Nav;
