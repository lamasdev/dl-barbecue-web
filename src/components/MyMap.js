import React from 'react';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const MyMap = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) =>{
    const setPosition = (event) => {
          props.setPosition({
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          });
    };
    const onMapClick = (event) => {
        props.setPosition({
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          });
    };
    return(
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}
    onClick={onMapClick}
  >
    {props.isMarkerShown && <Marker onDragEnd={setPosition} draggable={props.isDraggable} position={{ lat: props.latitude, lng: props.longitude }} />}
  </GoogleMap>
)});

export default MyMap;
