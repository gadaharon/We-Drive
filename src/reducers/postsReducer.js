import { GET_POSTS, ADD_POST, GET_SINGLE_POST, DELETE_POST, GET_JOINED_RIDES, ADD_JOINED_POST } from '../actions/types';
import { URL_STRING } from '../config/urlstring';
import axios from 'axios';

const initialState = {
    posts:[],
    singlePost: {},
    joinedPost: {},
    joinedRides: []
};


export default function (state = initialState, action){
    switch(action.type){
        case GET_POSTS:
        return {
            ...state,
            posts: action.payload
        };
        case ADD_POST:
        console.log(action.payload);
        return {
            ...state
        };
        case GET_JOINED_RIDES:
        console.log(action.payload)
        return{
            ...state,
            joinedRides: JSON.parse(action.payload)
        };
        case ADD_JOINED_POST:
        console.log(action.payload);
        return {
            ...state,
            joinedPost: action.payload
        }
        case GET_SINGLE_POST:
        return{
            ...state,
            singlePost: {...action.payload}
        }
        case DELETE_POST:
        console.log(action.payload);
            return {
                ...state,
            };
        default:
        return state;
    }
}