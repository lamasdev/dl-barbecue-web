import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../history';

import { deleteBarbecue, setBarbecue, retrieveAuthUser } from '../actions';

class Barbecues extends Component {

  state = {
      lastLatitude: undefined,
      lastLongitude: undefined,
  }

  componentDidMount() {
    this.props.retrieveAuthUser();
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
                <div className="text-center card mt-md-2 m-sm-0 p-md-2 p-sm-0 pb-sm-1 col-sm-12">
                <div className="card-body">
                    <h5 className="card-title">Your barbecue's list.</h5>
                    <hr/>
                    <button className="btn btn-md btn-primary col-sm-4 col-md-2 align-self-center" type="button" onClick={()=>history.push('/barbecues/new')}>Add</button>
                    <hr/>
                    <div className="row d-flex justify-content-start">

                    {this.props.barbecueList.map(barbecue => {
                        return (
                            <div key={barbecue.id} className="card mb-3 col-sm-12 col-md-4">
                                <img className="card-img-top" src={`http://dlbarbecue.test${barbecue.image}`} style={cardImageStyle} alt="Card"/>
                                <div className="card-body">
                                    <h5 className="card-title">{barbecue.name}</h5>
                                    <p className="card-text">{barbecue.description}</p>
                                </div>
                                <div className="card-body">
                                    <a
                                        onClick={() => {
                                            this.props.setBarbecue({...barbecue});
                                            history.push(`/barbecues/${barbecue.id}`);
                                        }}
                                        className="card-link"
                                    >
                                        Edit
                                    </a>
                                    <a onClick={()=> this.handleDeleteBarbecue(barbecue.id)} className="card-link text-danger">Delete</a>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = ({ barbecues }) => {
    const { error, loading, barbecueList } = barbecues;
    return { error, loading, barbecueList };
};

export default connect(mapStateToProps,
{
    deleteBarbecue,
    setBarbecue,
    retrieveAuthUser,
})(Barbecues);
