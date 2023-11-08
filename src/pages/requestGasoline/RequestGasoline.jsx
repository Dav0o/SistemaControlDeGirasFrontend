import React, { useRef } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getByIdRequest } from "../../services/RequestService";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function RequestGasoline() {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      En un inicio todo los datos van a estar por defecto, es necesario cambiarlos
    </Tooltip>
  );
  const requestId = useParams();

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
        <h1 className="h3 mb-2 text-gray-800">Suministro de combustible</h1>
        <p class="mb-4">Lista de recarga de combustible de la solicitud</p>
        <div className="card shadow mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-end">
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <Button variant="info" style={LinkStyle}>
                <i class="bi bi-question-square"></i>
                </Button>
              </OverlayTrigger>
            </div>
          </div>
          <div className="card-body">
            <Table striped="columns">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Comercio</th>
                  <th>Litros</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              {data.requestGasoline.map((request) => (
                <tbody>
                  <tr key={request.id}>
                    <td>{request.date}</td>
                    <td>{request.commerce}</td>
                    <td>{request.litres}</td>
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
            <Link to={`/requestManagement`}>
              <Button variant="warning">Regresar</Button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}

export default RequestGasoline;
