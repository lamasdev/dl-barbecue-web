import axios from '../axios';
import history from '../history';
import {
    AUTH_USER,
    AUTH_USER_ERROR,
    AUTH_USER_SUCCESS,
    UNAUTH_USER,
} from './types';

const ROOT_URL = '/api/auth';

export function signInUser(data) {
    return function (dispatch) {
        // Submit email/password to the server
        dispatch({ type: AUTH_USER });
        axios({
            method: 'post',
            url: `${ROOT_URL}/login`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            const loginResponse = response.data;
            // If request is good...
            // - Update state to indicate user is authenticated
            dispatch(loginUserSuccess(loginResponse.user));
            // - Save the oauth token
            localStorage.setItem('token', `${loginResponse.token_type} ${loginResponse.access_token}`);
            history.push('/dashboard');
        }).catch((error) => {
            dispatch(loginUserFail(error.response.data.message));
        });
    };
}

export function signUpUser(data) {
    return function(dispatch) {
        axios({
            method: 'post',
            url: `${ROOT_URL}/signup`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            const loginResponse = response.data;
            dispatch({ type: AUTH_USER });
            // - Save the oauth token
            dispatch(loginUserSuccess(loginResponse.user));
            localStorage.setItem('token', `${loginResponse.token_type} ${loginResponse.access_token}`);
            history.push('/dashboard');
        })
        .catch(error =>{
            dispatch(loginUserFail(error.response.data.message));
            dispatch({ type: AUTH_USER });
        });
    }
}

export function signOutUser() {
    return function (dispatch) {
        dispatch({ type: UNAUTH_USER });
        axios({
            method: 'get',
            url: `${ROOT_URL}/logout`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(response => {
            const loginResponse = response.data;
            // - Delete the oauth token
            localStorage.removeItem('token');
            history.push('/login');
        })
        .catch(error => dispatch(loginUserFail(error.response.data.message)));
    };    
}

export function retrieveAuthUser() {
    return function (dispatch) {
        dispatch({ type: AUTH_USER });
        axios({
            method: 'get',
            url: `${ROOT_URL}/user`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            }
        }).then((response) => {
            const userResponse = response.data.data;
            // If request is good...
            // - Update state to indicate the auth user
            dispatch(loginUserSuccess(userResponse));
        }).catch((error) => {
            if (error !== undefined) {
                if (error.response !== undefined) {
                    dispatch(loginUserFail(error.response.data.message));
                }
            }
        });
    };
}

function loginUserSuccess(user) {
    return {
        type: AUTH_USER_SUCCESS,
        payload: user
    };
}

function loginUserFail(error) {
    return {
        type: AUTH_USER_ERROR,
        payload: error
    };
}
