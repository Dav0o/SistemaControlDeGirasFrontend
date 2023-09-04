import React, { useState } from 'react'; // Importa useState y useRef
import { Modal, Form, Button } from 'react-bootstrap'; // Importa los componentes necesarios de React Bootstrap
import { useMutation } from 'react-query'; 

export const EditVehicles = () => {

  const mutation = useMutation("vehicles", create);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowEditModal(true); 
  };
    setShowEditModal(false);
    
    const handleCloseEditModal = () => {
      setShowEditModal(false); 
    };
  
    const handleUpdate = () => {
        let updatedVehicle = {
          id: editingVehicle.id,
          plate_Number: plate_Number.current.value,
          make: make.current.value,
          model: model.current.value,
          category: category.current.value,
          traction: traction.current.value,
          year: parseInt(year.current.value),
          color: color.current.value,
          capacity: parseInt( capacity.current.value),
          engine_capacity: parseInt(engine_capacity.current.value),
          mileage: parseInt(mileage.current.value),
          fuel: fuel.current.value,
          oil_Change: "2023-09-01",
          status: true,
          imageUrl: image_url.current.value,
        };
       mutation.mutateAsync(updatedVehicle);
        setShowEditModal(false);
      }; 
  return (

    
    <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
    <Modal.Header closeButton>
      <Modal.Title>Editar vehiculo</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Placa</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la placa"
            defaultValue={editingVehicle ? editingVehicle.plate_Number : ''}
            ref={plate_Number}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la marca"
            defaultValue={editingVehicle ? editingVehicle.make : ''}
            ref={make}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la capacidad"
            defaultValue={editingVehicle ? editingVehicle.capacity : ''}
            ref={capacity}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Traccion</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la traccion"
            defaultValue={editingVehicle ? editingVehicle.traction : ''}
            ref={traction}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Cilindraje</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el cilindraje"
            defaultValue={editingVehicle ? editingVehicle.engine_capacity : ''}
            ref={engine_capacity}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Gasolina</Form.Label>
          <Form.Control
            type="text"
            placeholder="Gasolina"
            defaultValue={editingVehicle ? editingVehicle.fuel : ''}
            ref={fuel}
          />
        </Form.Group>
        <Form.Group >
          <Form.Label>Año</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el año"
            defaultValue={editingVehicle ? editingVehicle.year : ''}
            ref={year}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Modelo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el modelo"
            defaultValue={editingVehicle ? editingVehicle.model : ''}
            ref={model}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la categoria"
            defaultValue={editingVehicle ? editingVehicle.category : ''}
            ref={category}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Color</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el color"
            defaultValue={editingVehicle ? editingVehicle.color : ''}
            ref={color}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Kilometraje</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el kilometraje"
            defaultValue={editingVehicle ? editingVehicle.mileage : ''}
            ref={mileage}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Cambio de aceite</Form.Label>
          <Form.Control
            type="date"
            placeholder="Ingrese la fecha"
            defaultValue={editingVehicle ? editingVehicle.oil_Change : ''}
            ref={oil_Change}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese l aimagen"
            defaultValue={editingVehicle ? editingVehicle.image_url : ''}
            ref={image_url}
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
  )
}

export default EditVehicles