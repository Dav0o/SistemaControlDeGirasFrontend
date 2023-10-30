import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { create, getDriverLog } from "../../services/DriverLogService";
import Container from "react-bootstrap/Container";
import { Button, Table } from "react-bootstrap";
import "datatables.net-buttons-dt";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "datatables.net-responsive-dt";
import "../../stylesheets/vies.css";
import Modal from "react-bootstrap/Modal";
import { getUserByRole } from "../../services/UserService";
import { useMutation } from "react-query";

function WorkingTime() {
  const { isLoading, data, isError } = useQuery("driverLogs", getDriverLog, {
    enabled: true,
  });

  const {
    isLoading: isLoadingUsers,
    data: users,
    isError: isErrorUsers,
  } = useQuery("users/usersbyrole", () => getUserByRole('Chofer'), {
    enabled: true,
  });

  const [dataTable, setDataTable] = useState(null);

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableControlJornada", {
      dom: "lfBrtip",
      bLengthChange: false,
      responsive: true,
      buttons: [
        {
          extend: "print",
          title: "Jornada laboral del chófer",
          titleAttr: "Imprimir",
          text: '<i class="fa-solid fa-print" aria-hidden="true"></i>',
          className: "btn btn-info",
          exportOptions: {
            columns: [0, 1, 2, 3],
          },
          customize: function (win) {
            $(win.document.body)
              .find("tableControlJornada")
              .addClass("compact")
              .css("font-size", "inherit");
            $(win.document.body).find("h1").css("text-align", "center");
            $(win.document.body).css("font-size", "9px");
          },
        },
        {
          extend: "pdf",
          title: "Jornada laboral del chófer",
          titleAttr: "Exportar a PDF",
          text: '<i class="fa-regular fa-file-pdf" aria-hidden="true"></i>',
          className: "btn btn-danger",
          exportOptions: { columns: [0, 1, 2, 3] },
          customize: function (doc) {
            doc.content[1].margin = [100, 0, 100, 0]; //left, top, right, bottom
          },
        },
        {
          extend: "excel",
          title: "Jornada laboral del chófer",
          titleAttr: "Exportar a Excel",
          text: '<i class="fa-solid fa-file-csv"></i>',
          className: "btn btn-success",
          exportOptions: { columns: [0, 1, 2, 3] },
        },
      ],
    });

    // Actualiza el estado para mantener la referencia del DataTable
    setDataTable(newDataTable);
  }, [data]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (log) => {
    setSelectedLog(log);
    setShow(true);
  };

  const [selectedLog, setSelectedLog] = useState(null);

  const initialLogDate = useRef(null);
  const ordinaryHours = useRef(null);
  const userId = useRef(0);

  const mutation = useMutation("driverLog", create, {
    onSettled: () => queryClient.invalidateQueries("driverLogs"),
    mutationKey: "driverLog",
  });
  const handleSave = () =>{
    let newLog = {
        initialLogDate: initialLogDate.current.value,
        ordinaryHours: ordinaryHours.current.value,
        bonusHours: 0,
        extraHours: 0,
        salary: 0,
        userId: parseInt(userId.current.value)
    };
    mutation.mutateAsync(newLog);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }
  if (isLoadingUsers) {
    return <div>Loading...</div>;
  }

  if (isErrorUsers) {
    return <div>Error</div>;
  }

 

  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Control Jornada</h1>
        <p>Lista de los choferes con la respectiva jornada del mes</p>
        <div className="card shadow mb-4">
          <div>
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Click en el botón para crear una jornada laboral
                </Accordion.Header>
                <Accordion.Body>
                  <Container>
                    <Row className="mb-2">
                      <Col>
                        <Form.Label htmlFor="inputDNI">
                          Cédula del chofer
                        </Form.Label>
                        <Form.Select aria-label="Default select example">
                          <option>Choferes a seleccionar</option>
                          {users.map((user) => (
                            <option value={user.id} ref={userId}>{user.dni}-{user.name} {user.lastName1}</option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <Form.Label >
                          Fecha de inicio
                        </Form.Label>
                        <Form.Control type="date"  ref={initialLogDate}/>
                      </Col>
                      <Col>
                        <Form.Label >
                          Horas Ordinarias
                        </Form.Label>
                        <Form.Control type="number"  ref={ordinaryHours}/>
                      </Col>
                    </Row>

                    <Button variant="primary" className="mt-3" onClick={handleSave}>
                      Guardar
                    </Button>
                  </Container>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className="card-body">
            <Table
              
              id="tableControlJornada"
              className="display nowrap"
              responsive
            >
              <thead>
                <tr>
                  <th>Fecha inicial</th>
                  <th>Cedula chófer</th>
                  <th>Nombre Chofer</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.map((request) => (
                  <tr key={request.id}>
                    <td>{request.initialLogDate}</td>
                    <td>{request.user.dni}</td>
                    <td>
                      {request.user.name} {request.user.lastName1}
                    </td>
                    <td>
                      {/* <Link to={`/workingTimeControl/${request.id}`} style={LinkStyle}> */}
                      <Button
                        variant="info"
                        className="bg-gradient-info text-light"
                        onClick={() => handleShow(request)}
                      >
                        <i class="bi bi-info-square"></i>
                      </Button>
                      {/* </Link> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Detalles de la jornada
          </Modal.Title>
        </Modal.Header>
        {selectedLog && (
          <>
            <Modal.Body>
              <h4>
                {selectedLog.user.name} {selectedLog.user.lastName1} /{" "}
                {selectedLog.initialLogDate}
              </h4>
              <Form.Label>Horas regulares</Form.Label>
              <Form.Control
                type="number"
                disabled
                value={selectedLog.ordinaryHours}
              />
              <Form.Label>Horas extra</Form.Label>
              <Form.Control
                type="number"
                disabled
                value={selectedLog.extraHours}
              />
              <Form.Label>Horas sobresueldo</Form.Label>
              <Form.Control
                type="number"
                disabled
                value={selectedLog.bonusHours}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose}>Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}

export default WorkingTime;
