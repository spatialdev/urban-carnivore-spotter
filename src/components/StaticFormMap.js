import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const StaticMap = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    dragPan: false,
    interactive: false
});

class StaticFormMap extends Component {

    render() {
        const { centerLng, centerLat} = this.props;
        return (
            <StaticMap style="mapbox://styles/mapbox/streets-v9"
                 center={{ lng: centerLng, lat: centerLat }}
                 className="formMap"
            >
                <div>
                    <Layer type="circle"
                           id="marker"
                           paint={{
                               'circle-color': '#ff5200',
                               'circle-stroke-width': 1,
                               'circle-stroke-opacity': 1,
                               'circle-radius': 10
                           }}>
                        <Feature coordinates={[centerLng, centerLat]} />
                    </Layer>
                </div>
            </StaticMap>
        );
    }
}

export default StaticFormMap;
