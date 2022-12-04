import React from 'react'
import '../scss/mapbox-gl.css'
import { useRef, useEffect, useState } from 'react';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { supabase } from '../supabaseClient';
import Button from 'react-bootstrap/Button';
import Multiselect from 'multiselect-react-dropdown';
import { violationTypes } from './Violation';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';

// imports for custom markers
import taxi from "./images/taxi.png"
import company from "./images/company.png"
import construction from "./images/construction.png"
import municipal from "./images/municipal.png"
import private_vehicle from "./images/private_vehicle.png"
import other from "./images/other.png"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    },
    defaultMode: 'simple_select'
});



function Maps() {
    var [mapLoaded, setLoadedMap] = useState(false)

    const mapContainer = useRef();
    // const mapContainer = React.createRef();
    const map = useRef(null);
    const lng = -87.64
    const lat = 41.87
    const zoom = 11

    const [violation, setViolation] = useState([]);

    var layer_exists = false
    console.log(layer_exists)

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        const taxi_image = new Image(35,35);
        taxi_image.src = taxi

        const company_image = new Image(35,35);
        company_image.src = company

        const construction_image = new Image(35,35);
        construction_image.src = construction

        const other_image = new Image(35,35);
        other_image.src = other

        const municipal_image = new Image(35,35);
        municipal_image.src = municipal

        const private_image = new Image(35,35);
        private_image.src = private_vehicle

        map.current.on('load', () => {
            setLoadedMap(true);

            map.current.addImage('taxi-marker', taxi_image)
            map.current.addImage('company-marker', company_image)
            map.current.addImage('private-marker', private_image)
            map.current.addImage('municipal-marker', municipal_image)
            map.current.addImage('other-marker', other_image)
            map.current.addImage('construction-marker', construction_image)
            
            Map_gen(true)
        })
        map.current.addControl(draw, 'top-left');
        map.current.on('draw.create', updateArea);
        map.current.on('draw.delete', updateArea);
        map.current.on('draw.update', updateArea);

        map.current.on('draw.modechange', (e) => {
            const data = draw.getAll();
            if (draw.getMode() === 'draw_polygon') {
                var pids = []
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

    function deletePolygons(){
        const data = draw.getAll();
            console.log("data in delete polygon ",data)
                var pids = []
                
                data.features.forEach((f) => {
                    if (f.geometry.type === 'Polygon' ) {
                        pids.push(f.id)
                    }
                })
                draw.delete(pids)
            
    }
    
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
        }
        else if (e.type === 'draw.update') {
            const poly = draw.getAll();
            const locArray = poly.features[0].geometry.coordinates[0];
            
            loadPolygonData(locArray)
        }
    }

    async function mylocation() {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            const crd = pos.coords;

            var currLat = crd.latitude
            var currLong = crd.longitude

            map.current.flyTo({
                center: [currLong, currLat],
                essential: true
            });
        }

        function error(err) {
            console.warn(`ERROR({err.code}): ${err.message}`);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    }


    function changeViolationValue(valueArray) {
        setViolation(valueArray);
    }

    function removeViolationValue(valueArray) {
        setViolation(valueArray);
    }

    async function loadPolygonData(array) {
        removeData()
        var array_cat = []
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
        for (var i = 0; i < checkboxes.length; i++) {
            array_cat.push(checkboxes[i].value)
        }
        let payload = { "poly": array }
        if (violation.length > 0) payload["cats"] = violation
        console.log("Load polygon payload",payload)
        const { data, error } = await supabase.functions.invoke('maps_polygon_1', {
            body: payload
        }
        )
        if (error)
            console.log("Error", error)

        loadMapWithData(data)
        layer_exists = true

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
        })
        if (error != null){
            alert("Unable to fetch data from server.")
        }

        if (error) {
            console.log(error)
            alert("Error in loading maps");
        }

        return data
    }

    function removeData() {
        if (map.current.getLayer("points")) {
            map.current.removeLayer("points");
        }

        if (map.current.getSource("points_source")) {
            map.current.removeSource("points_source");
        }
    }

    async function loadMapWithData(data) {
        removeData()
        map.current.addSource('points_source', {
            'type': 'geojson',
            'data': data
        })

        map.current.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points_source',
            'layout': {
                'icon-image': [
                'match',
                [ 'get', 'violation' ], // type corresponds to the field name you are keying off of
                [ 'COMPANY' ],
                'company-marker',
                [ 'CONSTRUCTION_VEHICLE' ],
                'construction-marker',
                [ 'PRIVATE_VEHICLE' ],
                'private-marker',
                [ 'MUNICIPAL_VEHICLE' ],
                'municipal-marker',
                [ 'TAXI' ],
                'taxi-marker',
                [ 'OTHER' ],
                'other-marker',
                'other-marker' // fallback icon
              ],
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
            
            const coordinates = e.features[0].geometry.coordinates.slice();
            const violation = e.features[0].properties.violation;
            const timeViolationDate = (e.features[0].properties.time).slice(0, 10);
            const timeViolationTime = (e.features[0].properties.time).slice(11, 19);
            const imageURL = e.features[0].properties.image_url;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            // eslint-disable-next-line
            var popupHTML = "<strong>Violation reported at: </strong> <br/>" +timeViolationDate + "<br/>" + timeViolationTime +" GMT" + "<br/>" + "<strong>Vehicle Category: </strong><br/>" + violation + "<br/>"
             if(imageURL!=null){
                // eslint-disable-next-line
                popupHTML=popupHTML+ "<img style=\"width:100px;height:100px;\" align = \"center\" src='" + imageURL + "\'>"

             }
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                // eslint-disable-next-line
                .setHTML(popupHTML)
                .addTo(map.current);
        });
        layer_exists = true
    }

    function Map_gen(temp_data) {
        removeData()
        deletePolygons()
        const curr_bounds = map.current.getBounds()

        var array_cat = []
        var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
        for (var i = 0; i < checkboxes.length; i++) {
            array_cat.push(checkboxes[i].value)
        }
        if (temp_data === true || mapLoaded === true) {
            async function getMap() {
                var lat1 = curr_bounds['_sw']['lng']
                var lon1 = curr_bounds['_ne']['lat']
                var lat2 = curr_bounds['_ne']['lng']
                var lon2 = curr_bounds['_sw']['lat']
                var data = await supabaseCall(lat1, lon1, lat2, lon2, violation)
                loadMapWithData(data)
            }
            (async () => await getMap())()
        }
    }

    return (
        <div class="container-xxl" style={{ marginTop: "60px" ,width: "100%;"}}>
            <div class="row">
                <meta charSet="utf-8" />
                <title>Maps for BikeSpy</title>
                <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
                <link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet" />
                <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.2/mapbox-gl-draw.js"></script>
                <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.2/mapbox-gl-draw.css" type="text/css"></link>

                <div class="col-12">

                    <h5>Select the filters you want to apply: <br /> (Default: All results will be displayed)</h5>
        
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
                    <br/>
                </div>
                <div class="col-12" ref={mapContainer} id="map" />
            </div>
        </div>
    );
}

export default Maps