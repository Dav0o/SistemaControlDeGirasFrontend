import React, { useRef, useState } from "react";
import { Modal, Form, Button, Table, ModalFooter } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery } from "react-query";
import { create, getByIdVehicle, getVehicles } from "../../services/VehicleService";
import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Accordion } from "react-bootstrap";

export const Vehicles = () => {
  const mutation = useMutation("vehicles", create);


  const [vehicleData, setVehicleData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {

    fetch("/src/pages/data/vehicleJSON.json")
      .then((response) => response.json())
      .then((data) =>
        setVehicleData(data))
      .catch((error) => console.error("Error al cargar los datos", error));
  }, []);

  //reinicia la selección
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedMake('');
    setSelectedModel('');
  };

  useEffect(() => {
    if (selectedCategory) {
      const makes = Object.keys(vehicleData[selectedCategory] || {});

      console.log("Marcas disponibles:", makes);

    }
  }, [selectedCategory]);




  const [imageUrl, setImageUrl] = useState('');
  const apiKey = '6c4a708d4bdee0384fae9c67a8558f9e';

  const handleImageUpload = async (e) => {
    const imageInput = e.target.files[0];

    if (imageInput) {
      const formData = new FormData();
      formData.append('image', imageInput);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const uploadedImageUrl = data.data.url;
          setImageUrl(uploadedImageUrl);
          console.log('Url = ', uploadedImageUrl);
        } else {
          console.error('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error de solicitud', error);
      }
    }
  };
  const MySwal = withReactContent(Swal);

  {
    mutation.isError
      ? MySwal.fire({
        icon: "error",
        text: "Algo salió mal!",
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

  const [dataTable, setDataTable] = useState(null); // Estado para mantener la referencia del DataTable
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
    enabled: true,
  });

  const [validated, setValidated] = useState(false);

  const handleSave = (event) => {

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();

    } else {
      setValidated(true);
    }
    if (form.checkValidity() === true) {
      let newVehicle = {
        plate_Number: plate_Number.current.value,
        make: make.current.value,
        model: model.current.value,
        category: category.current.value,
        traction: traction.current.value,
        year: parseInt(year.current.value),
        color: color.current.value,
        capacity: parseInt(capacity.current.value),
        engine_capacity: parseInt(engine_capacity.current.value),
        mileage: parseInt(mileage.current.value),
        fuel: fuel.current.value,
        oil_Change: "2023-09-01",
        status: true,
        image: imageUrl
      };
      mutation.mutateAsync(newVehicle);
    };
  }

  const plate_Number = useRef(null);
  const make = useRef(null);
  const model = useRef(null);
  const category = useRef(null);
  const traction = useRef(null);
  const year = useRef(0);
  const color = useRef(null);
  const capacity = useRef(0);
  const engine_capacity = useRef(0);
  const mileage = useRef(0);
  const fuel = useRef(null);
  const oil_Change = useRef(null);
  const status = useRef(true);


  const handleEditClick = (vehicleId) => {
    const vehicleToEdit = data.find((vehicle) => vehicle.id === vehicleId);
    setEditingVehicle(vehicleToEdit);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdate = (event) => {

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();

    } else {
      setValidated(true);
    }
    if (form.checkValidity() === true) {

      let updatedVehicle = {
        id: editingVehicle.id,
        plate_Number: plate_Number.current.value,
        make: make.current.value,
        model: model.current.value,
        category: category.current.value,
        traction: traction.current.value,
        year: year.current.value,
        color: color.current.value,
        capacity: capacity.current.value,
        engine_capacity: engine_capacity.current.value,
        mileage: mileage.current.value,
        fuel: fuel.current.value,
        oil_Change: "2023-09-01",
        status: editingVehicle.status,
        image: imageUrl,
      };

      mutation.mutateAsync(updatedVehicle).then(() => {
        setShowEditModal(false);
      });
    };

  }
  
  useEffect(() => {
    if (editingVehicle) {
      setSelectedCategory(editingVehicle.category);
      setSelectedMake(editingVehicle.make);
      setSelectedModel(editingVehicle.model);
    }
  }, [editingVehicle]);

  const handleDisableVehicle = (vehicleId) => {
    const updatedVehicles = data.map((vehicle) =>
      vehicle.id === vehicleId ? { ...vehicle, status: false } : vehicle
    );
    handleUpdate(updatedVehicles);
    mutation.mutateAsync({ id: vehicleId, status: false });
  };
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowInfoModal(true);
  };
  const handleCloseFormModal = () => setShowFormModal(false);
  const handleShowFormModal = () => setShowFormModal(true);

  const handleCapacity = (e) => {
    const rangeCapacity = e.target.value;
    if (rangeCapacity > 80 || rangeCapacity < 1) {
      capacity.current.value = '';
    }
  };

  const handleYear = (e) => {
    const inputValue = e.target.value;


    const currentYear = new Date().getFullYear();

    if (inputValue < 1980 || inputValue > currentYear) {
      e.target.setCustomValidity('El año debe estar entre 1980 y ' + currentYear);
    } else {
      e.target.setCustomValidity('');
    }
  };



  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableVehicles", {
      retrieve: true,
      responsive: true,
      dom: "<'row' <'col-md-12 float-right'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
      buttons: [
        {
          extend: "print",
          title: "Registro Vehículos",
          titleAttr: "Imprimir",
          text: '<i class="fa-solid fa-print" aria-hidden="true"></i>',
          className: "btn btn-info",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6],
          },
          customize: function (win) {
            $(win.document.body)
              .find("tableVehicles")
              .addClass("compact")
              .css("font-size", "inherit");
            $(win.document.body).find("h1").css("text-align", "center");
            $(win.document.body).css("font-size", "9px");
          },
        },
        {
          extend: "pdf",
          title: "Registro Vehículos",
          titleAttr: "Exportar a PDF",
          text: '<i class="fa-regular fa-file-pdf" aria-hidden="true"></i>',
          className: "btn btn-danger",
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] },
          customize: function (doc) {
            doc.content[1].margin = [100, 0, 100, 0]; //left, top, right, bottom
          },
        },
        {
          extend: "excel",
          title: "Registro Vehículos",
          titleAttr: "Exportar a Excel",
          text: '<i class="fa-solid fa-file-csv"></i>',
          className: "btn btn-success",
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] },
        },
      ],
    });

    // Actualiza el estado para mantener la referencia del DataTable
    setDataTable(newDataTable);
  }, [data]); // Vuelve a inicializar el DataTable cuando los datos cambien

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }


  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Vehículos</h1>
        <p class="mb-4">Lista de vehículos</p>
        <div className="card shadow mb-4">

          {/* <div className="d-flex justify-content-between"> */}
          {/* <div>Click en el botón para crear un vehículo</div>
              <div> */}
          <div>
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Click en el botón para crear un vehículo</Accordion.Header>
                <Accordion.Body>
                  <Form validated={validated} onSubmit={handleSave}>
                    <Container>
                      <Row>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputplate_Number"
                              className="form-label">Placa</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese la placa"
                              name="plate_Number"
                              ref={plate_Number}
                              required
                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">El campo es requerido.</div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputCategory"
                              className="form-label">Categoría</label>
                            <select class="form-select" id="inputCategory"
                              value={selectedCategory}
                              onChange={handleCategoryChange}
                              ref={category}
                              required>
                              <option select disable value="">Seleccione una opción</option>
                              <option value="Automovil">Automóvil</option>
                              <option value="PickUp">Pick-Up</option>
                              <option value="Motocicleta">Motocicleta</option>
                              <option value="Buseta">Buseta</option>
                              <option value="Bus">Bus</option>
                              <option value="SUV">SUV</option>
                              <option value="Moto Electrica">Motocicleta eléctrica</option>
                              <option value="Auto Electrico">Automóvil eléctrico</option>
                            </select>
                            <div class="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputMake"
                              className="form-label">Marca</label>
                            <select class="form-select" value={selectedMake}
                              onChange={(e) => setSelectedMake(e.target.value)}
                              required
                              ref={make}>
                              <option select disable value="">Seleccione una opción</option>

                              {Object.keys(vehicleData[selectedCategory] || {}).map((make) => (
                                <option key={make} value={make}>
                                  {make}
                                </option>
                              ))}
                            </select>
                            <div class="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputModel"
                              className="form-label">Modelo</label>
                            <select class="form-select" id="inputModel"
                              value={selectedModel}
                              onChange={(e) => setSelectedModel(e.target.value)}
                              required
                              ref={model} >
                              <option select disable value="">Seleccione una opción</option>
                              {vehicleData[selectedCategory] &&
                                vehicleData[selectedCategory][selectedMake] &&
                                vehicleData[selectedCategory][selectedMake].map((model) => (
                                  <option key={model} value={model}>
                                    {model}
                                  </option>
                                ))}
                            </select>
                            <div class="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputYear"
                              className="form-label">Año</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Ingrese el año"
                              name="year"
                              ref={year}
                              onChange={handleYear}
                              required

                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">El año debe estar entre 1980 y el año actual.</div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputColor"
                              className="form-label">Color</label>
                            <select class="form-select" id="inputColor" ref={color} required>
                              <option select disable value="">Seleccione una opción</option>
                              <option value="Blanco">Blanco</option>
                              <option value="Negro">Negro</option>
                              <option value="Gris">Gris</option>
                              <option value="Rojo">Rojo</option>
                              <option value="Azul">Azul</option>
                              <option value="Verde">Verde</option>
                              <option value="Plateado">Plateado</option>
                              <option value="Dorado">Dorado</option>
                            </select>
                            <div class="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputCapacity"
                              className="form-label">Capacidad</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Ingrese la capacidad"
                              name="capacity"
                              ref={capacity}
                              minLength="1"
                              maxLength="70"
                              size="2"
                              onInput={handleCapacity}
                              required


                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">Digite un número que se encuentre en el rango de 1 a 80.</div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputFuel"
                              className="form-label">Gasolina</label>
                            <select class="form-select" id="inputFuel" ref={fuel} required>
                              <option select disable value="">Seleccione una opción</option>
                              <option value="Regular">Regular</option>
                              <option value="Super">Super</option>
                              <option value="Diesel">Diésel</option>
                              <option value="Electrico">Eléctrico</option>
                            </select>
                            <div class="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputTraction"
                              className="form-label">Tracción</label>
                            <select class="form-select" id="inputTraction" ref={traction} required>
                              <option select disable value="">Seleccione una opción</option>
                              <option value="FWD">Tracción delantera (FWD)</option>
                              <option value="4X4">Tracción en las cuatro ruedas(4X4)</option>
                              <option value="RWD">Tracción trasera (RWD)</option>
                              <option value="AWD">Tracción total (AWD) </option>
                              <option value="FR-AWD">Tracción delantera (FR-AWD)</option>
                              <option value="part-time 4WD">Tracción integral (part-time 4WD)</option>
                              <option value="full-time 4WD">Tracción integral (full-time 4WD)</option>
                            </select>
                            <div class="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputEngine_Capacity"
                              className="form-label">Cilindraje</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Ingrese el cilindraje"
                              name="engine_capacity"

                              ref={engine_capacity}
                              required
                              min="0"


                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">El campo es requerido.</div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputMileage"
                              className="form-label">Kilometraje</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Ingrese el kilometraje"
                              name="Mileage"

                              ref={mileage}
                              required
                              min="0"

                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">El campo es requerido.</div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputOil_Change"
                              className="form-label">Cambio de aceite</label>
                            <input
                              type="date"
                              className="form-control"
                              name="Oil_Change"

                              ref={oil_Change}
                              required

                            />
                          </div>

                        </Col>
                      </Row>
                      {/*               
                     <div className="valid-feedback"></div>
                     <div className="invalid-feedback">El campo es requerido.</div> */}
                      {/* </div>
                   </div> */}
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Imagen</Form.Label>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="customFile"

                                onChange={handleImageUpload}
                              />
                              <label className="custom-file-label" htmlFor="customFile">
                              </label>
                            </div>
                            {imageUrl && <img src={imageUrl} alt="Imagen subida" className="uploadedImg"
                              style={{ maxWidth: '200px', maxHeight: '200px' }} />}
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* </Modal.Body>
                  
                   <ModalFooter> */}
                      <Button variant="danger"
                        onClick={handleCloseFormModal}>
                        Cancelar
                      </Button>

                      <Button
                        variant="success"
                        className="bg-gradient-success" onClick={handleSave}>

                        Guardar
                      </Button>
                    </Container>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>



          {/* </ModalFooter>
                
                <Button
                  variant="success"
                  className="bg-gradient-success text-light
                  "
                  onClick={handleShowFormModal}
                >
                  {" "}
                  <i class="bi bi-plus-square"></i>
                </Button>
              </div>
            </div> */}


          <div className="card-body">
            <Table
              className="table table-bordered"
              striped="columns"
              id="tableVehicles"
            >
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Color</th>
                  <th>Capacidad</th>
                  <th>Año</th>
                  {/* <th>Imagen</th>  */}
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.plate_Number}</td>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.color}</td>
                    <td>{vehicle.capacity}</td>
                    <td>{vehicle.year}</td>
                    {/* <img src={vehicle.image}
                      alt="Vehicles"
                      style={{ width: '150px', height: '150px' }} />   
 */}

                    <td>
                      <Button
                        variant="warning"
                        className="bg-gradient-warning mr-1 text-light"
                        onClick={() => handleEditClick(vehicle.id)}
                      >
                        <i class="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="info"
                        className="bg-gradient-info text-light"
                        onClick={() => handleShowInfoModal(vehicle)}
                      >
                        <i class="bi bi-info-square"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      <Modal show={showFormModal} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear vehiculo</Modal.Title>
        </Modal.Header>

        <Modal.Body>


          <div className="col-md-6">
            <Row>
              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputplate_Number"
                    className="form-label">Placa</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese la placa"
                    name="plate_Number"

                    ref={plate_Number}
                    required
                  />
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">El campo es requerido.</div>
                </div>

              </Col>
              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputMake"
                    className="form-label">Marca</label>
                  <select class="form-select" id="inputMake" data-live-search="true" ref={make} required>
                    <option select disable value="">Seleccione una opción</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Tucson">Tucson</option>
                    <option value="Acent">Accent</option>
                    <option value="Chevrolet">Chevrolet</option>
                    <option value="Hiunday">Hiunday</option>
                    <option value="Suzuki">Suzuki</option>

                  </select>
                  <div class="invalid-feedback">
                    Por favor, seleccione una opción.
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputModel"
                    className="form-label">Modelo</label>
                  <select class="form-select" id="inputModel" data-live-search="true" ref={model} required>
                    <option select disable value="">Seleccione una opción</option>
                    <option value="Hilux">Hilux</option>
                    <option value="Yaris">Yaris</option>
                    <option value="RAV4">RAV4</option>
                    <option value="Corolla">Corolla</option>
                    <option value="LandCruiser">LandCruiser</option>
                    <option value="Suzuki">Suzuki</option>

                  </select>
                  <div class="invalid-feedback">
                    Por favor, seleccione una opción.
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputYear"
                    className="form-label">Año</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ingrese el año"
                    name="year"
                    ref={year}
                    required
                    min="1980"
                    max="2023"
                  />
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">El campo es requerido.</div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputCategory"
                    className="form-label">Categoría</label>
                  <select class="form-select" id="inputCategoria" ref={category} required>
                    <option select disable value="">Seleccione una opción</option>
                    <option value="Automovil">Automóvil</option>
                    <option value="PickUp">Pick-Up</option>
                    <option value="Motocicleta">Motocicleta</option>
                    <option value="Buseta">Buseta</option>
                    <option value="Bus">Bus</option>
                    <option value="SUV">SUV</option>
                    <option value="Moto Electrica">Motocicleta eléctrica</option>
                    <option value="Auto Electrico">Automóvil eléctrico</option>
                  </select>
                  <div class="invalid-feedback">
                    Por favor, seleccione una opción.
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputColor"
                    className="form-label">Color</label>
                  <select class="form-select" id="inputColor" ref={color} required>
                    <option select disable value="">Seleccione una opción</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Negro">Negro</option>
                    <option value="Gris">Gris</option>
                    <option value="Rojo">Rojo</option>
                    <option value="Azul">Azul</option>
                    <option value="Verde">Verde</option>
                    <option value="Plateado">Plateado</option>
                    <option value="Dorado">Dorado</option>
                  </select>
                  <div class="invalid-feedback">
                    Por favor, seleccione una opción.
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputCapacity"
                    className="form-label">Capacidad</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ingrese la capacidad"
                    name="capacity"

                    ref={capacity}
                    required
                    min="1"
                    max="70"
                    pattern="[0-9]{2}"
                  />
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">El campo es requerido.</div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputFuel"
                    className="form-label">Gasolina</label>
                  <select class="form-select" id="inputFuel" ref={fuel} required>
                    <option select disable value="">Seleccione una opción</option>
                    <option value="Regular">Regular</option>
                    <option value="Super">Super</option>
                    <option value="Diesel">Diésel</option>
                    <option value="Electrico">Eléctrico</option>
                  </select>
                  <div class="invalid-feedback">
                    Por favor, seleccione una opción.
                  </div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputTraction"
                    className="form-label">Tracción</label>
                  <select class="form-select" id="inputTraction" ref={traction} required>
                    <option select disable value="">Seleccione una opción</option>
                    <option value="FWD">Tracción delantera (FWD)</option>
                    <option value="4X4">Tracción en las cuatro ruedas(4X4)</option>
                    <option value="RWD">Tracción trasera (RWD)</option>
                    <option value="AWD">Tracción total (AWD) </option>
                    <option value="FR-AWD">Tracción delantera (FR-AWD)</option>
                    <option value="part-time 4WD">Tracción integral (part-time 4WD)</option>
                    <option value="full-time 4WD">Tracción integral (full-time 4WD)</option>
                  </select>
                  <div class="invalid-feedback">
                    Por favor, seleccione una opción.
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputEngine_Capacity"
                    className="form-label">Cilindraje</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ingrese el cilindraje"
                    name="engine_capacity"

                    ref={engine_capacity}
                    required
                    min="0"
                    pattern="[0-9]"
                  />
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">El campo es requerido.</div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputMileage"
                    className="form-label">Kilometraje</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ingrese el kilometraje"
                    name="Mileage"
                    ref={mileage}
                    required
                    min="0"

                  />
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">El campo es requerido.</div>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-3 mt-3">
                  <label htmlFor="inputOil_Change"
                    className="form-label">Cambio de aceite</label>
                  <input
                    type="date"
                    className="form-control"
                    name="Oil_Change"

                    ref={oil_Change}
                    required

                  />
                </div>

              </Col>
            </Row>
            {/*               
              <div className="valid-feedback"></div>
              <div className="invalid-feedback">El campo es requerido.</div> */}
            {/* </div>
            </div> */}
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Imagen</Form.Label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"

                      onChange={handleImageUpload}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                    </label>
                  </div>
                  {imageUrl && <img src={imageUrl} alt="Imagen subida" className="uploadedImg"
                    style={{ maxWidth: '200px', maxHeight: '200px' }} />}
                </Form.Group>
              </Col>
            </Row>
          </div>

        </Modal.Body>

        <ModalFooter>
          <Button variant="danger" onClick={handleCloseFormModal}>
            Cancelar
          </Button>
          <Button
            variant="success"
            className="bg-gradient-success" onClick={handleSave}>


            Guardar
          </Button>
        </ModalFooter>


      </Modal>



      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar vehículo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form validated={validated} onSubmit={handleUpdate}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Placa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese la placa"
                      defaultValue={
                        editingVehicle ? editingVehicle.plate_Number : ""
                      }
                      ref={plate_Number}
                      required
                    />
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">El campo es requerido</div>

                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Marca</Form.Label>
                    <select 
                    class="form-select"
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      required
                      ref={make}
                      >
                      <option value="">Seleccione una opción</option>
                      {Object.keys(vehicleData[selectedCategory] || {}).map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>
                  </Form.Group>


                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el año"
                    defaultValue={editingVehicle ? editingVehicle.year : ""}
                    ref={year}
                    required
                    onChange={handleYear}
                  >
                  </Form.Control>
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">El año debe estar entre 1980 y el año actual.</div>


                  <Col>

                  </Col>
                  <Form.Group>
                    <Form.Label>Tracción</Form.Label>
                    <Form.Control as="select" ref={traction} defaultValue={editingVehicle ? editingVehicle.traction : ""}>
                      <option value="FWD">Tracción delantera (FWD)</option>
                      <option value="4X4">Tracción en las cuatro ruedas (4X4)</option>
                      <option value="RWD">Tracción trasera (RWD)</option>
                      <option value="AWD">Tracción total (AWD) </option>
                      <option value="FR-AWD">Tracción delantera (FR-AWD)</option>
                      <option value="part-time 4WD">Tracción integral (part-time 4WD)</option>
                      <option value="full-time 4WD">Tracción integral (full-time 4WD)</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Cilindraje</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el cilindraje"
                      defaultValue={
                        editingVehicle ? editingVehicle.engine_capacity : ""
                      }
                      ref={engine_capacity}
                      required
                      min="0"
                    >

                    </Form.Control>
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">El campo es requerido</div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Gasolina</Form.Label>
                    <Form.Control as="select" ref={fuel} defaultValue={editingVehicle ? editingVehicle.fuel : ""}>
                      <option value="Regular">Regular</option>
                      <option value="Super">Super</option>
                      <option value="Diesel">Diésel</option>
                      <option value="Electrico">Eléctrico</option>
                    </Form.Control>
                  </Form.Group>

                  {/* <Form.Group>
                  <Form.Label>Imagen</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la imagen"
                    defaultValue={
                      editingVehicle ? editingVehicle.image : ""
                    }
                    ref={image}
                  />
                </Form.Group> */}
                </Col>


                <Col>
                  <Form.Group>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control as="select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      ref={category}
                      defaultValue={editingVehicle ? editingVehicle.category : ""} required>
                      <option value="Automovil">Automóvil</option>
                      <option value="PickUp">Pick-Up</option>
                      <option value="Motocicleta">Motocicleta</option>
                      <option value="Buseta">Buseta</option>
                      <option value="Bus">Bus</option>
                      <option value="SUV">SUV</option>
                      <option value="Moto Electrica">Motocicleta eléctrica</option>
                      <option value="Auto Electrico">Automóvil eléctrico</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Modelo</Form.Label>
                    <select
                     class="form-select" id="inputModel"
                     value={selectedModel}
                     onChange={(e) => setSelectedModel(e.target.value)}
                      required
                      ref={model}
                      >
                     <option value="">Seleccione una opción</option>
                      {vehicleData[selectedCategory] &&
                        vehicleData[selectedCategory][selectedMake] &&
                        vehicleData[selectedCategory][selectedMake].map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                    </select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Control as="select" ref={color} defaultValue={editingVehicle ? editingVehicle.color : ""}>
                      <option value="Blanco">Blanco</option>
                      <option value="Negro">Negro</option>
                      <option value="Gris">Gris</option>
                      <option value="Rojo">Rojo</option>
                      <option value="Azul">Azul</option>
                      <option value="Verde">Verde</option>
                      <option value="Plateado">Plateado</option>
                      <option value="Dorado">Dorado</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Capacidad</Form.Label>
                    <Form.Control
                      type="text"
                      id="capacity"
                      placeholder="Ingrese la capacidad"
                      defaultValue={editingVehicle ? editingVehicle.capacity : ""}
                      ref={capacity}
                      onChange={handleCapacity}
                      required
                    />
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">La capacidad se debe encontrar en el rango de 1 a 80.</div>

                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Kilometraje</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el kilometraje"
                      defaultValue={editingVehicle ? editingVehicle.mileage : ""}
                      ref={mileage}
                      required
                      min="0"
                      pattern="[^/*-+]+" title="valores inválidos"
                    />
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">El campo es requerido</div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Cambio de aceite</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Ingrese la fecha"
                      defaultValue={
                        editingVehicle ? editingVehicle.oil_Change : ""
                      }
                      ref={oil_Change}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Form >
        </Modal.Body >

        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button
            variant="warning"
            className="bg-gradient-warning text-light"
            onClick={handleUpdate}
          >
            Actualizar
          </Button>
          {/* <Button
            variant="danger"
            onClick={() => handleDisableVehicle(editingVehicle.id)}
          >
            {" "}
            <span class="material-symbols-outlined">visibility</span>{" "}
          </Button> */}
        </Modal.Footer>
      </Modal >


      <Modal size="lg" show={showInfoModal} onHide={handleCloseInfoModal} centered>
        <Modal.Header closeButton>

          <Modal.Title>Información del Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {selectedVehicle && (
            <div>
              <Row>
                <Col md={3}>
                  <div>
                    <strong>Placa:</strong> {selectedVehicle.plate_Number}
                  </div>
                  <div>
                    <strong>Marca:</strong> {selectedVehicle.make}
                  </div>
                  <div>
                    <strong>Modelo:</strong> {selectedVehicle.model}
                  </div>
                  <div>
                    <strong>Capacidad:</strong> {selectedVehicle.capacity}
                  </div>
                  <div>
                    <strong>Tracción:</strong> {selectedVehicle.traction}
                  </div>
                  <div>
                    <strong>Cilindraje:</strong> {selectedVehicle.engine_capacity}
                  </div>
                  <div>
                    <strong>Gasolina:</strong> {selectedVehicle.fuel}
                  </div>
                  <div>
                    <strong>Año:</strong> {selectedVehicle.year}
                  </div>
                  <div>
                    <strong>Color:</strong> {selectedVehicle.color}
                  </div>
                  <div>
                    <strong>Categoría:</strong> {selectedVehicle.category}
                  </div>
                  <div>
                    <strong>Kilometraje:</strong> {selectedVehicle.mileage}
                  </div>
                  <div>
                    <strong>Cambio de Aceite:</strong> {selectedVehicle.oil_Change}
                  </div>
                  <div>
                    <strong>Estado:</strong>{" "}
                    {selectedVehicle.status ? "Habilitado" : "Deshabilitado"}
                  </div>
                </Col>
                <Col md={3} className="text-right">

                  <strong>Imagen</strong>
                  {selectedVehicle.image && (
                    <img
                      src={selectedVehicle.image}
                      style={{ maxWidth: '400%', maxHeight: '400px' }}
                    />
                  )}
                </Col>
              </Row>
            </div>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfoModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  )
};


export default Vehicles;