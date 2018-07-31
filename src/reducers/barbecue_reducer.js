import {
    BARBECUE,
    BARBECUE_ERROR,
    BARBECUE_SUCCESS,
    BARBECUES_LIST_SUCCESS,
    BARBECUES_RESERVED_LIST_SUCCESS,
    BARBECUE_LOGOUT,
    BARBECUES_SEARCH_LIST_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
    barbecue: null,
    barbecueList: [],
    barbecueSearchList: [],
    barbecueReservedList: [],
    error: null,
    loading: false,
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BARBECUE:
            return { ...state, loading: true, error: null };
        case BARBECUE_ERROR:
            return { ...state, loading: false, error: action.payload };
        case BARBECUE_SUCCESS:
            return { ...state, loading: false, error: null, barbecue: action.payload };
        case BARBECUES_LIST_SUCCESS:
            return { ...state, loading: false, error: null, barbecueList: action.payload };
        case BARBECUES_RESERVED_LIST_SUCCESS:
            return { ...state, loading: false, error: null, barbecueReservedList: action.payload };
        case BARBECUES_SEARCH_LIST_SUCCESS:
            return { ...state, loading: false, error: null, barbecueSearchList: action.payload };
        case BARBECUE_LOGOUT:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};

export default authReducer;
