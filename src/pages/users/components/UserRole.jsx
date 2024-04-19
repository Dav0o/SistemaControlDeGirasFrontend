import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getByIdUser } from "../../../services/UserService";
import { getRoles } from "../../../services/RoleService";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import Container from "react-bootstrap/Container";

function UserRole() {
  const { User } = useParams();

  const {
    isLoading: userLoading,
    data: userData,
    isError: userError,
  } = useQuery(["users", User], () => getByIdUser(User));

  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    // Set selectedRoles when userData is available
    if (userData) {
      const rolesFilter = userData.user_Roles.map((role) => role.roleId);
      setSelectedRoles(rolesFilter);
    }
  }, [userData]);

  const {
    isLoading: rolesLoading,
    data: rolesData,
    isError: rolesError,
  } = useQuery(["roles"], getRoles);
  const [isSaving, setIsSaving] = useState(false);

  const deleteRoleMutation = useMutation(async (roleId) => {
    try {
      const userId = userData.id;

      Swal.fire({
        title: "¿Seguro que deseas eliminar el rol?",
        showDenyButton: true,

        confirmButtonText: "Eliminar",
        denyButtonText: `Cancelar`,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          await axios.delete(
            `https://controldegirasapi20240418212308.azurewebsites.net/api/User_Roles/${userId}/${roleId}`
          ); // Esto de aqui elimina el rol antes de haber confirmado
          Swal.fire({
            icon: "success",
            title: "Eliminado con éxito",
            showConfirmButton: false,
            timer: 2500,
          });
        },
      });
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar el rol",
        text: "Hubo un problema al eliminar el rol. Por favor, inténtalo de nuevo más tarde.",
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
          console.log("Rol eliminado ");
        },
        onError: (error) => {
          console.error("Error al eliminar el rol:", error);
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

      console.log("Data a enviar al servidor:", data);

      axios
        .post("https://controldegirasapi20240418212308.azurewebsites.net/api/user_Roles", data)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);

          Swal.fire({
            icon: "success",
            title: "Registrado exitosamente",
            showConfirmButton: false,
            timer: 2500,
          }).then(() => {
            location.reload();
          });
        })
        .catch((error) => {
          console.error("Error al enviar la solicitud:", error);
        });
    }
  };

  const LinkStyle = {
    textDecoration: "none",
    color: "white",
  };

  return (
    <Container className="container-fluid">
      <h2 className="h3 mb-2 text-gray-800 custom-heading">Configuración de Roles</h2>
      <p className="mb-4">Lista de roles para los usuarios</p>
      <div className="p-4 card shadow mb-4">
        {console.log(selectedRoles)}
        {userLoading ? (
          <div>Loading user...</div>
        ) : userError ? (
          <div>Error loading user</div>
        ) : (
          <div>
            <div>
              {rolesData ? rolesData.map((role) => (
                <div key={role.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleRoleChange(role.id)}
                      disabled={role.id ===  1 || isSaving}
                    />
                    {role.name}
                  
                  </label>
                </div>
              )): ''}
              
            </div>
            <div>
              <Button
                variant="success"
                className="mr-2 buttonSave"
                onClick={handleSave}
                disabled={isSaving}
                
              >
                Guardar
              </Button>

              <Link style={LinkStyle} to={"/users"}>
                <Button  className="buttonCancel">
                  Regresar
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default UserRole;
