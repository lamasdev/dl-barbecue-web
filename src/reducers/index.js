import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import barbecueReducer from './barbecue_reducer'

const rootReducer = combineReducers({
    auth: authReducer,
    barbecues: barbecueReducer,
});

export default rootReducer;
