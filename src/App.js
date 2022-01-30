import React, { useEffect, useState } from "react";
import Card from "./components/Card/Card";
import CardsList from "./components/CardsList/CardsList";
import { DataService } from "./DataService/DataService";

function App() {

    // useEffect(_ => {

    //     const forbidWheelClick = click => {
    //         if (click.which === 1){
    //             click.stopPropagation()
    //             click.preventDefault()
    //         }
    //     }

    //     window.addEventListener('auxclick', forbidWheelClick)

    //     return _ => window.removeEventListener('auxclick', forbidWheelClick)
    // })

    return (
        <div className="App">
            <CardsList/>
        </div>
    );
}

export default App;
