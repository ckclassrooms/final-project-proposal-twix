import React from 'react'
import './mapbox-gl.css'
import { useRef, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';

import {supabase} from '../supabaseClient';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
mapboxgl.accessToken = "pk.eyJ1Ijoibml0aXNoZGV3YW4iLCJhIjoiY2xhM2ZqcXlzMGFxZjNvbDRkMHFjOHBjYyJ9.d7qTDfI-UTq6QwfUxbsfZw"
console.log(mapboxgl.accessToken)

function Maps() {

    var [mapLoaded, setLoadedMap] = useState(false)

    const mapContainer = useRef();
    // const mapContainer = React.createRef();
    const map = useRef(null);
    const lng = -87.64
    const lat = 41.87
    const zoom = 10
    var layer_exists = false

    // const [lng, setLng] = useState(-87.64);
    // const [lat, setLat] = useState(41.87);
    // const [zoom, setZoom] = useState(10);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
        });
        map.current.on('load',() => {
            console.log('test map on load')
            setLoadedMap(true);
        })
        });


    // useEffect(() => {
    function Map_gen(){
        console.log("test button press", mapLoaded)
        
            if(mapLoaded === true){

                console.log("test button")

            async function getMap(){
                console.log('calling edge func')
                const {data, error} = await supabase.functions.invoke('maps_func_2', {
                body: {
                "lat1": -87.651769,
                "lon1": 41.88007,
                "lat2": -87.647589,
                "lon2": 41.869612,
                "cats": [
                  "TAXI"
                ]
                }}
                )
                console.log(data)
                console.log(error)
                console.log(typeof(data))
                var data1 = JSON.stringify(data)
                // map.current.setGeoJSON(
                //     data1
                // );
                if(layer_exists === true){
                map.current.removeLayer('points')
                map.current.removeSource('points_source')
                map.current.removeImage('custom-marker')
                }
                map.current.loadImage(
                    'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                    (error, image) => {
                    if (error) throw error;
                    map.current.addImage('custom-marker', image);
                map.current.addSource('points_source', {
                    'type': 'geojson',
                    'data': data1
                    // {   "type": "FeatureCollection",
                    //     "features": [
                    //       {
                    //         "type": "Feature",
                    //         "properties": {
                    //           "title": "Lincoln Park",
                    //           "description": "A northside park that is home to the Lincoln Park Zoo"
                    //         },
                    //         "geometry": {
                    //           "coordinates": [-87.637596, 41.940403],
                    //           "type": "Point"
                    //         }
                    //       },
                    //       {
                    //         "type": "Feature",
                    //         "properties": {
                    //           "title": "Burnham Park",
                    //           "description": "A lakefront park on Chicago's south side"
                    //         },
                    //         "geometry": {
                    //           "coordinates": [-87.603735, 41.829985],
                    //           "type": "Point"
                    //         }
                    //       }]}
                })
                console.log('source added')
                
                // map.current.addImage('custom-marker', image);

                map.current.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points_source',
                    'layout': {
                        'icon-image': 'custom-marker',
                        // get the title name from the source's "title" property
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
        map.current.on('click', 'places', (e) => {
            // Copy coordinates array.
            console.log("inside map click")
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
             
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
            });
            layer_exists = true
            console.log("layer added")
              }
            (async () => await getMap())()
    }
        }
    // })

    return (
        <div>
            <meta charSet="utf-8" />
            <title>Maps for BikeSpy</title>
            <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
            <link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet" />
            {/* <style dangerouslySetInnerHTML={{__html: "\n  body { margin:0; padding:0; }\n  #map { position:absolute; top:50px; bottom:0; width:100%; }\n" }} /> */}
            <div id="button">
            <button onClick={()=>Map_gen()}>Load Map</button>
            </div>
            <div ref = {mapContainer} id="map" />
        </div>
    );
}

export default Maps