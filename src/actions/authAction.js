import { LOGIN_USER, REGISTER_USER, SET_CURRENT_USER, SET_PUSH_TOKEN } from './types';
import { URL_STRING } from '../config/urlstring';

import axios from 'axios';

// Login Method
export const loginUser = userData => dispatch => {
    const { email, password } = userData;
    const result =  axios.post(`${URL_STRING}/Login`, { email, password });
    result.then(res => JSON.parse(res.data.d))
    .then(res => {
        dispatch({
            type: LOGIN_USER,
            payload: res
        })
    })
    .catch(err => console.log('Something went wrong with loginUser',err))
}

export const setUser = data => dispatch => {
    dispatch({
        type: SET_CURRENT_USER,
        payload: data
    })
}

export const setPushToken = token => {
    return {
        type: SET_PUSH_TOKEN,
        payload: token
    }
}

// export const registerUser = userData
