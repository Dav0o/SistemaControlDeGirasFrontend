import React, { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Table, Modal, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useQuery, useMutation } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { getByIdVehicle } from "../../../services/VehicleService";
import { create } from "../../../services/MaintenanceService";



function VehicleMaintenances() {
  const { vehicleId } = useParams();
  const { isLoading, data, isError } = useQuery(["vehicles", vehicleId], () =>
    getByIdVehicle(vehicleId)
  );
  const mutation = useMutation("maintenances", create);

    const name = useRef(null);
    const severity = useRef(null);
    const date = useRef(null);
    const type = useRef(null);
    const category = useRef(0);
    const status = useRef(null);
    const description = useRef(null);

  const handleSave = () => {
    let newMaintenance = {
      name:name.current.value,
      severity:severity.current.value,
      date:date.current.value,
      type: type.current.value,
      category:0,
      status: true,
      description: description.current.value,
      vehicleId: vehicleId,

    };
    mutation.mutateAsync(newMaintenance);
    setModalCreate(false);
  };

  const [modalCreate, setModalCreate] = useState(false);

  const handleCloseFormModal = () => setModalCreate(false);
  const handleShowFormModal = () => setModalCreate(true);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }
  return (
    <>
      <Container>
        <Row>
          <Col>
            <h2>Lista de Mantenimiento del Vehiculo</h2>
          </Col>
          <Col>
            <Button onClick={handleShowFormModal}>Crear</Button>
          </Col>
        </Row>

        <Table striped="columns">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Gravedad</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.maintenances.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>{maintenance.name}</td>
                <td>{maintenance.severity}</td>
                <td>{maintenance.type}</td>
                <td>
                  <Button variant="info">Editar</Button>
                  <Button>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="info">
                <Link to={"/vehicle"}>
                Regresar
                </Link>
                
            </Button>
      </Container>

      <Modal show={modalCreate} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear mantenimiento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formPlaca">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el daño" ref={name} />
                </Form.Group>

                <Form.Group controlId="formPlaca">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type="date" placeholder="Fecha de cuando sucedio" ref={date} />
                </Form.Group>
                
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formColor">
                  <Form.Label>Gravedad</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el año" ref={severity} />
                </Form.Group>

                <Form.Group controlId="formColor">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el año" ref={type} />
                </Form.Group>
               
            </div>
            </div>
            <Form.Group controlId="formColor">
                  <Form.Label>Descripcion</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese la descripcion del suceso" ref={description} />
                </Form.Group>
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
    </>
  );
}

export default VehicleMaintenances;
