import { toast } from 'react-toastify';


import axios from '../axios';
import history from '../history';
import {
    BARBECUE,
    BARBECUE_ERROR,
    BARBECUE_SUCCESS,
    BARBECUES_LIST_SUCCESS,
    BARBECUES_RESERVED_LIST_SUCCESS,
    BARBECUES_SEARCH_LIST_SUCCESS,
} from './types';

const ROOT_URL = '/api/auth';

export function createBarbecue(data) {
    return function(dispatch) {
        axios({
            method: 'post',
            url: `${ROOT_URL}/barbecue`,
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(response => {
            const barbecueResponse = response.data;
            dispatch({ type: BARBECUE });
            dispatch(barbecueSuccess(barbecueResponse.barbecue));
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            history.push('/barbecues');
        })
        .catch(error =>{
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            dispatch(barbecueFail(error.response.data.message));
        });
    }
}

export function updateBarbecue(id, data) {
    return function(dispatch) {
        axios({
            method: 'post',
            url: `${ROOT_URL}/barbecue/${id}`,
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(response => {
            const barbecueResponse = response.data;
            dispatch({ type: BARBECUE });
            dispatch(barbecueSuccess(barbecueResponse.barbecue));
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            history.push('/barbecues');
        })
        .catch(error =>{
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            dispatch(barbecueFail(error.response.data.message));
        });
    }
}

export function reserveBarbecue(data, dataList, barbecue) {
    return function(dispatch) {
        axios({
            method: 'post',
            url: `${ROOT_URL}/reserve`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(response => {
            const reserveBarbecueResponse = response.data
            dispatch(barbecuesReservedListSuccess([{...barbecue, pivot:reserveBarbecueResponse.reservedBarbecue}].concat(dataList)));
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
        .catch(error =>{
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            dispatch(barbecueFail(error.response.data.message));
        });
    }
}

export function editBarbecue(id) {
    return function(dispatch) {
        axios({
            method: 'get',
            url: `${ROOT_URL}/barbecue/${id}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(response => {
            const barbecueResponse = response.data;
            dispatch({ type: BARBECUE });
            dispatch(barbecueSuccess(barbecueResponse.barbecue));
            history.push(`/barbecues/${id}`);
        })
        .catch(error =>{
            dispatch(barbecueFail(error.response.data.message));
        });
    }
}

export function barbecueSearch() {
    return function(dispatch) {
        axios({
            method: 'get',
            url: `${ROOT_URL}/barbecue`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(response => {
            const barbecueResponse = response.data;
            dispatch({ type: BARBECUE });
            dispatch(barbecuesSearchListSuccess(barbecueResponse.barbecues));
        })
        .catch(error =>{
            dispatch(barbecueFail(error.response.data.message));
        });
    }
}

export function setBarbecue(data) {
    return function(dispatch) {
        dispatch({ type: BARBECUE });
        dispatch(barbecueSuccess({...data}));
    }
}

export function deleteBarbecue(barbecues, id) {
    return function(dispatch) {
        axios({
            method: 'delete',
            url: `${ROOT_URL}/barbecue/${id}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            }
        })
        .then(response => {
            dispatch({ type: BARBECUE });
            dispatch(barbecuesListSuccess(barbecues.filter(barbecue => barbecue.id !== id)));
            history.push('/barbecues');
        })
        .catch(error =>{
            dispatch(barbecueFail(error.response.data.message));
        });
    }
}

function barbecueSuccess(barbecue) {
    return {
        type: BARBECUE_SUCCESS,
        payload: barbecue
    };
}

function barbecueFail(error) {
    return {
        type: BARBECUE_ERROR,
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

function barbecuesSearchListSuccess(barbecuesReserved) {
    return {
        type: BARBECUES_SEARCH_LIST_SUCCESS,
        payload: barbecuesReserved
    };
}
