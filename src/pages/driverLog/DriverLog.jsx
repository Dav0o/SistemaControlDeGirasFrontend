import React, { useRef, useState, useEffect} from "react";
import { Container } from "react-bootstrap";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { create, getDriverLog } from "../../services/DriverLogService";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";


function DriverLog() {

  const initialLogDate = useRef(null);
  const ordinaryHours = useRef(0);
  const bonusHours = useRef(0);
  const extraHours = useRef(0);
  const salary = useRef(0);
  const userid = useRef(0);

  const mutation = useMutation("driverLogs", create);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const handleShowFormModal = () => setModalCreate(true);
  const handleCloseFormModal = () => setModalCreate(false);
  const [dataTable, setDataTable] = useState(null);
  const [editingDriverLog, setEditingDriverLog] = useState(null);
  const { isLoading, data, isError } = useQuery("driverLogs", getDriverLog, {
  enabled: true,
  });

  const MySwal = withReactContent(Swal);

  {
    mutation.isError
      ? MySwal.fire({
        icon: "error",
        text: "Algo salio mal!",
      }).then(mutation.reset)
      : null;
  }
  {
    mutation.isSuccess
      ? MySwal.fire({

          icon: "success",
          title: "Tu trabajo ha sido guardado!",
          showConfirmButton: false,
          timer: 1500,
        })

      : null;
  }

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }
  
    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableJornada", {
      retrieve: true,
      responsive: true,
      dom: "<'row' <'col-md-12 float-right'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
      buttons: [
        {
          extend: "print",
          title: "Control Jornada de Chófer",
          titleAttr: "Imprimir",
          text: '<i class="fa-solid fa-print" aria-hidden="true"></i>',
          className: "btn btn-info",
          exportOptions: {
            columns: [0, 1, 2, 3],
          },
          customize: function (win) {
            $(win.document.body)
              .find("tableJornada")
              .addClass("compact")
              .css("font-size", "inherit");
            $(win.document.body).find("h1").css("text-align", "center");
            $(win.document.body).css("font-size", "9px");
          },
        },
        {
          extend: "pdf",
          title: "Control Jornada de Chófer",
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
          title: "Control Jornada de Chófer",
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
  

const handleSaveDriver = () => {
    let newDriverLog = {
        initialLogDate: initialLogDate.current.value,
        ordinaryHours: parseInt(ordinaryHours.current.value),
        bonusHours: parseInt(bonusHours.current.value),
        extraHours: parseInt(extraHours.current.value),
        salary: parseInt(salary.current.value),
        userid: parseInt(userid.current.value)
    };
    mutation.mutate(newDriverLog);
};

const handleEditClick = (driverLogId) => {
  const driverLogToEdit = data.find((driverLog) => 
  driverLog.id === driverLogId);
  setEditingDriverLog(driverLogToEdit);
  setShowEditModal(true);
};

const handleOpenModal = (driverLogId) => {
  setSelectedDriver(driverLogId);
  setShowModal(true);
};

const handleCloseEditModal = () => {
  setShowEditModal(false);
};

const handleUpdate = () => {
  const updatedDriverLog = {
    id: editingDriverLog.id,
    initialLogDate: initialLogDate.current.value,
    ordinaryHours: parseInt(ordinaryHours.current.value),
    bonusHours: parseInt(bonusHours.current.value),
    extraHours: parseInt(extraHours.current.value),
    salary: parseInt(salary.current.value),
    userid: userid,
  };

  mutation.mutateAsync(updatedDriverLog).then(() => {
    setShowEditModal(false);
  });
};

if (isLoading) {
  return <div>Loading...</div>;
}

if (isError) {
  return <div>Error</div>;
}

const LinkStyle = {
  textDecoration: "none",
  color: "white",
};

  return (
    <>
    <Container className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">
        Control Jornada de los Chóferes
      </h1>
      <p className="mb-4">Lista de la jornada laboral del chófer</p>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <div className="d-flex justify-content-between">
            <div>Clik en el botón para crear una nueva jornada</div>
            <Button
              variant="success"
              className="bg-gradient-success text-light
              "
              onClick={handleShowFormModal}
            >
              <i class="bi bi-plus-square"></i>
            </Button>
          </div>
        </div>
        <div className="card-body">
          <Table striped="columns"
          id="tableJornada">
            <thead>
              <tr>
                <th>Chófer</th>
                <th>Inicio de la jornada</th>
                <th>Horas regulares</th>
                <th>Horas sobresueldo</th>
                <th>Horas extras</th>
                <th>Salario total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data.map((driverLog) => (
                <tr key={driverLog.id}>
                  <td>{driverLog.userid}</td>
                  <td>{driverLog.initialLogDate}</td>
                  <td>{driverLog.ordinaryHours}</td>
                  <td>{driverLog.bonusHours}</td>
                  <td>{driverLog.extraHours}</td>
                  <td>{driverLog.salary}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="bg-gradient-warning mr-1 text-light"
                      onClick={() => handleEditClick(driverLog.id)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    {/* <Link to={`/requestsDays/${requestDays.id}``/requestsGasoline/${requestGasoline.id}`} style={LinkStyle}>
                        <Button
                          variant="info"
                          className="bg-gradient-info text-light"
                        >
                          <i class="bi bi-info-square"></i>
                        </Button>
                      </Link> */}
                 
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>

    <Modal show={modalCreate} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear jornada</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Chófer</Form.Label>
                  <Form.Control
                    type="text"
                    ref={userid}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Inicio de la jornada</Form.Label>
                  <Form.Control
                    type="date"
                    ref={initialLogDate}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Horas regulares</Form.Label>
                  <Form.Control
                    type="number"
                    ref={ordinaryHours}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Horas sobresueldo</Form.Label>
                  <Form.Control
                    type="number"
                    ref={bonusHours}
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Horas extras</Form.Label>
              <Form.Control
                type="number"
                ref={extraHours}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Salario total</Form.Label>
              <Form.Control
                type="number"
                ref={salary}
             />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseFormModal}>
            Cancelar
          </Button>
          <Button variant="dark" onClick={handleSaveDriver}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar jornada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Inicio de la jornada</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={
                      editingDriverLog ? editingDriverLog.initialLogDate : ""
                    }
                    ref={initialLogDate}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Horas regulares</Form.Label>
                  <Form.Control
                    type="number"
                    defaultValue={
                      editingDriverLog ? editingDriverLog.ordinaryHours : ""
                    }
                    ref={ordinaryHours}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Horas sobresueldo</Form.Label>
                  <Form.Control
                    type="number"
                    defaultValue={
                      editingDriverLog ? editingDriverLog.bonusHours : ""
                    }
                    ref={bonusHours}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Horas extras</Form.Label>
                  <Form.Control
                    type="number"
                    defaultValue={
                      editingDriverLog ? editingDriverLog.extraHours : ""
                    }
                    ref={extraHours}
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Salario Total</Form.Label>
              <Form.Control
                type="number"
                defaultValue={
                  editingDriverLog ? editingDriverLog.salary : ""
                }
                ref={salary}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="dark" onClick={handleUpdate}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal>
 </>
  );
}



export default DriverLog