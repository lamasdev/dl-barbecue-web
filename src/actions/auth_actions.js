import axios from '../axios';
import history from '../history';
import {
    AUTH_USER,
    AUTH_USER_ERROR,
    AUTH_USER_SUCCESS,
    UNAUTH_USER,
    BARBECUES_LIST_SUCCESS,
    BARBECUES_RESERVED_LIST_SUCCESS,
    BARBECUE_ERROR,
    BARBECUE_LOGOUT,
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
            dispatch(barbecuesListSuccess(loginResponse.user.barbecues));
            dispatch(barbecuesReservedListSuccess(loginResponse.user.reserves));
            // - Save the oauth token
            localStorage.setItem('token', `${loginResponse.token_type} ${loginResponse.access_token}`);
            history.push('/barbecues');
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
            history.push('/barbecues');
        })
        .catch(error =>{
            dispatch(loginUserFail(error.response.data.message));
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
            dispatch({ type: BARBECUE_LOGOUT });
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
            const userResponse = response.data;
            // If request is good...
            // - Update state to indicate the auth user
            dispatch(loginUserSuccess(userResponse));
            dispatch(barbecuesListSuccess(userResponse.barbecues));
            dispatch(barbecuesReservedListSuccess(userResponse.reserves));
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

function barbecuesListSuccess(barbecues) {
    return {
        type: BARBECUES_LIST_SUCCESS,
        payload: barbecues
    };
}

function barbecuesReservedListSuccess(barbecuesReserved) {
    return {
        type: BARBECUES_RESERVED_LIST_SUCCESS,
        payload: barbecuesReserved
    };
}

function barbecueFail(error) {
    return {
        type: BARBECUE_ERROR,
        payload: error
    };
}
