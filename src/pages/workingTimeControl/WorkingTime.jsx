import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { getRequests } from "../../services/RequestService";
import Container from "react-bootstrap/Container";
import { Button, Table } from "react-bootstrap";
import "datatables.net-buttons-dt";

function WorkingTime() {
  const { isLoading, data, isError } = useQuery("requests", getRequests, {
    enabled: true,
  });

  const [dataTable, setDataTable] = useState(null);

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableControlJornada", {
      retrieve: true,
      responsive: true,
      dom: "<'row' <'col-md-12 float-right'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
      buttons: [
        {
          extend: "print",
          title: "Jornada laboral del chófer",
          titleAttr: "Imprimir",
          text: '<i class="fa-solid fa-print" aria-hidden="true"></i>',
          className: "btn btn-info",
          exportOptions: {
            columns: [0, 1, 2, 3],
          },
          customize: function (win) {
            $(win.document.body)
              .find("tableControlJornada")
              .addClass("compact")
              .css("font-size", "inherit");
            $(win.document.body).find("h1").css("text-align", "center");
            $(win.document.body).css("font-size", "9px");
          },
        },
        {
          extend: "pdf",
          title: "Jornada laboral del chófer",
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
          title: "Jornada laboral del chófer",
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

  const LinkStyle = {
    textDecoration: "none",
    color: "white",
  };

  return (
    <>
      <Container>
        <h1 className="h3 mb-2 text-gray-800">Control Jornada</h1>
        <p>Lista de las solicitudes con el respectivo chófer encargado</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <p>
              De click en el boton "detalles" para observar la jornada laboral
              de cada chófer
            </p>
          </div>
          <div className="card-body">
            <Table
              striped="columns"
              id="tableControlJornada"
              className="display wrap table table-bordered"
            >
              <thead>
                <tr>
                  <th>Número consecutivo</th>
                  <th>Chófer</th>
                  <th>Destino</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.map((request) => (
                  <tr key={request.id}>
                    <td>{request.consecutiveNumber}</td>
                    <td>{request.itsDriver}</td>
                    <td>{request.DestinyLocation}</td>
                    <td>
                      <Link
                        to={`/driverLogs/${request.id}`}
                        style={LinkStyle}
                      >
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

export default WorkingTime;
