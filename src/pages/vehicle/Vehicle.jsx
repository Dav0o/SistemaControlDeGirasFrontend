import React from "react";;
import { getVehicles } from "../../services/VehicleService";
import { useQuery, useMutation } from "react-query";
import { Button, Table } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { create } from "../../services/MaintenanceService";
import { useState, useEffect } from "react";
import "datatables.net-buttons-dt";


function Vehicle() {
  const LinkStyle = {
    textDecoration: "none",
    color: "white",
  };

  const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
    enabled: true,
  });
  const mutation = useMutation("maintenances", create);

  const [dataTable, setDataTable] = useState(null);

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableMaintenance", {
      retrieve: true,
      responsive: true,
      dom: "Bfrtip",
      buttons: [
        {
            extend: "excelHtml5",
            text: '<i class="fa-solid fa-file-csv"></i>',
            titleAttr: "Exportar a Excel",
            className: "btn btn-success",
        },
        {
            extend: "pdfHtml5",
            text: '<i class="fa-regular fa-file-pdf"></i>',
            titleAttr: "Exportar a PDF",
            className: "btn btn-danger",
        },
        {
            extend: "print",
            text: '<i class="fa-solid fa-print"></i>',
            titleAttr: "Imprimir",
            className: "btn btn-info",
        },
      ],
    });

    // Actualiza el estado para mantener la referencia del DataTable
    setDataTable(newDataTable);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container>
        <h1 className="h3 mb-2 text-gray-800">Mantenimiento</h1>
        <p>Lista de vehiculos con su respectiva lista de mantenimiento</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <p>
              De click en el boton "detalles" para observar el mantenimiento de
              cada vehiculo
            </p>
          </div>
          <div className="card-body">
            <Table
              striped="columns"
              id="tableMaintenance"
              className="display wrap table table-bordered"
            >
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Color</th>
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
                    <td>
                      <Link to={`/vehicle/${vehicle.id}`} style={LinkStyle}>
                        <Button
                          variant="info"
                          className="bg-gradient-info text-light"
                        >
                          <i class="bi bi-info-square"></i>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Vehicle;
