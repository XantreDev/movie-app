export const NAVIGATE_ACTION_TYPES = {
    SET_NAVIGATION: "setNavigation",
    UNSET_NAVIGATION: "unsetNavigation",
}

const navigateReducer = (state=null, action) => {
    switch (action.type){
        case NAVIGATE_ACTION_TYPES.SET_NAVIGATION:
            return action.payload
        case NAVIGATE_ACTION_TYPES.UNSET_NAVIGATION:
            return null
        default:
            return state
    }
}

export default navigateReducer