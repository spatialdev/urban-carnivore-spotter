import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const Map2 = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

const Map = props => {
  const { data } = props;
  return (
      <div className="mapContainer ">
        <Map2 style="mapbox://styles/mapbox/streets-v9"
              center={[-122.335167, 47.608013]}
              className="map">
          <Layer type="circle"
                 id="marker"
                 paint={{
                   'circle-color': '#8854ff',
                   'circle-stroke-width': 1,
                   'circle-stroke-opacity': 1
                 }}>
            <Feature coordinates={[data.mapLat, data.mapLng]}/>
          </Layer>
        </Map2>
      </div>
  );
};
export default Map;
