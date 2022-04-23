import React, { useState } from "react";
import styles from "./Nav.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { ActionCreators } from "../../state";
import SearchBar from "../UI/SearchBar/SearchBar";

const Nav = () => {

    return (
        <div className={styles.nav}>
            <SearchBar/>
        </div>
    );
};

export default Nav;
