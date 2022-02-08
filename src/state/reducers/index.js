import { combineReducers } from "redux"
import searchReducer from "./searchReducer"
import navigateReducer from "./navigateReducer"
import cardsListReducer from './cardsListReducer';

const reducers = combineReducers({
    searchRequest: searchReducer,
    navigate: navigateReducer,
    cardsList: cardsListReducer
})

export default reducers