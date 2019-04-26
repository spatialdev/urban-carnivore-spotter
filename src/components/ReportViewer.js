import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImageGallery from 'react-image-gallery';
import { Toolbar } from "@material-ui/core";
import { KeyboardArrowLeft } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import axios from "axios";

const getReport = 'https://us-central1-seattlecarnivores-edca2.cloudfunctions.net/getReport';

class ReportViewer extends Component {
  componentDidMount() {
    const {match: {params: {id}}} = this.props;
    axios.get(getReport + `?id=${id}`)
      .then(report => {
        console.log(report);
        this.setState({ report: report.data });
      })
      .catch(error => error);
  }

  _renderVideo(item) {
    return (
      <div className='image-gallery-image'>
        {
          this.state.showVideo[item.embedUrl] ?
            <div className='video-wrapper'>
              <a
                className='close-video'
                onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
              >
              </a>
              <iframe
                width='560'
                height='315'
                src={item.embedUrl}
                frameBorder='0'
                allowFullScreen
              >
              </iframe>
            </div>
            :
            <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
              <div className='play-button'></div>
              <img src={item.original}/>
              {
                item.description &&
                <span
                  className='image-gallery-description'
                  style={{ right: '0', left: 'initial' }}
                >
                    {item.description}
                  </span>
              }
            </a>
        }
      </div>
    );
  }

  render() {
    const { history } = this.props;

    const images = [
      {
        original: 'http://lorempixel.com/1000/600/nature/1/',
        thumbnail: 'http://lorempixel.com/250/150/nature/1/',
      },
      {
        original: 'http://lorempixel.com/1000/600/nature/2/',
        thumbnail: 'http://lorempixel.com/250/150/nature/2/'
      },
      {
        original: 'http://lorempixel.com/1000/600/nature/3/',
        thumbnail: 'http://lorempixel.com/250/150/nature/3/'
      },
      {
        original: 'https://www.youtube.com/watch?v=YE7VzlLtp-4',
      }];

    return (
      <div className="reportViewer">
        <Toolbar className="reportViewerToolbar">
          <Button className="backToExplore" onClick={() => history.push('/map')}> <KeyboardArrowLeft/>Explore</Button>
          <h4>ANIMAL TYPE</h4>
        </Toolbar>
        <Card className="reportCard">
          <ImageGallery items={images}
                        showBullets={true} showIndex={true}
                        showThumbnails={false} showVideo={true}/>
          <div style={{ backgroundColor: 'white', textAlign: 'left', paddingLeft: '30px' }}>
            <p><strong>Date:</strong> DATE HERE</p>
            <p><strong>Neighborhood:</strong> NEIGHBORHOOD HERE</p>
            <p><strong>Time of Sighting:</strong> SIGHTING TIME HERE</p>
            <p><strong>Confidence:</strong> CONFIDENCE HERE</p>
          </div>
        </Card>
      </div>
    )
      ;
  }
}

export default withRouter(ReportViewer);