import React from "react";
import Container from "react-bootstrap/Container";
import { useQuery } from "react-query";
import { getRequests } from "../../services/RequestService";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function RequestList() {
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
    (request) =>
      (request.itsEndorse === true && request.itsApprove === true) ||
      (request.itsEndorse === true && request.itsCanceled === true)
  );

  return (
    <Container className="container-fluid">
      <h2 className="h3 mb-2 text-gray-800 custom-heading">Bitácora de solicitudes</h2>
      <p class="mb-4">
        Gestiona la lista de solicitudes
      </p>

      <div className="card shadow mb-4">
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
                <Link to={`/requestDays/${request.id}`}>
                  <Button
                    variant="info"
                    className="bg-gradient-info text-light mr-2"
                  >
                    Horario de trabajo
                  </Button>
                </Link>
                <Link to={`/requestGasoline/${request.id}`}>
                  <Button
                    variant="warning"
                    className="bg-gradient-info text-light"
                  >
                    Suministro de combustible
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default RequestList;
