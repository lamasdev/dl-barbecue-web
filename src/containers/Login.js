import React, { Component } from 'react';
import { connect } from 'react-redux';

import { signInUser } from '../actions';


class Login extends Component {

  state = {
      email: 'ronny13@example.org',
      password: 'secret',
      lastLatitude: undefined,
      lastLongitude: undefined,
  }

  componentDidMount() {
    const self = this;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lastLatitude = position.coords.latitude;
            const lastLongitude = position.coords.longitude;
            self.setState({lastLatitude, lastLongitude});
        });
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit = (event) => {
    this.preventDefault = event.preventDefault();
    const {email ,password ,lastLatitude ,lastLongitude} = this.state;
    this.props.signInUser({email ,password ,lastLatitude ,lastLongitude});
  }

  render() {
    return (
        <div className="flex-column d-flex justify-content-center h-100">
            <div className="card col-sm-12 col-md-6 align-self-md-center align-self-sm-start">
                <div className="card-body">
                    <form className="form-signin text-center" onSubmit={this.handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                        <input type="email" id="inputEmail" name="email" className="form-control" placeholder="Email address" required autoFocus onChange={this.handleInputChange} />
                        <input type="password" id="inputPassword" name="password" className="form-control" placeholder="Password" required onChange={this.handleInputChange} />
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
    const { error, loading, user } = auth;
    return { error, loading, user };
};

export default connect(mapStateToProps,
{
    signInUser,
})(Login);
