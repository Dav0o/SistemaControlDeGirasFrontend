import React, { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { useMutation } from "react-query";
import { create } from "../../services/RequestService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function RequestForm() {

  const [showDriverOptions, setShowDriverOptions] = useState(false);
  const [drivers, setDrivers] = useState([]); // Almacena los choferes cuando se activa el checkbox

  
 const handleDriverCheckboxChange = () => {
    setShowDriverOptions(!showDriverOptions);
    if (!showDriverOptions) {
      // Realiza una solicitud HTTP GET para obtener los choferes
      fetch("https://localhost:7023/api/Users/usersbyrole/Chofer")
        .then((response) => response.json())
        .then((data) => {
          setDrivers(data); // Almacena los choferes en el estado
        })
        .catch((error) => {
          console.error("Error al obtener la lista de choferes:", error);
        });
    }
  };


  const mutation = useMutation("requests", create);

  const MySwal = withReactContent(Swal);

  {mutation.isError
    ? 
      MySwal.fire({
      icon: "error",
      text: "Algo salió mal!",
    }).then(mutation.reset)
  
    : null}
  {mutation.isSuccess
    ? MySwal.fire({
        icon: "success",
        title: "Solicitud creada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      }).then(mutation.reset)
    : null}

  const executingUnit = useRef(null);
  const typeRequest = useRef(null);
  const condition = useRef(null);
  const priority = useRef(0);
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
      consecutiveNumber: 20230000,
      executingUnit: executingUnit.current.value,
      typeRequest: typeRequest.current.value,
      condition: condition.current.value,
      priority: priority.current.value,
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
    mutation.mutate(newRequest);
    
  };

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
                  <Form.Control as= "select" ref={typeRequest} defaultValue="Descentralizada">
                <option value="Centralizada">Centralizada</option>
                <option value="Descentralizada">Descentralizada</option>
              </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Unidad ejecutora</Form.Label>
                  <Form.Control type="text" ref={executingUnit} defaultValue="CH" />
                </Form.Group>
              </Col>

          
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Objetivo</Form.Label>
              <Form.Control as="textarea" ref={objective} />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Número de personas</Form.Label>
              <Form.Control type="number" ref={personsAmount} />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Fecha y hora de salida</Form.Label>
                  <Form.Control type="datetime-local" ref={departureDate} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Fecha y hora de regreso</Form.Label>
                  <Form.Control type="datetime-local" ref={arriveDate} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Lugar de salida</Form.Label>
                  <Form.Control type="text" ref={departureLocation} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Lugar de destino</Form.Label>
                  <Form.Control type="text" ref={destinyLocation} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Condición</Form.Label>
              <Form.Control as= "select" ref={condition} defaultValue="Permanente">
                <option value="Permanente">Permanente</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Itinerario</Form.Label>
              <Form.Control as="textarea" ref={itinerary} />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Tipo de vehículo</Form.Label>
                  <Form.Control type="text" ref={typeOfVehicle} />
                </Form.Group>
              </Col>
              <Col>
               <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Requiere chófer</Form.Label>
                  <Form.Check
                    type="checkbox"
                    ref={itsDriver}
                    onChange={handleDriverCheckboxChange} // Maneja el cambio de checkbox
                  />
                </Form.Group>
                {showDriverOptions && (
                  <Form.Group className="mb-2" controlId="driverSelect">
                    <Form.Control as="select">
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                         {driver.dni} - {driver.name} {driver.lastName1} {driver.lastName2}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
              </Col>
            </Row>
              </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Prioridad</Form.Label>
              <Form.Control as= "select" ref={priority} >
              <option value="">Seleccione una opción</option>
              <option value="Objetivos administrativos, académicos-administrativos y paraacadémicos">Objetivos administrativos, académicos-administrativos y paraacadémicos</option>
              <option value="Cumplen con objetivos de cursos de docencia, según plan de estudios y programa del curso">Cumplen con objetivos de cursos de docencia, según plan de estudios y programa del curso</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control as="textarea" ref={observations} />
            </Form.Group>

            <Button variant="dark" className="bg-gradient-success" onClick={handleSave}>
              Enviar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RequestForm;
