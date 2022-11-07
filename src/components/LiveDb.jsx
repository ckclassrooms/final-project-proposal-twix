import React from 'react'
import Card from 'react-bootstrap/Card';

function LiveDb() {
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