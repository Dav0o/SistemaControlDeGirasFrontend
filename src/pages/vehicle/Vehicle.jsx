import React from 'react'
import { getVehicles } from "../../services/VehicleService";
import { useQuery, useMutation } from 'react-query';
import { Button, Table } from 'react-bootstrap';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { create } from '../../services/MaintenanceService';

function Vehicle() {

    const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
        enabled: true,
      }
      );
      const mutation = useMutation("maintenances", create);

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

        <Table striped="columns">
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