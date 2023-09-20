import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import { getVehicles } from "../../../services/VehicleService";
import "../../../stylesheets/DataTables/VehicleDataTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const columns = [
  {
    name: "Id",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Placa",
    selector: (row) => row.plate_Number,
    sortable: true,
  },
  {
    name: "Marca",
    selector: (row) => row.make,
    sortable: true,
  },
  {
    name: "Modelo",
    selector: (row) => row.model,
    sortable: true,
  },
  {
    name: "Capacidad",
    selector: (row) => row.capacity,
    sortable: true,
  },
  {
    name: "Acciones",
    cell: (row) => (
      <div>
        <button onClick={() => handleEdit(row.id)} className="boton-accionEdit">Editar</button>
        <button onClick={() => handleDetails(row.id)} className="boton-accionDetails">Ver detalles</button>
      </div>
    ),
  },
];

const paginacionOpciones = {
  rowsPerPageText: "Filas por Página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

function VehicleDataTable() {
  const [busqueda, setBusqueda] = useState('');
  const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
    enabled: true,
  });

  const onChange = (e) => {
    setBusqueda(e.target.value);
  };

  function handleEdit(userId) {
    // Busca el usuario con el ID correspondiente en los datos
    const userToEdit = data.find((user) => user.id === userId);

    if (userToEdit) {
      // Actualiza el estado con los atributos del usuario
      setEditedUser(userToEdit);
    console.log(`Editar usuario con ID ${userId}`);
  }
}

  function handleDetails(userId) {
    // Lógica para ver los detalles del usuario con el ID userId
    // Por ejemplo, puedes redirigir a una página de detalles
    console.log(`Ver detalles del usuario con ID ${userId}`);
  }

  const busquedaLower = busqueda.toLowerCase();

  let filteredData = data ? data.filter(item => (
    item.id.toString().includes(busquedaLower) ||
    item.plate_Number.toString().includes(busquedaLower) ||
    item.make.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").includes(busquedaLower) ||
    item.model.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").includes(busquedaLower) ||
    item.capacity.toString().includes(busquedaLower) 
  )) : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Hubo un error al cargar los vehículos:", isError);
    return <div>Error al cargar los vehículos</div>;
  }

  return (
    <div>
      <div className="barraBusqueda">
        <input
          type="text"
          placeholder="Buscar"
          className="textField"
          name="busqueda"
          value={busqueda}
          onChange={onChange}
        />
        <button type="button" className="btnBuscar">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    
      <DataTable
        columns={columns}
        data={filteredData}
        title="Vehiculos"
        pagination
        paginationComponentOptions={paginacionOpciones}
        fixedHeader
        fixedHeaderScrollHeight="600px"
        noDataComponent={<span>No se encontró ningún registro</span>}
      />
    </div>
  );
}

export default VehicleDataTable;
