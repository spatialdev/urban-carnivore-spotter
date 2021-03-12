import React, { Component } from "react";
import * as turf from "@turf/turf";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "@material-ui/lab/Pagination";
import ListCard from "../components/ListCard";
import { dataMatchesFilter } from "../services/FilterService";
import { withRouter } from "react-router-dom";
import Map from "@material-ui/icons/Place";
import mapViewIcon from "../assets/MapView.svg";
import FilterDrawer from "./FilterDrawer";
import { withStyles } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import * as ReactGA from "react-ga";
import { setReports, setReport } from "../store/actions";
import { getReports, updateReports, getPaginatedReports } from "../services/ReportsService";
import { getReport, getTacomaReport } from "../services/ReportService";
import NeighborhoodService from "../services/NeighborhoodService";
const neighborhoodService = new NeighborhoodService();
const TACOMA_LINE_FOR_BBOX = turf.lineString( [
  [-122.670442006814, 47.0600919913851],
  [-122.320456134032, 47.3206338868513],
] );
const TACOMA_BBOX = turf.bboxPolygon( turf.bbox( TACOMA_LINE_FOR_BBOX ) );

const styles = {
  mapViewButtonContainerMobile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bottom: "75%",
    left: "88%",
    zIndex: 99,
    position: "sticky",
    backgroundColor: "#0877C6",
    color: "#FFFFFF",
    cursor: "pointer",
    border: 0,
    outline: 0,
    borderRadius: "100%",
    padding: "1em",
    "&:hover": {
      backgroundColor: "#319ce8",
    },
    "&:active": {
      backgroundColor: "#319ce8",
    },
    "&:focus": {
      backgroundColor: "#319ce8",
    },
  },
  mapViewButtonContainerDesktop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bottom: "75%",
    left: "88%",
    zIndex: 99,
    position: "sticky",
    backgroundColor: "#000",
    color: "#FFFFFF",
    cursor: "pointer",
    border: 0,
    outline: 0,
    borderRadius: "19.5px",
    width: "9em",
    height: "40px",
    "&:hover": {
      backgroundColor: "rgba(25,1,1,0.7)",
    },
    "&:active": {
      backgroundColor: "rgba(25,1,1,0.7)",
    },
    "&:focus": {
      backgroundColor: "rgba(25,1,1,0.7)",
    },
  },
  mapViewText: {
    marginRight: "0.5em",
    marginLeft: "0.2em",
    fontWeight: 600,
    fontSize: "1em",
  },
  mapViewIcon: {
    marginRight: "0.2em",
  },
  paginator: {
    justifyContent: "center",
    padding: "1em",
  },
  mainRectangle: {
    margin: "1em 0",
  },
  filterContainer: {
    backgroundColor: "white",
    position: "fixed",
    left: "5%",
    bottom: "5%",
    width: 250,
    zIndex: 1000,
    height: "60%",
    boxShadow: "0px 2px 10px 0px rgba(117,117,117,0.05)",
    borderRadius: "6px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0.25em",
      height: "0.25em",
    },
    "&::-webkit-scrollbar-track": {
      width: "0.25em",
      height: "0.25em",
      backgroundColor: "#F1F1F1",
    },
    "&::-webkit-scrollbar-corner": {
      width: "0.25em",
      height: "0.25em",
      backgroundColor: "#F1F1F1",
    },
    "&::-webkit-scrollbar-thumb": {
      width: "0.25em",
      height: "0.25em",
      backgroundColor: "#D8D8D8",
    },
  },
};

class ListView extends Component {
  state = {
    reports: null,
    pageNumber: 1,
    itemsPerPage: 10,
  };

  componentDidMount = async () => {
    // const paginated = await getPaginatedReports( this.state.pageNumber );
    // console.log( 'PAGINATED IN FRONT', paginated );

    ReactGA.pageview( window.location.pathname );
    const { localStorage } = window;

    const cachedReports = localStorage.getItem( "reports" );
    if ( cachedReports ) {
      const parsedReports = JSON.parse( cachedReports );
      this.setState( { reports: parsedReports } );
    } else if ( this.props.reports && this.props.reports.length > 0 ) {
      this.setState( { reports: this.props.reports } );
    } else {
      const reports = await getReports();
      setReports( reports );
      this.setState( { reports } );
      localStorage.setItem( "reports", JSON.stringify( reports ) );
    }

    // Temporary: updates all reports' neighborhoods in DB
    // JSON.parse(cachedReports).forEach(async (report) => {
    //   if (
    //     report.data.neighborhood === "Seattle" ||
    //     report.data.neighborhood === "Unknown"
    //   ) {
    //     const newNeighborhood = await neighborhoodService.getNeighborhoodFor(
    //       report.data.mapLat,
    //       report.data.mapLng
    //     );
    //     if (newNeighborhood !== "Unknown") {
    //       await updateReports(report.id, {
    //         neighborhood: newNeighborhood,
    //       });
    //     } else {
    //       await updateReports(report.id, {
    //         neighborhood: "Washington",
    //       });
    //     }
    //   }
    // });

    const cachedPageNum = localStorage.getItem( "lastPageNum" );
    if ( cachedPageNum ) {
      this.setState( { pageNumber: cachedPageNum } );
    }
  };

  handlePageNumber = ( e, page ) => {
    const { localStorage } = window;
    this.setState( { pageNumber: page } );

    const cachedPageNum = localStorage.getItem( "lastPageNum" );
    if ( cachedPageNum ) {
      localStorage.removeItem( "lastPageNum" );
      localStorage.setItem( "lastPageNum", page );
    } else {
      localStorage.setItem( "lastPageNum", page );
    }
  };

  filterReports = ( reports ) => {
    const { filter } = this.props;
    return reports
      .filter( ( report ) => dataMatchesFilter( report, filter ) )
      .sort(
        ( one, two ) =>
          Date.parse( two.data.timestamp ) - Date.parse( one.data.timestamp )
      );
  };

  renderReportsPerPage = ( reports ) => {
    const { pageNumber, itemsPerPage } = this.state;
    const start = pageNumber - 1;
    return reports && reports.length > 10
      ? reports
        .slice( start * itemsPerPage, start * itemsPerPage + itemsPerPage )
        .map( ( report ) => {
          return (
            <ListCard
              key={ report.id }
              currReport={ report }
              handleReport={ this.handleReport }
            />
          );
        } )
      : reports.map( ( report ) => {
        return (
          <ListCard
            key={ report.id }
            currReport={ report }
            handleReport={ this.handleReport }
          />
        );
      } );
  };

  handleReport = async ( id ) => {
    const tacomaReport = await getTacomaReport( id );
    const report = await getReport( id );

    if ( Object.keys( tacomaReport ).length > 0 ) {
      setReport( { tacomaReport } );
      this.showReportPage( tacomaReport, id );
    } else {
      setReport( { report } );
      this.showReportPage( report, id );
    }
  };

  showReportPage = async ( report, id ) => {
    const { history } = this.props;

    const isInTacoma = await neighborhoodService.isInTacoma( report.data.mapLat, report.data.mapLng ).then( ( place ) => {
      // If place from neighborhoodService comes back as empty, check if the point lies within the TACOMA_BBOX
      if ( JSON.stringify( place ) === "{}" ) {
        const point = turf.point( [report.data.mapLng, report.data.mapLat] );
        return turf.booleanPointInPolygon( point, TACOMA_BBOX );
      } else {
        return place.toString().toLowerCase() === "tacoma";
      }
    } );

    const path = isInTacoma ? "/tacoma/reports" : "/reports";
    history.push( isInTacoma ? `${ path }/tacoma/${ id }` : `${ path }/${ id }` );
  };

  render () {
    const { reports, pageNumber, itemsPerPage } = this.state;
    const { isMobile, history, classes } = this.props;

    if ( !reports ) {
      return <CircularProgress />;
    }
    const filteredReports = this.filterReports( reports );

    return (
      <div className="backgroundCardContainer">
        {isMobile ? null : (
          <div className={ classes.filterContainer }>
            <FilterDrawer />
          </div>
        ) }
        <div className="cardContainer">
          { this.renderReportsPerPage( filteredReports ) }
          <button
            onClick={ () =>
              history.location.pathname.indexOf( "tacoma" ) === -1
                ? history.push( "/" )
                : history.push( "/tacoma" )
            }
            className={
              isMobile
                ? classes.mapViewButtonContainerMobile
                : classes.mapViewButtonContainerDesktop
            }
          >
            { !isMobile && <div className={ classes.mapViewText }>Map View</div> }
            <img
              className={ classes.mapViewIcon }
              src={ mapViewIcon }
              alt="Map View"
            />
          </button>
        </div>
        <Pagination
          classes={ { ul: classes.paginator } }
          color="primary"
          onChange={ this.handlePageNumber }
          count={ Math.floor( filteredReports.length / itemsPerPage ) }
          page={ Number( pageNumber ) }
          showFirstButton
          showLastButton
        />
      </div>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    isMobile: state.isMobile,
    filter: state.filter,
    reports: state.reports,
  };
};
export default withRouter(
  connect( mapStateToProps )( withStyles( styles )( ListView ) )
);
