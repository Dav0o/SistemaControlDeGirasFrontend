import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import {
  create,
  getDriverLog,
  deleteDriverLog,
} from "../../services/DriverLogService";
import Container from "react-bootstrap/Container";
import { Button, Table } from "react-bootstrap";
import "datatables.net-buttons-dt";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import "datatables.net-responsive-dt";
import "../../stylesheets/vies.css";
import Modal from "react-bootstrap/Modal";
import { getUserByRole } from "../../services/UserService";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

function WorkingTime() {
  const [selectedUserId, setSelectedUserId] = useState("");

  const { isLoading, data } = useQuery("driverLogs", getDriverLog, {
    enabled: true,
  });

  const { isLoading: isLoadingUsers, data: users } = useQuery(
    "users/usersbyrole",
    () => getUserByRole("Chofer"),
    {
      enabled: true,
    }
  );

  const [dataTable, setDataTable] = useState(null);

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableControlJornada", {
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando elementos _START_ al _END_ de un total de _TOTAL_ elementos",
        infoEmpty: "Mostrando 0 elementos",
        infoFiltered: "(filtrado de _MAX_ elementos en total)",
        infoPostFix: "",
        loadingRecords: "Cargando...",
        zeroRecords: "No se encontraron elementos",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último",
        },
        aria: {
          sortAscending:
            ": activar para ordenar la columna de manera ascendente",
          sortDescending:
            ": activar para ordenar la columna de manera descendente",
        },
      },
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
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "El registro ha sido guardado exitosamente",
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    },
    onError: (error) => {
      console.error("Error al guardar el registro:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el registro",
      });
    },
  });

  const handleSelectChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleSave = () => {
    if (!selectedUserId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, seleccione un chofer",
      });
      return;
    }

    if (!initialLogDate.current.value.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingrese la fecha inicial",
      });
      return;
    }

    let newLog = {
      userId: parseInt(selectedUserId),
      initialLogDate: initialLogDate.current.value,
      ordinaryHours: 0,
      bonusHours: 0,
      extraHours: 0,
      salary: 0,
    };
    mutation.mutateAsync(newLog);
  };

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (isLoadingUsers) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  /////////////////////////////////////////

  const handleDelete = async (driverLogId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await deleteDriverLog(driverLogId);
        Swal.fire("Eliminado!", "El registro ha sido eliminado.", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error al eliminar el control de horas:", error);
      Swal.fire("Error", "Hubo un problema al eliminar el registro.", "error");
    }
  };

  return (
    <>
      <Container className="container-fluid">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">
          Control Jornada
        </h2>
        <p>Lista de los choferes con la respectiva jornada del mes</p>
        <div className="card shadow mb-4">
          <div>
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Clic en el botón para crear una jornada laboral
                </Accordion.Header>
                <Accordion.Body>
                  <Container>
                    <Row className="mb-2">
                      <Col>
                        <Form.Label htmlFor="inputDNI">
                          Cédula del chofer
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={selectedUserId}
                          onChange={handleSelectChange}
                        >
                          <option value="">Choferes a seleccionar</option>
                          {users.map((user) => (
                            <option value={user.id} ref={userId}>
                              {user.dni}-{user.name} {user.lastName1}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Form.Label>Fecha de inicio</Form.Label>
                      <Form.Control type="date" ref={initialLogDate} />
                    </Row>

                    <Button
                      variant="success"
                      className=" buttonSave mt-3"
                      onClick={handleSave}
                    >
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
                  <th>Cédula del chofer</th>
                  <th>Nombre del chofer</th>
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
                      <Button
                        variant="info"
                        className="bg-gradient-info text-light mr-2"
                        onClick={() => handleShow(request)}
                      >
                        <i class="bi bi-info-square"></i>
                      </Button>
                      <Link to={`/hourscontrol/${request.id}`}>
                        <Button
                          variant="warning"
                          className="bg-gradient-info text-light"
                        >
                          <i class="bi bi-clock"></i>
                        </Button>
                      </Link>

                      <Button
                        variant="danger"
                        className="bg-gradient-danger mr-1 text-light"
                        onClick={() => handleDelete(request.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
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
              <Button className="buttonCancel" onClick={handleClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}

export default WorkingTime;
