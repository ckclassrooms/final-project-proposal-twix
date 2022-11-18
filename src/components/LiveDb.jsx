import React from 'react'
import Card from 'react-bootstrap/Card';

async function getGridData() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlc2dvZ3Vqd3BzaGhoYWhvb3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcxNjY4NTksImV4cCI6MTk4Mjc0Mjg1OX0.vLaXeTLbdnc7MyhoA9Qe9v_gp3w0r_GP-XR80AFu6oc");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", '*');

    console.log(myHeaders);
    var raw = JSON.stringify({
    "violation_type": [
        "TAXI",
        "COMPANY"
    ],
    "ts1": "2022-11-16T00:56:00",
    "ts2": "2022-11-16T01:56:00",
    "metro_city": [
        "chicago"
    ]
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        mode: 'no-cors'
    };

    const res = await fetch("https://kesgogujwpshhhahoouk.functions.supabase.co/grid_func_1", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    console.log(res);
}

function LiveDb() {
    getGridData();
    return (
        <>
        <div class="liveDb-div">
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>Case number</Card.Title>
                <Card.Text>METRO CITY: Chicago IL</Card.Text>
                <Card.Text>Submitted:</Card.Text>
                <Card.Text>8/24/2022 9:16am</Card.Text>
            </Card.Body>
            </Card>
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>Case number</Card.Title>
                <Card.Text>METRO CITY: Chicago IL</Card.Text>
                <Card.Text>Submitted:</Card.Text>
                <Card.Text>8/24/2022 9:16am</Card.Text>
            </Card.Body>
            </Card>
        </div>
            
        </>
    )
}

export default LiveDb