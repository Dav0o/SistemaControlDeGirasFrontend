import React, { useRef } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { useMutation } from "react-query";
import { create } from "../../services/RequestService";

function RequestForm() {

  const mutation = useMutation("requests", create);

  const executingUnit = useRef(0);
  const typeRequest = useRef(null);
  const condition = useRef(null);
  const priority = useRef(0);
  const budgetUnid = useRef(0);
  const personsAmount = useRef(0);
  const objective = useRef(null);
  const departureDate = useRef(null);
  const arriveDate = useRef(null);
  const departureLocation = useRef(null);
  const destinyLocation = useRef(null);
  const itinerary = useRef(null);
  const observations = useRef(null);
  const typeOfVehicle = useRef(null);
  const itsDriver = useRef(false);

  const handleSave = () => {
    let newRequest = {
      consecutiveNumber:20230000,
      executingUnit: parseInt(executingUnit.current.value),
      typeRequest: typeRequest.current.value,
      condition: condition.current.value,
      priority: parseInt(priority.current.value),
      budgetUnid: parseInt(budgetUnid.current.value),
      personsAmount: parseInt(personsAmount.current.value),
      objective: objective.current.value,
      departureDate: departureDate.current.value,
      arriveDate: arriveDate.current.value,
      departureLocation: departureLocation.current.value,
      destinyLocation: destinyLocation.current.value,
      itinerary: itinerary.current.value,
      observations: observations.current.value,
      typeOfVehicle: typeOfVehicle.current.value,
      itsDriver: itsDriver.current.valueOf,
    };
    mutation.mutateAsync(newRequest);
  }

  return (
    <Container>
      <Card>
        <Card.Header>Formulario de Solicitud</Card.Header>

        <Card.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tipo de gira</Form.Label>
                  <Form.Control type="text" ref={typeRequest}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Unidad ejecutora</Form.Label>
                  <Form.Control type="number" ref={executingUnit}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Unidad presupuestaria</Form.Label>
                  <Form.Control type="number" ref={budgetUnid}/>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Objetivo</Form.Label>
              <Form.Control as="textarea" ref={objective}/>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Numero de personas</Form.Label>
              <Form.Control type="number" ref={personsAmount}/>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Fecha y hora de salida</Form.Label>
                  <Form.Control type="date"  ref={departureDate}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Fecha y hora de regreso</Form.Label>
                  <Form.Control type="date" ref={arriveDate} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Lugar de salida</Form.Label>
                  <Form.Control type="text" ref={departureLocation}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Lugar de destino</Form.Label>
                  <Form.Control type="text" ref={destinyLocation}/>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Condicion</Form.Label>
              <Form.Control type="text" ref={condition}/>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Itinerario</Form.Label>
              <Form.Control as="textarea" ref={itinerary}/>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Tipo de vehiculo</Form.Label>
                  <Form.Control type="text" ref={typeOfVehicle}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Requiere chofer</Form.Label>

                  <Form.Check type="checkbox" ref={itsDriver}/>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Prioridad</Form.Label>
              <Form.Control type="number" ref={priority}/>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control as="textarea" ref={observations}/>
            </Form.Group>

            <Button variant="primary" onClick={handleSave}>
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RequestForm;
