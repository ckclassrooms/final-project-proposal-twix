import React from 'react';
import {supabase} from '../supabaseClient';
import { Col, Container, Row, Card } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import { useState,useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";

function LiveDb() {
    
    const [filterText, setFilterText] = useState("Filter");
    const [time1, setTime1] = useState('');
    const [time2, setTime2] = useState('');
    const [city, setCity] = useState('');
    const [liveData, setLiveData] = useState([]);
    const [violation, setViolation] = useState('CONSTRUCTION_VEHICLE');
    const [paginationNumber, setPaginationNumber] = useState(0);
    const valueToFilter = {
        'violationType': "Violation type",
        'time': "Time",
        'metroCity': "Metro city",
        'Filter': 'Filter'
    }
    const [filter, setFilter] = useState({"violation_type": [], "metro_city": [], ts1: '', ts2: ''});

    var [active, setActive] = useState(1);
    var [smallGrid, setSmallGrid] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {    
        console.log("getting grid");
        getGrid();
        // eslint-disable-next-line
    }, []);

    var pages = [];
    const numOfEpisPerPage = 40;
    var indOfLastEpi = active * numOfEpisPerPage;
    var indOfFirstEpi = indOfLastEpi - numOfEpisPerPage;
    // const [loading, setLoading] = useState(false);
    for (let number = 1; number <= paginationNumber; number++) {
            pages.push(
                <Pagination.Item
                  key={number}
                  active={number === active}
                  onClick={() => pagination(number)}
                >
                  {number}
                </Pagination.Item>
              );
        
      }
    

    if (liveData.length === 0) {
        getGrid();
    }

    function pagination(number, firstBool) {
        console.log(number);
        indOfLastEpi = number * numOfEpisPerPage;
        indOfFirstEpi = indOfLastEpi - numOfEpisPerPage;
        setActive(number);
        setSmallGrid(liveData.slice(indOfFirstEpi, indOfLastEpi));
    }


    async function getGrid(jsonArray) {
        console.log("jsonArray");
        console.log(jsonArray);
        var requestData = {}, notEmpty = false;
        if (jsonArray) {
            if (jsonArray.violation_type !== []) {
                notEmpty = true;
                requestData["violation_type"] = jsonArray.violation_type;
            }
            if (jsonArray.metro_city.length !== 0) {
                notEmpty = true;
                requestData["metro_city"] = jsonArray.metro_city;
            }
            if (jsonArray.ts1 !== '') {
                notEmpty = true;
                requestData["ts1"] = jsonArray.ts1;
            }
            if (jsonArray.ts2 !== '') {
                notEmpty = true;
                requestData["ts2"] = jsonArray.ts2;
            }
        }
        setLoader(true);
        const { data, error } = await supabase.functions.invoke('grid_func_1', {
            body: notEmpty ? JSON.stringify(requestData) : {}
          })
          if (error) {
            console.log(error);
          }
          console.log("data:");
          console.log(data);
          if (data && data.length > 0) {
            const newLiveData = [];
            data.forEach(d => newLiveData.push(d));
            console.log("new live data");
            console.log(newLiveData.length);
            setLiveData(newLiveData);
            setPaginationNumber(Math.floor(newLiveData.length/numOfEpisPerPage) + 1);
            setSmallGrid(newLiveData.slice(indOfFirstEpi, indOfLastEpi));
            // pagination(1);
          }
    }

      const onDropdownChange = function(e) {
        setFilterText(e.target.value);
    }

    function onFilterButtonClicked() {
        getGrid(filter);
    }

    function onAddButtonClicked(event, key) {
        var updatedValue;

        if (key === 'time') {
            updatedValue = { "ts1": time1, "ts2": time2}
            
        } else if (key === 'violationType') { 
            updatedValue = {"violation_type": [...filter["violation_type"], violation]}
        } else if (key === 'city') {
            updatedValue = {"metro_city": [...filter["metro_city"], city]}
            
        }
        setFilter(previous => ({
            ...previous,
            ...updatedValue
            }));
        getGrid(filter);
    }
    
    return (
        <>
       <div class="filterDiv d-flex flex-md-row">
            <DropdownButton className="filter-dropdown" id="dropdown-item-button" title={ valueToFilter[filterText]} onSelect={(eventKey, event) => onDropdownChange(event)}>
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
                        <Form.Control type="date" placeholder="Enter value to filter" onChange={(event) => setTime1(event.target.value)}/>
                        </Form.Group>
                    </Form>
                    <br/>
                    <Form.Label>To</Form.Label>
                    <Form className="md-1">
                        <Form.Group controlId="timeFiltervalue2">
                        <Form.Control type="date" placeholder="Enter value to filter" onChange={(event) => setTime2(event.target.value)} />
                        </Form.Group>
                    </Form>
                    <br/>
                    <Button variant="primary" onClick={(event) => onAddButtonClicked(event, "time")}>Add</Button>
                    <Button variant="primary" onClick={(event) => onFilterButtonClicked()}>Filter</Button></div>: null
                }
                {
                    filterText === "violationType" ? <div className="violationFilterValue">
                    <Form.Select aria-label="Default select example" onChange={(event) => setViolation(event.target.value)}>
                        <option value="CONSTRUCTION_VEHICLE">Construction</option>
                        <option value="COMPANY">Company Vehicle</option>
                        <option value="MUNICIPAL_VEHICLE">Municipal Vehicle - including USPS</option>
                        <option value="PRIVATE_VEHICLE">Private Owner Vehicle</option>
                        <option value="TAXI">Taxi / Uber / Lyft</option>
                        <option value="OTHER">Other  (damaged lane, snow, debris, pedestrian, etc.)</option>
                    </Form.Select>
                    <Button variant="primary" onClick={(event) => onAddButtonClicked(event, "violationType")}>Add</Button>
                    <Button variant="primary" onClick={(event)=> onFilterButtonClicked()}>Filter</Button></div>: null
                }
                {
                    filterText === 'metroCity' ? <div className="metroCityFilterValue">
                    <Form.Select aria-label="Default select example" onChange={(event) => setCity(event.target.value)}>
                        <option value="" disabled="" class="Vx877 _3pa83">Select metro city</option><option value="recgZhmuvwXbRU1o8" class="Vx877" aria-selected="false">My metro city is not listed</option><option value="rec80VroenY8u41ju" class="Vx877" aria-selected="false">Albuquerque - NM</option><option value="rec5ZRCZFHIJz6Xz2" class="Vx877" aria-selected="false">Alexandria - VA</option><option value="recnEcSwrCa2j131f" class="Vx877" aria-selected="false">Anchorage - AK</option><option value="recP6tOTejaJ5bV5f" class="Vx877" aria-selected="false">Ann Arbor - MI</option><option value="recnXUlkmSehgE8N7" class="Vx877" aria-selected="false">Arlington - VA</option><option value="recG7DjXykTDKaytt" class="Vx877" aria-selected="false">Athens - GA</option><option value="reccu4FDEqi9cVbRi" class="Vx877" aria-selected="false">Atlanta - GA</option><option value="recURjK3lxhRzGivj" class="Vx877" aria-selected="false">Austin - TX</option><option value="recINZ1yAteNs9kxe" class="Vx877" aria-selected="false">Baltimore - MD</option><option value="recS9uR5H10AWPc1p" class="Vx877" aria-selected="false">Beaverton - OR</option><option value="recgnUlZ3tPDACkEH" class="Vx877" aria-selected="false">Bellevue - WA</option><option value="rec5Y8OfkVKTFQEaP" class="Vx877" aria-selected="false">Bethesda - MD</option><option value="recFnyCEjv9rDsXJW" class="Vx877" aria-selected="false">Bethlehem - PA</option><option value="recbS0eJ81v1WTliM" class="Vx877" aria-selected="false">Boise - ID</option><option value="recDphnWMyfF9LtSh" class="Vx877" aria-selected="false">Boston - MA</option><option value="recYgxI7HP590qIJ6" class="Vx877" aria-selected="false">Boulder - CO</option><option value="recdZfzW8befEiTcg" class="Vx877" aria-selected="false">Bristol - UK</option><option value="recJc2FesvTOyDFlU" class="Vx877" aria-selected="false">Brookline - MA</option><option value="reccRHw8ciZNValbi" class="Vx877" aria-selected="false">Buffalo - NY</option><option value="reccLXLUgV9Dd4qhD" class="Vx877" aria-selected="false">Burlington - VT</option><option value="recuaua8zSZp6HCR6" class="Vx877" aria-selected="false">Calgary - AB - Canada</option><option value="recAQhOF7JRWPTtFY" class="Vx877" aria-selected="false">Cambridge - MA</option><option value="chattanooga" class="Vx877" aria-selected="false">Chattanooga - TN</option><option value="chicago" class="Vx877" aria-selected="false">Chicago - IL</option><option value="cincinnati" class="Vx877" aria-selected="false">Cincinnati - OH</option><option value="cleveland" class="Vx877" aria-selected="false">Cleveland - OH</option><option value="rec82e62GMjFBuhsg" class="Vx877" aria-selected="false">Colorado Springs - CO</option><option value="recTKVbaqGdjqeQN8" class="Vx877" aria-selected="false">Columbia - MO</option><option value="rec2yinpcOyGsIzgJ" class="Vx877" aria-selected="false">Columbus - OH</option><option value="recTTATMvMPYBPvaW" class="Vx877" aria-selected="false">Corvallis - OR</option><option value="recEh2Fa03Qi3aJzJ" class="Vx877" aria-selected="false">Dallas - TX</option><option value="rec4z2xyoZtoTyMWO" class="Vx877" aria-selected="false">Dayton - OH</option><option value="recwzxnbPr9uKIxwP" class="Vx877" aria-selected="false">Denver - CO</option><option value="recefGIIyB2j8ZsSA" class="Vx877" aria-selected="false">Des Moines - IA</option><option value="recWquxg2xHhHAZH4" class="Vx877" aria-selected="false">Detroit - MI</option><option value="rectQS8dFJeQlB4zm" class="Vx877" aria-selected="false">Durham - NC</option><option value="rec4lH3xz1Q0ubyI6" class="Vx877" aria-selected="false">El Paso - TX</option><option value="recbRwn7JHFP2pIK3" class="Vx877" aria-selected="false">Eugene - OR</option><option value="recSQVYMHk9fXdc1T" class="Vx877" aria-selected="false">Evanston - IL</option><option value="rec8NtTGYvFxN0ORn" class="Vx877" aria-selected="false">Everett - WA</option><option value="recEe7gKi76ijcASm" class="Vx877" aria-selected="false">Fitchburg - WI</option><option value="recNmGbg3yXV9dHz6" class="Vx877" aria-selected="false">Fort Collins - CO</option><option value="recAxUiMCvwiI608Y" class="Vx877" aria-selected="false">Fort Lauderdale - FL</option><option value="recc3rdOmjXzzlOlt" class="Vx877" aria-selected="false">Fremont - CA</option><option value="recK1sptm9umgvKRN" class="Vx877" aria-selected="false">Gainesville - FL</option><option value="rec8JdbPZM8EI5JKf" class="Vx877" aria-selected="false">Gold Coast - Queensland Australia</option><option value="rec2R9ppFPPnzrTcP" class="Vx877" aria-selected="false">Grand Rapids - MI</option><option value="recPgwrHpHf3B2sdK" class="Vx877" aria-selected="false">Green Bay - WI</option><option value="recSKwjXgKJexkP4l" class="Vx877" aria-selected="false">Hamilton - ON - CANADA</option><option value="recosRAXe23bO1Lrj" class="Vx877" aria-selected="false">Hartford - CT</option><option value="recclVdC01hSISEsG" class="Vx877" aria-selected="false">Hillsboro - OR</option><option value="recCYipgpEjq3pTm2" class="Vx877" aria-selected="false">Holland - MI</option><option value="recrPVHTJkDg12qir" class="Vx877" aria-selected="false">Honolulu - HI</option><option value="recO86rVxLjzlLhcT" class="Vx877" aria-selected="false">Houston - TX</option><option value="recsqDMUrgHUJt4UP" class="Vx877" aria-selected="false">Huntington Beach - CA</option><option value="rec4r5jsFFaKeUv1u" class="Vx877" aria-selected="false">Indianapolis - IN</option><option value="recwYFlEaDjgUJdGJ" class="Vx877" aria-selected="false">Ithaca - NY</option><option value="recR5aFGSVX0jeU0B" class="Vx877" aria-selected="false">Jacksonville - FL</option><option value="recCScTptBSYZmOr7" class="Vx877" aria-selected="false">Jersey City - NJ</option><option value="rec6P7GL5d6RKpL5I" class="Vx877" aria-selected="false">Kalamazoo - MI</option><option value="recUb5xUsppJGXHzH" class="Vx877" aria-selected="false">Kansas City - KS</option><option value="rec5IsAHHJA9tvT8L" class="Vx877" aria-selected="false">Kansas City - MO</option><option value="recarxLYYNQLzUWQk" class="Vx877" aria-selected="false">Kirkland - WA</option><option value="recH7sRLkCjEkLHFn" class="Vx877" aria-selected="false">Knoxville - TN</option><option value="recMvlIKWSQQGicLI" class="Vx877" aria-selected="false">Lansing - MI</option><option value="rec4CiBoQIk6zfQ6t" class="Vx877" aria-selected="false">Las Vegas - NV</option><option value="rec0zYEM3uMleOZsy" class="Vx877" aria-selected="false">Lexington - KY</option><option value="rec9pn8NFICAMyoLA" class="Vx877" aria-selected="false">Lincoln - NE</option><option value="recp4CkmZ6jBirp2d" class="Vx877" aria-selected="false">Little Rock - AR</option><option value="recj1K5GgKGONuSOg" class="Vx877" aria-selected="false">London - ON - CANADA</option><option value="recBfObanuCezQdcy" class="Vx877" aria-selected="false">Long Beach - CA</option><option value="rec4Ipx8SeP4D2GoE" class="Vx877" aria-selected="false">Los Angeles - CA</option><option value="recsjocTA0xK1ByRv" class="Vx877" aria-selected="false">Louisville - KY</option><option value="recKg5TIqVmOPWOYB" class="Vx877" aria-selected="false">Macon - GA</option><option value="recyK8Jvbfkvl7s8w" class="Vx877" aria-selected="false">Madison - WI</option><option value="recFn0CKcqbARs9CQ" class="Vx877" aria-selected="false">Melbourne - AU</option><option value="reci5LyJSRQeOtiuq" class="Vx877" aria-selected="false">Memphis - TN</option><option value="recO0eFsLTTpE8TLg" class="Vx877" aria-selected="false">Miami - FL</option><option value="rechNRtLPbBONfDte" class="Vx877" aria-selected="false">Milwaukee - WI</option><option value="recf1aXn7n93jYGIU" class="Vx877" aria-selected="false">Minneapolis - MN</option><option value="reczj3I4MWtu6guMN" class="Vx877" aria-selected="false">Monterey - CA</option><option value="recE1xV6kNFs8BSM7" class="Vx877" aria-selected="false">Montgomery County - MD</option><option value="reciFAcu9Wf3YekS3" class="Vx877" aria-selected="false">Montreal - QC - CANADA</option><option value="rec0NvGJPTPOmmuzT" class="Vx877" aria-selected="false">Morton Grove - IL</option><option value="recBSKjurdl5FeRPI" class="Vx877" aria-selected="false">Mountain View - CA</option><option value="recMkdyzF0EbiBjee" class="Vx877" aria-selected="false">Muskegon - MI</option><option value="reczCcvneOaFpSW5s" class="Vx877" aria-selected="false">Nashville - TN</option><option value="recNcdNIbWcwDygMn" class="Vx877" aria-selected="false">New Orleans - LA</option><option value="rechtyogSfYj79WaB" class="Vx877" aria-selected="false">New York City - NY</option><option value="recVrqfsjAdg5fPW2" class="Vx877" aria-selected="false">Oak Park - IL</option><option value="recmXRje9TvulEldk" class="Vx877" aria-selected="false">Oakland - CA</option><option value="rec1ki6TqUVqyjehf" class="Vx877" aria-selected="false">Omaha - NE</option><option value="recaDKWbgNygOFaFv" class="Vx877" aria-selected="false">Orlando - FL</option><option value="recm7Dw3KfwC4BWbz" class="Vx877" aria-selected="false">Oxford - UK</option><option value="recusyDE3ZdDwAVRq" class="Vx877" aria-selected="false">Palm Springs - CA</option><option value="recQFj44jbSm50hs8" class="Vx877" aria-selected="false">Palo Alto - CA</option><option value="recqGbhHl6OmkeTxh" class="Vx877" aria-selected="false">Paris - FR</option><option value="rec0ItKa6RurIPn1m" class="Vx877" aria-selected="false">Philadelphia - PA</option><option value="recTijMbaJdbds53w" class="Vx877" aria-selected="false">Phoenix - AZ</option><option value="recMvbmn4tmPQoU3F" class="Vx877" aria-selected="false">Pittsburgh - PA</option><option value="recchqqq8itRBIQFN" class="Vx877" aria-selected="false">Port Townsend - WA</option><option value="recUDZlmkJXB60B5J" class="Vx877" aria-selected="false">Portland - OR</option><option value="recAdvUy5RAnpCMpP" class="Vx877" aria-selected="false">Providence - RI</option><option value="recofFKcKeO0P4iwL" class="Vx877" aria-selected="false">Provincetown - MA</option><option value="recjbYWFPyFPGzFKT" class="Vx877" aria-selected="false">Raleigh - NC</option><option value="rece0Nr1ZwJcrBqRK" class="Vx877" aria-selected="false">Richmond - VA</option><option value="rec1z84sBN9dVyA91" class="Vx877" aria-selected="false">Rochester - MN</option><option value="recobBsptoMPPn5qM" class="Vx877" aria-selected="false">Rochester - NY</option><option value="recOaIX00c7OBvyLS" class="Vx877" aria-selected="false">Rockford - IL</option><option value="recUFB7OopgxqEswb" class="Vx877" aria-selected="false">Sacramento - CA</option><option value="recbrQBthhNhOOcII" class="Vx877" aria-selected="false">Saint Louis - MO</option><option value="recrHwbEwThzJdZHG" class="Vx877" aria-selected="false">Salem - OR</option><option value="recKKc25d7tSLqfyw" class="Vx877" aria-selected="false">Salt Lake City - UT</option><option value="recQEk6eHO4Vf3GKx" class="Vx877" aria-selected="false">San Antonio - TX</option><option value="recocbhxiN3b2wybA" class="Vx877" aria-selected="false">San Diego - CA</option><option value="rectOSzEeSmu095gL" class="Vx877" aria-selected="false">San Francisco - CA</option><option value="recRcsnpheMolvFx8" class="Vx877" aria-selected="false">San Jose - CA</option><option value="recOJ7EKqQHx3voBR" class="Vx877" aria-selected="false">San Luis Obispo - CA</option><option value="recEP5J6IgOHS9RKp" class="Vx877" aria-selected="false">Santa Barbara - CA</option><option value="recfgK4EicGNuu2BG" class="Vx877" aria-selected="false">Sarasota - FL</option><option value="recxN8Kff1Mkh2aX0" class="Vx877" aria-selected="false">Savannah - GA</option><option value="recyizZzLEruCI8ih" class="Vx877" aria-selected="false">Scottsdale - AZ</option><option value="rec1S52qlJ9vxvrXZ" class="Vx877" aria-selected="false">Seattle - WA</option><option value="reclcFquset5QLe95" class="Vx877" aria-selected="false">Somerville - MA</option><option value="recXdQQfgBkGXxzow" class="Vx877" aria-selected="false">South Bend - IN</option><option value="recNJSnosJjE98Rvm" class="Vx877" aria-selected="false">Spokane - WA</option><option value="rec0Aq0YUl4HTtI0o" class="Vx877" aria-selected="false">St. Paul - MN</option><option value="recy8tBUHigDfopOC" class="Vx877" aria-selected="false">St. Petersburg - FL</option><option value="recKGxCtSAIjUDnim" class="Vx877" aria-selected="false">Sunnyvale - CA</option><option value="rec2WSUD2RpfTSrZx" class="Vx877" aria-selected="false">Sydney - AU</option><option value="rec50haRLSKojd6gI" class="Vx877" aria-selected="false">Tacoma - WA</option><option value="rec5oZIDdVGbQQWG7" class="Vx877" aria-selected="false">Tallahassee - FL</option><option value="rec0kU0azkoYcEWZw" class="Vx877" aria-selected="false">Tampa - FL</option><option value="recLCU57Mj7VSfPuK" class="Vx877" aria-selected="false">Tempe - AZ</option><option value="reckLy1atM98yH5fr" class="Vx877" aria-selected="false">Thousand Oaks - CA</option><option value="recgeYw5wPSMRPjBB" class="Vx877" aria-selected="false">Toledo - OH</option><option value="rec9a8A9VRy69xYvh" class="Vx877" aria-selected="false">Toronto - ON - CANADA</option><option value="recqFe7TA6SBiCMe1" class="Vx877" aria-selected="false">Townsend - WA</option><option value="rechmuTJnpGwP0ygD" class="Vx877" aria-selected="false">Tri-Cities - WA</option><option value="recKwydbB8UIzM87F" class="Vx877" aria-selected="false">Tucson - AZ</option><option value="recZJPOHoBs0BIO64" class="Vx877" aria-selected="false">Tulsa - OK</option><option value="recWEZSldnOhJPQCw" class="Vx877" aria-selected="false">Urbana - IL</option><option value="recgGSAMom2qKtpM3" class="Vx877" aria-selected="false">Vancouver - BC - CANADA</option><option value="recqlIV9mxa0dqipk" class="Vx877" aria-selected="false">Vancouver - WA</option><option value="reclcVu6YqtUvuQWA" class="Vx877" aria-selected="false">Victoria - BC - CANADA</option><option value="recwYcFEZ3Pk11QiZ" class="Vx877" aria-selected="false">Washington - DC</option>
                    </Form.Select>
                    <Button variant="primary" onClick={(event) => onAddButtonClicked(event, "city")}>Add</Button>
                    <Button variant="primary" onClick={(event) => onFilterButtonClicked()}>Filter</Button></div>: null
                }
            </div>
        </div>
        <div className="container pagination d-flex justify-content-center">
            <Pagination size="sm" count={liveData.length} defaultPage={6} boundaryCount={2}>
                <Pagination.First onClick={() => {pagination(1);}}/>
                <Pagination.Prev
                    onClick={() => {
                    if (active > 1) {
                        pagination(active - 1);
                    }
                    }}
                />
                {pages}
                <Pagination.Next
                    onClick={() => {
                        if (active < paginationNumber) {
                            pagination(active + 1);
                        }
                    }}
                />
                <Pagination.Last onClick={() => {console.log("in last page");pagination(paginationNumber);}}/>
            </Pagination>
            </div>
            {loader ? <div class="loader"></div> : 
            <Container className="gridContainer">
                    <Row xs={3}>{
                    smallGrid.map(d => (
                        <Col sm={6} md={4} className='mt-3'>
                            <Card>
                            <Card.Img variant="top" src={ d["image_url"]} height="250px" width="285px"/>
                            <Card.Body>
                                <Card.Title>{ d["id"] }</Card.Title>
                                <Card.Text>Metro city: {d["metro_city"]} </Card.Text>
                                <Card.Text>Violation type: {d["violation_type"]}</Card.Text>
                                <Card.Text>Submitted:</Card.Text>
                                <Card.Text>{ d["ts"] }</Card.Text>
                                <Card.Text>License Plate: { d["license_plate"]}</Card.Text>
                            </Card.Body>
                            </Card>
                        </Col> 
                    ))}
                    </Row>
            </Container>
            }
            <div className="container pagination d-flex justify-content-center">
            <Pagination size="sm" count={liveData.length} defaultPage={6} boundaryCount={2}>
                <Pagination.First onClick={() => {pagination(1);}}/>
                <Pagination.Prev
                    onClick={() => {
                    if (active > 1) {
                        pagination(active - 1);
                    }
                    }}
                />
                {pages}
                <Pagination.Next
                    onClick={() => {
                        if (active < paginationNumber) {
                            pagination(active + 1);
                        }
                    }}
                />
                <Pagination.Last onClick={() => {console.log("in last page");pagination(paginationNumber);}}/>
            </Pagination>
            </div>
        </>
    )
}

export default LiveDb