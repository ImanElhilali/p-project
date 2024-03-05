import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const HomeScreen = () => {
  return (
    <Container>
      <Row className='justify-content-center mt-5 me-5'>
        <Col md={6}>
          <h1>Welcome To The App</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default HomeScreen
