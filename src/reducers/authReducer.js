import { REGISTER_USER, LOGIN_USER, SET_CURRENT_USER, SET_PUSH_TOKEN } from '../actions/types';


const initialState = {
    user: {},
    userPushToken: ''
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
        return {
            ...state,
            user: action.payload
        };
        case REGISTER_USER:
        return {
            ...state
        };
        case SET_CURRENT_USER:
        return{
            ...state,
            user: action.payload
        }
        case SET_PUSH_TOKEN:
        return {
            ...state,
            userPushToken: action.payload
        }
        default:
        return state;
    }
}