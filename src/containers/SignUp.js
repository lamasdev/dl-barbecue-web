import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import history from '../history';
import { signUpUser } from '../actions';


class SignUp extends Component {

  state = {
      email: '',
      password: '',
      password_confirmation: '',
      lastLatitude: undefined,
      lastLongitude: undefined,
      zipCode: '',
      name: '',
      lastName: '',
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

  componentDidUpdate(prevProps) {
    if (!this.props.loading && this.props.error !== null && this.props.error !== prevProps.error) {
        this.notify(this.props.error);
    }
  }

  notify = (error) => toast.error(error, {
    position: toast.POSITION.TOP_RIGHT
  });

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
    const {email, password, password_confirmation, lastLatitude, lastLongitude, zipCode, name, lastName} = this.state;
    this.props.signUpUser({email, password, password_confirmation, lastLatitude, lastLongitude, zipCode, name, lastName});
  }

  render() {
    return (
        <div className="flex-column d-flex justify-content-center h-100">
            <ToastContainer />
            <div className="card col-sm-12 col-md-6 align-self-md-center align-self-sm-start">
                <div className="card-body">
                    <form className="form-signin text-center" onSubmit={this.handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>
                        <input type="text" id="inputName" name="name" className="form-control" placeholder="First Name" required onChange={this.handleInputChange} autoFocus />
                        <input type="text" id="inputLastName" name="lastName" className="form-control" placeholder="Last Name" required onChange={this.handleInputChange} />
                        <input type="email" id="inputEmail" name="email" className="form-control" placeholder="Email address" required onChange={this.handleInputChange} />
                        <input type="password" id="inputPassword" name="password" className="form-control" placeholder="Password" required onChange={this.handleInputChange} />
                        <input type="password" id="password_confirmation" name="password_confirmation" className="form-control" placeholder="Password Confirmation" required onChange={this.handleInputChange} />
                        <input type="text" id="inputzipCode" name="zipCode" minLength="4" className="form-control" placeholder="Zip Code" required onChange={this.handleInputChange} />
                        <br/>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
                    </form>
                    <br/>
                    <button className="btn btn-lg btn-primary btn-block" type="button" onClick={() => history.push('/login')}>Back to Login</button>
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
    signUpUser,
})(SignUp);
