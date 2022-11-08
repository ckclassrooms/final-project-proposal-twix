import React from 'react'

function About() {
    return (
        <>  
            <div class="about-content">
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
            </div>

        </>
    )
}

export default About