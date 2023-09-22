import React from "react";
import { approve, getRequests } from "../../services/RequestService";
import { useMutation, useQuery } from "react-query";
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
import { useState } from "react";

function ApproveRequest() {
  const { data, isLoading, isError } = useQuery("requests", getRequests, {
    enabled: true,
  });

  const mutation = useMutation("requests/approve", approve)

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const handleClose = () => setShowApproveModal(false);

  const handleShowApprove = (requestId) => {
    const requestToApprove = data.find((request) => request.id === requestId);
    setSelectedRequest(requestToApprove);
    setShowApproveModal(true);
  };

  const handleApprove = () =>{
      let updateRequest = {
      id: selectedRequest.id,
      itsApprove: true,
      };
      mutation.mutateAsync(updateRequest);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const filteredData = data.filter(request => request.itsApprove === false && request.itsEndorse === true)
  return (
    <>
      <Container>
        <h1>Solicitudes a aprobar</h1>
        <Col>
          {filteredData.map((request) => (
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
                  onClick={() => handleShowApprove(request.id)}
                >
                  Aprobar
                </Button>
                <Button variant="primary">Editar</Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Container>


      <Modal show={showApproveModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitud a aprobar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedRequest && (
            <Form>
              <Form.Group>
                <Form.Label>
                  Numero de consecutivo de la solicitud a aprobar
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedRequest.id}
                  aria-label="Disabled input example"
                  disabled
                  readOnly
                />
              </Form.Group>

  
              
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleApprove}>
            Aprobar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ApproveRequest;
