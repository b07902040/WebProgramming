import React, { Component } from 'react'

class Station extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  render() {
    const data = this.props.station;
    const id1 = "s-" + data.station_id;
    const id2 = "l-" + data.station_id;
    var color;
    if ( data.station_type === 'R' ) {
      color = "red"
    }
    else if ( data.station_type === 'G') {
      color = "green"
    }
    else if ( data.station_type === 'O') {
      color = "orange"
    }
    else {
      color = "blue"
    }
    var rec = "station-rectangle " + color
    const li = "line " + color
    if ( data.distance_to_next === -1 ) {
      rec += " ";
      rec += "end";
      return (
        <div className="station-line-container">
          <div className="station-and-name" id={id1}> {/* you should add both id and onClick to attributes */}
            <div className={rec}>{data.station_id}</div>
            <div className="station-name">{data.station_name}</div>
          </div>
        </div>
      )
    }
    else {
      if ( data.station_order === 1 ) {
        rec += " ";
        rec += "end";
      }
      return (
        <div className="station-line-container">
          <div className="station-and-name" id={id1}> {/* you should add both id and onClick to attributes */}
            <div className={rec}>{data.station_id}</div>
            <div className="station-name">{data.station_name}</div>
          </div>
          <div className={li} id={id2}></div> {/* you should add id to attributes */}
        </div>
      )
    }
  }
}

export default Station
