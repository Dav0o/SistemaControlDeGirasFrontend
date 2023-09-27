import React from "react";
import { getRequests } from "../../services/RequestService";
import { useQuery } from "react-query";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function CheckedRequests() {
  const { data, isLoading, isError } = useQuery("requests", getRequests, {
    enabled: true,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const filteredData = data.filter(
    (request) => request.itsEndorse === true && request.itsApprove === true
  );
  return (
    <>
      <Container className="mb-3">
        <h1 className="h3 mb-2 text-gray-800">Solicitudes autorizadas</h1>
        <p class="mb-4">Lista de solicitudes autorizadas</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <p>De click en detalles para seleccionar una solicitud</p>
          </div>
          <div className="card-body">
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
                    className="bg-gradient-info text-light"
                  >
                    <i class="bi bi-info-square"></i>
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}

export default CheckedRequests;
