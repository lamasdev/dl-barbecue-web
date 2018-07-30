import React, { Component } from 'react';
import './App.css';

import { Route, Switch, Router } from 'react-router-dom';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import history from './history';
import Login from './containers/Login';
import reducers from './reducers';
import axios from './axios';
import {
    AUTH_USER,
    AUTH_USER_ERROR,
    AUTH_USER_SUCCESS,
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
    }).catch((error) => {
        if (error !== undefined) {
            if (error.response !== undefined) {
                store.dispatch({ type: AUTH_USER_ERROR, payload: error });
            }
        }
    });
}

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
              <Router history={history}>
                  <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/login" exact component={Login} />
                      {/* <Route
                          path="/app" exact={false}
                          component={
                              () => {
                                  if (localStorage.getItem('token')) {
                                      return (
                                          <Layout>
                                              <Switch>
                                                  <Route 
                                                      exact path="/app/dashboard" 
                                                      component={Dashboard} 
                                                  />
                                              </Switch>
                                          </Layout>
                                      );
                                  }
                                  return <Redirect to='/login' />;
                              }
                          }
                      /> */}
                  </Switch>
              </Router>
            </Provider>
        );
    }
}

export default App;

