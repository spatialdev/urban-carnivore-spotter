import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {KeyboardArrowLeft} from "@material-ui/icons";
import Button from "./ReportViewer";

const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/2010-brown-bear.jpg/200px-2010-brown-bear.jpg";

const timeToString = time => {
    const date = new Date(time);
    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
};


/* TODO: Should be updated with neighborhood info */
class PointTooltip extends Component {
    render() {
        const { report } = this.props;
        return <div >
            <img width = {40} src = {report.data.mediaPaths && report.data.mediaPaths.length>0 ? report.data.mediaPaths[0] : DEFAULT_IMAGE_URL}  />
            <div className = "caption">{report.data.species}</div>
            <div className = "caption">Date & Time:</div>
            <div>{timeToString(report.data.timestamp)}</div>
            <div className = "caption">Location: {report.data.mapLat},{report.data.mapLng}</div>
            <li>
                <Link to={`/reports/${report.id}`}>See Report</Link>
            </li>
        </div>
    }
};

export default PointTooltip;
