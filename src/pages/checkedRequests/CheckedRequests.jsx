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

  const filteredData = data.filter(request => request.itsEndorse === true && request.itsApprove === true)
  return (
    <>
      <Container>
        <h1>Solicitudes autorizadas</h1>
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
                >
                  Detalles
                </Button>
                
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Container>
    </>
  );
}

export default CheckedRequests;
