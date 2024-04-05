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
import { create, getHoursLogDriver, deleteHour } from "../../../services/HoursLogDriverService";
import { useMutation } from "react-query";
import Swal from "sweetalert2";


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

    const initHourValue = initHour.current.value.trim();
    const finishHourValue = finishHour.current.value.trim();

    if (!workedDay.current.value.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese el día laborado'
      });
      return;
    }


    if (!initHour.current.value.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese la hora de inicio'
      });
      return;
    }

    if (!finishHour.current.value.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese la hora de finalización'
      });
      return;
    }

    if (initHourValue === finishHourValue) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La hora de finalización no puede ser igual a la hora de inicio'
      });
      return;
    }
  
    if (initHourValue >= finishHourValue) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La hora de finalización debe ser mayor que la hora de inicio'
      });
      return;
    }

    const descriptionValue = description.current.value.trim();
    if (descriptionValue && !/^[a-zA-ZáéíóúüÜÁÉÍÓÚ\s\-.,;/:()"'=#1234567890]+$/.test(descriptionValue)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese una descripción válida'
      });
      return;
    }
    try {
      let newHourLog = {
        workedDay: workedDay.current.value,
        categoryHours: hoursCategory.current.value,
        initialHour: initHour.current.value,
        finishHour: finishHour.current.value,
        description: description.current.value,
        driverLogId: driverLogId.logId,
        requestId: requestId.current.value,
      };
      mutation.mutateAsync(newHourLog);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El registro ha sido guardado exitosamente'
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {

      console.error('Error al guardar el registro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el registro'
      });
    }
  };


  const { isLoading, data, isError } = useQuery("requests", getRequests, {
    enabled: true,
  });

  const { isLoading: loadingLogs, data: dataLogs, errorLogs } = useQuery("hoursLogDriver", getHoursLogDriver);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (loadingLogs) {
    return <div>Cargando...</div>;
  }

  if (errorLogs) {
    return <div>Error</div>;
  }

  const dataLogFiltered = dataLogs.filter((item) => item.driverLogId == driverLogId.logId);


  const handleDelete = async (HourDriverId) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar',
      });
  
      if (result.isConfirmed) {
        await deleteHour(HourDriverId);
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al eliminar el control de horas:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al eliminar el registro.',
        'error'
      );
    }
  };


  return (
    <>
      <Container className="container-fluid">
        <h1 className="custom-heading h3 mb-2 text-gray-800">Control de horas</h1>
        <p>Lista de las horas laboradas del chófer</p>
        <div className="card shadow mb-4">
          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Clic en el botón para registrar las horas del chofer
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
                      <Form.Label>Categoría de horas</Form.Label>
                      <Form.Control
                        as="select"
                        defaultValue="Regulares"
                        ref={hoursCategory}
                      >
                        <option value="Regulares">Regulares</option>
                        <option value="Extra">Extra</option>
                        <option value="Sobresueldo">Sobresueldo</option>
                      </Form.Control>

                      <Form.Label>Hora final</Form.Label>
                      <Form.Control type="time" ref={finishHour} />

                      <Form.Label>Descripción</Form.Label>
                      <Form.Control type="text" ref={description} />
                    </Col>
                  </Row>

                  <Button
                    variant="sucess"
                    className="buttonSave mt-3"
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
                    <td>{(logs.initialHour).substr(11, 8)} - {(logs.finishHour).substr(11, 8)}</td>
                    <td>{logs.description}</td>
                    <td> 
                      <Button
                        variant="danger"
                        className="bg-gradient-danger mr-1 text-light"
                        onClick={() => handleDelete(logs.id)}
                        style={{marginLeft:'10px'}}
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

        <Button className="buttonCancel" >
          <Link to="/workingTimeControl">Regresar </Link>
        </Button>
       
      </Container>

    </>
  );
}

export default HoursControl;
