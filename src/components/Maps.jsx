import React from 'react'
import './mapbox-gl.css'
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
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

                // var myHeaders = new Headers();
                // myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlc2dvZ3Vqd3BzaGhoYWhvb3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcxNjY4NTksImV4cCI6MTk4Mjc0Mjg1OX0.vLaXeTLbdnc7MyhoA9Qe9v_gp3w0r_GP-XR80AFu6oc");
                // myHeaders.append("Content-Type", "application/json");
        
                // myHeaders.append("Access-Control-Allow-Origin", "*")
                // myHeaders.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
                // myHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        
                // var raw = JSON.stringify({
                // "lat1": -87.651769,
                // "lon1": 41.88007,
                // "lat2": -87.647589,
                // "lon2": 41.869612,
                // "cats": [
                //     "TAXI"
                // ]
                // });
        
                // var requestOptions = {
                // method: 'POST',
                // headers: myHeaders,
                // body: {
                //     "lat1": -87.651769,
                //     "lon1": 41.88007,
                //     "lat2": -87.647589,
                //     "lon2": 41.869612,
                //     "cats": [
                //         "TAXI"
                //     ]
                //     },
                // redirect: 'follow'
                // };
                // var result = ""

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
                console.log(typeof(data))
                var data1 = JSON.stringify(data)
                // map.current.setGeoJSON(
                //     data1
                // );
                if(layer_exists == true){
                map.current.removeLayer('points')
                map.current.removeSource('points_source')
                }

                map.current.addSource('points_source', {
                    'type': 'geojson',
                    'data': 'https://pfpkazivqzaanncegjkr.supabase.co/storage/v1/object/public/test/geojson_file.json?t=2022-11-22T04%3A22%3A20.108Z'
                })
                console.log('source added')
                
                map.current.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'interactive':true,
                    'source': 'points_source',
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