import React, { useEffect } from "react";
import { approve, cancel, getRequestToApprove, getRequests } from "../../services/RequestService";
import { useMutation, useQuery } from "react-query";
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
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SeeRequest from "../../components/SeeRequest";


function ApproveRequest() {
  const { data, isLoading, isError } = useQuery("requests", getRequestToApprove, {
    enabled: true,
  });

  const mutation = useMutation("requests/approve", approve);

  const cancelMutation = useMutation("requests/cancel", cancel);

  const handleCancel = async (requestId) => {
    const requestToCancel = data.find((request) => request.id === requestId);
    try {
      await cancelMutation.mutateAsync({ id: requestToCancel.id });
      MySwal.fire("Solicitud Cancelada", "", "success");
    } catch (error) {
      console.error("Error al cancelar la solicitud", error);
      MySwal.fire("Error al cancelar la solicitud", error.message, "error");
    }
  };

  const MySwal = withReactContent(Swal);
  {
    mutation.isError
      ? MySwal.fire({
          icon: "error",
          text: "¡Algo salió mal!",
        }).then(mutation.reset)
      : null;
  }
  {
    mutation.isSuccess
      ? MySwal.fire({
          icon: "success",
          title: "¡Tu trabajo ha sido guardado!",
          showConfirmButton: false,
          timer: 1500,
        }).then(mutation.reset)
      : null;
  }

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const handleClose = () => setShowApproveModal(false);

  const handleShowApprove = (requestId) => {
    const requestToApprove = data.find((request) => request.id === requestId);
    setSelectedRequest(requestToApprove);
    setShowApproveModal(true);
  };

  const handleApprove = () => {
    let updateRequest = {
      id: selectedRequest.id,
      itsApprove: true,
    };
    mutation.mutateAsync(updateRequest);
  };
  const [dataFilter, setDataFilter] = useState(data);

  useEffect(() => {
    setDataFilter(data)
  }, [data])
  
  const numberFilter = useRef(0);
  function handleFilter(){
    const _data = data.filter((item) => (item.consecutiveNumber).includes(numberFilter.current.value))

    setDataFilter(_data);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const filteredData = data.filter(
    (request) =>
      request.itsApprove === false &&
      request.itsEndorse === true &&
      request.itsCanceled === false
  );
  return (
    <>
      <Container className="container-fluid">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">Solicitudes pendientes</h2>
        <p className="mb-4">
          Lista de solicitudes 
        </p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <p>Diríjase a la solicitud que desee aprobar o anular </p>
            <br />
            <Row className="d-flex">
              
              <Col >
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
                    aria-label="Username"
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
                    Fecha de salida {request.departureDate} con el destino de{" "}
                    {request.destinyLocation}
                  </Card.Text>
                  <div className="d-flex flex-row justify-content-between">
                    <div className="">
                      <Button
                        variant="success"
                        className="buttonSave"
                        onClick={() => handleShowApprove(request.id)}
                        style={{marginRight: '15px'}}
                      >
                        Aprobar
                      </Button>

                      <Button
                        variant="danger"
                        className="bg-gradient-danger text-light"
                        onClick={() => handleCancel(request.id)}
                      >
                        Anular
                      </Button>
                    </div>
                    <div>
                        <SeeRequest data={request}  userId={request.processes[0].userId}/>
                   
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </Container>

      <Modal show={showApproveModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitud a aprobar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedRequest && (
            <Form>
              <Form.Group>
                <Form.Label>
                  Numero de consecutivo de la solicitud a aprobar
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder={selectedRequest.id}
                  aria-label="Disabled input example"
                  disabled
                  readOnly
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonCancel" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="success" className="buttonSave" onClick={handleApprove}>
            Aprobar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ApproveRequest;
