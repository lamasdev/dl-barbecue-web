import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../history';

import 'react-datepicker/dist/react-datepicker.css';

import Reservation from '../components/Reservation'
import { deleteBarbecue, setBarbecue, retrieveAuthUser, barbecueSearch } from '../actions';

class Reserve extends Component {

  state = {
      lastLatitude: undefined,
      lastLongitude: undefined,
  }

  componentDidMount() {
    this.props.retrieveAuthUser();
    this.props.barbecueSearch();
    const self = this;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lastLatitude = position.coords.latitude;
            const lastLongitude = position.coords.longitude;
            self.setState({lastLatitude, lastLongitude});
        });
    }
  }

  handleDeleteBarbecue = (id) => {
    this.props.deleteBarbecue([...this.props.barbecueList], id)
  }

  render() {
      const cardImageStyle = {
        height: 140,
        objectFit: 'cover',
      };
    return (
        <div className="container">
            <div className="row d-flex justify-content-around">
                <div className="text-center card mt-md-2 m-sm-0 p-md-2 p-sm-0 pb-sm-1 col-sm-12 col-md-5">
                <div className="card-body">
                    <h5 className="card-title">Your reserved barbecues.</h5>
                    <hr/>
                    {
                        this.props.loading ? <h5>Loading...</h5> :
                        this.props.barbecueReservedList.length > 0 ?
                        this.props.barbecueReservedList.map(barbecue => {
                            return (
                                <div key={barbecue.pivot.id} className="card mb-3">
                                    <img className="card-img-top" src={`http://dlbarbecue.test${barbecue.image}`} style={cardImageStyle} alt="Card"/>
                                    <div className="card-body">
                                        <h5 className="card-title">{barbecue.name}</h5>
                                        <p className="card-text">{barbecue.description}</p>
                                    </div>
                                    <div className="card-body">
                                        <h6>From: {barbecue.pivot.reserved_from}</h6>
                                        <h6>To: {barbecue.pivot.reserved_to}</h6>
                                    </div>
                                </div>
                            );
                        })
                        : <h5>You don't have reserved barbecues.</h5>
                    }
                </div>
                </div>
                <div className=" text-center card mt-md-2 m-sm-0 p-md-2 p-sm-0 pb-sm-1 col-sm-12 col-md-5">
                <div className="card-body">
                <h5 className="card-title">Barbecues closer from you.</h5>
                <hr/>
                    {
                        this.props.loading ? <h5>Loading...</h5> :
                        this.props.barbecueSearchList.length > 0 ?
                        this.props.barbecueSearchList.map(barbecue => {
                            return (
                                <Reservation key={barbecue.id} barbecue={barbecue}/>
                            );
                        })
                        : <h5>You don't have barbecues closer.</h5>
                    }
                </div>
                </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = ({ barbecues }) => {
    const { error, loading, barbecueReservedList, barbecueSearchList } = barbecues;
    return { error, loading, barbecueReservedList, barbecueSearchList };
};

export default connect(mapStateToProps,
{
    deleteBarbecue,
    setBarbecue,
    retrieveAuthUser,
    barbecueSearch,
})(Reserve);
