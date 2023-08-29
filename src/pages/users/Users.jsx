import React from 'react'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';


function Users() {
  return (
    <>
    <div>Users</div>
    <Button color="success"> Crear</Button>
    <div>
      <Table>
        <thead>
          Usuarios
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td></td>
            <td></td>
            <td></td>
            <td><Button variant="info">Detalles</Button>{' '}
            <Button variant="primary">Editar</Button>{' '}
            <Button variant="danger">Deshabilitar</Button></td>
            
          </tr>
          <tr>
            <td>2</td>
            <td></td>
            <td></td>
            <td></td>
            <td><Button variant="info">Detalles</Button>{' '}
            <Button variant="primary">Editar</Button>{' '}
            <Button variant="danger">Deshabilitar</Button></td>
          
          </tr>
          <tr>
            <td>3</td>
            <td></td>
            <td></td>
            <td></td>
            <td><Button variant="info">Detalles</Button>{' '}
            <Button variant="primary">Editar</Button>{' '}
            <Button variant="danger">Deshabilitar</Button></td>
          </tr>
        </tbody>
      </Table>
    </div>

   
    </>

 
  )
}

export default Users