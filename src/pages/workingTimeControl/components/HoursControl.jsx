import React, { useRef } from "react";
import Container from "react-bootstrap/Container";
import { Button, Table } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getRequests } from "../../../services/RequestService";
import { create, getHoursLogDriver } from "../../../services/HoursLogDriverService";
import { useMutation } from "react-query";

function HoursControl() {
  const driverLogId = useParams();
  const workedDay = useRef(null);
  const hoursCategory = useRef(null);
  const initHour = useRef(null);
  const finishHour = useRef(null);
  const requestId = useRef(0);
  const description = useRef(null);

  const mutation = useMutation("hoursLogDriver", create, {
    onSettled: () => queryClient.invalidateQueries("hoursLogDriver"),
    mutationKey: "hoursLogDriver",
  });

  const handleSave = () => {
    let newHourLog = {
      workedDay: workedDay.current.value,
      categoryHours: hoursCategory.current.value,
      description: description.current.value,
      initialHour: initHour.current.value,
      finishHour: finishHour.current.value,
      driverLogId: driverLogId.logId,
      requestId: requestId.current.value,
    };
    mutation.mutateAsync(newHourLog);
  };

  const { isLoading, data, isError } = useQuery("requests", getRequests, {
    enabled: true,
  });

  const {isLoading:loadingLogs, data:dataLogs, errorLogs} = useQuery("hoursLogDriver", getHoursLogDriver);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (loadingLogs) {
    return <div>Loading...</div>;
  }

  if (errorLogs) {
    return <div>Error</div>;
  }

  const dataLogFiltered = dataLogs.filter((item)=>item.driverLogId == driverLogId.logId);

  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Control de Horas del Chófer</h1>
        <p>Lista de las horas laboradas del chófer</p>
        <div className="card shadow mb-4">
          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Click en el botón para registrar las horas del chofer
              </Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row className="mb-2">
                    <Col></Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <Form.Label>Día laborado</Form.Label>
                      <Form.Control type="date" ref={workedDay} />

                      <Form.Label>Hora de inicio</Form.Label>
                      <Form.Control type="time" ref={initHour} />

                      <Form.Label>Solicitud Laborada</Form.Label>
                      <Form.Control as="select">
                        {data.map((request) => (
                          <option value={request.id} ref={requestId}>
                            {request.departureDate.substr(0, 10)}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col>
                      <Form.Label>Categoria de horas</Form.Label>
                      <Form.Control
                        as="select"
                        defaultValue="Regulares"
                        ref={hoursCategory}
                      >
                        <option value="Regulares">Regulares</option>
                        <option value="Extra">Extra</option>
                        <option value="Sobresueldo">Sobresueldo</option>
                      </Form.Control>

                      <Form.Label>Hora de final</Form.Label>
                      <Form.Control type="time" ref={finishHour} />

                      <Form.Label>Descripción</Form.Label>
                      <Form.Control type="text" ref={description} />
                    </Col>
                  </Row>

                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleSave}
                  >
                    Guardar
                  </Button>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className="card-body">
            <Table
              id="tableControlHoras"
              className="display nowrap"
              responsive
            >
              <thead>
                <tr>
                  <th>Día laborado</th>
                  <th>Categoría de horas</th>
                  <th>Horas</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
               {dataLogFiltered.map((logs) => (
                <tr key={logs.id}>
                    <td>{(logs.workedDay).substr(0, 10)}</td>
                    <td>{logs.categoryHours}</td>
                    <td>{(logs.initialHour).substr(11,8)} - {(logs.finishHour).substr(11,8)}</td>
                    <td>{logs.description}</td>
                </tr>
               ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </>
  );
}

export default HoursControl;
