import React from 'react'
import './mapbox-gl.css'
import { useRef, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';

import {supabase} from '../supabaseClient';

import Button from 'react-bootstrap/Button';
// import {Form} from 'react-bootstrap';



mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
mapboxgl.accessToken = "pk.eyJ1Ijoibml0aXNoZGV3YW4iLCJhIjoiY2xhM2ZqcXlzMGFxZjNvbDRkMHFjOHBjYyJ9.d7qTDfI-UTq6QwfUxbsfZw"
console.log(mapboxgl.accessToken)

function Maps() {

    var [mapLoaded, setLoadedMap] = useState(false)

    // const [violation, setViolation] = useState('construction');

    const mapContainer = useRef();
    // const mapContainer = React.createRef();
    const map = useRef(null);
    const lng = -87.64
    const lat = 41.87
    const zoom = 11

    // const [lng, setLng] = useState(-87.64);
    // const [lat, setLat] = useState(41.87);
    // const [zoom, setZoom] = useState(10);

    var layer_exists = false

    useEffect(() => {
        if (map.current) return;
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

    function Map_gen(){
        console.log(typeof(map.current.getBounds()['_ne']))
        console.log("test button press", mapLoaded)
        // console.log(document.getElementById('f2').value)

        var array_cat = []
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

        for (var i = 0; i < checkboxes.length; i++) {
        array_cat.push(checkboxes[i].value)
        }
        console.log(array_cat)


        // console.log(violation)
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
                  array_cat
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
                    'data': 
                    {   "type": "FeatureCollection",
                        "features": [
                          {
                            "type": "Feature",
                            "properties": {
                              "title": "Lincoln Park",
                              "description": "A northside park that is home to the Lincoln Park Zoo"
                            },
                            "geometry": {
                              "coordinates": [-87.637596, 41.940403],
                              "type": "Point"
                            }
                          },
                          {
                            "type": "Feature",
                            "properties": {
                              "title": "Burnham Park",
                              "description": "<strong>Truckeroo</strong><p>Truckeroo</a> brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>"
                            },
                            "geometry": {
                              "coordinates": [-87.603735, 41.829985],
                              "type": "Point"
                            }
                          }]}
                })
                console.log('source added')
                console.log(data1)

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
        map.current.on('click', 'points', (e) => {
            // Copy coordinates array.

            console.log("inside map click")
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;
             
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map.current);
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
            <br/><br/><br/>


            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="CONSTRUCTION_VEHICLE" id="o1"/>
                <label className="form-check-label">
                    CONSTRUCTION VEHICLE
                </label>
                <br/>
                <input className="form-check-input" type="checkbox" value="COMPANY" id="o2"/>
                <label className="form-check-label">
                    COMPANY
                </label>
                <br/>
                <input className="form-check-input" type="checkbox" value="MUNICIPAL_VEHICLE" id="o3"/>
                <label className="form-check-label">
                    MUNICIPAL VEHICLE
                </label>
                <br/>
                <input className="form-check-input" type="checkbox" value="PRIVATE_VEHICLE" id="o4"/>
                <label className="form-check-label">
                    PRIVATE VEHICLE
                </label>
                <br/>
                <input className="form-check-input" type="checkbox" value="TAXI" id="o5"/>
                <label className="form-check-label">
                    TAXI
                </label>
                <br/>
                <input className="form-check-input" type="checkbox" value="OTHER" id="o6"/>
                <label className="form-check-label">
                    OTHER
                </label>
            </div>
            <br/>
                

            <div id="button">
            <Button onClick={()=>Map_gen()}>Load Map</Button>
            </div>
            <br/><br/><br/>
            <div ref = {mapContainer} id="map" />
        </div>
    );
}

export default Maps