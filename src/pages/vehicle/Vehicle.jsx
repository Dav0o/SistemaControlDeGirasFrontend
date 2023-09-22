import React from 'react'
import { getVehicles } from "../../services/VehicleService";
import { useQuery, useMutation } from 'react-query';
import { Button, Table } from 'react-bootstrap';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { create } from '../../services/MaintenanceService';
import DataTable from 'datatables.net-dt';
import { useState, useEffect } from 'react';
import pdfmake from 'pdfmake';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';


function Vehicle() {

    const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
        enabled: true,
      }
      );
      const mutation = useMutation("maintenances", create);

      const [dataTable, setDataTable] = useState(null);

      useEffect(() => {
        if (dataTable) {
          // Destruye el DataTable existente antes de volver a inicializarlo
          dataTable.destroy();
        }
    
        // Inicializa el DataTable después de renderizar los datos
        const newDataTable = new DataTable('#tableMaintenance', {
          retrieve: true,
          responsive:true,
          dom: 'Bfrtip',
          buttons: [
            
            'excel', 'print',
            {
              extend: 'pdf', 
              messageTop: 'Reporte de Mantenimiento'
            }
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
        <Row>
            <h2>Lista de Vehiculos</h2>
            <p>Observar el mantenimiento de cada uno de los vehiculos</p>
        </Row>
        
        <Table striped="columns" id='tableMaintenance' className='display wrap'>
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
                  <Button variant="info">
                    <Link to={`/vehicle/${vehicle.id}`}>
                    Detalles
                    </Link>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
    
       
    </Container>
    </>
  )
}

export default Vehicle