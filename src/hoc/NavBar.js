
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { signOutUser } from '../actions';

class NavBar extends Component {
    state = {
        showBar: 'd-none d-md-flex',  
    }

    handleSubmit = (event) => {
        this.preventDefault = event.preventDefault();
        this.props.signOutUser();
    }

    render(){
        const { showBar } = this.state;
        const { user } = this.props;
        return (
            [
            <nav key="1" className="navbar sticky-top navbar-dark bg-dark">
                <ToastContainer />
                <div className="container">
                    <button
                        className="navbar-toggler d-md-none mb-2 mb-md-0"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarToggleExternalContent"
                        onClick={() => {
                        this.setState({ showBar: showBar === 'd-flex d-md-flex' ? 'd-none d-md-flex' : 'd-flex d-md-flex' });
                        }}
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <form onSubmit={this.handleSubmit} className={`${showBar} form-inline w-100 mb-0`}>
                        <ul className="navbar-nav flex-sm-column  flex-md-row col-sm-12 col-md-6">
                            <NavLink style={{textDecoration: 'none'}} className="nav-item text-center p-md-1 p-sm-0 mr-md-1 m-sm-0" activeClassName={'active'} to={'/barbecues'}>
                                <div className="nav-link">Barbecues</div>
                            </NavLink>
                            <NavLink style={{textDecoration: 'none'}} className="nav-item text-center p-md-1 p-sm-0 mr-md-1 m-sm-0" activeClassName={'active'} to={'/reserve'}>
                                <div className="nav-link">Reserve</div>
                            </NavLink>
                        </ul>
                        <span className="navbar-text col-sm-12  col-md-3 text-center">
                            {user ? `Hi ${user.name}!` : null}
                        </span>
                        <button className="btn btn-success my-2 my-sm-0 col-sm-12 col-md-2" type="submit">
                            Logout
                        </button>
                        </form>
                </div>
            </nav>,
            this.props.children
        ]
        )
    }
}

const mapStateToProps = ({ auth }) => {
    const { error, loading, user } = auth;
    return { error, loading, user };
};

export default connect(mapStateToProps,
{
    signOutUser,
})(NavBar);
