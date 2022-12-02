import React from 'react'
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

function Maps() {
    // const mapContainer = useRef(null);
    const mapContainer = React.createRef();
    const map = useRef(null);
    const lng = -87.64
    const lat = 41.87
    const zoom = 10
    
    // const [lng, setLng] = useState(-87.64);
    // const [lat, setLat] = useState(41.87);
    // const [zoom, setZoom] = useState(10);

    // if (map.current) return;
    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
    });

    function map_gen(){
        map.current.addLayer().addTo(map);
        // function loadFile(filePath) {
        //     var result = null;
        //     var xmlhttp = new XMLHttpRequest();
        //     xmlhttp.open("GET", filePath, false);
        //     xmlhttp.send();
        //     if (xmlhttp.status===200) {
        //     result = xmlhttp.responseText;
        //     return result
        //     }
        // console.log(loadFile("http://localhost:8000/geojson_file.json"))
        // var data = loadFile("http://localhost:8000/geojson_file.json")
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlc2dvZ3Vqd3BzaGhoYWhvb3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcxNjY4NTksImV4cCI6MTk4Mjc0Mjg1OX0.vLaXeTLbdnc7MyhoA9Qe9v_gp3w0r_GP-XR80AFu6oc");
        myHeaders.append("Content-Type", "application/json");

        myHeaders.append("Access-Control-Allow-Origin", "*")
        myHeaders.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
        myHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

        var raw = JSON.stringify({
        "lat1": -87.651769,
        "lon1": 41.88007,
        "lat2": -87.647589,
        "lon2": 41.869612,
        "cats": [
            "TAXI"
        ]
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        var result = ""
        fetch("https://kesgogujwpshhhahoouk.functions.supabase.co/maps_func_2", requestOptions)
        .then(response => console.log(response.json()))
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        // return result;
        
        var data = JSON.parse(result)
        map.current.setGeoJSON(
            data
        );
    }


    return (
        <div>
            <meta charSet="utf-8" />
            <title>Maps for BikeSpy</title>
            <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
            <link href="https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{__html: "\n  body { margin:0; padding:0; }\n  #map { position:absolute; top:50px; bottom:0; width:100%; }\n" }} />
            <div id="button">
            <button onClick={map_gen()}>Load Map</button>
            </div>
            <div ref = {this.mapContainer} className="mapContainer" />
        </div>
    );
}

export default Maps