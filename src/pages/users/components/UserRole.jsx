import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import { useQuery } from 'react-query';
import { getByIdUser } from '../../../services/UserService';
import { getRoles } from '../../../services/RoleService';
import Button from "react-bootstrap/Button";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useMutation } from 'react-query';

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

  
  const deleteRoleMutation = useMutation(async (roleId) => {
    try {
      const userId = userData.id;
      await axios.delete(`https://localhost:7023/api/User_Roles/${userId}/${roleId}`);
      Swal.fire({
        title: '¿Seguro que deseas eliminar el rol?',
        showDenyButton: true,
      
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
       showLoaderOnConfirm: true, 
      preConfirm: async () => {
         Swal.fire({
          icon: 'success',
          title: 'Eliminado con éxito',
          showConfirmButton: false,
          timer: 2500, 
        });
      },
    });
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar el rol',
        text: 'Hubo un problema al eliminar el rol. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  });

  const handleRoleChange = (roleId) => {
    const updatedRoles = selectedRoles.includes(roleId)
      ? selectedRoles.filter((id) => id !== roleId)
      : [...selectedRoles, roleId];

    setSelectedRoles(updatedRoles);

      // Si el rol se deselecciona, elimina el rol del usuario
      if (selectedRoles.includes(roleId)) {
        deleteRoleMutation.mutate(roleId, {
          onSuccess: () => {
            console.log('Rol eliminado ');
          },
          onError: (error) => {
            console.error('Error al eliminar el rol:', error);
          },
        });
      }
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

           location.reload();
          });
        })
        .catch((error) => {
          console.error('Error al enviar la solicitud:', error);
        });
    }
  }


  const LinkStyle = {
    textDecoration: 'none',
    color: 'white',
  };

  return (
    <div>
      <h1>Configuración de Roles</h1>
      <div className="bg-light p-4">
        {console.log(selectedRoles)}
        {userLoading ? (
          <div>Loading user...</div>
        ) : userError ? (
          <div>Error loading user</div>
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
            <div>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                Guardar
              </Button>

              <Link style={LinkStyle} to={"/users"}>
          <Button variant="dark" className="bg-gradient-danger">
            Regresar
          </Button>
        </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}

export default UserRole;