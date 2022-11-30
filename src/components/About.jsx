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
                <h2>Objectives:</h2> <br></br> 
                <ol>
                    <li>Users should be able to login via Email or an SSO.</li>
                    <li>Once logged in, users should be able to submit a violation with required details using the form provided (including location).</li>
                    <li>Users will be able to visualize all the violations submitted for an area and filter data as needed.</li>
                    <li>Users can also visualize the violations on a map.</li>
                </ol>

                <img src={require("./images/484-bikespy-flow-chart.jpg")} alt = {"Flow Diagram"} />

                <br></br>
                <h2>Project Summary:</h2><br/>
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
                </ul>
                <h2>Current Milestone Achieved</h2>
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
            <p><b>Note:</b> Few options such as 'Submit Obstruction' and 'Live DB' are accessible from Navigation Bar without login for testing purposes. Final version will have everything in Nav Bar locked under access control.</p>
            </div>
            
        </>
    )
}

export default About