import React, { useRef } from "react";


function RequestGasoline() {


const city = useRef(null);
const commerce = useRef(null);
const mileague = useRef(0);
const litres = useRef(0);
const date = useRef(null);
const card = useRef(0);
const invoice = useRef(null);
const authorization = useRef(null);
const requestId = useRef(0);

const handleSaveGasoline = () => {
  let newRequestGasoline = {
      city: city.current.value,
      commerce: commerce.current.value,
      mileague: parseInt(mileague.current.value),
      litres: parseInt(litres.current.value),
      date: date.current.value,
      card: parseInt(card.current.value),
      invoice: invoice.current.value,
      authorization: authorization.current.value,
      requestId: parseInt(requestId.current.value)  
  };
  mutation.mutate(newRequestGasoline);
}

  return (
    <Container>
    <Card>
        <Card.Header>Solicitud de gasolina</Card.Header>

        <Card.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control type="text" ref={city} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la gasolinera</Form.Label>
                  <Form.Control type="text" ref={commerce} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Kilometraje</Form.Label>
                  <Form.Control type="number" ref={mileague} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label>Litros</Form.Label>
              <Form.Control type="number" ref={litres} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Día</Form.Label>
              <Form.Control type="date" ref={date} />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Numero de tarjeta</Form.Label>
                  <Form.Control type="number" ref={card} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Factura</Form.Label>
                  <Form.Control type="text" ref={invoice} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Autorización</Form.Label>
                  <Form.Control type="text" ref={authorization} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Id Solicitud</Form.Label>
                  <Form.Control type="number" ref={requestId} />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="dark" className="bg-gradient-success" onClick={handleSaveGasoline}>
              Guardar
            </Button>
            </Form>
        </Card.Body>
    </Card>
  </Container>
  )
}

export default RequestGasoline