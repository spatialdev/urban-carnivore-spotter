import React, { Component } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import supported from "@mapbox/mapbox-gl-supported";

let Map = null;
if (supported({})) {
  Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    dragPan: true,
  });
}

class FormMap extends Component {
  handleMapMove = (e) => {
    const { lng, lat } = e.getCenter();
    const { passMapCoordinates } = this.props;

    passMapCoordinates({ lng, lat });
  };

  render() {
    const { centerLng, centerLat } = this.props;

    return (
      <div style={{ height: "100%" }}>
        {Map && (
          <Map
            style="mapbox://styles/mapbox/streets-v9"
            center={{ lng: centerLng, lat: centerLat }}
            className="formMap"
            onDragEnd={(e) => this.handleMapMove(e)}
          />
        )}
      </div>
    );
  }
}

export default FormMap;
