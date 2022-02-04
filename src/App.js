import React, { useEffect, useState } from "react";
import CardsList from "./components/CardsList/CardsList";
import Nav from './components/Nav/Nav';

function App() {

    return (
        <div className="App">
            <Nav></Nav>
            <CardsList/>
        </div>
    );
}

export default App;
