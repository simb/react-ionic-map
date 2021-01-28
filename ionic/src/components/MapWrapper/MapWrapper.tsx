import React, { useState, useEffect, createRef, useReducer } from 'react';
import MapContext from './MapContext'

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import {fromLonLat} from 'ol/proj'
// import {toStringXY} from 'ol/coordinate';

import './MapWrapper.css';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

const MapWrapper: React.FC = () => {

  // set intial state - used to track references to OpenLayers
  const [map, setMap ] = useState<Map>()
  const [, setFeaturesLayer ] = useState<VectorLayer>()
  const [mounting, setMounting] = useState(true);

  // get ref to div element - OpenLayers will render into this div
  const mapElement: React.RefObject<HTMLDivElement> = createRef();

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect(() => {
    const iconStyle = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: "http://cdn.mapmarker.io/api/v1/pin?text=1&size=50&hoffset=1"
        })
    });
    const markerFeature = new Feature({
        // geometry: new Point(fromLonLat([-123.009566, 45.279232])) // alit
        geometry: new Point(fromLonLat([-123.00773643156519, 45.279269161831074]))
        
    });
    markerFeature.setStyle(iconStyle);
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource({
            features: [markerFeature]
        })
    })

    // create map
    const initialMap = new Map({
      target: mapElement.current as HTMLDivElement,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
        initalFeaturesLayer
      ],
      view: new View({
        center: fromLonLat([-123.0116626, 45.2756504]),
        zoom: 13,
      }),
      controls: []
    })

    initialMap.on('rendercomplete', (e) => {

      setMounting(false);
    })

    // save map and vector layer references to state
    setMap(initialMap)
    setFeaturesLayer(initalFeaturesLayer)
    

  },[])

  return (
    <MapContext.Provider value={{ map }}>
      <div>
        {mounting ? <p>mounting</p> : <p>not mounting</p>}
        <div ref={mapElement} className="map-container"></div>
      </div>
    </MapContext.Provider>
  )

}

export default MapWrapper

