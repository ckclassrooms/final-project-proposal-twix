import React from 'react'
import Card from 'react-bootstrap/Card'; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Landing() {
    return (
      <>
        <Container className="landingContainer">
        <div class="landing-div" style={{marginTop: "60px"}}>
          <Row>
            <Card style={{ width: '45rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-bicycle"></i> <br></br>What is BikeSpy?</Card.Title>
                  <Card.Text>
                  We're making it easier for users to report and view bike lane violations! The different views such as Live Database and Maps cover the various use cases for visualization.
                  </Card.Text>
                </Card.Body>
            </Card>
          </Row>
          <Row>
            <Col>
              <Card onClick={()=>window.location.href="/#/about"} style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-person-circle"></i><br/>About</Card.Title>
                  <Card.Text>
                   Click here to go to the <b>About</b> page to learn more about the developers, the architecure of the application and the different features of the application.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card onClick={()=>window.location.href="/#/liveDb"} style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-database"></i><br/>Live Database</Card.Title>
                  <Card.Text>
                  Click here to go to <b>Live DB</b> page to look at the obstructions submitted so far. You can also filter the results based on Violation Type, Data and Time of reporting & City.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card onClick={()=>window.location.href="/#/maps"} style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-geo-alt"></i><br/>Maps</Card.Title>
                  <Card.Text>
                  Click here to go to the <b>Maps</b> page to see the obstructions submitted at different locations visualized on a map. There are different ways to filter the results on the map.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-ui-radios"></i><br/>Submit Obstruction <br/> (login needed)</Card.Title>
                  <Card.Text>
                  Want to submit an obstruction? Head to <b>Submit Obstruction</b> page and make a submission. Violation Type and City are required.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
      </>
    )
}

export default Landing