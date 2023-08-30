import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Vehicles = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = () => setShowInfoModal(true)
  const handleCloseFormModal = () => setShowFormModal(false);
  const handleShowFormModal = () => setShowFormModal(true);
 
  return (
    <div>
      <Table striped="columns">
        
        <thead>
        <tr>
    <th colSpan={1} className="text-right">
    
      <Button variant="dark" onClick={handleShowFormModal}><span class="material-symbols-outlined">
create_new_folder
</span>     
      </Button>
   
    </th>
  </tr>
          <tr>
            <th >Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Color</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th>Acciones</th>
            <Button variant="-dark" onClick={handleShow}> <span className="material-symbols-outlined">
              add_circle
            </span></Button>{' '}
          </tr>
        </thead>
        
        <tbody>
          <tr>
            <td colSpan={1}>1</td>
            <td>   </td>
            <td>   </td>
            <td>   </td>
            <td>   </td>
            <td>   </td>
            <td><Button variant="dark" onClick={handleShowFormModal}> <span className="material-symbols-outlined">
              draw
            </span>
            </Button>{' '}
              <Button variant="info" onClick={handleShowInfoModal}><span className="material-symbols-outlined">
                info
              </span>
              </Button>{' '}  <Button variant="danger" onClick={handleCloseFormModal}><span class="material-symbols-outlined">
visibility_off
</span>
          </Button> </td>
          </tr>
          <tr>
            <td colSpan={1}>2</td>
            <td>   </td>
            <td>   </td>
            <td>   </td>
            <td>   </td>
            <td>   </td>
            <td><Button variant="dark" onClick={handleShowFormModal}> <span className="material-symbols-outlined">
              draw
            </span></Button>{' '}
              <Button variant="info"><span className="material-symbols-outlined">
                info
              </span></Button>{' '}  <Button variant="danger" onClick={handleCloseFormModal}><span class="material-symbols-outlined">
visibility_off
</span>
          </Button>   </td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan={1}>   </td>
            <td>    </td>
            <td>   </td>
            <td>  </td>
            <td>  </td>
            <td><Button variant="dark"><span className="material-symbols-outlined">
              draw
            </span></Button>{' '}
              <Button variant="info"><span className="material-symbols-outlined">
                info
              </span></Button>{' '}   <Button variant="danger" onClick={handleCloseFormModal}><span class="material-symbols-outlined">
visibility_off
</span>
          </Button>  </td>
          </tr>

          <tr>
            <td>4</td>
            <td colSpan={1}>    </td>
            <td>    </td>
            <td>   </td>
            <td>    </td>
            <td>    </td>
            <td> <td><Button variant="dark"><span className="material-symbols-outlined">
              draw
            </span></Button>{' '}
              <Button variant="info"><span className="material-symbols-outlined">
                info
              </span></Button>{' '}  <Button variant="danger" onClick={handleCloseFormModal}><span class="material-symbols-outlined">
visibility_off
</span>
          </Button>   </td> </td>
          </tr>
        </tbody>
      </Table>


      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Save changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Desea guardar los siguientes cambios?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFormModal} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear vehiculo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formPlaca">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese la placa" />
                </Form.Group>

                <Form.Group controlId="formMarca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese la marca" />
                </Form.Group>

                <Form.Group controlId="formModelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el modelo" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formColor">
                  <Form.Label>Color</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el color" />
                </Form.Group>

                <Form.Group controlId="formCapacidad">
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese la capacidad" />
                </Form.Group>

                <Form.Group controlId="formEstado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el estado" />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseFormModal}>
            Cancelar
          </Button>
          <Button variant="dark" onClick={handleCloseFormModal}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showInfoModal} onHide={handleCloseInfoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Información detallada del vehículo</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfoModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>



    </div>

  )
}
