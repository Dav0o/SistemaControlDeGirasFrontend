import React, { useState } from "react";
import { useQuery } from "react-query";
import { getRequests } from "../../services/RequestService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { getVehicles } from "../../services/VehicleService";
import { useRef } from "react";

function EndorseRequest() {
  const { data, isLoading, isError } = useQuery("requests", getRequests, {
    enabled: true,
  });

  const { data:vehicles, isLoading:loadingVehicles, isError:errorVehicles } = useQuery("vehicles", getVehicles, {
    enabled: true,
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEndorseModal, setShowEndorseModal] = useState(false);

  const vehicleId = useRef(0);

  const handleClose = () => setShowEndorseModal(false);

  const handleShowEndorse = (requestId) => {
    const requestToEndorse = data.find((request) => request.id === requestId);
    setSelectedRequest(requestToEndorse);
    setShowEndorseModal(true);
  };

  const handleEndorse = () =>{
      let updateRequest = {
      id: selectedRequest.id,
      vehicleId: vehicleId.current.value,
      itsEndorse: true,
      };
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (loadingVehicles) {
    return <div>Loading...</div>;
  }

  if (errorVehicles) {
    return <div>Error</div>;
  }
  return (
    <>
      <Container>
        <Col>
          {data.map((request) => (
            <Card key={request.id}>
              <Card.Header>{request.consecutiveNumber}</Card.Header>
              <Card.Body>
                <Card.Title>{request.objective}</Card.Title>
                <Card.Text>
                  Fecha de salida {request.departureDate} con el destino de{" "}
                  {request.destinyLocation}
                </Card.Text>
                <Button
                  variant="info"
                  onClick={() => handleShowEndorse(request.id)}
                >
                  Aprobar
                </Button>
                <Button
                  variant="primary"
                  
                >
                  Editar
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Container>

      <Modal show={showEndorseModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitud a aprobar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedRequest && (
            <Form>
              <Form.Group>
                <Form.Label>
                  Numero de Consecutivo de la Solicitud a Aprobar
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedRequest.consecutiveNumber}
                  aria-label="Disabled input example"
                  disabled
                  readOnly
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Seleccione el vehiculo para la solicitud
                </Form.Label>
                <Form.Select aria-label="Default select example" ref={vehicleId}>
                  <option>Lista de Vehiculos</option>
                  {vehicles.map((vehicle)=> (
                    <option value={vehicle.id}>{vehicle.plate_Number}</option>
                  ))}
                  
                  
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Aprobar solicitud
                </Form.Label>
                <Form.Check aria-label="option 1" />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EndorseRequest;
