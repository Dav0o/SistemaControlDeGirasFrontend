import React from "react";
import Container from "react-bootstrap/Container";
import { useQuery } from "react-query";
import { getRequests } from "../../services/RequestService";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

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
    (request) => request.itsEndorse === true && request.itsApprove === true ||
      request.itsEndorse === true && request.itsCanceled === true
  );

  return (
    <Container className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Bitacora de Solicitudes</h1>
      <p class="mb-4">
        Lista de Solicitudes para gestionar la bitacora de las mismas
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
  );
}

export default RequestList;
