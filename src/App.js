import React, { Component } from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import history from './history';
import Login from './containers/Login';
import SignUp from './containers/SignUp';
import NavBar from './hoc/NavBar';
import Reserve from './containers/Reserve';
import Barbecues from './containers/Barbecues';
import Barbecue from './components/Barbecue';
import reducers from './reducers';
import axios from './axios';


import {
    AUTH_USER,
    AUTH_USER_ERROR,
    BARBECUE_ERROR,
    AUTH_USER_SUCCESS,
    BARBECUES_LIST_SUCCESS,
    BARBECUES_RESERVED_LIST_SUCCESS,
} from './actions/types';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(ReduxThunk)));

const token = localStorage.getItem('token');
// If we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  const ROOT_URL = '/api/auth';
    store.dispatch({ type: AUTH_USER });
    axios({
        method: 'get',
        url: `${ROOT_URL}/user`,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: localStorage.getItem('token'),
        }
    }).then((response) => {
        const userResponse = response.data;
        // If request is good...
        // - Update state to indicate the auth user
        store.dispatch({ type: AUTH_USER_SUCCESS, payload: userResponse });
        store.dispatch({ type: BARBECUES_LIST_SUCCESS, payload: userResponse.barbecues });
        store.dispatch({ type: BARBECUES_RESERVED_LIST_SUCCESS, payload: userResponse.reserves });
    }).catch((error) => {
        if (error !== undefined) {
            if (error.response !== undefined) {
                store.dispatch({ type: AUTH_USER_ERROR, payload: error });
                store.dispatch({ type: BARBECUE_ERROR, payload: error });
            }
        }
    });
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
              <Router history={history}>
                  <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/signup" exact component={SignUp} />
                      <Route
                          component={
                              () => {
                                  if (localStorage.getItem('token')) {
                                      return (
                                        <NavBar>
                                          <Switch>
                                              <Route 
                                                  exact path="/reserve" 
                                                  component={Reserve} 
                                              />
                                              <Route 
                                                  exact path="/barbecues" 
                                                  component={Barbecues} 
                                              />
                                              <Route 
                                                  exact path="/barbecues/new" 
                                                  component={Barbecue} 
                                              />
                                              <Route 
                                                  exact path="/barbecues/:id" 
                                                  component={Barbecue} 
                                              />
                                          </Switch>
                                        </NavBar>
                                      );
                                  }
                                  return <Redirect to='/login' />;
                              }
                          }
                      />
                  </Switch>
              </Router>
            </Provider>
        );
    }
}

export default App;
