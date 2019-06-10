import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

import { Map } from 'immutable';
import axios from "axios";
import {Button, Card, CardContent, z} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import blackbear from "../assets/SpeciesCards/blackbear.png";
import "../assets/SpeciesCards/coyote.png";
import bobcat from "../assets/SpeciesCards/bobcat.png";
import cougar from "../assets/SpeciesCards/cougar.png";
import opossum from "../assets/SpeciesCards/opossum.png";
import riverotter from "../assets/SpeciesCards/riverotter.png";
import raccoon from "../assets/SpeciesCards/raccoon.png";
import CardMedia from "./ListCard";


const imagePath = '../assets/SpeciesCards/';
const speciesList = ['blackbear', 'bobcat', 'cougar', 'coyote', 'opossum',
    'raccoon', 'riverotter'];

class ResourceCard extends Component {
    state = {
        species: null
    };

    componentDidMount() {
        const { match: { params: { species } } } = this.props;
            this.setState({species: species})
    }
;
    render() {
        const {species} = this.state;
        const { history } = this.props;
        if (!species) {
            return <CircularProgress/>;
        }
        return (
            <div>
                <img src={ require('../assets/SpeciesCards/' + species+'.png') }/>
                <Button onClick={() => history.goBack()}>back</Button>
            </div>
        );
    }
}

export default (withRouter(ResourceCard));