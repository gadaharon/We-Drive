import axios from 'axios';

import { GET_POSTS, ADD_POST, GET_SINGLE_POST, DELETE_POST, GET_JOINED_RIDES, ACCEPT_REQUEST, DECLINE_REQUEST, ADD_JOINED_POST } from './types';
import { URL_STRING } from '../config/urlstring';


export const getPosts = () => dispatch => {
    axios.post(`${URL_STRING}/GetAllDrives`, {g: 's'})
    .then(res =>  {
        dispatch({
            type: GET_POSTS,
            payload: JSON.parse(res.data.d)
        })
    }).catch(err => console.log('something went wrong with getPosts',err));
};

export const getJoinedPosts = (id) => dispatch => {
    // Get all joined posts
    axios.post(`${URL_STRING}/GetJoinedRides`, { id })
        .then(res => {
            console.log(res.data.d);
            dispatch({
                type: GET_JOINED_RIDES,
                payload: res.data.d
            })
        })
}

export const addJoinedPost = post => dispatch => {
    dispatch({
        type: ADD_JOINED_POST,
        payload: post
    });
}


export const addNewRidePost = data => dispatch => {
    const { isWeekly } = data;
    if(isWeekly == 1){
        createNewConstantRide(data)
            .then(res => dispatch({
                type: ADD_POST,
                payload: res
            }))
            .catch(err => console.log(err))
    } else{
        createNewSingleRide(data)
            .then(res => dispatch({
                type: ADD_POST,
                payload: res
            }))
            .catch(err => console.log(err))
    }
};

export const getSinglePost = data => dispatch => {
    dispatch({
        type: GET_SINGLE_POST,
        payload: data
    });
}

export const deletePost = ({postId}) => dispatch => {
    axios.post(`${URL_STRING}/DeletePost`, { id: parseInt(postId) })
        .then(res => console.log(res.data.d))
        .catch(err => console.log(err.data.response));
    dispatch({
        type: DELETE_POST,
        payload: postId
    })
}

// Create New Single Ride
const createNewSingleRide = data =>  {
  return new Promise((resolve, reject) =>{
    axios.post(`${URL_STRING}/PostNewDrive`, data)
    .then(res => resolve('Single Ride Created Successfuly') )
    .catch(err => resolve(err.response.data))
  }) 
}

// Create New Constant Ride
const createNewConstantRide = data =>  {
    return new Promise((resolve, reject) =>{
        axios.post(`${URL_STRING}/PostNewConstantDrive`, data)
        .then(res => resolve('Constant Ride Created Successfuly') )
        .catch(err => reject(err.response.data))
      })     
}