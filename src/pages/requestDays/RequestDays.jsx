import React, { useRef } from "react";
import Swal from "sweetalert2";
import { getByIdRequestDays, create } from "../../services/RequestDaysService";



function RequestDays() {

const day = useRef(null);
const startTime = useRef(null);
const endTime = useRef(null);
const requestId = useRef(null);

const { isLoading, data, isError } = useQuery(["requestsDays", requestDaysId], () =>
getByIdRequestDays(requestDaysId)
);

const mutation = useMutation("requestsDays", create);
const handleShowFormModal = () => setModalCreate(true);
const handleCloseFormModal = () => setModalCreate(false);
const [modalCreate, setModalCreate] = useState(false);

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
        }).then(mutation.reset)
      : null;
  }

const handleSaveDays = () => {
  let newRequestDays = {
      day: day.current.value,
      startTime: startTime.current.value,
      endTime: endTime.current.value,
      requestId: requestId,  
  };
  mutation.mutate(newRequestDays);
};

const handleEditClick = (requestDaysId) => {
  const requestDaysToEdit = data.requestDays.find(
    (requestDays) => requestDays.id === requestDaysId
  );
  setEditingMaintenance(requestDaysToEdit);
  setShowEditModal(true);
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
        Solicitud de días de gira
      </h1>
      <p class="mb-4">Lista de solicitudes de días de gira</p>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <div className="d-flex justify-content-between">
            <div>Clik en el boton para crear una nueva solicitud</div>
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
          <Table striped="columns">
            <thead>
              <tr>
                <th>Día de la gira</th>
                <th>Hora de salida</th>
                <th>Hora regreso</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data.map((requestDays) => (
                <tr key={requestDays.id}>
                  <td>{requestDays.day}</td>
                  <td>{requestDays.startTime}</td>
                  <td>{requestDays.endTime}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="bg-gradient-warning mr-1 text-light"
                      onClick={() => handleEditClick(requestDays.id)}
                    >
                      <i class="bi bi-pencil-square"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Link style={LinkStyle} to={"/driverLog"}>
        <Button variant="dark" className="bg-gradient-danger">
          Regresar
        </Button>
      </Link>
    </Container>

    <Modal show={modalCreate} onHide={handleCloseFormModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear solicitud</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Día de gira</Form.Label>
                <Form.Control
                  type="date"
                  ref={day}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Hora de salida</Form.Label>
                <Form.Control
                  type="time"
                  ref={startTime}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Hora de regreso</Form.Label>
                <Form.Control
                  type="time"
                  ref={endTime}
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCloseFormModal}>
          Cancelar
        </Button>
        <Button variant="dark" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar solicitud</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Día de gira</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={
                    editingRequestDays ? editingRequestDays.day : ""
                  }
                  ref={day}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Hora de salida</Form.Label>
                <Form.Control
                  type="time"
                  defaultValue={
                    editingRequestDays ? editingRequestDays.startTime : ""
                  }
                  ref={startTime}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Hora de regreso</Form.Label>
                <Form.Control
                  type="time"
                  defaultValue={
                    editingRequestDays ? editingRequestDays.endTime : ""
                  }
                  ref={endTime}
                />
              </Form.Group>
            </div>
          </div>
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

export default RequestDays;