import React from 'react';
import { Button } from '@material-ui/core';
import raccoon from '../assets/Raccoon.svg';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const styles = {
    oops: {
        color: '#8acc25',
        fontSize: '64px',
    },
    text: {
        fontSize: 20,
        marginLeft: '20%',
        marginRight: '20%',
    },
    raccoon: {
        position: 'fixed',
        bottom: 0,
        transform: 'translateX(-50%)',
        zIndex: -1,
        maxHeight: '40%',
        minHeight: '15%',
    },
    raccoonMobile: {
        position: 'fixed',
        bottom: '10%',
        transform: 'translateX(-50%)',
        zIndex: -1,
        maxHeight: '30%',
        minHeight: '15%',
    },
    button: {
        backgroundColor: '#8acc25',
        color: 'white',
    },
    container: {
        zIndex: 0,
    },
    background: {
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
        zIndex: -100,
        position: 'fixed',
        top: 0,
    }
};

const NotFound = (props) => {
    const { classes, history, isMobile } = props;
    return <>
        <div className={classes.background}/>
        <div className={classes.container}>
            <h1 className={classes.oops}><strong>oops!</strong></h1>
            <h2>404 - Page not found</h2>
            <p className={classes.text}>Sorry, the page you are looking for could not be found.</p>
            <Button
                variant="contained"
                onClick={() => history.push('/')}
                className={classes.button}
                size="large">Back to Map</Button>
            <br/>
            <img src={raccoon} alt="Raccoon" className={isMobile ? classes.raccoonMobile : classes.raccoon}/>
        </div>
    </>
};

const mapStateToProps = (state) => {
    return { isMobile: state.isMobile };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps)(NotFound)));
