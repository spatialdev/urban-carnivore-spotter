import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";

const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/2010-brown-bear.jpg/200px-2010-brown-bear.jpg";

const timeToString = time => {
    const date = new Date(time);
    return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
};

/* TODO: Should be updated with neighborhood info */
const PointTooltip = props => {
    const { data } = props;
    return <div >
        <img width = {40} src = {data.image_url ? data.image_url : DEFAULT_IMAGE_URL}  />
        <div className = "caption">{data.species}</div>
        <div className = "caption">Date & Time:</div>
        <div>{timeToString(data.timestamp)}</div>
        <div className = "caption">Location: {data.mapLat},{data.mapLng}</div>
        <li>
            <Link to={`/reports/${data.id}`}>See Report</Link>
        </li>
    </div>
};

export default PointTooltip;
