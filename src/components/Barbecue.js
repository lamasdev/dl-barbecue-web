import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';

import {
    createBarbecue,
    updateBarbecue,
    setBarbecue,
    editBarbecue,
} from '../actions';
import MyMap from './MyMap';

class Barbecues extends Component {

    state = {
        name: '',
        description: '',
        image: null,
        model: '',
        latitude: '',
        longitude: '',
        imageUrl: null,
    }

    componentDidMount() {
        const self = this;
        const {match, barbecue} = this.props;
        if (match.params.id && barbecue !== null) {
            this.setState({
                name: barbecue.name,
                description: barbecue.description,
                model: barbecue.model,
                latitude: barbecue.latitude,
                longitude: barbecue.longitude,
                imageUrl: barbecue.image !== null ? barbecue.image : null,
            });        
        } else if (match.params.id != null) {
            this.props.editBarbecue(match.params.id);
        }
        if (match.path === '/barbecues/new' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                self.setState({
                    latitude,
                    longitude
                });
            });
        }
    }

    componentDidUpdate(prevProps) {
        const {barbecue} = this.props;
        if((barbecue !== null &&
            prevProps.barbecue == null) ||
            (barbecue !== null && prevProps.barbecue !== null && prevProps.barbecue.id !== barbecue.id)){
            this.setState({
                name: barbecue.name,
                description: barbecue.description,
                model: barbecue.model,
                latitude: barbecue.latitude,
                longitude: barbecue.longitude,
                imageUrl: barbecue.image !== null ? barbecue.image : null,
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
        const {
            name,
            description,
            image,
            model,
            latitude,
            longitude,
        } = this.state;
        const { match } = this.props;
        const status = match.path === "/barbecues/new" ? 'new' : 'edit';
        const payload = {
            name,
            description,
            model,
            latitude: latitude + '',
            longitude: longitude + '',
        };
        if(image !== null){
            payload.image = image;
        }
        if(status === 'edit'){
            payload['_method'] = 'PATCH';
        }
        

        const formData = new FormData();
        Object.keys(payload).forEach(data => {
            formData.append(data, payload[data]);
        });
        if(status === 'new'){
            this.props.createBarbecue(formData);
        } else {
            this.props.updateBarbecue(match.params.id, formData);
        }
    }

    handleImage = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            this.setState({
                image: file,
                imageUrl: reader.result
            });
        };
    }

    setPosition = (position) => {
        this.setState({
            latitude: position.latitude,
            longitude: position.longitude,
        });
    }

    render() {
        const {
            latitude,
            longitude,
            imageUrl,
            name,
            description,
            model,
        } = this.state;
        const {
            match,
        } = this.props;
        return (
            <div className="container">
                <form className="flex-column text-center" onSubmit={this.handleSubmit}>
                <div className="card m-md-2 m-sm-0 p-md-2 p-sm-0 pb-sm-1">
                <div className="card-body">
                <h5 className="card-title">{match.path === "/barbecues/new" ? 'Add your barbecue.' : 'Edit your barbecue.'}</h5>
                    <div className="row">
                    <div className="col-sm-12 col-md-6 ">
                        <img className="card-img-top" src={imageUrl == null ? "/image/notfound.png" : imageUrl} alt="Card" />
                        <label className="btn btn-default">
                            Upload image 
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={this.handleImage}
                                hidden
                                required={match.path === "/barbecues/new"}
                            />
                        </label>
                        <input type="text" id="inputName" name="name" value={name} className="form-control" placeholder="Name" required onChange={this.handleInputChange} autoFocus />
                        <input type="text" id="inputDescription" name="description" value={description} className="form-control" placeholder="Description" required onChange={this.handleInputChange} />
                        <input type="text" id="inputModel" name="model" value={model} className="form-control" placeholder="Model" required onChange={this.handleInputChange} />
                        <br/>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        {latitude && <MyMap
                            isMarkerShown
                            isDraggable
                            latitude={latitude*1}
                            longitude={longitude*1}
                            setPosition={this.setPosition}
                        />}
                        <br/>
                    </div>
                    </div>
                    </div>
                    <button className="btn btn-lg btn-primary col-sm-4 col-md-2 align-self-center" type="submit">{match.path === "/barbecues/new" ? 'Save' : 'Update'}</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({
    barbecues
}) => {
    const {
        error,
        loading,
        barbecue,
        barbecueList,
    } = barbecues;
    return {
        error,
        loading,
        barbecue,
        barbecueList,
    };
};

export default connect(mapStateToProps, {
    createBarbecue,
    updateBarbecue,
    setBarbecue,
    editBarbecue,
})(Barbecues);
