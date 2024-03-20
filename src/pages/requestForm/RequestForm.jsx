import React, { useRef, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { useMutation } from "react-query";
import { create } from "../../services/RequestService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../stylesheets/button.css"

function RequestForm() {
  const [showDriverOptions, setShowDriverOptions] = useState(false);

  const [itsDriver, setItsDriver] = useState(true);


  //VALIDACIONES
  const validateFormFields = (objetivo, personas, fechaSalida, fechaRegreso, lugarSalida, lugarDestino, itinerario, typeOfVehicle, observaciones) => {

    if (!objetivo.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s-]+$/.test(objetivo)) {
      return 'El objetivo es requerido y solo puede contener letras';
    }


    if (personas < 1) {
      return 'La cantidad de personas tiene que ser mayor o igual a 1';
    }

    if (!fechaSalida.trim()) {
      return 'La fecha de salida es requerida';
    }

    if (!fechaRegreso.trim()) {
      return 'La fecha de regreso es requerida';
    }

    const salidaDate = new Date(fechaSalida);
    const regresoDate = new Date(fechaRegreso);
  
    if (salidaDate.getTime() === regresoDate.getTime()) {
      return 'La fecha de salida de puede ser igual a la fecha de regreso';
    }

    if (new Date(fechaSalida) < new Date()) {
       return 'La fecha de salida debe ser igual o mayor a la fecha actual';
   
    }

    if (new Date(fechaRegreso) < new Date(fechaSalida)) {
      return 'La fecha de regreso debe ser posterior o igual a la fecha de salida';
    }

    if (!lugarSalida.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s-]+$/.test(lugarSalida)) {
      return 'El lugar de salida es requerido';
    }


    if (!lugarDestino.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s-]+$/.test(lugarDestino)) {
      return 'El lugar de destino es requerido';
    }

    if (!itinerario.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚ\s-]+$/.test(itinerario)) {
      return 'El itinerario es requerido';
    }

    if (!typeOfVehicle.trim() || !/^[a-zA-Z\s]+$/.test(typeOfVehicle)) {
      return 'El tipo de vehiculo es requerido';
    }


    if (observaciones && !/^[a-zA-Z0-9\s]*$/.test(observaciones)) {
      return 'Las observaciones solo pueden contener letras y números';
    }


    return null;
  };

  const handleSelectChange = (event) => {
    const value = event.target.value === "0";
    setItsDriver(value);
  };


  
  const mutation = useMutation("requests", create);

  const MySwal = withReactContent(Swal);


  useEffect(() => {
    if (mutation.isSuccess) {
      MySwal.fire({
        icon: "success",
        title: "Solicitud creada con éxito!",
        showConfirmButton: false,
        timer: 2000,
      }).then(mutation.reset);
      window.location.reload();
    }
  }, [mutation.isSuccess, MySwal, mutation.reset]);

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
  const driverId = useRef(0);

  function obtenerFechaYHora() {
    // Obtener la fecha actual
    const fecha = new Date();

    // Obtener los componentes de la fecha
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0
    const dia = fecha.getDate();

    // Obtener los componentes de la hora
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();

    // Formatear los componentes para que tengan dos dígitos
    const mesFormateado = mes < 10 ? "0" + mes : mes;
    const diaFormateado = dia < 10 ? "0" + dia : dia;
    const horasFormateadas = horas < 10 ? "0" + horas : horas;
    const minutosFormateados = minutos < 10 ? "0" + minutos : minutos;

    // Crear la cadena de texto con la fecha y la hora
    const cadenaFechaHora = `${anio}${mesFormateado}${diaFormateado}${horasFormateadas}${minutosFormateados}`;

    return cadenaFechaHora;
  }

  const handleSave = () => {

    const validationError = validateFormFields(

      objective.current.value,
      personsAmount.current.value,
      departureDate.current.value,
      arriveDate.current.value,
      departureLocation.current.value,
      destinyLocation.current.value,
      itinerary.current.value,
      typeOfVehicle.current.value,
      observations.current.value,

    );

    if (validationError) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: validationError,
      });
      return;
    }

    let newRequest = {
      consecutiveNumber: obtenerFechaYHora(),
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
      itsDriver: itsDriver,
      driverId: driverId.current.value,
    };
    try {
      mutation.mutate(newRequest);

    } catch (error) {

      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear la solicitud',
      });
    }

  };

  return (
    <Container>
      <Card>
        <Card.Header>Formulario de Solicitud</Card.Header>

        <Card.Body>
          <Form >
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tipo de gira</Form.Label>
                  <Form.Control
                    as="select"
                    ref={typeRequest}
                    defaultValue="Descentralizada"
                  >
                    <option value="Centralizada">Centralizada</option>
                    <option value="Descentralizada">Descentralizada</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Unidad ejecutora</Form.Label>
                  <Form.Control
                    type="text"
                    ref={executingUnit}
                    defaultValue="CH"
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Objetivo</Form.Label>
              <Form.Control as="textarea" ref={objective} required />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Número de personas</Form.Label>
              <Form.Control type="number" ref={personsAmount} required />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Fecha y hora de salida</Form.Label>
                  <Form.Control type="datetime-local" ref={departureDate} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Fecha y hora de regreso</Form.Label>
                  <Form.Control type="datetime-local" ref={arriveDate} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Lugar de salida</Form.Label>
                  <Form.Control type="text" ref={departureLocation} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Lugar de destino</Form.Label>
                  <Form.Control type="text" ref={destinyLocation} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Condición</Form.Label>
              <Form.Control
                as="select"
                ref={condition}
                defaultValue="Permanente"
              >
                <option value="Permanente">Permanente</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Itinerario</Form.Label>
              <Form.Control as="textarea" ref={itinerary} required />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Tipo de vehículo</Form.Label>
                  <Form.Select ref={typeOfVehicle} required>
                    <option select disable value="No especificado">
                      Seleccione una opción de lo contrario será generico
                    </option>
                    <option value="Automovil">Automóvil</option>
                    <option value="PickUp">Pick-Up</option>
                    <option value="Motocicleta">Motocicleta</option>
                    <option value="Buseta">Buseta</option>
                    <option value="Bus">Bus</option>
                    <option value="SUV">SUV</option>
                    <option value="Moto Electrica">
                      Motocicleta eléctrica
                    </option>
                    <option value="Auto Electrico">Automóvil eléctrico</option>
                  </Form.Select>
                </Form.Group>
              </Col>
                  <Col>
           <Form.Group className="m" controlId="formBasicSelect">
          <Form.Label>Requiere chofer</Form.Label>
          <Form.Control as="select" onChange={handleSelectChange} value={itsDriver ? "0" : "1"}>
          <option value="1">Sí</option>
          <option value="0">No</option>
         
        </Form.Control>
        </Form.Group>
       </Col>
            </Row>
            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Prioridad</Form.Label>
              <Form.Control as="select" ref={priority}>
                <option value="Objetivos administrativos, académicos-administrativos y paraacadémicos">
                  Objetivos administrativos, académicos-administrativos y
                  paraacadémicos
                </option>
                <option value="Cumplen con objetivos de cursos de docencia, según plan de estudios y programa del curso">
                  Cumplen con objetivos de cursos de docencia, según plan de
                  estudios y programa del curso
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicPassword">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control as="textarea" ref={observations} />
            </Form.Group>

            <Button
              variant="succes"
              className="buttonSave"
              onClick={handleSave}
            >
              Enviar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RequestForm;
