import React, { useState } from "react";
import styles from "./Nav.module.scss";
import searchIcon from "./imgs/search_icon.svg"

const Nav = () => {
    const [inputText, setInputText] = useState('');
    

    return (
        <div className={styles.nav}>
            <div className={styles.container}>
                <img className={styles.searchIcon} src={searchIcon} alt=""/>
                <input
                    value={inputText}
                    onInput={value => setInputText(value.target.text)}
                    className={styles.input}
                    type="search"
                    name=""
                    id=""
                    placeholder="Search"
                    onSubmit={_ => {}}
                />
                <button onClick={e => e.preventDefault()} className={styles.submitButton}>
                    Find
                    <div className={styles.hoverSubmitButtonAnimation}></div>
                </button>
            </div>
        </div>
    );
};

export default Nav;
