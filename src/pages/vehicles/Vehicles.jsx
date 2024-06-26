import React, { useRef, useState } from "react";
import { Modal, Form, Button, Table, ModalFooter, Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery } from "react-query";
import {changeStatus, create, getByIdVehicle, getVehicles,} from "../../services/VehicleService";
import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Accordion } from "react-bootstrap";
import "../../stylesheets/button.css";
import "../../stylesheets/generalDesign.css";



export const Vehicles = () => {
  const mutation = useMutation("vehicles", create);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [plateNumberError, setPlateNumberError] = useState("");

  const [newImages, setNewImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const apiKey = "85a713159de230240e6eeb0c37ca3d34";

  
  const handleImageUpload = async (e) => {
    const imageInput = e.target.files[0];

    if (imageInput) {
      const formData = new FormData();
      formData.append("image", imageInput);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const uploadedImageUrl = data.data.url;
          setImageUrl(uploadedImageUrl);
          console.log("Url = ", uploadedImageUrl);
        } else {
          console.error("Error al subir la imagen");
        }
      } catch (error) {
        console.error("Error de solicitud", error);
      }
    }
  };

/////////////////////editar imagen//////////////////
const handleEditImageUpload = async (e) => {
  const imageInput = e.target.files[0];

  if (imageInput) {
    try {
      const formData = new FormData();
      formData.append('image', imageInput);

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

        setNewImages((prevImages) => [...prevImages, uploadedImageUrl]);

        console.log('Url = ', uploadedImageUrl);
      } else {
        console.error('error al subir la imagen');
      }
    } catch (error) {
      console.error('error de solicitud', error);
    }
  }
};
///////////////////////////////////////////////////



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



    //VALIDACIONES
    const validateFields = (plate_Number, category, make,model, year,color,capacity,
                               fuel, traction, engine_capacity, mileage
       ) => {
     
        const plateNumberRegex = /^[A-Za-z0-9-]{3,8}$/;
        if (!plateNumberRegex.test(plate_Number)) {
            return "La placa es requerida y debe tener entre 3 y 8 caracteres alfanuméricos.";
        }

        
      if (!category) {
        return "La categoría requerida.";
      }
      
      const makeRegex = /^[A-Za-z]{3,20}$/;
      if (!make || !makeRegex.test(make)) {
        return "La marca es requerida, solo permite letras.";
      }


    const modelRegex = /^[A-Za-z0-9]{3,30}$/;
      if (!model || !modelRegex.test(model)) {
        return "Digite un formato válido para el modelo, acepta números-letras.";
      }
      
      if (!year || isNaN(year) || year < 1980 || year > new Date().getFullYear()) {
        return "El año debe ser entre 1980 y el año actual.";
      }
    
      if (!color) {
        return "Color es un campo requerido.";
      }
    
      if (!capacity || isNaN(capacity) || capacity < 1 || capacity > 80) {
        return "la capacidad debe ser entre 1 y 80.";
      }
      if (!fuel) {
        return "La gasolina es un campo requerido.";
      }
    
      if (!traction) {
        return "La tracción es un campo requerido.";
      }
    
      const digitsOnlyRegex = /^\d+$/;
      if (!engine_capacity || !digitsOnlyRegex.test(engine_capacity) ||  parseInt(engine_capacity) < 0) {
        return "El cilindraje solo acepta números.";
      }
    
     
      if (!mileage || !digitsOnlyRegex.test(mileage)  || parseInt(mileage) < 0) {
        return "El kilometraje solo acepta números.";
      }

      return null; 
    };
    
    
  const handleSave = async (event) => {
      event.preventDefault();

  
    const validationError = validateFields(
    
      plate_Number.current.value,
      category.current.value,
      make.current.value,
      model.current.value,
      year.current.value,
      color.current.value,
      capacity.current.value,
      fuel.current.value,
      traction.current.value,
      engine_capacity.current.value,
      mileage.current.value,

    );

    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: validationError,
      });
      return;
    }

    let updatedImageString = '';
    if (Array.isArray(imageUrl)) {
      updatedImageString = imageUrl.filter(Boolean).join(',');
    } else {
      updatedImageString = imageUrl || '';
    }

    let newVehicle = {
      plate_Number: plate_Number.current.value,
     category: category.current.value,
      make: make.current.value,
      model: model.current.value,
      year: parseInt(year.current.value),
      color: color.current.value,
      capacity: parseInt(capacity.current.value),
      fuel: fuel.current.value,
      traction: traction.current.value,
      engine_capacity: parseInt(engine_capacity.current.value),
      mileage: parseInt(mileage.current.value), 
      oil_Change: oil_Change.current.value,
      status: true,
      image: updatedImageString,
    };
    const result = await create(newVehicle);
  if (result.error) {
  
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: result.error,
    });
  } else {
    
    Swal.fire({
      icon: 'success',
      title: 'Vehículo creado',
      text: 'El vehículo se ha creado exitosamente',
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    });
  }
};





  const handleEditClick = (vehicleId) => {
    const vehicleToEdit = data.find((vehicle) => vehicle.id === vehicleId);
    setEditingVehicle(vehicleToEdit);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdate = (event) => {

    const updatedImages = [...editingVehicle.image.split(','), ...newImages];
    const updatedImageString = updatedImages.filter(Boolean).join(',');


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
      oil_Change: oil_Change.current.value,
      status: editingVehicle.status,
      image: updatedImageString,
    };

  try{

    mutation.mutateAsync(updatedVehicle).then(() => {

      setShowEditModal(false);
      
    });
  
  Swal.fire({
    icon: 'success',
    title: 'Vehículo editado',
    text: 'El vehículo se ha editado exitosamente',
  });

  setTimeout(() => {
    window.location.reload();
  }, 2000); 
  
} catch (error) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Hubo un error al editar el vehículo',
  });
}
  };


   const removeImage = (indexToRemove) => {

    setEditingVehicle((prevVehicle) => {
      const updatedImages = prevVehicle.image.split(',');
      updatedImages.splice(indexToRemove, 1);
      const serializedImages = updatedImages.join(',');

      return {
        ...prevVehicle,
        image: serializedImages,
      };
    });


    Swal.fire('Imagen removida', 'Para confirmar su eliminación presione el botón "Actualizar"', 'success');

  };

  ////////////////////////////////////////////////

  useEffect(() => {
    if (editingVehicle) {
      setSelectedCategory(editingVehicle.category);
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



  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableVehicles", {
      language: {
        processing:     "Procesando...",
        search:         "Buscar:",
        lengthMenu:    "Mostrar _MENU_ elementos",
        info:           "Mostrando elementos _START_ al _END_ de un total de _TOTAL_ elementos",
        infoEmpty:      "Mostrando 0 elementos ",
        infoFiltered:   "(filtrado de _MAX_ elementos en total)",
        infoPostFix:    "",
        loadingRecords: "Cargando...",
        zeroRecords:    "No se encontraron elementos",
        emptyTable:     "No hay datos disponibles en la tabla",
        paginate: {
            first:      "Primero",
            previous:   "Anterior",
            next:       "Siguiente",
            last:       "Último"
        },
        aria: {
            sortAscending:  ": activar para ordenar la columna de manera ascendente",
            sortDescending: ": activar para ordenar la columna de manera descendente"
        }
    },
      retrieve: true,
      responsive: true,
      bLengthChange: false,
      dom: "lfBrtip",
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
            doc.content[1].margin = [100, 0, 100, 0]; 
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

  const mutationStatus = useMutation("vehicles", changeStatus,{
    onSuccess:() => {
      // Invalidar y refetch los datos de vehículos después de una mutación exitosa
      queryClient.invalidateQueries('vehicles');
      window.location.reload()
    },
  });


  const handleStatus = async (id) => {
   
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea cambiar el estado del vehículo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar estado',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
      mutationStatus.mutateAsync(id);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milisegundos = 2 segundos
      }
    });
  };

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container className="container-fluid">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">Vehículos</h2>
        <p className="mb-4">Lista de vehículos</p>
        <div className="card shadow mb-4">
       
          <div>
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Clic en el botón para crear un vehículo
                </Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleSave}>
                    <Container>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label
                              htmlFor="inputplate_Number"
                              className="form-label"
                            >
                              Placa
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese la placa"
                              name="plate_Number"
                              ref={plate_Number}
                              required
                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">
                              El campo es requerido.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label
                              htmlFor="inputCategory"
                              className="form-label"
                            >
                              Categoría
                            </label>
                            <select
                              className="form-select"
                              id="inputCategory"
                              ref={category}
                              required
                            >
                              <option select disable value="">
                                Seleccione una opción
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
                              <option value="Auto Electrico">
                                Automóvil eléctrico
                              </option>
                            </select>
                            <div className="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputMake" className="form-label">
                              Marca
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese la marca"
                              name="plate_Number"
                              ref={make}
                              required
                            />
                            <div class="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputModel" className="form-label">
                              Modelo
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese el modelo"
                              name="plate_Number"
                              ref={model}
                              required
                            />
                            <div className="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputYear" className="form-label">
                              Año
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Ingrese el año"
                              name="year"
                              ref={year}
                              required
                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">
                              El año debe estar entre 1980 y el año actual.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputColor" className="form-label">
                              Color
                            </label>
                            <select
                              className="form-select"
                              id="inputColor"
                              ref={color}
                              required
                            >
                              <option select disable value="">
                                Seleccione una opción
                              </option>
                              <option value="Blanco">Blanco</option>
                              <option value="Negro">Negro</option>
                              <option value="Gris">Gris</option>
                              <option value="Rojo">Rojo</option>
                              <option value="Azul">Azul</option>
                              <option value="Verde">Verde</option>
                              <option value="Plateado">Plateado</option>
                              <option value="Dorado">Dorado</option>
                            </select>
                            <div className="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label
                              htmlFor="inputCapacity"
                              className="form-label"
                            >
                              Capacidad
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Ingrese la capacidad"
                              name="capacity"
                              ref={capacity}
                              required
                            />
                            <div className="valid-feedback"></div>
                            <div className="invalid-feedback">
                              Digite un número que se encuentre en el rango de 1
                              a 80.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label htmlFor="inputFuel" className="form-label">
                              Gasolina
                            </label>
                            <select
                              class="form-select"
                              id="inputFuel"
                              ref={fuel}
                              required
                            >
                              <option select disable value="">
                                Seleccione una opción
                              </option>
                              <option value="Regular">Regular</option>
                              <option value="Super">Super</option>
                              <option value="Diesel">Diésel</option>
                              <option value="Electrico">Eléctrico</option>
                            </select>
                            <div className="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label
                              htmlFor="inputTraction"
                              className="form-label"
                            >
                              Tracción
                            </label>
                            <select
                              className="form-select"
                              id="inputTraction"
                              ref={traction}
                              required
                            >
                              <option select disable value="">
                                Seleccione una opción
                              </option>

                              <option value="4X4">
                                Tracción en las cuatro ruedas(4X4)
                              </option>
                              <option value="4X2">
                                Tracción de dos ruedas(4X2)
                              </option>
                            </select>
                            <div className="invalid-feedback">
                              Por favor, seleccione una opción.
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label
                              htmlFor="inputEngine_Capacity"
                              className="form-label"
                            >
                              Cilindraje
                            </label>
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
                            <div className="invalid-feedback">
                              El campo es requerido.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label
                              htmlFor="inputMileage"
                              className="form-label"
                            >
                              Kilometraje
                            </label>
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
                            <div className="invalid-feedback">
                              El campo es requerido.
                            </div>
                          </div>
                        </Col>

                        <Col md={4}>
                          <div className="mb-3 mt-3">
                            <label
                              htmlFor="inputOil_Change"
                              className="form-label"
                            >
                              Próximo cambio de aceite
                            </label>
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
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              ></label>
                            </div>
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt="Imagen subida"
                                className="uploadedImg"
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                              />
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

         
                      <Button
                        variant="success"
                        className="buttonSave"
                        onClick={handleSave}
                      >
                        Guardar
                      </Button>
                    </Container>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

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
                        style={{marginRight: '20px'}}
                        onClick={() => handleEditClick(vehicle.id)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="info"
                        className="bg-gradient-info text-light"
                        onClick={() => handleShowInfoModal(vehicle)}
                      >
                        <i className="bi bi-info-square"></i>
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
        show={showEditModal}
        onHide={handleCloseEditModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar vehículo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form onSubmit={handleUpdate}>
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
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Marca</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese la marca"
                      defaultValue={editingVehicle ? editingVehicle.make : ""}
                      ref={make}
                      required
                    />
                  </Form.Group>

                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el año"
                    defaultValue={editingVehicle ? editingVehicle.year : ""}
                    ref={year}
                    required 
                  ></Form.Control>
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">
                    El año debe estar entre 1980 y el año actual.
                  </div>

                  <Col></Col>
                  <Form.Group>
                    <Form.Label>Tracción</Form.Label>
                    <Form.Control
                      as="select"
                      ref={traction}
                      defaultValue={
                        editingVehicle ? editingVehicle.traction : ""
                      }
                    >
                      <option value="4X4">
                        Tracción en las cuatro ruedas (4X4)
                      </option>
                      <option value="RX2">Tracción en dos ruedas(4X2)</option>
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
                    ></Form.Control>
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">
                      El campo es requerido
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Gasolina</Form.Label>
                    <Form.Control
                      as="select"
                      ref={fuel}
                      defaultValue={editingVehicle ? editingVehicle.fuel : ""}
                    >
                      <option value="Regular">Regular</option>
                      <option value="Super">Super</option>
                      <option value="Diesel">Diésel</option>
                      <option value="Electrico">Eléctrico</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                  <Form.Label>Imágenes </Form.Label>
                  <div className='styled-table'>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '10px' }}>
                      {editingVehicle && editingVehicle.image && editingVehicle.image.split(',').map((imageUrl, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <td>
                            <img
                              src={imageUrl}
                              alt={`Imagen ${index}`}
                              style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                          </td>
                          <td>
                            <Button variant='danger' onClick={() => removeImage(index)}>
                              Eliminar
                            </Button>
                          </td>
                        </div>
                      ))}
                    </div>
                  </div>
                  <br>
                  </br>
                  <input type='file' accept='image/*' className='form-control-file' onChange={handleEditImageUpload} multiple />
                  {newImages.map((imageUrl, index) => (
                    <div key={index}>Nueva imagen {index + 1}</div>
                  ))}
                </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control
                      as="select"
                      ref={category}
                      defaultValue={
                        editingVehicle ? editingVehicle.category : ""
                      }
                      required
                    >
                      <option value="Automovil">Automóvil</option>
                      <option value="PickUp">Pick-Up</option>
                      <option value="Motocicleta">Motocicleta</option>
                      <option value="Buseta">Buseta</option>
                      <option value="Bus">Bus</option>
                      <option value="SUV">SUV</option>
                      <option value="Moto Electrica">
                        Motocicleta eléctrica
                      </option>
                      <option value="Auto Electrico">
                        Automóvil eléctrico
                      </option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el modelo"
                      defaultValue={editingVehicle ? editingVehicle.model : ""}
                      ref={model}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      as="select"
                      ref={color}
                      defaultValue={editingVehicle ? editingVehicle.color : ""}
                    >
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
                      defaultValue={
                        editingVehicle ? editingVehicle.capacity : ""
                      }
                      ref={capacity}
                      required
                    />
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">
                      La capacidad se debe encontrar en el rango de 1 a 80.
                    </div>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Kilometraje</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el kilometraje"
                      defaultValue={
                        editingVehicle ? editingVehicle.mileage : ""
                      }
                      ref={mileage}
                      required
                      min="0"
                      pattern="[^/*-+]+"
                      title="valores inválidos"
                    />
                    <div className="valid-feedback"></div>
                    <div className="invalid-feedback">
                      El campo es requerido
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Cambio de aceite</Form.Label>
                    <Form.Control
                      type="datetime-local"
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
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button className="buttonCancel" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button
           
            className="buttonSave"
            variant="success"
            onClick={handleUpdate}
          >
            Actualizar
          </Button>
         
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={showInfoModal}
        onHide={handleCloseInfoModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Información del vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVehicle && (
            <div>
              <Row>
                <Col md={4}>
                <p style={{color: 'black'}}>
                    <strong>Placa:</strong> {selectedVehicle.plate_Number}
                  </p>
                  </Col>

                  <Col md={4}> 
                  <p style={{color: 'black'}}>
                    <strong>Categoría:</strong> {selectedVehicle.category}
                    </p>
                    </Col>

                  <Col md={4}>
                  <p style={{color: 'black'}}>
                    <strong>Marca:</strong> {selectedVehicle.make}
                    </p>
                    </Col>
                    <Col md={4}>
                  <p style={{color: 'black'}}>
                    <strong>Modelo:</strong> {selectedVehicle.model}
                    </p>
                    </Col>

                    <Col md={4}> 
                  <p style={{color: 'black'}}>
                    <strong>Año:</strong> {selectedVehicle.year}
                    </p>
                    </Col>
                    <Col md={4}> 
                  <p style={{color: 'black'}}>
                    <strong>Color:</strong> {selectedVehicle.color}
                    </p>
                    </Col>

                    <Col md={4}>
                  <p style={{color: 'black'}}>
                    <strong>Capacidad:</strong> {selectedVehicle.capacity}
                    </p>
                    </Col>
                
                    <Col md={4}>
                   <p style={{color: 'black'}}>
                    <strong>Gasolina:</strong> {selectedVehicle.fuel}
                    </p>
                    </Col>
          
                    <Col md={4}>
                  <p style={{color: 'black'}}>
                    <strong>Tracción:</strong> {selectedVehicle.traction}
                    </p>
                    </Col>
                    </Row>
                    <Row>
                    <Col md={4}>
                  <p style={{color: 'black'}}>
                    <strong>Cilindraje:</strong>{" "}
                    {selectedVehicle.engine_capacity}
                    </p>
                    </Col>
                  
                    <Col md={4}> 
                  <p style={{color: 'black'}}>
                    <strong>Kilometraje:</strong> {selectedVehicle.mileage}
                    </p>
                    </Col>
               
                    <Col md={4}> 
                  <p style={{color: 'black'}}>
                    <strong>Cambio de Aceite:</strong>{" "}
                    {selectedVehicle.oil_Change}          
                    </p>
                  </Col>
                   </Row>
                      <Row>
                <Col md={4}>
                  <p  style={{color: 'black'}} className="d-flex align-items-center">
                    <strong>Estado:  </strong>{" "}
                    {selectedVehicle.status ? "Habilitado" : "Deshabilitado"}
                   
                    <Button
                      variant={selectedVehicle.status ? "success" : "danger"}
                      onClick={() => handleStatus(selectedVehicle.id)}
                      style={{marginLeft: '10px'}}
                    >
                      {selectedVehicle.status ? (
                        <i class="bi bi-toggle-on"></i>
                      ) : (
                        <i class="bi bi-toggle-off"></i>
                      )}
                    </Button>
                  </p>
                </Col>          

                <Col md={4} className="text-right">
                  {selectedVehicle.image && (
                    <img
                      src={selectedVehicle.image}
                      style={{ maxWidth: "400%", maxHeight: "400px" }}
                    />
                  )}
                </Col>
                </Row>
            </div>

          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonCancel" onClick={handleCloseInfoModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Vehicles;
