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
                  <Card.Title><i class="bi bi-bicycle"></i> <br></br>What is bike lane?</Card.Title>
                  <Card.Text>
                  We're making biking safer by making it easy to report bike lane obstructions.  To prevent future obstructions, we find trends in the data to highlight problem locations and hold violators accountable.
                  </Card.Text>
                </Card.Body>
            </Card>
          </Row>
          <Row>
            <Col>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-person-circle"></i><br/>About</Card.Title>
                  <Card.Text>
                   Check the about page to learn about the developers and the architecure of the app.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-database"></i><br/>Live db</Card.Title>
                  <Card.Text>
                  Check out the live db page to look at the obstructions submitted so far. 
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-geo-alt"></i><br/>Maps</Card.Title>
                  <Card.Text>
                  Check out the maps page to see the obstructions submitted at different location.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title><i class="bi bi-ui-radios"></i><br/>Submit Obstruction</Card.Title>
                  <Card.Text>
                  Want to submit an obstruction? Go to submit obstruction page and make a submission.
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