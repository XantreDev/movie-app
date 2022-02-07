import { bindActionCreators } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import CardsList from "./components/CardsList/CardsList";
import Nav from "./components/Nav/Nav";
import { ActionCreators } from "./state";
import MainPage from './MainPage';
import SearchPage from "./SearchPage";


function App() {
    const navigation = useNavigate()
    const dispatch = useDispatch()
    
    const { setNavigate } = bindActionCreators(ActionCreators, dispatch)

    useEffect(_ => setNavigate(navigation), [])

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<MainPage key="main" className="pages"/>}/>
                <Route path="/search" element={<SearchPage key="search" className="pages"/>}/>
            </Routes>
        </div>
    );
}

export default App;
