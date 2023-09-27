import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getByIdUser } from '../../../services/UserService';
import { getRoles } from '../../../services/RoleService';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
import Swal from 'sweetalert2';



function UserRole() {

  const { User } = useParams();
  const { isLoading: userLoading, data: userData, isError: userError } = useQuery(['users', User], () =>
    getByIdUser(User));
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    // Set selectedRoles when userData is available
    if (userData) {
      const rolesFilter = userData.user_Roles.map((role) => role.roleId);
      setSelectedRoles(rolesFilter);
    }
  }, [userData]);



  const { isLoading: rolesLoading, data: rolesData, isError: rolesError } = useQuery(['roles'], getRoles);
  const [isSaving, setIsSaving] = useState(false);


  const [show, setShow] = useState(false);
  const handleCloseRole = () => setShow(false);
  const handleShowRole = () => setShow(true);


  const handleRoleChange = (roleId) => {
    const updatedRoles = selectedRoles.includes(roleId)
      ? selectedRoles.filter((id) => id !== roleId)
      : [...selectedRoles, roleId];

    setSelectedRoles(updatedRoles);
  };

  const handleSave = () => {
    setIsSaving(true);

    const userId = userData.id;

    // Itera a través de cada rol en SelectedRoles
    for (const roleId of selectedRoles) {
      const data = {
        userId: userId,
        roleId: roleId,
      };

      console.log('Data a enviar al servidor:', data);

      axios
        .post('https://localhost:7023/api/user_Roles', data)
        .then((response) => {
          console.log('Respuesta del servidor:', response.data);

          Swal.fire({
            icon: 'success',
            title: 'Registrado éxitosamente',
            showConfirmButton: false,
            timer: 2500,
          }).then(() => {


          //  window.location.reload();
          });
        })
        .catch((error) => {
          console.error('Error al enviar la solicitud:', error);
        });
    }
  }

  return (

    <Modal show={handleShowRole} onHide={handleCloseRole} centered>
      <Modal.Header closeButton>
        <Modal.Title>Asignación de Roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <div className="bg-light p-4">
                {console.log(selectedRoles)}
                {userLoading ? (
                  <div>Cargando usuario...</div>
                ) : userError ? (
                  <div>Error al cargar usuario</div>
                ) : (
                  <div>
          
                    <div>
                    
                      {rolesData.map((role) => (
                        <div key={role.id}>
                          <label>
                          
                            <input
                              type="checkbox"
                              checked={selectedRoles.includes(role.id)}
                              onChange={() => handleRoleChange(role.id)}
                              disabled={isSaving}
                            />
                             {role.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => handleCloseRole}>
                        Cerrar
                      </Button>

                      <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        Guardar
                      </Button>
                    </Modal.Footer>

                  </div>

                )}
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );

}

export default UserRole;