import React from 'react'
import '../scss/mapbox-gl.css'
import { useRef, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { supabase } from '../supabaseClient';
import DOMPurify from 'dompurify';

import Button from 'react-bootstrap/Button';
// import {Form} from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { violationTypes } from './Violation';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
// mapboxgl.accessToken = "pk.eyJ1Ijoibml0aXNoZGV3YW4iLCJhIjoiY2xhM2ZqcXlzMGFxZjNvbDRkMHFjOHBjYyJ9.d7qTDfI-UTq6QwfUxbsfZw"
console.log(mapboxgl.accessToken)

const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        polygon: true,
        trash: true
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: 'simple_select'
});



function Maps() {

    var [mapLoaded, setLoadedMap] = useState(false)

    // const [violation, setViolation] = useState('construction');

    const mapContainer = useRef();
    // const mapContainer = React.createRef();
    const map = useRef(null);
    const lng = -87.64
    const lat = 41.87
    const zoom = 11

    const [violation, setViolation] = useState([]);
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
        map.current.loadImage(
            "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
            (error, image) => {
                if (error) throw error;
                map.current.addImage('custom-marker', image);
            })
        map.current.on('load', () => {
            console.log('test map on load')
            setLoadedMap(true);
        })
        map.current.addControl(draw, 'top-left');
        map.current.on('draw.create', updateArea);
        map.current.on('draw.delete', updateArea);
        map.current.on('draw.update', updateArea);

        map.current.on('draw.modechange', (e) => {
            const data = draw.getAll();
            if (draw.getMode() === 'draw_polygon') {
                var pids = []

                // ID of the added template empty feature
                const lid = data.features[data.features.length - 1].id

                data.features.forEach((f) => {
                    if (f.geometry.type === 'Polygon' && f.id !== lid) {
                        pids.push(f.id)
                    }
                })
                draw.delete(pids)

            }
        });
    });

    function updateArea(e) {
        if (e.type === 'draw.delete') {
            removeData()
            Map_gen();
            
        }
        else if (e.type === 'draw.create') {
            removeData()
            const poly = draw.getAll();
            const locArray = poly.features[0].geometry.coordinates[0];
            loadPolygonData(locArray)
            console.log("Draw .create called", locArray);
            // layer_exists = true
            console.log("layer_exists" + layer_exists)

        }
        else if (e.type === 'draw.update') {
            const poly = draw.getAll();
            const locArray = poly.features[0].geometry.coordinates[0];
            loadPolygonData(locArray)
            console.log("draw.update called", locArray);
        }
    }

    async function mylocation() {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            // eslint-disable-next-line
            const crd = pos.coords;

            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);

            var currLat = crd.latitude
            var currLong = crd.longitude
            console.log("hello")
            console.log(currLat, currLong)

            map.current.flyTo({
                // center: [(Math.random() - 0.5) * 360, (Math.random() - 0.5) * 100],
                center: [currLong, currLat],
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }

        function error(err) {
            console.warn(`ERROR({err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);

        console.log("test 2")
    }

    function changeViolationValue(valueArray) {
        setViolation(valueArray);
    }

    function removeViolationValue(valueArray) {
        setViolation(valueArray);
    }

    // eslint-disable-next-line
    async function loadPolygonData(array) {
        removeData()
        var array_cat = []
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
        for (var i = 0; i < checkboxes.length; i++) {
            array_cat.push(checkboxes[i].value)
        }
        let payload = { "poly": array }
        console.log(violation.length);
        if (violation.length > 0) payload["cats"] = violation
        console.log("payload of polygon", payload)
        const { data, error } = await supabase.functions.invoke('maps_polygon_1', {
            body: payload
        }
        )
        console.log("polygon res", data)
        if (error)
            console.log("Error", error)

        loadMapWithData(data)
        layer_exists = true
        console.log("test here")
        console.log(layer_exists)

    }

    async function supabaseCall(lat1, lon1, lat2, lon2, cats) {
        let payload = {
            "lat1": lat1,
            "lon1": lon1,
            "lat2": lat2,
            "lon2": lon2
        }
        if (cats.length > 0)
            payload["cats"] = cats

        const { data, error } = await supabase.functions.invoke('maps_func_2', {
            body: payload
        }
        )
        console.log(data)
        console.log(error)

        return data
    }

    function removeData() {
        // if (layer_exists === true) {
        // map.current.removeLayer('points')
        // map.current.removeSource('points_source')
        // map.current.removeImage('custom-marker')
        // layer_exists = false;
        if (map.current.getLayer("points")) {
            map.current.removeLayer("points");
        }

        if (map.current.getSource("points_source")) {
            map.current.removeSource("points_source");
        }

        // try{
        // map.current.removeImage('custom-marker')
        // }
        // catch{
        //     console.log("error in removing image")
        // }

        // }
    }

    async function loadMapWithData(data) {
        removeData()

        map.current.addSource('points_source', {
            'type': 'geojson',
            'data': data
        })
        console.log('source added')


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



        map.current.on('click', 'points', (e) => {
            // Copy coordinates array.

            console.log("inside map click")
            const coordinates = e.features[0].geometry.coordinates.slice();
            const violation = DOMPurify().sanitize(unescape(e.features[0].properties.violation));
            const timeViolationDate = DOMPurify().sanitize(unescape((e.features[0].properties.time).slice(0, 10)));
            console.log(timeViolationDate)
            const timeViolationTime = DOMPurify().sanitize(unescape((e.features[0].properties.time).slice(11, 19)));
            console.log(timeViolationTime)
            const imageURL = DOMPurify().sanitize(unescape(e.features[0].properties.image_url));

            // console.log("typeof")
            // console.log(typeof(violation))

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                // eslint-disable-next-line
                .setHTML("<strong>Violation reported at: </strong> <br/>" + timeViolationDate + "<br/>" + timeViolationTime + " GMT" + "<br/>" + "<strong>Vehicle Category: </strong><br/>" + violation + "<br/><img style=\"width:100px;height:100px;\" align = \"center\" src='" + imageURL + "\'>")
                .addTo(map.current);
        });
        layer_exists = true
        console.log("layer added")
    }

    function Map_gen() {
        console.log("inisde map gen " + layer_exists)
        removeData()
        console.log("bounds all")
        const curr_bounds = map.current.getBounds()
        console.log("ne-lang" + curr_bounds['_ne']['lng'])
        console.log("ne-lat" + curr_bounds['_ne']['lat'])
        console.log("sw-lang" + curr_bounds['_sw']['lng'])
        console.log("se-lang" + curr_bounds['_sw']['lat'])
        console.log("test button press", mapLoaded)
        // console.log(document.getElementById('f2').value)

        var array_cat = []
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
        for (var i = 0; i < checkboxes.length; i++) {
            array_cat.push(checkboxes[i].value)
        }
        console.log(array_cat)


        // console.log(violation)
        if (mapLoaded === true) {

            console.log("test button")

            async function getMap() {
                console.log('calling edge func')

                // values for testing
                var lat1 = curr_bounds['_sw']['lng']
                var lon1 = curr_bounds['_ne']['lat']
                var lat2 = curr_bounds['_ne']['lng']
                var lon2 = curr_bounds['_sw']['lat']
                // var data = await supabaseCall(lat1, lon1, lat2, lon2, array_cat)
                var data = await supabaseCall(lat1, lon1, lat2, lon2, violation)
                loadMapWithData(data)
                // layer_exists = true

            }
            (async () => await getMap())()
        }
    }

    // function toggleTrue(source) {
    //     var checkboxes = document.getElementsByClassName("form-check-input")
    //     for(var i=0, n=checkboxes.length;i<n;i++) {
    //       checkboxes[i].checked = true;
    //     }
    //   }

    // function toggleFalse(source) {
    //     var checkboxes = document.getElementsByClassName("form-check-input")
    //     for(var i=0, n=checkboxes.length;i<n;i++) {
    //       checkboxes[i].checked = false;
    //     }
    // }
    // })

    return (
        <div class="container" style={{ marginTop: "60px" }}>
            <div class="row">
                <meta charSet="utf-8" />
                <title>Maps for BikeSpy</title>
                <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
                <link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet" />
                <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.2/mapbox-gl-draw.js"></script>
                <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.2/mapbox-gl-draw.css" type="text/css"></link>
                {/* <style dangerouslySetInnerHTML={{__html: "\n  body { margin:0; padding:0; }\n  #map { position:absolute; top:50px; bottom:0; width:100%; }\n" }} /> */}
                <div class="col-xl">

                    <h5>Select the filters you want to apply: <br /> (Default: All results will be displayed)</h5>
                    {/* <Button style={{t: "30px"}} onClick={() => toggleTrue()}>Select All</Button> */}
                    {/* &nbsp;&nbsp;&nbsp; */}
                    {/* <Button onClick={() => toggleFalse()}>De-select All</Button> */}
                    <br />
                    <Multiselect class="form-select"
                        options={violationTypes}
                        selectedValues={violation}
                        onSelect={(event) => changeViolationValue(event)}
                        onRemove={(event) => removeViolationValue(event)}
                        isObject={false}
                    />
                   
                    <br />

                    <div><Button onClick={() => mylocation()} id="fly">Go to my location!</Button></div>
                    <br />
                    <div id="button">
                        <Button onClick={() => Map_gen()}>Load Map</Button>
                    </div>
                </div>
                <div class="col-xl" ref={mapContainer} id="map" />
            </div>
        </div>
    );
}

export default Maps