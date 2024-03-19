import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { getByIdUser } from "../services/UserService";
import ButtonPDF from "./ButtonPDF";



function SeeRequest({ data, userId }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const {
    isLoading: userLoading,
    data: userData,
    isError: userError,
  } = useQuery(["users", userId], () => getByIdUser(userId));

  
  if (userLoading) {
    <div>isLoading...</div>;
  }
  if (userError) {
    <div>isError...</div>;
  }

  const handleShowEdit = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button
        onClick={handleShowEdit}
        // variant="info"
        //  className="bg-gradient-info text-light"
      >
        <i class="bi bi-info-square"> </i>
      </Button>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Solicitud</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {data && (
            <Form>
              <Row>
                {userData ? (
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Usuario Solicitante</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={userData ? userData.dni+" | "+userData.name +" " +userData.lastName1 + ' | ' + userData.phoneNumber: ""}
                      disabled
                    />
                  </Form.Group>
                ) : (
                  ""
                )}
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tipo de gira</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={data ? data.typeRequest : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Unidad ejecutora</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={data ? data.executingUnit : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Objetivo</Form.Label>
                <Form.Control
                  as="textarea"
                  defaultValue={data ? data.objective : ""}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Número de personas</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={data ? data.personsAmount : ""}
                  disabled
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Fecha y hora de salida</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      defaultValue={data ? data.departureDate : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Fecha y hora de regreso</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      defaultValue={data ? data.arriveDate : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Lugar de salida</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={data ? data.departureLocation : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Lugar de destino</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={data ? data.destinyLocation : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Condición</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={data ? data.condition : ""}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Itinerario</Form.Label>
                <Form.Control
                  as="textarea"
                  defaultValue={data ? data.itinerary : ""}
                  disabled
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Tipo de vehículo</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={data ? data.typeOfVehicle : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Requiere chofer</Form.Label>

                    <Form.Check
                      type="checkbox"
                      defaultValue={data ? data.itsDriver : ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Prioridad</Form.Label>
                <Form.Control
                  as="textarea"
                  defaultValue={data ? data.priority : ""}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  defaultValue={data ? data.observations : ""}
                  disabled
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
        
          <Button className="buttonCancel" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SeeRequest;
