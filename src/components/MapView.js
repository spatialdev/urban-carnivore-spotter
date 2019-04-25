import React, { Component } from 'react';
import ReactMapboxGl, {Layer, Feature, Popup} from 'react-mapbox-gl';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Map } from 'immutable';
import PointTooltip from '../components/PointTooltip';


const Map2 = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

const speciesColorMap = Map({'bear':'#801e78','bobcat': '#498029','coyote': '#561480','mountain lion': '#802a00','racoon': '#093c80'});
const getReports = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReports';
//const reports = [{"id":"report","data":{"time_seen":{"_seconds":1546333200,"_nanoseconds":0},"time_submitted":{"_seconds":1550131200,"_nanoseconds":0},"observer_name":"","species":"Dog","vocalization":"","location":"","animal_response":"","observer_interaction":"","photos":"","species_desc":"","species_confidence":"high","videos":"","date_of_obs":"","observer_phone":"","general_comments":"","animal_behavior":"","observer_email":"","number_observed":""}},{"id":"report2","data":{"some_field":"test","species":"Cat","time_seen":{"_seconds":1550766300,"_nanoseconds":0},"time_submitted":{"_seconds":1550649600,"_nanoseconds":0},"species_confidence":"medium"}},{"id":"WjDrs0XrH2Wiz0dNk8mR","data":{"species":"Bear","time_seen":{"_seconds":1547583120,"_nanoseconds":0},"time_submitted":{"_seconds":1552032000,"_nanoseconds":0},"species_confidence":"high"}},{"id":"uIqosaGJuUp4iFIQKAbD","data":{"species":"coyote","time_seen":{"_seconds":1552428720,"_nanoseconds":0},"time_submitted":{"_seconds":1553066100,"_nanoseconds":0},"location":{"_latitude":53.30774059167,"_longitude":36.62600826775}}},{"id":"vWCjwYC1hUfdxG4XU261","data":{"time_seen":{"_seconds":1548966720,"_nanoseconds":0},"time_submitted":{"_seconds":1553195400,"_nanoseconds":0},"species_confidence":"high","species":"coyote","location":{"_latitude":53.3051877349,"_longitude":36.62173475774},"image_url":"https://firebasestorage.googleapis.com/v0/b/seattlecarnivores-edca2.appspot.com/o/images%2F00b39864-a0f3-446c-b0fc-5d64dd357435.png?alt=media&token=9b142009-a161-4715-ac97-42e77fb7f605"}},{"id":"657f8heLF8pMskGcDntx","data":{"species":"coyote","timestamp":"2019-04-01T21:26:28.030Z","mapLat":-127,"time_seen":{"_seconds":1553876100,"_nanoseconds":0},"time_submitted":{"_seconds":1553451011,"_nanoseconds":0},"mapLng":46}},{"id":"rs54UHL4WlfRkAQu1pix","data":{"species_confidence":"high","neighborhood":"Queen Anne","species":"dog","location":{"_latitude":53.30002063169,"_longitude":36.7338823301},"time_seen":{"_seconds":1551862800,"_nanoseconds":0},"time_submitted":{"_seconds":1553497200,"_nanoseconds":0}}},{"id":"4NjTeWoInrcIqWJHkZar","data":{"mapLng":47.608013,"species":"coyote","timestamp":"2019-04-01T21:21:28.030Z","location":{"_latitude":53.30008162958,"_longitude":36.61318914921},"mapLat":-122.335167,"time_seen":{"_seconds":1549011600,"_nanoseconds":0},"time_submitted":{"_seconds":1553537470,"_nanoseconds":0}}},{"id":"tce8WBzelfbsjww09gS9","data":{"species":"dog","time_seen":{"_seconds":1551866400,"_nanoseconds":0},"time_submitted":{"_seconds":1553583600,"_nanoseconds":0},"species_confidence":"high","location":{"_latitude":53.30825116822,"_longitude":36.62686299148}}}]

class MapView extends Component {
    state = {
        fitBounds: undefined,
        viewport: {
            latitude: 47.608013,
            longitude: -122.335167,
            //center: [-122.335167, 47.608013],
            zoom: [10],
        },
        popupInfo: null,
        reports: reports
    };

    updateViewport = (viewport) => {
        const url = getReports+"?"+viewport.latitude+"&"+viewport.longitude;
        axios.get(url)
            .then(reports => {
                this.setState({ reports: reports.data,
                viewport: viewport});
            })
            .catch(error => error);
    };
    componentDidMount() {
        const url = getReports+"?mapLat=-122.335167&mapLng=47.608013";
        axios.get(url)
            .then(reports => {
                this.setState({ reports: reports.data });
            })
            .catch(error => error);
    }

    getColor(species) {
        return speciesColorMap.get(species)!== undefined ? speciesColorMap.get(species) : '#805b14';
    }

    renderPopup() {
        const {popupInfo} = this.state;

        return popupInfo && (
            <Popup tipSize={5}
                   anchor="bottom"
                   coordinates={[popupInfo.mapLat, popupInfo.mapLng]}
                   onMouseLeave={() => this.setState({popupInfo: null})}>
                <PointTooltip data={popupInfo} key={popupInfo.id}/>
            </Popup>
        );
    }
    render() {
        const {reports,viewport} = this.state;
        if (!reports) {
            return <CircularProgress/>;
        }
        return (
            <div className="mapContainer ">
                <Map2 style="mapbox://styles/mapbox/streets-v9"
                      {...viewport}
                      className="map"
                      onViewportChange={this.updateViewport}>
                    {this.renderPopup()}
                    {reports.map((report) => (
                        <Layer type="circle"
                               key ={report.id}
                               paint={{'circle-color': this.getColor(report.data.species.toLowerCase())}}>
                            <Feature  key ={report.id} coordinates={[report.data.mapLat, report.data.mapLng]}
                                      onClick={() => this.setState({popupInfo: report.data})}
                            />
                        </Layer>))}

                </Map2>
            </div>
        );
    }
}

export default MapView;
