import React, { Component } from 'react'
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { reserveBarbecue, retrieveAuthUser } from '../actions';

class Reservation extends Component {

    state = {
        reservedFrom: moment().add(1, 'days'),
        reservedTo: moment().add(7, 'days'),
    }

    handleChangeDate(date, key) {
        this.setState({[key]: date });
    }

    handleSubmit = (event) => {
        this.preventDefault = event.preventDefault();
        const {barbecue, barbecueReservedList} = this.props;
        const {
            reservedFrom,
            reservedTo,
        } = this.state;
        const payload = {
            reservedFrom: moment(reservedFrom).format('YYYY-MM-DD H:mm:ss'),
            reservedTo: moment(reservedTo).format('YYYY-MM-DD H:mm:ss'),
            bbqId: this.props.barbecue.id,
        };
        
        this.props.reserveBarbecue(payload, barbecueReservedList, barbecue);
        
    }

    render() {
        const {barbecue} = this.props;
        const {reservedFrom, reservedTo} = this.state;
        const cardImageStyle = {
            height: 140,
            objectFit: 'cover',
          };
        return (
            <div className="card mb-3">
                <img className="card-img-top" src={barbecue.image} style={cardImageStyle} alt="Card"/>
                <div className="card-body">
                    <h5 className="card-title">{barbecue.name}</h5>
                    <p className="card-text">{barbecue.description}</p>
                </div>
                <form onSubmit={this.handleSubmit} >
                <DatePicker
                    selected={reservedFrom}
                    onChange={(date) => this.handleChangeDate(date, 'reservedFrom')}
                    className="w-100"
                    dateFormat="YYYY-MM-DD LT"
                    timeCaption="time"
                    title={'Reserve from'}
                    minDate={moment()}
                    maxDate={reservedTo}
                    showTimeSelect
                />
                <DatePicker
                    selected={reservedTo}
                    onChange={(date) => this.handleChangeDate(date, 'reservedTo')}
                    className="w-100"
                    dateFormat="YYYY-MM-DD LT"
                    timeCaption="time"
                    title={'Reserve To'}
                    minDate={reservedFrom}
                    showTimeSelect
                />
                <hr/>
                <button
                className="btn btn-md btn-primary mb-2 col-sm-4 align-self-center"
                type="submit">
                    Reserve
                </button>
                <br/>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ barbecues }) => {
    const { error, loading, barbecueReservedList } = barbecues;
    return { error, loading, barbecueReservedList };
};

export default connect(mapStateToProps,
{
    reserveBarbecue,
    retrieveAuthUser,
})(Reservation);