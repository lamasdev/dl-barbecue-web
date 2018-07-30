import React, { Component } from 'react';
import { connect } from 'react-redux';

import { signInUser } from '../actions';

class Dashboard extends Component {

  state = {
      email: '',
      password: '',
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
        [

            <div  key="2" className="flex-column d-flex justify-content-center h-100">
                <div className="card col-sm-12 col-md-6 align-self-md-center align-self-sm-start">
                    <div className="card-body">
                        <h1>
                            I'm the Dashboard!
                        </h1>
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
})(Dashboard);
