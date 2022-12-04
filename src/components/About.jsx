import React from 'react'

function About() {
    return (
        <>  
            <div class="about-content" style={{marginTop: "60px"}}>
                <h1> CS 484 Final Project: BikeSpy </h1>
                <br/>
                <h3>Github repo: <a href="https://github.com/ckclassrooms/final-project-proposal-twix.git">Twix Team</a></h3>
                <h3>App deployment: <a href="https://cool-conkies-80a0da.netlify.app/">Twix App</a></h3>
                <br/>
                <h4>Team Members:</h4>
                <ul>
                    <li>
                        Jeet Mehta 
                    </li>
                    <li>
                        Monisha Siddananda Sampath
                    </li>
                    <li>
                        Sharath S Bhargav
                    </li>
                    <li>
                        Nitish Dewan
                    </li>
                </ul>
                <br/>
                {/* <h2>Objectives:</h2> <br></br> 
                <ol>
                    <li>Users should be able to login via Email or an SSO.</li>
                    <li>Once logged in, users should be able to submit a violation with required details using the form provided (including location).</li>
                    <li>Users will be able to visualize all the violations submitted for an area and filter data as needed.</li>
                    <li>Users can also visualize the violations on a map.</li>
                </ol> */}
                <h2>Project Architecture:</h2>
                <img src={require("./images/484-bikespy-flow-chart.jpg")} alt = {"Flow Diagram"} />

                <br></br>
                {/* <h2>Project Summary:</h2><br/>
                <p>The project involves a web application that allows users to report and submit the details of any Bike Lane violation. Violations mainly consist of a vehicle parked in the bike lane. The application also allows the user to submit images along with other details of violation. This data is stored in a database and can be accessed by any registered user using the interface provided. 
                <br></br>
                In addition to the live database view, the data can also be visualized in an interactive map. 
                <br></br>
                We envision the following security and privacy concerns when managing the user data for our application:
                </p>
                <ul>
                    <li>The location acquired from the device should be securely read and stored.</li>
                    <li>The authentication methods, SSO or User Sign-up, should be implemented securely.</li>
                    <li>All confidential data should be stored in hashed form, and not as plain-text.</li>
                </ul> */}
            {/* <h2>Current Milestone Achieved</h2>
            <p><ol>
                <li>The front-end interface and basic functionality such as Navigation Bar, Form Control, layout and Access Control is setup.</li>
                <li>The user can login via GitHub OAuth which is routed via Supabaae.</li>
                <li>At the back-end, the database, edge functions for data transmission to and from DB is setup.</li>
                <li>Maps page development is in progress.</li>
                <li>The image store with Supabaae is setup to accept input images via form and tag it to violation.</li>
                <li>The grid is formed dynamically based on the data received from the DB</li>
            </ol>
            </p>
            <h2>Further Steps:</h2>
            <p>
                <ol>
                    <li>Filtering and pagination on the grid layout is in progress.</li>
                    <li>Fix Mapbox conflicts and have the user visualize violations on Map, only for the visible area of map, controlled by corresponding events.</li>
                </ol>
            </p>
            <p><b>Note:</b> Few options such as 'Submit Obstruction' and 'Live DB' are accessible from Navigation Bar without login for testing purposes. Final version will have everything in Nav Bar locked under access control.</p> */}


            <h2>Application Functionality:</h2>
            <p>
                <ol>
                    <li>
                        The user is greeted with an initial welcome page with a Nav Bar (containing About, Live Database, Maps, and Login Buttons).
                    </li>
                    <li>
                        Once the user clicks on login, the user is redirected to a Github Login Page, where the user can authorize our application (Github OAuth set using Supabase)
                    </li>
                    <li>
                        If the user is not logged in, they can navigate to the following pages:
                        <ul>
                            <li>
                            <b>Live Database:</b> Displays a Grid View of all the obstructions reported in a paginated manner. This page also allows filtering the results based on Violation Type, Date of Violation, and City of reported Violation. The grid displays the city of violation, the violation type, and the date and time of the violation report. If the user has uploaded an image, submitted a license plate, and submitted the location, the same will be displayed as well.
                            </li>
                            <li>
                            <b>Maps View:</b> Visualizes the obstructions on a map. The obstructions are loaded based on the visible area of the map, and if the user changes the visible area/zooms in or out, the button 'Search Again' needs to be clicked to refresh the map to reload the violations in this new visible area. Users can click on violation markers to open a popup with details of the violation (including an image if submitted).
                            </li>
                            <li>
                            <b>About Page:</b> This page gives an overall idea of the infrastructure, and design of the Web Application.
                            </li>
                        </ul>
                    </li>
                    <li>
                    Once the user is authenticated, the button to 'Submit Obstruction' is enabled in Nav Bar. Going to this page, a form is presented to submit a new obstruction. Users can submit the following details:
                    <ul>
                        <li>
                            <b>Mandatory</b>
                            <ul>
                                <li>Type of Violation</li>
                                <li>City of Violation</li>
                            </ul>
                        </li>
                        <li>
                            <b>Optional</b>
                            <ul>
                                <li>Licence Plate</li>
                                <li>Geo-location</li>
                                <li>Single Image of Violation</li>
                                <li>Additional Notes</li>
                            </ul>
                        </li>
                    </ul>
                    </li>
                </ol>
            </p>
            <h2>Beyond the declared scope:</h2>
            <p>
                <ol>
                    <li>
                        <b>Polygon Select on Map:</b> 
                    </li>
                </ol>
            </p>
            <h2>Notable Highlights</h2>
            <p>
                <ol>
                    <li>
                        <b>PostGIS:</b>
                    </li>
                </ol>
            </p>
            <b>Screen Recording</b> for Map functionality is available at: [drive link]
            
            <h2>Additional Points to Note:</h2>
            <p>
                <ol>
                    <li>Get Location for Submit Obstruction page might not work on some browsers.</li>
                    <li>Polygon, as explined in the video, needs to be deleted exclusively using the delete button before searching again using the filter options.</li>
                    <li>In "Maps" page, the user is limited to draw only one polygon at a time. This is a limitation introduced due to time constraints. </li>
                    <li>In both "Maps" and "LiveDB" page, more filters can be introduced in the future.</li>
                    <li>There is no limit placed on image size that is accepted from user in Submit obstruction. This again is a not a feature expected in a MVP and has not been added due to time contraints.</li>

                </ol>
            </p>
            </div>
            <h2>Credits:</h2>
            <a  href="https://icons8.com/icon/gMxh4liv8Mjt/car-roof-box">Car Roof Box</a> icon by <a  href="https://icons8.com">Icons8</a><br/>
            <a  href="https://icons8.com/icon/36496/garbage-truck">Garbage Truck</a> icon by <a  href="https://icons8.com">Icons8</a><br/>
            <a  href="https://icons8.com/icon/88269/taxi-waiting">Taxi Waiting</a> icon by <a  href="https://icons8.com">Icons8</a><br/>
            <a  href="https://icons8.com/icon/40316/vehicle-insurance">Vehicle Insurance</a> icon by <a  href="https://icons8.com">Icons8</a><br/>
            <a  href="https://icons8.com/icon/9342/construction">Construction</a> icon by <a href="https://icons8.com">Icons8</a><br/>
            <a  href="https://icons8.com/icon/1510/multiply">Multiply</a> icon by <a  href="https://icons8.com">Icons8</a><br/>
        </>
    )
}

export default About