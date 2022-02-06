import React, { useEffect, useState } from "react";
import { HashRouter, Route, Router, Routes } from "react-router-dom";
import CardsList from "./components/CardsList/CardsList";
import Nav from "./components/Nav/Nav";

function App() {
    return (
        <div className="App">
            <Nav />
            <HashRouter basename="/">
                <CardsList />
            </HashRouter>
            <HashRouter>
                {/* <Search/> */}
            </HashRouter>
        </div>
    );
}

export default App;
