import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { endorse, getRequestToEndorse, getRequests, update, } from "../../services/RequestService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { getVehicles } from "../../services/VehicleService";
import { useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import SeeRequest from "../../components/SeeRequest";
import { getUsersDriver, getByIdUser} from "../../services/UserService";


function EndorseRequest({}) {
  const { data, isLoading, isError } = useQuery(
    "requests",
    getRequests,
    {
      enabled: true,
    }
  );

  const {
    data: drivers,
    isLoading: LoadingDrivers,
    isError: ErrorDrivers,
  } = useQuery("users", getUsersDriver);



  const executingUnit = useRef(null);
  const typeRequest = useRef(null);
  const condition = useRef(null);
  const priority = useRef(0);
  const personsAmount = useRef(0);
  const objective = useRef(null);
  const departureDate = useRef(null);
  const arriveDate = useRef(null);
  const departureLocation = useRef(null);
  const destinyLocation = useRef(null);
  const itinerary = useRef(null);
  const observations = useRef(null);
  const typeOfVehicle = useRef(null);
  const itsDriver = useRef(false);

  const driverId = useRef(0);

  const {
    data: vehicles,
    isLoading: loadingVehicles,
    isError: errorVehicles,
  } = useQuery("vehicles", getVehicles, {
    enabled: true,
  });

  const mutation = useMutation(`requests/endorse`, endorse);

  const mutationUpdate = useMutation(`requests`, update);

   const MySwal = withReactContent(Swal);
  // {
  //   mutation.isError
  //     ? MySwal.fire({
  //       icon: "error",
  //       text: "¡Algo salió mal!",
  //     }).then(mutation.reset)
  //     : null;
  // }
  // {
  //   mutation.isSuccess
  //     ? MySwal.fire({
  //       icon: "success",
  //       title: "Tu trabajo ha sido guardado!",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     })
  //       .then(mutation.reset)
  //       .then(window.location.reload())
  //     : null;
  // }
  // {
  //   mutationUpdate.isError
  //     ? MySwal.fire({
  //       icon: "error",
  //       text: "¡Algo salió mal!",
  //     }).then(mutation.reset)
  //     : null;
  // }
  // {
  //   mutationUpdate.isSuccess
  //     ? MySwal.fire({
  //       icon: "success",
  //       title: "Tu trabajo ha sido guardado!",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     })
  //       .then(mutation.reset)
  //       .then(window.location.reload())
  //     : null;
  // }

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEndorseModal, setShowEndorseModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const vehicleId = useRef(0);

  const handleClose = () => setShowEndorseModal(false);
  const handleCloseEdit = () => setShowEditModal(false);

  const handleShowEndorse = (requestId) => {
    const requestToEndorse = data.find((request) => request.id === requestId);
    setSelectedRequest(requestToEndorse);
    setShowEndorseModal(true);
  };

  const handleShowEdit = (requestId) => {
    const requestToEdit = data.find((request) => request.id === requestId);
    setSelectedRequest(requestToEdit);
    setShowEditModal(true);
  };


  
  const handleEndorse = () => {

    const selectedVehicleId = parseInt(vehicleId.current.value);

    if (!selectedVehicleId) {
        MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, seleccione un vehículo",
        });
        return;
    }


    let updateRequest = {
      id: selectedRequest.id,
      vehicleId: parseInt(vehicleId.current.value),
      driverId: parseInt(driverId.current.value),
      itsEndorse: true,
    };
    mutation.mutateAsync(updateRequest)
    .then(() => {

        MySwal.fire({
            icon: "success",
            title: "Éxito",
            text: "La solicitud ha sido avalada correctamente",
        });

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    })
    .catch((error) => {
        MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al avalar la solicitud",
        });
    });
};



  const handleUpdate = () => {
    let updatedRequest = {
      id: selectedRequest.id,
      consecutiveNumber: selectedRequest.consecutiveNumber,
      executingUnit: executingUnit.current.value,
      typeRequest: typeRequest.current.value,
      condition: condition.current.value,
      priority: priority.current.value,
      personsAmount: parseInt(personsAmount.current.value),
      objective: objective.current.value,
      departureDate: departureDate.current.value,
      arriveDate: arriveDate.current.value,
      departureLocation: departureLocation.current.value,
      destinyLocation: destinyLocation.current.value,
      itinerary: itinerary.current.value,
      observations: observations.current.value,

      typeOfVehicle: typeOfVehicle.current.value,

      itsDriver: itsDriver.current.valueOf,
    };
    mutationUpdate.mutateAsync(updatedRequest);
  };

  const [dataFilter, setDataFilter] = useState(data);

  const [idUserRequest, setIdUserRequest] = useState(null);

  useEffect(() => {
    setDataFilter(data);

    //data ? console.log(data[0].processes[0].userId) : console.log('Loading...')
  }, [data]);

  const numberFilter = useRef(0);
  function handleFilter() {
    const _data = data.filter((item) =>
      item.consecutiveNumber.includes(numberFilter.current.value)
    );

    setDataFilter(_data);
  }

  let vehiclesFilter = vehicles
    ? vehicles.filter((item) => item.status == true)
    : "";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (loadingVehicles) {
    return <div>Loading...</div>;
  }

  if (errorVehicles) {
    return <div>Error</div>;
  }

  const filteredData = data.filter((item) => item.itsEndorse === false);

  return (
    <>
      <Container className="container-fluid ">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">Avalar</h2>
        <p className="mb-4"> Lista de solicitudes</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <p>Diríjase a la solicitud que desea avalar</p>
            <br />
            <Row className="d-flex">
              <Col>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar por número"
                    ref={numberFilter}
                    onChange={handleFilter}
                    aria-describedby="basic-addon1"
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            {filteredData.map((request) => (
              <Card key={request.id} className="mb-3">
                <Card.Header>{request.consecutiveNumber}</Card.Header>
                <Card.Body>
                  <Card.Title>{request.objective}</Card.Title>
                  <Card.Text>
                    La gira tiene destino a{" "}
                    <strong>{request.destinyLocation}</strong> y sale desde{" "}
                    <strong>{request.departureLocation}</strong>
                  </Card.Text>

                  <div className="d-flex justify-content-between">
                    <div>
                      <Button
                        variant="success"
                        className="buttonSave text-light mr-1"
                        onClick={() => handleShowEndorse(request.id)}
                      >
                        Avalar
                      </Button>
                      <Button
                        className="buttonCancel"
                        onClick={() => handleShowEdit(request.id)}
                      >
                        Editar
                      </Button>
                    </div>
                    <SeeRequest
                      data={request}
                      userId={1}
                    />
                    {console.log(request)}
                  </div>
                </Card.Body>
              </Card>
            ))
            }
          </div>
        </div>
      </Container>

      <Modal show={showEndorseModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitud a avalar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedRequest && (
            <Form>
            
              <Form.Group>
             
                <Form.Label>
                  Número de consecutivo de la solicitud a avalar
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedRequest.consecutiveNumber}
                  aria-label="Disabled input example"
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cantidad de personas que van a la gira</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedRequest.personsAmount}
                  aria-label="Disabled input example"
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tipo de vehículo requerido</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedRequest.typeOfVehicle}
                  aria-label="Disabled input example"
                  disabled
                  readOnly
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Seleccione el vehículo para la solicitud
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  ref={vehicleId}
                >
                  <option>Lista de vehículos</option>
                  {/* -------------------------------------------------------------------------------------------------- */}
                  {vehiclesFilter.map((vehicle) => {
                    // Verificar disponibilidad del vehículo
                    const isAvailable = data.every((request) => {
                      // Convertir las fechas a objetos Date
                      const requestStartDate = new Date(request.departureDate);
                      const requestEndDate = new Date(request.arriveDate);

                      const selectedStartDate = new Date(
                        selectedRequest.departureDate
                      );
                      const selectedEndDate = new Date(
                        selectedRequest.arriveDate
                      );

                      // Comprobar si hay solapamiento de fechas
                      return (
                        request.vehicleId !== vehicle.id ||
                        request.id === selectedRequest.id || // Ignorar la solicitud actual si se está editando
                        selectedStartDate >= requestEndDate ||
                        selectedEndDate <= requestStartDate

                      );
                    });
                    const isCanceled = data.filter(item => item.ItsCanceled == true);

                    // Si el vehículo está disponible, mostrarlo en la lista
                    if (isAvailable || isCanceled) {
                      return (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate_Number} - {vehicle.category}
                        </option>
                      );
                    } else {
                      return null; // No mostrar el vehículo si no está disponible
                    }
                  })}
                </Form.Select>
              </Form.Group>
              {!selectedRequest.itsDriver && (
                <Form.Group className="mb-2" controlId="driverSelect">
                  <Form.Label>
                    Seleccione el chofer para la solicitud
                  </Form.Label>
                  <Form.Control as="select" ref={driverId}>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.dni} - {driver.name} {driver.lastName1}{" "}
                        {driver.lastName2}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonCancel" onClick={handleClose}>
            Cerrar
          </Button>
          <Button
            variant="success"
            className="buttonSave"
            onClick={handleEndorse}
          >
            Avalar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Solicitud a editar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedRequest && (
            <Form>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tipo de gira</Form.Label>
                    <Form.Control
                      type="text"
                      ref={typeRequest}
                      defaultValue={
                        selectedRequest ? selectedRequest.typeRequest : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Unidad ejecutora</Form.Label>
                    <Form.Control
                      type="text"
                      ref={executingUnit}
                      defaultValue={
                        selectedRequest ? selectedRequest.executingUnit : ""
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Objetivo</Form.Label>
                <Form.Control
                  as="textarea"
                  ref={objective}
                  defaultValue={
                    selectedRequest ? selectedRequest.objective : ""
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Número de personas</Form.Label>
                <Form.Control
                  type="number"
                  ref={personsAmount}
                  defaultValue={
                    selectedRequest ? selectedRequest.personsAmount : ""
                  }
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Fecha y hora de salida</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      ref={departureDate}
                      defaultValue={
                        selectedRequest ? selectedRequest.departureDate : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Fecha y hora de regreso</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      ref={arriveDate}
                      defaultValue={
                        selectedRequest ? selectedRequest.arriveDate : ""
                      }
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
                      ref={departureLocation}
                      defaultValue={
                        selectedRequest ? selectedRequest.departureLocation : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Lugar de destino</Form.Label>
                    <Form.Control
                      type="text"
                      ref={destinyLocation}
                      defaultValue={
                        selectedRequest ? selectedRequest.destinyLocation : ""
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Condición</Form.Label>
                <Form.Control
                  type="text"
                  ref={condition}
                  defaultValue={
                    selectedRequest ? selectedRequest.condition : ""
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Itinerario</Form.Label>
                <Form.Control
                  as="textarea"
                  ref={itinerary}
                  defaultValue={
                    selectedRequest ? selectedRequest.itinerary : ""
                  }
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Tipo de vehículo</Form.Label>
                    <Form.Control
                      type="text"
                      ref={typeOfVehicle}
                      defaultValue={
                        selectedRequest ? selectedRequest.typeOfVehicle : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2" controlId="formBasicPassword">
                    <Form.Label>Requiere chofer</Form.Label>

                    <Form.Check
                      type="checkbox"
                      ref={itsDriver}
                      defaultValue={
                        selectedRequest ? selectedRequest.itsDriver : ""
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2" controlId="formPrioridad">
                <Form.Label>Prioridad</Form.Label>
                <Form.Control as="select" ref={priority} 
                defaultValue={selectedRequest ? selectedRequest.priority : ""}>
                  <option value="Objetivos administrativos, académicos-administrativos y paraacadémicos">
                    Objetivos administrativos, académicos-administrativos y paraacadémicos
                  </option>
                  <option value="Cumplen con objetivos de cursos de docencia, según plan de estudios y programa del curso">
                    Cumplen con objetivos de cursos de docencia, según plan de estudios y programa del curso
                  </option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  ref={observations}
                  defaultValue={
                    selectedRequest ? selectedRequest.observations : ""
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonCancel" onClick={handleCloseEdit}>
            Cerrar
          </Button>
          <Button
            variant="success"
            className="buttonSave"
            onClick={handleUpdate}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EndorseRequest;
