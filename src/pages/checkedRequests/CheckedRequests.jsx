import React, { useEffect, useRef, useState } from "react";
import { getRequestVerified } from "../../services/RequestService";
import { useQuery } from "react-query";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import SeeRequest from "../../components/SeeRequest";
import ButtonPDF from "../../components/ButtonPDF";
import { Form } from "react-router-dom";


function CheckedRequests() {
  const { data, isLoading, isError } = useQuery(
    "requests",
    getRequestVerified,
    {
      enabled: true,
    }
  );

  const [dataFiltered, setDataFilteres] = useState({});

  const condicionFilter = useRef(null);

  const [dataFilter, setDataFilter] = useState(data);

  useEffect(() => {
    setDataFilter(data)
  }, [data])
  
  const numberFilter = useRef(0);
  function handleFilter(){
    const selectedCondition = condicionFilter.current.value;
    const numberFilterValue = numberFilter.current.value;

    let filteredData = data.filter(item => (item.consecutiveNumber).includes(numberFilterValue));

    if (selectedCondition === "aprobadas") {
        filteredData = filteredData.filter(item => item.itsApprove === true);
    } else if (selectedCondition === "anuladas") {
        filteredData = filteredData.filter(item => item.itsCanceled === true);
    }

    setDataFilter(filteredData);
  }
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

 
  return (
    <>
      <Container className="mb-3">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">Solicitudes </h2>
        <p className="mb-4">Lista de solicitudes procesadas</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <p>Dé click en detalles para seleccionar una solicitud</p>
            <br />
            <Row className="d-flex">
              
              <Col>
                <div className="form-floating">
                  <select
                    class="form-select"
                    id="floatingSelect"
                    aria-label="Floating label select example"
                    ref={condicionFilter}
                    onChange={handleFilter}
                  >
                    <option value="todas">Todas</option>
                    <option value="aprobadas">Aprobadas</option>
                    <option value="anuladas">Anuladas</option>
                  </select>
                  <label for="floatingSelect">Filtrar por condición</label>
                </div>
              </Col>
              <Col >
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar por número"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    ref={numberFilter}
                    onChange={handleFilter}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            {dataFilter ?
            dataFilter.map((request) => (
              <Card key={request.id}>
                <Card.Header>{request.consecutiveNumber}</Card.Header>
                <Card.Body>
                  <Card.Title>{request.objective}</Card.Title>
                  <Card.Text>
                    Fecha de salida {request.departureDate.substring(0, 10)} con
                    el destino de {request.destinyLocation}
                  </Card.Text>

                  <SeeRequest data={request} userId={request.processes[0].userId}/>
                  <ButtonPDF formData={request} />

                  <Button
                    variant={
                      request.itsApprove
                        ? "success"
                        : request.itsCanceled
                        ? "danger"
                        : "info"
                    }
                    className="text-light rounded-circle"
                    style={{
                      float: "right",
                      backgroundColor: request.itsApprove
                        ? "rgba(0, 255, 0, 0.5)"
                        : request.itsCanceled
                        ? "rgba(255, 0, 0, 0.5)"
                        : "rgba(0, 0, 255, 0.5)",
                    }}
                  >
                    {request.itsApprove ? "Aprobada" : "Anulada"}
                  </Button>
                </Card.Body>
              </Card>
            )): ""}
          </div>
        </div>
      </Container>
    </>
  );
}

export default CheckedRequests;
