import React from 'react';
import { RouteHandler } from 'react-router';
import Header from '../components/header.jsx';
import Map from '../components/map/map.jsx';

class App extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <div className="content">
          <Map
            scrollWheelZoom={false}
            attributionControl={false}
            className="main-map" >
            <RouteHandler {...this.props} />
          </Map>
        </div>
      </div>
    );
  }

}

export default App;
