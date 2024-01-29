import React from "react";
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
      bLengthChange: false,
      dom: "lfBrtip",
      buttons: [
        {
          extend: "print",
          title: "Vehículos en Mantenimiento",
          titleAttr: "Imprimir",
          text: '<i class="fa-solid fa-print" aria-hidden="true"></i>',
          className: "btn btn-info",
          exportOptions: {
            columns: [0, 1, 2, 3],
          },
          customize: function (win) {
            $(win.document.body)
              .find("tableMaintenance")
              .addClass("compact")
              .css("font-size", "inherit");
            $(win.document.body).find("h1").css("text-align", "center");
            $(win.document.body).css("font-size", "9px");
          },
        },
        {
          extend: "pdf",
          title: "Vehículos en Mantenimiento",
          titleAttr: "Exportar a PDF",
          text: '<i class="fa-regular fa-file-pdf" aria-hidden="true"></i>',
          className: "btn btn-danger",
          exportOptions: { columns: [0, 1, 2, 3] },
          customize: function (doc) {
            doc.content[1].margin = [100, 0, 100, 0]; //left, top, right, bottom
          },
        },
        {
          extend: "excel",
          title: "Vehículos en Mantenimiento",
          titleAttr: "Exportar a Excel",
          text: '<i class="fa-solid fa-file-csv"></i>',
          className: "btn btn-success",
          exportOptions: { columns: [0, 1, 2, 3] },
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
                          <i className="bi bi-info-square"></i>
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
