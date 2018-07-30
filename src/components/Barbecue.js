import React, { Component } from 'react';
import { connect } from 'react-redux';

import { signInUser } from '../actions';
import MyMap from './MyMap';

class Barbecues extends Component {

  state = {
      name: '',
      description: '',
      image: '',
      model: '',
      latitude: '',
      longitude: '',
  }

  componentDidMount() {
    const self = this;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            self.setState({latitude, longitude});
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
    const {email ,password ,latitude ,longitude} = this.state;
    this.props.signInUser({email ,password ,latitude ,longitude});
  }

  render() {
    return (
        [

            <div  key="2" className="flex-column d-flex justify-content-center h-100">
                <div className="card col-sm-12 col-md-6 align-self-md-center align-self-sm-start">
                    <div className="card-body">
                    <form className="form-signin text-center" onSubmit={this.handleSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Add your barbecue.</h1>
                        <input type="text" id="inputName" name="name" className="form-control" placeholder="First Name" required onChange={this.handleInputChange} autoFocus />
                        <input type="text" id="inputDescription" name="description" className="form-control" placeholder="Description" required onChange={this.handleInputChange} />
                        <input type="text" id="inputModel" name="model" className="form-control" placeholder="Model" required onChange={this.handleInputChange} />
                        <input type="email" id="inputEmail" name="email" className="form-control" placeholder="Email address" required onChange={this.handleInputChange} />
                        <input type="password" id="inputPassword" name="password" className="form-control" placeholder="Password" required onChange={this.handleInputChange} />
                        <input type="password" id="password_confirmation" name="password_confirmation" className="form-control" placeholder="Password Confirmation" required onChange={this.handleInputChange} />
                        <input type="text" id="inputzipCode" name="zipCode" minLength="4" className="form-control" placeholder="Zip Code" required onChange={this.handleInputChange} />
                        <br/>
                        <MyMap isMarkerShown />
                        <br/>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
                    </form>
                    </div>
                </div>
            </div>,
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
    signInUser,
})(Barbecues);
