import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/2010-brown-bear.jpg/200px-2010-brown-bear.jpg";

const timeToString = time => {
    const nanosInMillis = time._nanoseconds / 1000000;
    const secondsInMillis = time._seconds * 1000;
    return new Date(nanosInMillis + secondsInMillis).toLocaleString();
};

const PointTooltip = props => {
    const { data } = props;
    return <div width = {100}>
        <img width={50} src={data.image_url ? data.image_url : DEFAULT_IMAGE_URL} />
        <div>{data.species}</div>
        <div>Date & Time:</div>
        <div>{timeToString(data.timestamp)}</div>
        <div>Location: {data.mapLat},{data.mapLng}</div>
    </div>
};

export default PointTooltip;