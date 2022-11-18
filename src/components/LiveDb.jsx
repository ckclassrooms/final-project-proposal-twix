import React from 'react';
import {supabase} from '../supabaseClient';
import { Col, Container, Row, Card } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import { useState } from "react";

function LiveDb() {
    
    const [filterText, setFilterText] = useState("Filter");
    const [state, setState] = useState({
        violationType: [],
        metroCity: [],
        time: []
    })
    const [time1, setTime1] = useState('');
    const [time2, setTime2] = useState('');
    const [violation, setViolation] = useState('');
    const [city, setCity] = useState('');
    const [liveData, setLiveData] = useState([]);

    if (liveData.length === 0) {
        getGrid();
    }
    // Getting grid data values
    // const getGridData = async function getGridData() {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlc2dvZ3Vqd3BzaGhoYWhvb3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcxNjY4NTksImV4cCI6MTk4Mjc0Mjg1OX0.vLaXeTLbdnc7MyhoA9Qe9v_gp3w0r_GP-XR80AFu6oc");
    //     myHeaders.append("Content-Type", "application/json");
    //     myHeaders.append("Access-Control-Allow-Origin", '*');
    
    //     var raw = JSON.stringify({
        
    //     });
    
    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow',
    //         mode: 'cors'
    //     };
    
    //     const res = await fetch("https://kesgogujwpshhhahoouk.functions.supabase.co/grid_func_1", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));
    //     console.log(res);
    // }
    
    
    async function getGrid() {
        const { data, error } = await supabase.functions.invoke('grid_func_1', {
            body: { }
          })
          if (error) {
            console.log(error);
          }
          if (data.length > 0) {
            const newLiveData = [];
            data.forEach(d => newLiveData.push(d));
            console.log("new live data");
            console.log(newLiveData);
            setLiveData(newLiveData);
            console.log(liveData)
          }
    }

      const onDropdownChange = function(e) {
        setFilterText(e.target.value);
        console.log(filterText);
    }


    function onAddButtonClicked(event, key) {
        console.log("in add");
        let updatedValue;
        if (key === 'time') {
            updatedValue = { [key]: [time1, time2] }
        } else if (key === 'violationType') {
            updatedValue = { [key]: [...state[key], violation] }
        } else if (key === 'city') {
            updatedValue = { [key]: [...state[key], city] }
        }
        
        setState(previous => ({
          ...previous,
          ...updatedValue
        }));
    }
    
    return (
        <>
        <div class="filterDiv d-flex flex-md-row">
            <DropdownButton id="dropdown-item-button" title={ filterText} onSelect={(eventKey, event) => onDropdownChange(event)}>
                <Dropdown.Item as="button" value="violationType">Violation type</Dropdown.Item>
                <Dropdown.Item as="button" value="time">Time</Dropdown.Item>
                <Dropdown.Item as="button" value="metroCity">Metro city</Dropdown.Item>
            </DropdownButton>
            <br/>
            <div className="filterValues">
                {
                    filterText === 'time' ? <div className="timeFilterValue">
                    <Form.Label>From</Form.Label>
                    <Form className="md-1">
                        <Form.Group controlId="timeFilterValue1">
                        <Form.Control type="text" placeholder="Enter value to filter" onChange={(event) => setTime1(event.target.data)}/>
                        </Form.Group>
                    </Form>
                    <br/>
                    <Form.Label>To</Form.Label>
                    <Form className="md-1">
                        <Form.Group controlId="timeFiltervalue2">
                        <Form.Control type="text" placeholder="Enter value to filter" onChange={(event) => setTime2(event.target.value)} />
                        </Form.Group>
                    </Form>
                    <br/>
                    <Button variant="primary" onClick={(event) => onAddButtonClicked(event, "time")}>Add</Button></div>: null
                }
                {
                    filterText === "violationType" ? <div className="violationFilterValue">
                    <Form.Select aria-label="Default select example" onChange={(event) => setViolation(event.target.value)}>
                        <option value="contruction">Contruction</option>
                        <option value="companyVehicle">Company Vehicle</option>
                        <option value="municipalVehicle">Municipal Vehicle - including USPS</option>
                        <option value="privateOwnerVehicle">Private Owner Vehicle</option>
                        <option value="taxi">Taxi / Uber / Lyft</option>
                        <option value="other">Other  (damaged lane, snow, debris, pedestrian, etc.)</option>
                    </Form.Select>
                    <Button variant="primary" onClick={(event) => onAddButtonClicked(event, "violationType")}>Add</Button></div>: null
                }
                {
                    filterText === 'metroCity' ? <div className="metroCityFilterValue">
                    <Form.Select aria-label="Default select example" onChange={(event) => setCity(event.target.value)}>
                        <option value="Chicago">Chicago</option>
                        <option value="Austin">Austin</option>
                        <option value="New York">New York</option>
                    </Form.Select>
                    <Button variant="primary" onClick={(event) => onAddButtonClicked(event, "city")}>Add</Button></div> : null
                }
            </div>
        </div>
 
        <Container className="gridContainer">
                <Row xs={3}>{
                liveData.map(d => (
                    <Col sm={6} md={4} className='mt-3'>
                        <Card>
                        <Card.Img variant="top" src={ d["image_url"]} height="250px" width="285px"/>
                        <Card.Body>
                            <Card.Title>{ d["id"] }</Card.Title>
                            <Card.Text>Metro city: {d["metro_city"]} </Card.Text>
                            <Card.Text>Violation type: {d["violation_type"]}</Card.Text>
                            <Card.Text>Submitted:</Card.Text>
                            <Card.Text>{ d["ts"] }</Card.Text>
                        </Card.Body>
                        </Card>
                    </Col> 
                ))}
                </Row>
        </Container>
        </>
    )
}

export default LiveDb