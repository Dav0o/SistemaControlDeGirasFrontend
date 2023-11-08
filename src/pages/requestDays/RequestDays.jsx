import React, { useRef } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getByIdRequest } from "../../services/RequestService";

function RequestDays() {
  const requestId = useParams();

  const day = useRef(null);
  const startTime = useRef(null);
  const endTime = useRef(null);

  const { data, isLoading, isError } = useQuery(
    "request",
    () => getByIdRequest(requestId.requestId),
    {
      enabled: true,
    }
  );

  const LinkStyle = {
    textDecoration: "none",
    color: "white",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Días de gira</h1>
        <p class="mb-4">Lista de días de la solicitud</p>
        <div className="card shadow mb-4">
          <div className="card-body">
            <Table striped="columns">
              <thead>
                <tr>
                  <th>Día de la gira</th>
                  <th>Hora de inicio</th>
                  <th>Hora final</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              {data.requestDays.map((request) => (
                <tbody>
                  <tr key={request.id}>
                    <td>{request.day}</td>
                    <td>{request.startTime}</td>
                    <td>{request.endTime}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="mr-1"
                        style={LinkStyle}
                      >
                        <i class="bi bi-pencil-square"></i>
                      </Button>
                      <Button variant="info" style={LinkStyle}>
                        {" "}
                        <i class="bi bi-info-square"></i>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </div>

          <div className="card-footer d-flex justify-content-end">
            <Link to={`/requestManagement`} style={LinkStyle}>
              <Button style={LinkStyle} variant="primary">
                Regresar
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}

export default RequestDays;
