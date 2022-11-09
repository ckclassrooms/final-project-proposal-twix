import React from 'react'
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoibml0aXNoZGV3YW4iLCJhIjoiY2xhM2ZqcXlzMGFxZjNvbDRkMHFjOHBjYyJ9.d7qTDfI-UTq6QwfUxbsfZw';


function Maps() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-87.64);
    const [lat, setLat] = useState(41.87);
    const [zoom, setZoom] = useState(10);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom: zoom,
          doubleClickZoom: false
        });
      });

    //   console.log(isDoubleClickZoomEnabled)
      

      useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('load', () => {
            map.current.loadImage(
                'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                (error, image) => {
                if (error) throw error;
                map.current.addImage('custom-marker', image);
                        // Add a GeoJSON source
                        map.current.addSource('points', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
                                        // feature 1
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [
                                                -87.649771, 41.870899
                                            ]
                                        },
                                        'properties': {
                                            'title': 'UIC'
                                        }
                                    },
                                ]
                            }
                        });
            
                        // Add a symbol layer
                        map.current.addLayer({
                            'id': 'points',
                            'type': 'symbol',
                            'source': 'points',
                            'layout': {
                                'icon-image': 'custom-marker',
                                // update properties for title, icon and description box
                                'text-field': ['get', 'title'],
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top'
                            }
                        });

        })
        map.current.on('move', () => {
          setLng(map.current.getCenter().lng.toFixed(4));
          setLat(map.current.getCenter().lat.toFixed(4));
          setZoom(map.current.getZoom().toFixed(2));
        //   console.log(map.current.getBounds()['_sw'])

        map.current.on('dblclick', () =>{
            // for test
            console.log("double click check")
            const data = {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            // feature for Mapbox DC
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [
                                    -87.625368, 41.874366
                                ]
                            },
                            'properties': {
                                'title': 'Test 2'
                            }
                        },
                    ]
                
            }
            map.current.getSource('points').setData(data);
            // console.log("Double click test")
        })
        // to accept new data and update layer
        // map.current.getSource('points').setData(data);
        });
        // map.current
    })
      });

      function clicked(){
        alert("Button Testing Success")
      }

      return (
        <div>
          <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
          <div ref={mapContainer} className="map-container" />
          <div>
        <button onClick = {clicked}>
            Test Button
        </button>
        </div>
        </div>
      );
}

export default Maps