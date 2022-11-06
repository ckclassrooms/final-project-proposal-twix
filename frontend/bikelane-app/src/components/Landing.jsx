import React from 'react'
import Card from 'react-bootstrap/Card'; 

function Landing() {
    return (
        <div class="landing-div">

        <Card style={{ width: '18rem' }}>
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <Card.Body>
        <Card.Title>About us</Card.Title>
        <Card.Text>
        We're making biking safer by making it easy to report bike lane obstructions.  To prevent future obstructions, we find trends in the data to highlight problem locations and hold violators accountable.
        </Card.Text>
      </Card.Body>
    </Card>
        </div>
    )
}

export default Landing