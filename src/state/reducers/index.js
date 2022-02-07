import { combineReducers } from "redux"
import searchReducer from "./searchReducer"
import navigateReducer from "./navigateReducer"

const reducers = combineReducers({
    searchRequest: searchReducer,
    navigate: navigateReducer
})

export default reducers